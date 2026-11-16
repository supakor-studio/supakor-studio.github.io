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

function tower() {
  const g = new THREE.Group();
  const stone = mat(0x3a3150, { roughness: 0.6 });
  const trim = mat(THEME.game, glow(THEME.game, 0.7));
  [[0.34, 0.42, 0.5, -0.45], [0.28, 0.34, 0.45, 0.02], [0.22, 0.28, 0.4, 0.44]].forEach(([top, bottom, h, y]) => {
    const tier = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, h, 8), stone);
    tier.position.y = y;
    g.add(tier);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(top + 0.01, 0.025, 8, 24), trim);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y + h / 2;
    g.add(ring);
  });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.4, 8), mat(THEME.music, { metalness: 0.7, ...glow(THEME.music, 0.3) }));
  roof.position.y = 0.84;
  g.add(roof);
  const win = mat(0xffd27a, glow(0xffd27a, 0.9));
  for (const y of [-0.4, 0.05, 0.47]) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.02), win);
    w.position.set(0, y, 0.3 - (y + 0.4) * 0.12);
    g.add(w);
  }
  return g;
}

// What orbits, and where a click goes. `theme` colours the object's glow when pointed at.
const WORKS = [
  { name: "DocDee PDF · โปรแกรม PDF ภาษาไทย", theme: "it", make: pdfDocument, href: "#docdee" },
  { name: "ซอฟต์แวร์ & IT", theme: "it", make: laptop, href: "#works" },
  { name: "ภาษีแม่ค้า · PDF Tools ไทย (แอปมือถือ)", theme: "it", make: phone, href: "#works" },
  { name: "AetherReel Studio · วิดีโอ AI", theme: "it", make: clapper, href: "#works" },
  { name: "ED GAMER · ช่องเกม", theme: "game", make: gamepad, href: "https://www.youtube.com/@ED._GAMER-SP" },
  { name: "เกม RPG หอคอย 50 ชั้น · กำลังพัฒนา", theme: "game", make: tower, href: "#works" },
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
