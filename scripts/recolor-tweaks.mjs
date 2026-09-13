import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { prune, dedup, unpartition } from "@gltf-transform/functions";

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read("public/models/character.glb");

function findNode(name) {
  return doc.getRoot().listNodes().find((n) => n.getName() === name);
}

// ---------------------------------------------------------------------
// 1) Darken the skin tone (face + hands) a bit, and match the ears to it.
// ---------------------------------------------------------------------
const faceSkinMat = doc.getRoot().listMaterials().find((m) => m.getName() === "FaceSkin");
const [r, g, b] = faceSkinMat.getBaseColorFactor();
const DARKEN = 0.82;
faceSkinMat.setBaseColorFactor([r * DARKEN, g * DARKEN, b * DARKEN, 1]);
console.log("darkened skin to", faceSkinMat.getBaseColorFactor());

const earNode = findNode("Ear.001");
const earPrim = earNode.getMesh().listPrimitives()[0];
earPrim.setMaterial(faceSkinMat);

// ---------------------------------------------------------------------
// 2) Shrink the ears (skinned mesh, both ears in one mesh symmetric about
//    x=0) around each ear's own centroid so they shrink in place instead
//    of sliding toward the face's centerline.
// ---------------------------------------------------------------------
const EAR_SCALE = 0.8;
{
  const position = earPrim.getAttribute("POSITION");
  const count = position.getCount();
  let leftSum = [0, 0, 0], leftCount = 0;
  let rightSum = [0, 0, 0], rightCount = 0;
  const pts = [];
  for (let i = 0; i < count; i++) {
    const p = position.getElement(i, []);
    pts.push(p);
    if (p[0] >= 0) {
      leftSum[0] += p[0]; leftSum[1] += p[1]; leftSum[2] += p[2]; leftCount++;
    } else {
      rightSum[0] += p[0]; rightSum[1] += p[1]; rightSum[2] += p[2]; rightCount++;
    }
  }
  const leftC = leftSum.map((v) => v / leftCount);
  const rightC = rightSum.map((v) => v / rightCount);
  console.log("left ear centroid", leftC, "right ear centroid", rightC);

  for (let i = 0; i < count; i++) {
    const p = pts[i];
    const c = p[0] >= 0 ? leftC : rightC;
    const np = [
      c[0] + (p[0] - c[0]) * EAR_SCALE,
      c[1] + (p[1] - c[1]) * EAR_SCALE,
      c[2] + (p[2] - c[2]) * EAR_SCALE,
    ];
    position.setElement(i, np);
  }
}

// ---------------------------------------------------------------------
// 3) Lighten the shoes to a light grey (was a dark grey).
// ---------------------------------------------------------------------
const shoeMat = doc.getRoot().listMaterials().find((m) => m.getName() === "ShoeDarkGrey");
shoeMat.setBaseColorFactor([0.55, 0.55, 0.55, 1]).setName("ShoeLightGrey");

await doc.transform(prune(), dedup(), unpartition());
await io.write("public/models/character.new.glb", doc);
console.log("wrote public/models/character.new.glb");
