// Minimal 3D KD-tree for nearest-neighbor queries (no external deps).
export class KDTree3 {
  constructor(points) {
    // points: Array<{ x, y, z, data }>
    this.nodes = points.slice();
    this.root = this._build(this.nodes, 0);
  }

  _build(pts, depth) {
    if (pts.length === 0) return null;
    const axis = depth % 3;
    const key = axis === 0 ? "x" : axis === 1 ? "y" : "z";
    pts.sort((a, b) => a[key] - b[key]);
    const mid = Math.floor(pts.length / 2);
    const node = {
      point: pts[mid],
      left: null,
      right: null,
    };
    node.left = this._build(pts.slice(0, mid), depth + 1);
    node.right = this._build(pts.slice(mid + 1), depth + 1);
    return node;
  }

  // Returns the k nearest points to (x, y, z) as [{ point, distSq }], sorted ascending.
  kNearest(x, y, z, k) {
    const best = []; // max-heap-ish via sorted array (k is small, linear insert is fine)

    const visit = (node, depth) => {
      if (!node) return;
      const p = node.point;
      const dx = p.x - x;
      const dy = p.y - y;
      const dz = p.z - z;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (best.length < k) {
        best.push({ point: p, distSq });
        best.sort((a, b) => a.distSq - b.distSq);
      } else if (distSq < best[best.length - 1].distSq) {
        best[best.length - 1] = { point: p, distSq };
        best.sort((a, b) => a.distSq - b.distSq);
      }

      const axis = depth % 3;
      const key = axis === 0 ? "x" : axis === 1 ? "y" : "z";
      const diff = (axis === 0 ? x : axis === 1 ? y : z) - p[key];
      const [near, far] = diff < 0 ? [node.left, node.right] : [node.right, node.left];
      visit(near, depth + 1);
      if (best.length < k || diff * diff < best[best.length - 1].distSq) {
        visit(far, depth + 1);
      }
    };

    visit(this.root, 0);
    return best;
  }
}
