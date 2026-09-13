import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as THREE from "three";

const file = process.argv[2];
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(file);
const root = doc.getRoot();

const worldMatrices = new Map();

function computeWorld(node, parentMatrix) {
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
  node.listChildren().forEach((c) => computeWorld(c, world));
}

for (const scene of root.listScenes()) {
  scene.listChildren().forEach((n) => computeWorld(n, new THREE.Matrix4()));
}

const names = process.argv.slice(3);
for (const node of root.listNodes()) {
  if (names.includes(node.getName())) {
    const m = worldMatrices.get(node);
    const pos = new THREE.Vector3().setFromMatrixPosition(m);
    console.log(node.getName(), pos.x.toFixed(4), pos.y.toFixed(4), pos.z.toFixed(4));
  }
}
