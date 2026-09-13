import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { copyToDocument, prune, dedup, unpartition } from "@gltf-transform/functions";
import * as THREE from "three";
import { KDTree3 } from "./kdtree.mjs";
import sharp from "sharp";

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

const characterDoc = await io.read("public/models/character.glb");
const modelDoc = await io.read("public/models/avatar/model.glb");

// ---------------------------------------------------------------------
// Helpers: compute world matrices for a document's node hierarchy at rest
// (bind) pose, i.e. no animation/pose applied - this matches the GLB's
// authored node transforms, which is exactly the skin's bind pose.
// ---------------------------------------------------------------------
function computeWorldMatrices(doc) {
  const worldMatrices = new Map();
  function visit(node, parentMatrix) {
    const t = node.getTranslation();
    const r = node.getRotation();
    const s = node.getScale();
    const local = new THREE.Matrix4().compose(
      new THREE.Vector3(...t),
      new THREE.Quaternion(...r),
      new THREE.Vector3(...s)
    );
    const world = new THREE.Matrix4().multiplyMatrices(parentMatrix, local);
    worldMatrices.set(node, world);
    node.listChildren().forEach((c) => visit(c, world));
  }
  for (const scene of doc.getRoot().listScenes()) {
    scene.listChildren().forEach((n) => visit(n, new THREE.Matrix4()));
  }
  return worldMatrices;
}

function findNodeByName(doc, name) {
  return doc.getRoot().listNodes().find((n) => n.getName() === name);
}

const charWorld = computeWorldMatrices(characterDoc);
const modelWorld = computeWorldMatrices(modelDoc);

function worldPos(doc, worldMatrices, name) {
  const node = findNodeByName(doc, name);
  if (!node) throw new Error(`Node not found: ${name}`);
  const m = worldMatrices.get(node);
  return new THREE.Vector3().setFromMatrixPosition(m);
}

// ---------------------------------------------------------------------
// 1) Compute a uniform scale + translation that best aligns model.glb's
//    rest pose onto character.glb's rest pose, using matching skeletal
//    landmarks (both files are authored in a T-pose, Y-up).
// ---------------------------------------------------------------------
const ANCHORS = [
  ["spine", "Hips"],
  ["spine.001", "Spine"],
  ["spine.002", "Spine1"],
  ["spine.003", "Spine2"],
  ["spine.006", "Head"],
  ["shoulder.L", "LeftShoulder"],
  ["shoulder.R", "RightShoulder"],
  ["hand.L", "LeftHand"],
  ["hand.R", "RightHand"],
  ["thigh.L", "LeftUpLeg"],
  ["thigh.R", "RightUpLeg"],
  ["foot.L", "LeftFoot"],
  ["foot.R", "RightFoot"],
  ["toe.L", "LeftToeBase"],
  ["toe.R", "RightToeBase"],
];

const oldPts = ANCHORS.map(([o]) => worldPos(characterDoc, charWorld, o));
const newPts = ANCHORS.map(([, n]) => worldPos(modelDoc, modelWorld, n));

const oldMean = oldPts
  .reduce((a, p) => a.add(p), new THREE.Vector3())
  .divideScalar(oldPts.length);
const newMean = newPts
  .reduce((a, p) => a.add(p), new THREE.Vector3())
  .divideScalar(newPts.length);

let num = 0;
let den = 0;
for (let i = 0; i < ANCHORS.length; i++) {
  const op = oldPts[i].clone().sub(oldMean);
  const np = newPts[i].clone().sub(newMean);
  num += op.dot(np);
  den += np.dot(np);
}
const SCALE = num / den;
const TRANSLATION = oldMean.clone().sub(newMean.clone().multiplyScalar(SCALE));

console.log("Alignment: scale =", SCALE, "translation =", TRANSLATION);

// The whole-body fit above gets the new head roughly in the right place.
// The old character's own "hair" and "Neck" meshes are removed entirely
// below (the new head brings its own hair and enough neck geometry to
// meet the shirt collar on its own), so only a small amount of extra
// growth is needed around the head/neck bone (spine.006) for a natural
// head-to-body proportion - not a full match to the old (now-deleted)
// hair shell.
const HEAD_EXTRA_SCALE = 1.08;
const HEAD_PIVOT = worldPos(characterDoc, charWorld, "spine.006");
const TOTAL_SCALE = SCALE * HEAD_EXTRA_SCALE;

function alignToOld(v) {
  const base = v.clone().multiplyScalar(SCALE).add(TRANSLATION);
  return base.sub(HEAD_PIVOT).multiplyScalar(HEAD_EXTRA_SCALE).add(HEAD_PIVOT);
}

// ---------------------------------------------------------------------
// 2) Build the reference point cloud from character.glb's existing
//    skinned body meshes (each vertex carries its joint indices/weights,
//    already expressed against the OLD 68-joint skeleton).
// ---------------------------------------------------------------------
const OLD_BODY_NODES = [
  "BODY.SHIRT",
  "Ear.001",
  "Eyebrow",
  "EYEs.001",
  "Hand",
  "Neck",
  "Pant",
  "Plane.007",
  "Shoe",
  "Sole",
];

const refPoints = [];
for (const nodeName of OLD_BODY_NODES) {
  const node = findNodeByName(characterDoc, nodeName);
  const world = charWorld.get(node);
  const mesh = node.getMesh();
  for (const prim of mesh.listPrimitives()) {
    const position = prim.getAttribute("POSITION");
    const joints = prim.getAttribute("JOINTS_0");
    const weights = prim.getAttribute("WEIGHTS_0");
    const count = position.getCount();
    for (let i = 0; i < count; i++) {
      const p = position.getElement(i, []);
      const wp = new THREE.Vector3(p[0], p[1], p[2]).applyMatrix4(world);
      refPoints.push({
        x: wp.x,
        y: wp.y,
        z: wp.z,
        joints: joints.getElement(i, []),
        weights: weights.getElement(i, []),
      });
    }
  }
}
console.log("Reference cloud points:", refPoints.length);

const tree = new KDTree3(refPoints);

// ---------------------------------------------------------------------
// 3) Copy the new avatar meshes into character.glb's document.
// ---------------------------------------------------------------------
// Face-only swap: keep the existing body/clothes meshes untouched (lighter,
// lower risk) and only replace the head/eyes/teeth so the face matches the
// new personalized model.
const NEW_MESH_NODES = [
  "AvatarEyelashes",
  "AvatarHead",
  "AvatarLeftCornea",
  "AvatarLeftEyeball",
  "AvatarRightCornea",
  "AvatarRightEyeball",
  "AvatarTeethLower",
  "AvatarTeethUpper",
];

// model.glb's mesh nodes are unnamed but have a "name" via the node itself only if present.
// Inspect showed node names ARE set (AvatarBody, AvatarHead, ...) even though the underlying
// mesh resources have empty names. So look up by NODE name in modelDoc.
const modelMeshNodes = NEW_MESH_NODES.map((name) => {
  const node = findNodeByName(modelDoc, name);
  if (!node) throw new Error(`model.glb missing node: ${name}`);
  return node;
});

const sourceMeshes = modelMeshNodes.map((n) => n.getMesh());
const meshMap = copyToDocument(characterDoc, modelDoc, sourceMeshes);

// ---------------------------------------------------------------------
// copyToDocument brings the new meshes over verbatim, still in model.glb's
// native (tiny, ~1.6m-tall) coordinate space. Because these meshes are
// bound to the OLD skin's joints, skinning at rest pose is a no-op
// (jointWorldMatrix * inverseBindMatrix == identity there), so whatever
// coordinate space the vertices are authored in is exactly what renders -
// nothing about the old skeleton implicitly rescales them. We must bake
// the alignment transform directly into each copied mesh's vertex data so
// the new head actually lands at the old head's position/scale instead of
// floating tiny and mispositioned near the model origin.
// ---------------------------------------------------------------------
function bakeAlignmentIntoMesh(mesh) {
  for (const prim of mesh.listPrimitives()) {
    const position = prim.getAttribute("POSITION");
    const count = position.getCount();
    for (let i = 0; i < count; i++) {
      const p = position.getElement(i, []);
      const aligned = alignToOld(new THREE.Vector3(p[0], p[1], p[2]));
      position.setElement(i, [aligned.x, aligned.y, aligned.z]);
    }
    // Morph target position deltas are relative offsets: scale only (by the
    // SAME overall scale as the base geometry, including the extra head
    // growth), never translate them (translation would double-count the
    // base position).
    for (const target of prim.listTargets()) {
      const tpos = target.getAttribute("POSITION");
      if (!tpos) continue;
      const tcount = tpos.getCount();
      for (let i = 0; i < tcount; i++) {
        const d = tpos.getElement(i, []);
        tpos.setElement(i, [d[0] * TOTAL_SCALE, d[1] * TOTAL_SCALE, d[2] * TOTAL_SCALE]);
      }
    }
  }
}

// ---------------------------------------------------------------------
// Bake a subtle static smile into AvatarHead's base pose, using the
// model's own mouthSmileLeft/mouthSmileRight blendshape deltas (still in
// their original, tiny model-space units at this point, before alignment
// scaling runs) at partial weight. This must happen before the morph
// target list gets trimmed down to just the blink shapes.
// ---------------------------------------------------------------------
function bakeStaticMorph(mesh, weightsByName) {
  const extras = mesh.getExtras();
  const allNames = extras.targetNames || [];
  for (const prim of mesh.listPrimitives()) {
    const basePos = prim.getAttribute("POSITION");
    const baseNormal = prim.getAttribute("NORMAL");
    const targets = prim.listTargets();
    for (const [name, weight] of Object.entries(weightsByName)) {
      const idx = allNames.indexOf(name);
      if (idx === -1) continue;
      const target = targets[idx];
      const dPos = target.getAttribute("POSITION");
      if (dPos) {
        for (let i = 0; i < basePos.getCount(); i++) {
          const b = basePos.getElement(i, []);
          const d = dPos.getElement(i, []);
          basePos.setElement(i, [
            b[0] + d[0] * weight,
            b[1] + d[1] * weight,
            b[2] + d[2] * weight,
          ]);
        }
      }
      const dNormal = target.getAttribute("NORMAL");
      if (baseNormal && dNormal) {
        for (let i = 0; i < baseNormal.getCount(); i++) {
          const b = baseNormal.getElement(i, []);
          const d = dNormal.getElement(i, []);
          const nx = b[0] + d[0] * weight;
          const ny = b[1] + d[1] * weight;
          const nz = b[2] + d[2] * weight;
          const len = Math.hypot(nx, ny, nz) || 1;
          baseNormal.setElement(i, [nx / len, ny / len, nz / len]);
        }
      }
    }
  }
}

bakeStaticMorph(meshMap.get(findNodeByName(modelDoc, "AvatarHead").getMesh()), {
  mouthSmileLeft: 0.85,
  mouthSmileRight: 0.85,
});

// ---------------------------------------------------------------------
// Sculpt a sharper jawline directly into AvatarHead's base geometry (there
// is no ARKit blendshape for this - it has to be a direct vertex tweak).
// Still in the model's own tiny coordinate space at this point, so the
// Y-range below is in those units (Head bone ~1.62, chin/jaw bottom
// ~1.457, from the source model's own bind pose).
// ---------------------------------------------------------------------
function sharpenJaw(mesh, { yMin, yMax, squeeze, chinPush }) {
  for (const prim of mesh.listPrimitives()) {
    const basePos = prim.getAttribute("POSITION");
    for (let i = 0; i < basePos.getCount(); i++) {
      const p = basePos.getElement(i, []);
      const [x, y, z] = p;
      if (y < yMin || y > yMax) continue;
      // t=1 at the chin (yMin), t=0 at the upper jaw/cheek boundary (yMax).
      const t = (yMax - y) / (yMax - yMin);
      const taper = t * t; // concentrate the effect near the chin/jawline
      const newX = x * (1 - squeeze * taper);
      const newZ = z + chinPush * taper * taper; // slight forward chin projection
      basePos.setElement(i, [newX, y, newZ]);
    }
  }
}

sharpenJaw(meshMap.get(findNodeByName(modelDoc, "AvatarHead").getMesh()), {
  yMin: 1.457,
  yMax: 1.56,
  squeeze: 0.16,
  chinPush: 0.006,
});

for (const oldNode of modelMeshNodes) {
  bakeAlignmentIntoMesh(meshMap.get(oldNode.getMesh()));
}

const oldSkin = characterDoc.getRoot().listSkins()[0];
const metarigRoot = characterDoc
  .getRoot()
  .listNodes()
  .find((n) => n.getName() === "metarig.002");

const K_NEAREST = 4;

function transferWeights(node, mesh) {
  const world = modelWorld.get(node);
  for (const prim of mesh.listPrimitives()) {
    const position = prim.getAttribute("POSITION");
    const count = position.getCount();
    const jointsOut = new Uint8Array(count * 4);
    const weightsOut = new Float32Array(count * 4);

    for (let i = 0; i < count; i++) {
      const p = position.getElement(i, []);
      const wp = new THREE.Vector3(p[0], p[1], p[2])
        .applyMatrix4(world);
      const aligned = alignToOld(wp);

      const neighbors = tree.kNearest(aligned.x, aligned.y, aligned.z, K_NEAREST);
      const acc = new Map(); // jointIndex -> weight
      for (const { point, distSq } of neighbors) {
        const invDist = 1 / Math.max(Math.sqrt(distSq), 1e-5);
        for (let j = 0; j < 4; j++) {
          const jointIdx = point.joints[j];
          const w = point.weights[j] * invDist;
          if (w <= 0) continue;
          acc.set(jointIdx, (acc.get(jointIdx) || 0) + w);
        }
      }
      const entries = [...acc.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
      const sum = entries.reduce((s, [, w]) => s + w, 0) || 1;
      for (let j = 0; j < 4; j++) {
        if (entries[j]) {
          jointsOut[i * 4 + j] = entries[j][0];
          weightsOut[i * 4 + j] = entries[j][1] / sum;
        } else {
          jointsOut[i * 4 + j] = 0;
          weightsOut[i * 4 + j] = 0;
        }
      }
    }

    const jointsAccessor = characterDoc
      .createAccessor(`${node.getName()}_JOINTS_0`)
      .setType("VEC4")
      .setArray(jointsOut)
      .setBuffer(characterDoc.getRoot().listBuffers()[0]);
    const weightsAccessor = characterDoc
      .createAccessor(`${node.getName()}_WEIGHTS_0`)
      .setType("VEC4")
      .setArray(weightsOut)
      .setBuffer(characterDoc.getRoot().listBuffers()[0]);

    prim.setAttribute("JOINTS_0", jointsAccessor);
    prim.setAttribute("WEIGHTS_0", weightsAccessor);
  }
}

const scene = characterDoc.getRoot().listScenes()[0];
const newNodesByRole = {};

for (const oldNode of modelMeshNodes) {
  const role = oldNode.getName();
  const newMesh = meshMap.get(oldNode.getMesh());
  transferWeights(oldNode, newMesh);

  const newNode = characterDoc
    .createNode(role)
    .setMesh(newMesh)
    .setSkin(oldSkin);
  newNodesByRole[role] = newNode;
  metarigRoot.addChild(newNode);
}

console.log("Copied + rebound meshes:", Object.keys(newNodesByRole));

// ---------------------------------------------------------------------
// 4) Remove only the old dummy FACE meshes now that replacements exist.
//    Body, clothes, and hair are left exactly as they were.
// ---------------------------------------------------------------------
const NODES_TO_REMOVE = ["Plane.007", "Eyebrow", "EYEs.001", "Ear.001", "Neck", "hair"];
for (const name of NODES_TO_REMOVE) {
  const node = findNodeByName(characterDoc, name);
  if (node) node.dispose();
}

// ---------------------------------------------------------------------
// 4a) Recolor the shirt (black) and pants (brown). Both previously used
//     the same shared flat-gray "default" material as the hands/neck/
//     shoes, so give them their own material clones instead of touching
//     "default" (which would also recolor the skin/shoes).
// ---------------------------------------------------------------------
function recolor(nodeName, materialName, rgb) {
  const node = findNodeByName(characterDoc, nodeName);
  const prim = node.getMesh().listPrimitives()[0];
  const base = prim.getMaterial();
  const mat = characterDoc
    .createMaterial(materialName)
    .setBaseColorFactor([...rgb, 1])
    .setRoughnessFactor(base.getRoughnessFactor())
    .setMetallicFactor(base.getMetallicFactor());
  prim.setMaterial(mat);
}

recolor("BODY.SHIRT", "ShirtBlack", [0.02, 0.02, 0.02]);
recolor("Pant", "PantsBrown", [0.32, 0.2, 0.11]);

// ---------------------------------------------------------------------
// 4a-ii) Recolor hands (brown/skin tone) and shoes+soles (grey). These
//     shared the same flat-gray "default" material as everything else,
//     so give them their own material clones too.
// ---------------------------------------------------------------------
recolor("Hand", "HandBrown", [0.55, 0.38, 0.27]);
recolor("Shoe", "ShoeGrey", [0.45, 0.45, 0.45]);
recolor("Sole", "SoleGrey", [0.3, 0.3, 0.3]);

// ---------------------------------------------------------------------
// 4a-iii) Smooth the new head's photoreal texture (blur out skin-scan
//     detail/blemishes, lift saturation/brightness a touch) and give it a
//     glossy/reflective finish (low roughness, no metalness) instead of
//     the source PBR values.
// ---------------------------------------------------------------------
{
  const headMat = characterDoc.getRoot().listMaterials().find((m) => m.getName() === "AvatarHead");
  const headTex = headMat.getBaseColorTexture();
  const rawImage = headTex.getImage();
  const smoothImage = await sharp(Buffer.from(rawImage))
    .blur(5)
    .modulate({ saturation: 1.25, brightness: 1.05 })
    .jpeg({ quality: 92 })
    .toBuffer();
  headTex.setImage(new Uint8Array(smoothImage)).setMimeType("image/jpeg");
  headMat.setRoughnessFactor(0.35).setMetallicFactor(0);
}


// ---------------------------------------------------------------------
// 4b) Strip unused ARKit morph targets to keep the file lightweight. Only
//     eyeBlinkLeft/eyeBlinkRight are ever driven (by the Blink clip); the
//     other ~49-27 targets per mesh would just be dead weight (full vertex
//     position+normal deltas per target). The jaw targets on the lower
//     teeth are unused too (no animation drives the jaw).
// ---------------------------------------------------------------------
function keepOnlyTargets(role, keepNames) {
  const node = newNodesByRole[role];
  const mesh = node.getMesh();
  const extras = mesh.getExtras();
  const allNames = extras.targetNames || [];
  const keepIdx = keepNames.map((n) => allNames.indexOf(n));
  if (keepIdx.some((i) => i === -1)) {
    throw new Error(`${role}: missing target(s) ${keepNames}`);
  }
  for (const prim of mesh.listPrimitives()) {
    const targets = prim.listTargets();
    targets.forEach((target, i) => {
      if (!keepIdx.includes(i)) prim.removeTarget(target);
    });
  }
  mesh.setExtras({ ...extras, targetNames: keepNames });
  mesh.setWeights(new Array(keepNames.length).fill(0));
}

keepOnlyTargets("AvatarHead", ["eyeBlinkLeft", "eyeBlinkRight"]);
keepOnlyTargets("AvatarEyelashes", ["eyeBlinkLeft", "eyeBlinkRight"]);

{
  const teethNode = newNodesByRole["AvatarTeethLower"];
  const teethMesh = teethNode.getMesh();
  for (const prim of teethMesh.listPrimitives()) {
    for (const target of prim.listTargets()) prim.removeTarget(target);
  }
  teethMesh.setExtras({});
  teethMesh.setWeights([]);
}

// ---------------------------------------------------------------------
// 5) Retarget the "Blink" animation from the old Plane.007 face morphs
//    onto the new model's ARKit blendshapes (eyeBlinkLeft/eyeBlinkRight).
// ---------------------------------------------------------------------
const blinkAnim = characterDoc
  .getRoot()
  .listAnimations()
  .find((a) => a.getName() === "Blink");

const oldBlinkChannel = blinkAnim.listChannels()[0];
const oldSampler = oldBlinkChannel.getSampler();
const inputAccessor = oldSampler.getInput();
const outputArray = oldSampler.getOutput().getArray(); // flattened, 3 targets/keyframe
const frameCount = inputAccessor.getCount();
const blinkAmount = new Float32Array(frameCount);
for (let i = 0; i < frameCount; i++) {
  // "Key 2" (index 0) and "eyeL_100" (index 2) are identical and drive the
  // blink; "eyeL_60" (index 1) is unused (always 0). Use index 0 as the
  // canonical blink-strength curve.
  blinkAmount[i] = outputArray[i * 3 + 0];
}

// Remove old channel + sampler (target node Plane.007 no longer exists).
oldBlinkChannel.dispose();
oldSampler.dispose();

function addBlinkChannel(role, targetNames) {
  const node = newNodesByRole[role];
  const leftIdx = targetNames.indexOf("eyeBlinkLeft");
  const rightIdx = targetNames.indexOf("eyeBlinkRight");
  const n = targetNames.length;
  node.setWeights(new Array(n).fill(0));

  const output = new Float32Array(frameCount * n);
  for (let i = 0; i < frameCount; i++) {
    output[i * n + leftIdx] = blinkAmount[i];
    output[i * n + rightIdx] = blinkAmount[i];
  }

  const outputAccessor = characterDoc
    .createAccessor(`Blink_${role}_output`)
    .setType("SCALAR")
    .setArray(output)
    .setBuffer(characterDoc.getRoot().listBuffers()[0]);

  const sampler = characterDoc
    .createAnimationSampler()
    .setInput(inputAccessor)
    .setOutput(outputAccessor)
    .setInterpolation(oldSampler.getInterpolation ? "LINEAR" : "LINEAR");

  const channel = characterDoc
    .createAnimationChannel()
    .setTargetNode(node)
    .setTargetPath("weights")
    .setSampler(sampler);

  blinkAnim.addSampler(sampler);
  blinkAnim.addChannel(channel);
}

// Both meshes were trimmed down to exactly these 2 targets, in this order.
const TRIMMED_TARGET_NAMES = ["eyeBlinkLeft", "eyeBlinkRight"];

addBlinkChannel("AvatarHead", TRIMMED_TARGET_NAMES);
addBlinkChannel("AvatarEyelashes", TRIMMED_TARGET_NAMES);

// ---------------------------------------------------------------------
// 6) Fix up the foot-position hack in character.ts (footR/footL) — those
//    nodes are bones, not meshes, so they still exist untouched.
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// 7) Clean unused resources left behind by the removed meshes, then write.
// ---------------------------------------------------------------------
await characterDoc.transform(prune(), dedup(), unpartition());

await io.write("public/models/character.new.glb", characterDoc);
console.log("Wrote public/models/character.new.glb");
