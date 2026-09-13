import http from "http";
import fs from "fs";
import path from "path";

const port = process.argv[2] || 8842;
const root = process.cwd();

const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".glb": "model/gltf-binary",
  ".json": "application/json",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    let filePath;
    if (urlPath === "/viewer.html" || urlPath === "/") {
      filePath = path.join(root, "scripts", "viewer.html");
    } else if (urlPath === "/character.glb") {
      filePath = path.join(root, "public", "models", "character.glb");
    } else {
      filePath = path.join(root, urlPath);
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("not found: " + filePath);
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, () => console.log(`static server on ${port}`));
