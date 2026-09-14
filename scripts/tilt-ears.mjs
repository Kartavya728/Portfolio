import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { prune, dedup, unpartition } from "@gltf-transform/functions";

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read("public/models/character.glb");

function findNode(name) {
  return doc.getRoot().listNodes().find((n) => n.getName() === name);
}

const earNode = findNode("Ear.001");
const earPrim = earNode.getMesh().listPrimitives()[0];
const position = earPrim.getAttribute("POSITION");
const count = position.getCount();

// Split into the two ears (mesh is symmetric about x=0) and compute each
// side's own centroid, exactly as recolor-tweaks.mjs does for scaling.
const pts = [];
let leftSum = [0, 0, 0], leftCount = 0;
let rightSum = [0, 0, 0], rightCount = 0;
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

// Each ear currently leans ~5.5 degrees away from true-vertical in the X-Y
// plane (top tilted outward, away from the head). Rotate 60% of that lean
// back out around each ear's own centroid so it stands noticeably more
// upright, without fully flattening the natural flare.
const CORRECTION_FRACTION = 0.6;
const LEFT_TILT_DEG = 5.49; // measured via scripts/analyze-ear.mjs
const RIGHT_TILT_DEG = -5.49;

// Pull each ear in toward the head's centerline (less lateral protrusion),
// i.e. "more inside the body".
const INWARD_AMOUNT = 0.04;

function rotateAndPull(p, centroid, tiltDeg, sign) {
  const angle = -(tiltDeg * CORRECTION_FRACTION) * (Math.PI / 180);
  const dx = p[0] - centroid[0];
  const dy = p[1] - centroid[1];
  const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
  const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
  return [
    centroid[0] + rx - sign * INWARD_AMOUNT,
    centroid[1] + ry,
    p[2],
  ];
}

for (let i = 0; i < count; i++) {
  const p = pts[i];
  const isLeft = p[0] >= 0;
  const centroid = isLeft ? leftC : rightC;
  const tiltDeg = isLeft ? LEFT_TILT_DEG : RIGHT_TILT_DEG;
  const sign = isLeft ? 1 : -1; // pulls +x ear toward -x (inward), -x ear toward +x
  const np = rotateAndPull(p, centroid, tiltDeg, sign);
  position.setElement(i, np);
}

console.log("tilted and pulled in both ears");

await doc.transform(prune(), dedup(), unpartition());
await io.write("public/models/character.new.glb", doc);
console.log("wrote public/models/character.new.glb");
