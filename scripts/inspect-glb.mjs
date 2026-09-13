import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import fs from "fs";

const file = process.argv[2];
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(file);
const root = doc.getRoot();

const out = [];
out.push(`=== FILE: ${file} ===`);

out.push(`\n-- SCENES --`);
for (const scene of root.listScenes()) {
  out.push(`Scene: ${scene.getName()}`);
}

out.push(`\n-- SKINS --`);
for (const skin of root.listSkins()) {
  const joints = skin.listJoints();
  out.push(`Skin "${skin.getName()}" joints=${joints.length}`);
  joints.forEach((j, i) => out.push(`  [${i}] ${j.getName()}`));
}

out.push(`\n-- ANIMATIONS --`);
for (const anim of root.listAnimations()) {
  out.push(`Animation "${anim.getName()}"`);
  const channels = anim.listChannels();
  const targets = new Set();
  channels.forEach((ch) => {
    const node = ch.getTargetNode();
    targets.add(`${node ? node.getName() : "?"} :: ${ch.getTargetPath()}`);
  });
  [...targets].sort().forEach((t) => out.push(`   target: ${t}`));
}

out.push(`\n-- MESHES / PRIMITIVES / MORPH TARGETS --`);
for (const mesh of root.listMeshes()) {
  out.push(`Mesh "${mesh.getName()}"`);
  mesh.listPrimitives().forEach((prim, i) => {
    const targets = prim.listTargets();
    const targetNames = mesh.listTargetNames ? mesh.listTargetNames() : [];
    out.push(`  Primitive[${i}] mode=${prim.getMode()} targets=${targets.length}`);
    if (targetNames.length) {
      out.push(`    targetNames: ${targetNames.join(", ")}`);
    }
    const material = prim.getMaterial();
    out.push(`    material: ${material ? material.getName() : "none"}`);
  });
}

out.push(`\n-- NODES (hierarchy) --`);
function printNode(node, depth) {
  const mesh = node.getMesh();
  const skin = node.getSkin();
  out.push(
    `${"  ".repeat(depth)}${node.getName() || "(unnamed)"}${mesh ? " [MESH]" : ""}${
      skin ? " [SKINNED]" : ""
    }`
  );
  node.listChildren().forEach((c) => printNode(c, depth + 1));
}
for (const scene of root.listScenes()) {
  scene.listChildren().forEach((n) => printNode(n, 0));
}

out.push(`\n-- MATERIALS --`);
for (const mat of root.listMaterials()) {
  out.push(`Material "${mat.getName()}"`);
}

out.push(`\n-- TEXTURES --`);
for (const tex of root.listTextures()) {
  out.push(`Texture "${tex.getName()}" mimeType=${tex.getMimeType()}`);
}

const text = out.join("\n");
console.log(text);
fs.writeFileSync(file + ".inspect.txt", text);
