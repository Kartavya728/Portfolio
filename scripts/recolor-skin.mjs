import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { prune, dedup, unpartition } from "@gltf-transform/functions";

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read("public/models/character.glb");

function findNode(name) {
  return doc.getRoot().listNodes().find((n) => n.getName() === name);
}

function recolor(nodeName, materialName, rgb) {
  const node = findNode(nodeName);
  const prim = node.getMesh().listPrimitives()[0];
  const base = prim.getMaterial();
  const mat = doc
    .createMaterial(materialName)
    .setBaseColorFactor([...rgb, 1])
    .setRoughnessFactor(base.getRoughnessFactor())
    .setMetallicFactor(base.getMetallicFactor());
  prim.setMaterial(mat);
}

// #c48662
const SKIN = [0xc4 / 255, 0x86 / 255, 0x62 / 255];

recolor("Plane.007", "FaceSkin", SKIN);
recolor("Hand", "HandSkin", SKIN);

await doc.transform(prune(), dedup(), unpartition());
await io.write("public/models/character.new.glb", doc);
console.log("wrote public/models/character.new.glb");
