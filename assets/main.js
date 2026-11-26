// Supakor.Studio — the 3D hero: the studio's mark at the centre, its works orbiting around it
// in three themes (IT, Gamer, Music). Point at a work to see its name, click to go to it.
// Three.js comes from the import map in index.html (pinned version); site.js does the rest of
// the page, so everything still works when this module can't load or WebGL is missing.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const THEME = { it: 0x1fa3dc, game: 0x8b5cf6, music: 0xd8a94e, navy: 0x13285c, white: 0xf4f7fc };

// ---------- small helpers ----------
function canvasTexture(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.25, ...extra });
const glow = (color, k = 0.35) => ({ emissive: color, emissiveIntensity: k });

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

// ---------- the works, as low-poly objects ----------
function laptop() {
  const g = new THREE.Group();
  const body = mat(0x2b3a5c, { metalness: 0.6, roughness: 0.3 });
  g.add(new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.07, 0.85, 3, 0.03), body));
  const screenTex = canvasTexture(512, 320, (c, w, h) => {
    c.fillStyle = "#0b1a33";
    c.fillRect(0, 0, w, h);
    const rows = [["#1fa3dc", 0.55], ["#d8a94e", 0.35], ["#8bd3f7", 0.7], ["#1fa3dc", 0.45], ["#e8edf7", 0.6], ["#d8a94e", 0.3], ["#8bd3f7", 0.5]];
    rows.forEach(([col, len], i) => {
      c.fillStyle = col;
      c.fillRect(30 + (i % 3) * 26, 34 + i * 38, (w - 90) * len, 16);
    });
    c.fillStyle = "#1fa3dc";
    c.font = "bold 28px monospace";
    c.fillText("</>", w - 80, h - 24);
  });
  const lid = new THREE.Group();
  lid.add(new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.85, 0.05, 3, 0.03), body));
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.18, 0.73), new THREE.MeshBasicMaterial({ map: screenTex }));
  screen.position.z = 0.03;
  lid.add(screen);
  lid.position.set(0, 0.42, -0.42);
  lid.rotation.x = -0.3;
  g.add(lid);
  return g;
}

function pdfDocument() {
  const g = new THREE.Group();
  const tex = canvasTexture(360, 470, (c, w, h) => {
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#c9d3e6";
    for (let i = 0; i < 7; i++) c.fillRect(40, 60 + i * 34, i % 3 === 2 ? 170 : 280, 12);
    c.fillStyle = "#1fa3dc";
    roundRect(c, 40, h - 150, 150, 80, 14);
    c.fill();
    c.fillStyle = "#ffffff";
    c.font = "bold 48px sans-serif";
    c.fillText("PDF", 62, h - 92);
  });
  const white = mat(THEME.white);
  g.add(new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.05, 0.03), [white, white, white, white, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 }), white]));
  const corner = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.04, 3), mat(THEME.music, { metalness: 0.7 }));
  corner.position.set(0.33, 0.46, 0.03);
  corner.rotation.set(Math.PI / 2, 0, Math.PI / 4);
  g.add(corner);
  return g;
}

function phone() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new RoundedBoxGeometry(0.55, 1.05, 0.07, 4, 0.08), mat(THEME.navy, { metalness: 0.6 })));
  const tex = canvasTexture(256, 480, (c, w, h) => {
    const grd = c.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, "#14315f");
    grd.addColorStop(1, "#0b1a33");
    c.fillStyle = grd;
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#e8edf7";
    c.font = "bold 30px sans-serif";
    c.fillText("฿ 12,450", 28, 70);
    [0.45, 0.7, 0.55, 0.9, 0.65].forEach((v, i) => {
      c.fillStyle = i === 3 ? "#d8a94e" : "#1fa3dc";
      c.fillRect(30 + i * 42, 330 - v * 200, 26, v * 200);
    });
    c.fillStyle = "#1fa3dc";
    roundRect(c, 28, 380, w - 56, 54, 16);
    c.fill();
  });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.47, 0.95), new THREE.MeshBasicMaterial({ map: tex }));
  screen.position.z = 0.04;
  g.add(screen);
  return g;
}

function clapper() {
  const g = new THREE.Group();
  const dark = mat(0x1c2333);
  g.add(new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.7, 0.08, 2, 0.03), dark));
  const stripes = canvasTexture(256, 48, (c, w, h) => {
    c.fillStyle = "#f4f7fc";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#1c2333";
    for (let x = -40; x < w; x += 52) {
      c.beginPath();
      c.moveTo(x, h);
      c.lineTo(x + 26, 0);
      c.lineTo(x + 52, 0);
      c.lineTo(x + 26, h);
      c.fill();
    }
  });
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.17, 0.08), [dark, dark, dark, dark, new THREE.MeshStandardMaterial({ map: stripes }), dark]);
  top.position.set(0, 0.45, 0);
  top.rotation.z = 0.18;
  g.add(top);
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), mat(THEME.music, glow(THEME.music, 0.5)));
  star.position.set(0, -0.05, 0.08);
  g.add(star);
  return g;
}

function gamepad() {
  const g = new THREE.Group();
  const shell = mat(0x2a1f4d, { metalness: 0.4, roughness: 0.3 });
  g.add(new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.5, 0.28, 4, 0.14), shell));
  for (const x of [-0.45, 0.45]) {
    const grip = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 16), shell);
    grip.scale.set(1, 1.15, 0.85);
    grip.position.set(x, -0.18, 0);
    g.add(grip);
  }
  const neon = mat(THEME.game, glow(THEME.game, 0.8));
  for (const [w, h] of [[0.24, 0.07], [0.07, 0.24]]) {
    const d = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), neon);
    d.position.set(-0.3, 0.02, 0.15);
    g.add(d);
  }
  const colors = [0x1fa3dc, 0xd8a94e, 0xf472b6, 0x34d399];
  [[0.3, 0.1], [0.42, 0.0], [0.3, -0.1], [0.18, 0.0]].forEach(([x, y], i) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), mat(colors[i], glow(colors[i], 0.6)));
    b.position.set(x, y, 0.15);
    g.add(b);
  });
  return g;
}

function headphones() {
  const g = new THREE.Group();
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 12, 40, Math.PI), mat(0x2b2f3a, { metalness: 0.7 }));
  band.position.y = 0.05;
  g.add(band);
  for (const x of [-0.5, 0.5]) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.16, 28), mat(THEME.music, { metalness: 0.75, roughness: 0.25 }));
    cup.rotation.z = Math.PI / 2;
    cup.position.set(x, -0.05, 0);
    g.add(cup);
    const pad = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 10, 28), mat(0x1a1a22));
    pad.rotation.y = Math.PI / 2;
    pad.position.set(x * 0.82, -0.05, 0);
    g.add(pad);
  }
  return g;
}

function musicNote() {
  const g = new THREE.Group();
  const gold = mat(THEME.music, { metalness: 0.85, roughness: 0.2, ...glow(THEME.music, 0.25) });
  for (const x of [-0.25, 0.25]) {
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), gold);
    head.scale.set(1.25, 0.9, 0.8);
    head.rotation.z = 0.4;
    head.position.set(x, -0.35, 0);
    g.add(head);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.75, 10), gold);
    stem.position.set(x + 0.17, 0.02, 0);
    g.add(stem);
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.1, 0.06), gold);
  beam.position.set(0.17, 0.36, 0);
  beam.rotation.z = 0.08;
  g.add(beam);
  return g;
}

function meru() {
  // World Exterior (โลกภายนอกหอคอย) matched to the Blender 5.2 scene:
  // flat-faced square pyramid Mount Meru with 4 cardinal colors (north gold, east silver,
  // south Indranil blue, west crystal), 4-continent world disk with rivers & mini pine forests,
  // floating tower on the southern rim, inverted rocky root, 3 subterranean element layers
  // (Fire magma, Water swells, Wind emerald vortex), and realistic boiling Sun with 6-ray
  // orange corona + cratered Moon.
  const g = new THREE.Group();

  // --- Procedural stone grain bump texture for Mount Meru faces ---
  const stoneTex = canvasTexture(256, 256, (c, w, h) => {
    c.fillStyle = "#808080";
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 1 + Math.random() * 5;
      const v = 90 + Math.floor(Math.random() * 75);
      c.fillStyle = `rgba(${v},${v},${v},0.22)`;
      c.fillRect(x, y, r * 2.2, r * 0.7);
    }
  });
  stoneTex.wrapS = stoneTex.wrapT = THREE.RepeatWrapping;
  stoneTex.repeat.set(2, 3);

  const faces = {
    north: new THREE.MeshStandardMaterial({ color: 0xd9a63a, metalness: 0.78, roughness: 0.28, bumpMap: stoneTex, bumpScale: 0.015 }),
    east: new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 0.82, roughness: 0.22, bumpMap: stoneTex, bumpScale: 0.015 }),
    south: new THREE.MeshStandardMaterial({ color: 0x2a5fc0, metalness: 0.28, roughness: 0.22, emissive: 0x163880, emissiveIntensity: 0.22, bumpMap: stoneTex, bumpScale: 0.015 }),
    west: new THREE.MeshStandardMaterial({ color: 0xbfe6f0, metalness: 0.12, roughness: 0.08, transparent: true, opacity: 0.88, emissive: 0x7bcce0, emissiveIntensity: 0.18, bumpMap: stoneTex, bumpScale: 0.01 }),
  };

  const diskY = -0.16;
  const diskH = 0.078;
  const diskR = 1.02;

  // --- 1. World Disk Top Surface (4 organic continents, inland lakes, 5 rivers, outer/inner ocean) ---
  const diskTopTex = canvasTexture(512, 512, (c, w, h) => {
    const cx = w / 2, cy = h / 2, R = w * 0.5;
    // Ocean base gradient
    const ocean = c.createRadialGradient(cx, cy, R * 0.12, cx, cy, R);
    ocean.addColorStop(0, "#1c7eb0");
    ocean.addColorStop(0.5, "#15638f");
    ocean.addColorStop(1, "#0f4d73");
    c.fillStyle = ocean;
    c.fillRect(0, 0, w, h);

    // Helper for organic continent wedge
    function drawContinent(centerAngle, span, innerR, outerR, baseColor, shoreColor, seed) {
      c.save();
      c.beginPath();
      const steps = 40;
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const a = centerAngle - span * 0.5 + u * span;
        const n = Math.sin(u * 13 + seed) * 0.035 + Math.cos(u * 23 - seed) * 0.02;
        const rr = (outerR + n * (1 - Math.abs(u - 0.5) * 1.4)) * R;
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        i === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
      }
      for (let i = steps; i >= 0; i--) {
        const u = i / steps;
        const a = centerAngle - span * 0.5 + u * span;
        const n = Math.cos(u * 11 + seed * 2) * 0.03 + Math.sin(u * 19 + seed) * 0.018;
        const rr = (innerR + n) * R;
        c.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      c.closePath();
      c.fillStyle = shoreColor;
      c.fill();
      c.lineWidth = 4;
      c.strokeStyle = "rgba(170, 215, 195, 0.28)";
      c.stroke();

      // Inner landmass fill
      c.clip();
      c.fillStyle = baseColor;
      c.fillRect(0, 0, w, h);

      // Forest texture blotches
      for (let k = 0; k < 220; k++) {
        const a = centerAngle + (Math.random() - 0.5) * span * 0.94;
        const rr = (innerR + 0.04 + Math.random() * (outerR - innerR - 0.07)) * R;
        const px = cx + Math.cos(a) * rr;
        const py = cy + Math.sin(a) * rr;
        c.fillStyle = k % 3 === 0 ? "rgba(22, 68, 28, 0.55)" : "rgba(56, 108, 44, 0.42)";
        c.beginPath();
        c.arc(px, py, 2 + Math.random() * 4.5, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    }

    // Inner land ring around Mount Meru (natural bridges & foothills)
    drawContinent(0, Math.PI * 2, 0.20, 0.42, "#3f6e33", "#6b8546", 1.1);

    // 4 Cardinal Continents: South (+PI/2), East (0), North (-PI/2), West (PI)
    drawContinent(Math.PI * 0.5, 1.38, 0.34, 0.90, "#3b7534", "#6e8e49", 2.3);  // South (ชมพูทวีป)
    drawContinent(0, 1.32, 0.36, 0.88, "#6f7d36", "#9a954a", 4.1);              // East (ปุพพวิเทหทวีป)
    drawContinent(-Math.PI * 0.5, 1.34, 0.36, 0.89, "#3d7a42", "#6a9154", 6.7); // North (อุตตรกุรุทวีป)
    drawContinent(Math.PI, 1.32, 0.36, 0.88, "#4c7865", "#769984", 8.9);        // West (อปรโคยานทวีป)

    // Inland lakes + 5 winding rivers connecting inner sea to outer ocean
    c.strokeStyle = "#1977ad";
    c.lineCap = "round";
    for (const [ang, lakeR] of [[Math.PI * 0.5, 0.64], [0, 0.65], [-Math.PI * 0.5, 0.66], [Math.PI, 0.65]]) {
      const lx = cx + Math.cos(ang) * lakeR * R;
      const ly = cy + Math.sin(ang) * lakeR * R;
      c.fillStyle = "#1876ab";
      c.beginPath();
      c.ellipse(lx, ly, R * 0.085, R * 0.062, ang, 0, Math.PI * 2);
      c.fill();
      // Winding river
      c.lineWidth = 5;
      c.beginPath();
      for (let s = 0; s <= 18; s++) {
        const u = s / 18;
        const rr = (0.22 + u * 0.72) * R;
        const aa = ang + Math.sin(u * Math.PI * 2.5 + ang) * 0.14;
        const rx = cx + Math.cos(aa) * rr, ry = cy + Math.sin(aa) * rr;
        s === 0 ? c.moveTo(rx, ry) : c.lineTo(rx, ry);
      }
      c.stroke();
    }
    // 5th winding river across South-West
    c.lineWidth = 4.5;
    c.beginPath();
    for (let s = 0; s <= 16; s++) {
      const u = s / 16;
      const rr = (0.25 + u * 0.68) * R;
      const aa = Math.PI * 0.72 + Math.sin(u * Math.PI * 2.2) * 0.12;
      const rx = cx + Math.cos(aa) * rr, ry = cy + Math.sin(aa) * rr;
      s === 0 ? c.moveTo(rx, ry) : c.lineTo(rx, ry);
    }
    c.stroke();

    // Inner blue moat ring around Mount Meru foot
    c.strokeStyle = "rgba(22, 118, 174, 0.85)";
    c.lineWidth = 10;
    c.beginPath();
    c.arc(cx, cy, R * 0.29, 0, Math.PI * 2);
    c.stroke();
  });

  // Stratified rocky cliff side wall of the world disk
  const cliffTex = canvasTexture(512, 64, (c, w, h) => {
    const grd = c.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, "#7c6751");
    grd.addColorStop(0.32, "#594838");
    grd.addColorStop(0.65, "#6b5642");
    grd.addColorStop(1, "#3b2e23");
    c.fillStyle = grd;
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 45; i++) {
      c.fillStyle = i % 2 === 0 ? "rgba(35,24,16,0.32)" : "rgba(165,140,110,0.22)";
      c.fillRect(0, Math.random() * h, w, 2 + Math.random() * 4);
    }
  });
  cliffTex.wrapS = THREE.RepeatWrapping;
  cliffTex.repeat.set(3, 1);

  const diskSideMat = new THREE.MeshStandardMaterial({ map: cliffTex, roughness: 0.88, metalness: 0.05 });
  const diskTopMat = new THREE.MeshStandardMaterial({ map: diskTopTex, roughness: 0.55, metalness: 0.12 });
  const diskBotMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1e, roughness: 0.92, metalness: 0.05 });
  const disk = new THREE.Mesh(
    new THREE.CylinderGeometry(diskR, diskR * 0.97, diskH, 56),
    [diskSideMat, diskTopMat, diskBotMat],
  );
  disk.position.y = diskY;
  g.add(disk);

  // Subtle 3D mini pine-forest clusters on the 4 continents (single InstancedMesh draw call)
  const treeGeo = new THREE.ConeGeometry(0.022, 0.058, 5);
  const treeMat = new THREE.MeshStandardMaterial({ color: 0x265c29, roughness: 0.85, metalness: 0.05 });
  const treeCount = 72;
  const trees = new THREE.InstancedMesh(treeGeo, treeMat, treeCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < treeCount; i++) {
    const q = i % 4;
    const baseA = q * (Math.PI / 2);
    // Deterministic pseudo-random placement on each continent
    const h1 = Math.sin(i * 12.9898) * 43758.5453;
    const r1 = h1 - Math.floor(h1);
    const h2 = Math.sin(i * 78.233 + 1.7) * 43758.5453;
    const r2 = h2 - Math.floor(h2);
    const a = baseA + (r1 - 0.5) * 1.02;
    const rr = 0.40 + r2 * 0.44;
    const sc = 0.65 + (i % 5) * 0.16;
    dummy.position.set(Math.cos(a) * rr, diskY + diskH * 0.5 + 0.025 * sc, Math.sin(a) * rr);
    dummy.scale.setScalar(sc);
    dummy.rotation.y = i * 1.1;
    dummy.updateMatrix();
    trees.setMatrixAt(i, dummy.matrix);
  }
  trees.instanceMatrix.needsUpdate = true;
  g.add(trees);

  // --- 2. Floating Ancient Tower on the southern edge (ชมพูทวีป) ---
  const tower = new THREE.Group();
  const towerStone = mat(0xb8b2a6, { roughness: 0.82, metalness: 0.08 });
  const towerShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.04, 0.17, 12), towerStone);
  towerShaft.position.y = 0.085;
  tower.add(towerShaft);
  const towerCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.026, 12), towerStone);
  towerCrown.position.y = 0.175;
  tower.add(towerCrown);
  const towerMist = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 12, 8),
    new THREE.MeshBasicMaterial({ color: 0xdbeeff, transparent: true, opacity: 0.24, depthWrite: false }),
  );
  towerMist.scale.set(1.4, 0.45, 1.4);
  towerMist.position.y = 0.035;
  tower.add(towerMist);
  tower.position.set(0.32, diskY + diskH * 0.5, 0.66);
  g.add(tower);

  // --- 3. Mount Meru: Sharp Flat-Faced Square Pyramid (edges parallel to X/Z) ---
  const H = 0.74, B = 0.23;
  const v = [
    [-B, 0, B], [B, 0, B], [B, 0, -B], [-B, 0, -B], // base: SW, SE, NE, NW
    [0, H, 0], // sharp apex
  ];
  const tris = [
    [0, 1, 4], // South (+Z) -> Indranil Blue
    [1, 2, 4], // East  (+X) -> Silver
    [2, 3, 4], // North (-Z) -> Gold
    [3, 0, 4], // West  (-X) -> Crystal
  ];
  const pPos = [], pUv = [];
  const pyramid = new THREE.BufferGeometry();
  tris.forEach((t, i) => {
    pPos.push(...v[t[0]], ...v[t[1]], ...v[t[2]]);
    pUv.push(0, 0, 1, 0, 0.5, 1);
    pyramid.addGroup(i * 3, 3, i);
  });
  pyramid.setAttribute("position", new THREE.Float32BufferAttribute(pPos, 3));
  pyramid.setAttribute("uv", new THREE.Float32BufferAttribute(pUv, 2));
  pyramid.computeVertexNormals();
  const mountain = new THREE.Mesh(pyramid, [faces.south, faces.east, faces.north, faces.west]);
  mountain.position.y = diskY + diskH * 0.5 - 0.01;
  g.add(mountain);

  // Inverted square root + floating-island rocky fangs below the world disk
  const rootMat = new THREE.MeshStandardMaterial({ color: 0x4b3f35, roughness: 0.92, metalness: 0.08 });
  const rootCone = new THREE.Mesh(new THREE.ConeGeometry(B * 1.12, 0.60, 4), rootMat);
  rootCone.rotation.set(Math.PI, Math.PI / 4, 0);
  rootCone.position.y = diskY - diskH * 0.5 - 0.29;
  g.add(rootCone);
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2;
    const rad = 0.22 + (k % 2) * 0.09;
    const fh = 0.14 + (k % 3) * 0.06;
    const fang = new THREE.Mesh(new THREE.ConeGeometry(0.055, fh, 5), rootMat);
    fang.rotation.x = Math.PI;
    fang.position.set(Math.cos(a) * rad, diskY - diskH * 0.5 - fh * 0.45, Math.sin(a) * rad);
    g.add(fang);
  }

  // --- 4. Three Subterranean Element Layers: Fire, Water, Wind ---
  // Layer 1: Fire / Molten Magma Crust (R = 0.93)
  const magmaTex = canvasTexture(512, 128, (c, w, h) => {
    c.fillStyle = "#1b0b08";
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 65; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      const rad = 12 + Math.random() * 34;
      const grd = c.createRadialGradient(x, y, 1, x, y, rad);
      grd.addColorStop(0, "rgba(255, 224, 102, 0.95)");
      grd.addColorStop(0.35, "rgba(255, 118, 28, 0.85)");
      grd.addColorStop(0.7, "rgba(190, 38, 12, 0.45)");
      grd.addColorStop(1, "rgba(27, 11, 8, 0)");
      c.fillStyle = grd;
      c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
  });
  magmaTex.wrapS = magmaTex.wrapT = THREE.RepeatWrapping;
  const fireMat = new THREE.MeshBasicMaterial({ map: magmaTex });
  const fireLayer = new THREE.Mesh(new THREE.CylinderGeometry(0.93, 0.91, 0.072, 48), fireMat);
  fireLayer.position.y = diskY - 0.15;
  g.add(fireLayer);

  const fireLight = new THREE.PointLight(0xff6a1f, 2.2, 2.4);
  fireLight.position.y = diskY - 0.16;
  g.add(fireLight);

  // Layer 2: Water Swells (R = 0.84)
  const waterTex = canvasTexture(256, 256, (c, w, h) => {
    const grd = c.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
    grd.addColorStop(0, "#1c7dc4");
    grd.addColorStop(0.7, "#115896");
    grd.addColorStop(1, "#2a96d6");
    c.fillStyle = grd;
    c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(190, 235, 255, 0.35)";
    c.lineWidth = 2;
    for (let i = 0; i < 14; i++) {
      c.beginPath();
      c.arc(w / 2, h / 2, 18 + i * 9, i * 0.5, i * 0.5 + 3.4);
      c.stroke();
    }
  });
  const waterLayer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.84, 0.82, 0.056, 48),
    new THREE.MeshStandardMaterial({
      map: waterTex,
      color: 0x38a5e8,
      roughness: 0.14,
      metalness: 0.3,
      transparent: true,
      opacity: 0.84,
      emissive: 0x0e4f8c,
      emissiveIntensity: 0.32,
    }),
  );
  waterLayer.position.y = diskY - 0.285;
  g.add(waterLayer);

  // Layer 3: Wind Emerald Storm Cloud Vortex (R = 0.76)
  const windTex = canvasTexture(256, 256, (c, w, h) => {
    const cx = w / 2, cy = h / 2;
    const grd = c.createRadialGradient(cx, cy, 8, cx, cy, w * 0.48);
    grd.addColorStop(0, "rgba(150, 255, 232, 0.85)");
    grd.addColorStop(0.55, "rgba(72, 224, 194, 0.65)");
    grd.addColorStop(0.85, "rgba(42, 180, 158, 0.25)");
    grd.addColorStop(1, "rgba(42, 180, 158, 0)");
    c.fillStyle = grd;
    c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(210, 255, 245, 0.45)";
    c.lineWidth = 3;
    for (let k = 0; k < 6; k++) {
      c.beginPath();
      for (let s = 0; s < 30; s++) {
        const u = s / 29;
        const a = k * (Math.PI / 3) + u * 2.4;
        const rr = (0.12 + u * 0.34) * w;
        const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
        s === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
      }
      c.stroke();
    }
  });
  const windMat = new THREE.MeshBasicMaterial({
    map: windTex,
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const windLayer = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.76 - i * 0.04, 40), windMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = (i - 1) * 0.022;
    windLayer.add(disc);
  }
  windLayer.position.y = diskY - 0.42;
  g.add(windLayer);

  // --- 5. Realistic Boiling Sun (crimson-orange photosphere + volumetric corona + 6-ray flare) & Moon ---
  const sunTex = canvasTexture(256, 128, (c, w, h) => {
    const grd = c.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, "#ff5524");
    grd.addColorStop(0.5, "#ff3b2f");
    grd.addColorStop(1, "#ff7828");
    c.fillStyle = grd;
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 240; i++) {
      c.fillStyle = i % 3 === 0 ? "rgba(255, 210, 110, 0.42)" : "rgba(180, 24, 14, 0.34)";
      c.beginPath();
      c.arc(Math.random() * w, Math.random() * h, 2 + Math.random() * 6, 0, Math.PI * 2);
      c.fill();
    }
  });
  const sunGroup = new THREE.Group();
  const sunCore = new THREE.Mesh(new THREE.SphereGeometry(0.095, 20, 16), new THREE.MeshBasicMaterial({ map: sunTex }));
  sunGroup.add(sunCore);

  // Translucent 6-rayed orange solar corona sprite (matches Blender Mat_Sun_CoronaRays6)
  const corona6Tex = canvasTexture(256, 256, (c, w, h) => {
    const cx = w / 2, cy = h / 2;
    const halo = c.createRadialGradient(cx, cy, w * 0.08, cx, cy, w * 0.48);
    halo.addColorStop(0, "rgba(255, 210, 140, 0.95)");
    halo.addColorStop(0.28, "rgba(255, 138, 42, 0.68)");
    halo.addColorStop(0.6, "rgba(255, 72, 26, 0.22)");
    halo.addColorStop(1, "rgba(255, 59, 47, 0)");
    c.fillStyle = halo;
    c.fillRect(0, 0, w, h);

    // 6 soft fiery solar flare rays
    for (let k = 0; k < 6; k++) {
      c.save();
      c.translate(cx, cy);
      c.rotate((k * Math.PI) / 3);
      const rg = c.createLinearGradient(0, 0, w * 0.48, 0);
      rg.addColorStop(0, "rgba(255, 196, 110, 0.88)");
      rg.addColorStop(0.42, "rgba(255, 128, 36, 0.48)");
      rg.addColorStop(1, "rgba(255, 60, 24, 0)");
      c.fillStyle = rg;
      c.beginPath();
      c.moveTo(0, -16);
      c.lineTo(w * 0.48, 0);
      c.lineTo(0, 16);
      c.closePath();
      c.fill();
      c.restore();
    }
  });
  const sunCorona = new THREE.Sprite(new THREE.SpriteMaterial({
    map: corona6Tex,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  }));
  sunCorona.scale.set(0.56, 0.56, 1);
  sunGroup.add(sunCorona);
  g.add(sunGroup);

  // Cratered Moon
  const moonTex = canvasTexture(128, 128, (c, w, h) => {
    c.fillStyle = "#e6ecf7";
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 24; i++) {
      c.fillStyle = "rgba(145, 160, 185, 0.35)";
      c.beginPath();
      c.arc(Math.random() * w, Math.random() * h, 3 + Math.random() * 9, 0, Math.PI * 2);
      c.fill();
    }
  });
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.062, 16, 12),
    new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.7, metalness: 0.1, emissive: 0xbfd4ff, emissiveIntensity: 0.55 }),
  );
  g.add(moon);

  g.userData.tick = (t) => {
    // Subtle magma pulse & wind vortex rotation
    fireLight.intensity = 1.9 + Math.sin(t * 4.2) * 0.35;
    magmaTex.offset.x = t * 0.02;
    waterLayer.rotation.y = t * 0.08;
    windLayer.rotation.y = -t * 0.35;
    sunCore.rotation.y = t * 0.4;
    sunCorona.material.rotation = t * 0.15;
    const s = 0.54 + Math.sin(t * 3.1) * 0.03;
    sunCorona.scale.set(s, s, 1);
    // Sun & Moon orbit vertically in a full circle (over Mount Meru and under the world layers)
    const a = t * 0.6;
    const orbitR = 1.15;
    const orbitCy = -0.09;
    sunGroup.position.set(Math.cos(a) * orbitR, orbitCy + Math.sin(a) * orbitR, 0);
    moon.position.set(Math.cos(a + Math.PI) * orbitR, orbitCy + Math.sin(a + Math.PI) * orbitR, 0);
  };

  g.scale.setScalar(0.95);
  return g;
}

// What orbits, and where a click goes. `theme` colours the object's glow when pointed at.
const WORKS = [
  { name: "DocDee PDF · โปรแกรม PDF ภาษาไทย", theme: "it", make: pdfDocument, href: "#docdee" },
  { name: "ซอฟต์แวร์ & IT", theme: "it", make: laptop, href: "#works" },
  { name: "ภาษีแม่ค้า · DocDee PDF (แอปมือถือ)", theme: "it", make: phone, href: "#works" },
  { name: "AetherReel Studio · วิดีโอ AI", theme: "it", make: clapper, href: "#works" },
  { name: "ED GAMER · ช่องเกม", theme: "game", make: gamepad, href: "https://www.youtube.com/@ED._GAMER-SP" },
  { name: "เกมที่กำลังพัฒนา", theme: "game", make: meru, href: "#works" },
  { name: "นกฮูก STORY & MUSIC · ไลฟ์เพลง", theme: "music", make: headphones, href: "https://www.youtube.com/@Owl_STORY-MUSIC/streams" },
  { name: "นกฮูก STORY & MUSIC · เพลงแต่งเอง", theme: "music", make: musicNote, href: "https://www.youtube.com/@Owl_STORY-MUSIC/videos" },
];

// ---------- the scene ----------
function startScene() {
  const canvas = document.getElementById("scene");
  if (!canvas || reduceMotion) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return; // no WebGL: the CSS gradient stays
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 1.2, 11);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xdfeaff, 0x1a1030, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 6, 7);
  scene.add(key);
  for (const [c, x, y, z] of [[THEME.it, -6, 2, 3], [THEME.game, 6, -2, 3], [THEME.music, 0, -5, 4]]) {
    const p = new THREE.PointLight(c, 26, 25);
    p.position.set(x, y, z);
    scene.add(p);
  }

  const world = new THREE.Group();
  scene.add(world);

  // The centre: the studio's mark on a rounded tile, with a gold halo and a soft glow.
  const markTex = new THREE.TextureLoader().load("assets/mark.png");
  markTex.colorSpace = THREE.SRGBColorSpace;
  const tileSide = mat(0xffffff, { roughness: 0.25, metalness: 0.1 });
  const tile = new THREE.Mesh(new RoundedBoxGeometry(1.7, 1.7, 0.22, 6, 0.32), [tileSide, tileSide, tileSide, tileSide, new THREE.MeshBasicMaterial({ map: markTex }), tileSide]);
  world.add(tile);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.03, 16, 120), mat(THEME.music, { metalness: 0.9, roughness: 0.2, ...glow(THEME.music, 0.4) }));
  world.add(halo);
  const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: canvasTexture(256, 256, (c, w, h) => {
      const r = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      r.addColorStop(0, "rgba(120,200,255,0.55)");
      r.addColorStop(0.5, "rgba(80,120,255,0.15)");
      r.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = r;
      c.fillRect(0, 0, w, h);
    }),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  glowSprite.scale.set(4.6, 4.6, 1);
  glowSprite.position.z = -0.6;
  world.add(glowSprite);

  // The orbit: a faint ring and the works on it.
  const orbit = new THREE.Group();
  // Tilted enough that works in front pass below the mark and those behind pass above it.
  orbit.rotation.x = 0.62;
  world.add(orbit);
  const R = 3.0;
  const path = new THREE.Mesh(new THREE.TorusGeometry(R, 0.008, 8, 200), new THREE.MeshBasicMaterial({ color: 0x8fb8ff, transparent: true, opacity: 0.25 }));
  path.rotation.x = Math.PI / 2;
  orbit.add(path);
  const items = WORKS.map((w, i) => {
    const holder = new THREE.Group();
    const obj = w.make();
    obj.scale.setScalar(0.85);
    holder.add(obj);
    // An invisible ball makes the whole object easy to point at.
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.userData.index = i;
    holder.add(hit);
    orbit.add(holder);
    const glowing = [];
    obj.traverse((m) => {
      if (m.isMesh && m.material && !Array.isArray(m.material) && "emissiveIntensity" in m.material) {
        // Own materials, so lighting one object up doesn't light up its neighbours.
        m.material = m.material.clone();
        glowing.push({ m: m.material, base: m.material.emissiveIntensity, color: m.material.emissive.getHex() });
      }
    });
    return { ...w, holder, obj, hit, glowing, angle: (i / WORKS.length) * Math.PI * 2, spin: 0.4 + (i % 3) * 0.15, hover: 0 };
  });

  // Theme-coloured dust: IT blue, Gamer purple, Music gold.
  const n = 1200, pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const palette = [new THREE.Color(THEME.it), new THREE.Color(THEME.game), new THREE.Color(THEME.music)];
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    pos[i * 3 + 2] = -3 - Math.random() * 14;
    const c = palette[i % 3];
    col.set([c.r, c.g, c.b], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  dustGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.8 }));
  scene.add(dust);

  // Pointing and clicking.
  const hero = canvas.parentElement;
  const label = document.getElementById("orbit-label");
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(9, 9);
  const target = { x: 0, y: 0 };
  let hovered = -1;
  const hits = items.map((it) => it.hit);
  hero.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    // Over the text card, nothing in the scene is under the pointer.
    if (e.target.closest(".glass")) ndc.set(9, 9);
    target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    target.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    if (label) {
      label.style.left = `${e.clientX - r.left}px`;
      label.style.top = `${e.clientY - r.top}px`;
    }
  }, { passive: true });
  hero.addEventListener("pointerleave", () => ndc.set(9, 9));
  hero.addEventListener("click", (e) => {
    if (e.target.closest("a, button, .glass")) return;
    // Pick at the click itself: a tap on a phone has no pointer moving over the work first.
    const r = canvas.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
    const picked = ray.intersectObjects(hits, false)[0];
    if (!picked) return;
    const href = items[picked.object.userData.index].href;
    if (href.startsWith("#")) document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    else window.open(href, "_blank", "noopener");
  });

  function resize() {
    const { clientWidth: w, clientHeight: h } = hero;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Desktop: the scene sits right of the text. Phones: above the card.
    const wide = w >= 900;
    camera.position.z = wide ? 11 : 15;
    world.position.set(wide ? 3.8 : 0, wide ? 0 : 3.4, 0);
    world.scale.setScalar(wide ? 0.95 : 0.62);
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  const clock = new THREE.Clock();
  let orbitAngle = 0;
  (function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(hits, false)[0];
    const now = hit ? hit.object.userData.index : -1;
    if (now !== hovered) {
      hovered = now;
      hero.style.cursor = hovered >= 0 ? "pointer" : "";
      if (label) {
        label.textContent = hovered >= 0 ? items[hovered].name : "";
        label.dataset.theme = hovered >= 0 ? items[hovered].theme : "";
        label.classList.toggle("on", hovered >= 0);
      }
    }

    // The orbit slows right down while a work is pointed at.
    orbitAngle += dt * (hovered >= 0 ? 0.02 : 0.16);
    for (const [i, it] of items.entries()) {
      const a = it.angle + orbitAngle;
      it.holder.position.set(Math.cos(a) * R, Math.sin(t * 0.9 + i) * 0.18, Math.sin(a) * R);
      // Each object mostly faces the viewer, turning a little on its own.
      it.holder.rotation.set(-orbit.rotation.x * 0.6, Math.sin(t * it.spin + i) * 0.6, 0);
      it.hover += ((i === hovered ? 1 : 0) - it.hover) * 0.15;
      it.obj.scale.setScalar(0.85 + it.hover * 0.35);
      it.obj.userData.tick?.(t);
      for (const gm of it.glowing) {
        gm.m.emissive.setHex(it.hover > 0.05 ? THEME[it.theme] : gm.color);
        gm.m.emissiveIntensity = gm.base + it.hover * 0.6;
      }
    }
    tile.rotation.y = Math.sin(t * 0.5) * 0.45;
    tile.rotation.x = Math.sin(t * 0.37) * 0.12;
    tile.position.y = Math.sin(t * 0.8) * 0.08;
    halo.rotation.set(Math.PI / 2 + Math.sin(t * 0.4) * 0.25, t * 0.3, 0);
    dust.rotation.y = t * 0.01;
    world.rotation.y += (target.x * 0.35 - world.rotation.y) * 0.04;
    world.rotation.x += (-target.y * 0.18 - world.rotation.x) * 0.04;
    renderer.render(scene, camera);
  })();
}

startScene();

