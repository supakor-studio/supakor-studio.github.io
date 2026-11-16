// Supakor.Studio — the 3D hero scene (site.js does the rest, without this module).
// Three.js comes from the import map in index.html (pinned version). Without WebGL, or with
// "reduce motion" set, the page keeps its static gradient and still works fully.
import * as THREE from "three";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- 3D hero ----------
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

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const NAVY = 0x13285c, SKY = 0x1fa3dc, GOLD = 0xc9a35a;

  // Light
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(4, 5, 6);
  scene.add(key);
  const rim = new THREE.PointLight(SKY, 30, 30);
  rim.position.set(-5, -2, 3);
  scene.add(rim);
  const warm = new THREE.PointLight(GOLD, 22, 30);
  warm.position.set(5, -3, 2);
  scene.add(warm);

  const group = new THREE.Group();
  scene.add(group);

  // The centrepiece: a glossy knot (the "S" of the logo, read as a ribbon) in sky blue.
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.35, 0.36, 220, 32, 2, 3),
    new THREE.MeshPhysicalMaterial({ color: SKY, metalness: 0.35, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1, sheen: 0.4 }),
  );
  group.add(knot);

  // A thin gold orbit ring.
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.7, 0.025, 16, 200),
    new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.9, roughness: 0.25, emissive: GOLD, emissiveIntensity: 0.15 }),
  );
  ring.rotation.x = Math.PI * 0.42;
  group.add(ring);

  // Pixels orbiting, as in the logo.
  const cubes = [];
  const cubeGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
  const cubeMats = [
    new THREE.MeshStandardMaterial({ color: NAVY, metalness: 0.4, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: SKY, metalness: 0.3, roughness: 0.3, emissive: SKY, emissiveIntensity: 0.2 }),
  ];
  for (let i = 0; i < 46; i++) {
    const c = new THREE.Mesh(cubeGeo, cubeMats[i % 2]);
    const r = 2.6 + Math.random() * 1.6;
    c.userData = { r, a: Math.random() * Math.PI * 2, y: (Math.random() - 0.5) * 2.6, s: 0.15 + Math.random() * 0.35 };
    cubes.push(c);
    group.add(c);
  }

  // A gold four-point star.
  const starShape = new THREE.Shape();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, rad = i % 2 ? 0.08 : 0.34;
    const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
    i ? starShape.lineTo(x, y) : starShape.moveTo(x, y);
  }
  const star = new THREE.Mesh(
    new THREE.ExtrudeGeometry(starShape, { depth: 0.06, bevelEnabled: false }),
    new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.8, roughness: 0.2, emissive: GOLD, emissiveIntensity: 0.35 }),
  );
  star.position.set(1.9, 1.7, 0.6);
  group.add(star);

  // A field of points, like circuit dots.
  const n = 900, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 26;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 2] = -4 - Math.random() * 10;
  }
  const dotsGeo = new THREE.BufferGeometry();
  dotsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dots = new THREE.Points(dotsGeo, new THREE.PointsMaterial({ color: SKY, size: 0.045, transparent: true, opacity: 0.75 }));
  scene.add(dots);

  // Pointer (mouse or touch) tilts the scene; a click spins the knot.
  const target = { x: 0, y: 0 };
  let spin = 0;
  const onMove = (x, y) => {
    target.x = (x / window.innerWidth) * 2 - 1;
    target.y = (y / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", (e) => onMove(e.clientX, e.clientY), { passive: true });
  canvas.parentElement.addEventListener("click", () => { spin = 0.6; });

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas.parentElement;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Desktop: the scene sits right of the text. Phones: above the card.
    const wide = w >= 900;
    camera.position.z = wide ? 9 : 11;
    group.position.set(wide ? 2.6 : 0, wide ? 0 : 2.3, 0);
    group.scale.setScalar(wide ? 1 : 0.72);
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // Render only while the hero is on screen.
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  const clock = new THREE.Clock();
  (function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();
    spin *= 0.96;
    knot.rotation.x = t * 0.18;
    knot.rotation.y = t * 0.26 + spin * 6;
    ring.rotation.z = t * 0.12;
    star.rotation.z = t * 0.8;
    star.scale.setScalar(1 + Math.sin(t * 2.4) * 0.12);
    for (const c of cubes) {
      const u = c.userData;
      const a = u.a + t * u.s;
      c.position.set(Math.cos(a) * u.r, u.y + Math.sin(t * u.s * 2) * 0.15, Math.sin(a) * u.r * 0.6);
      c.rotation.x = c.rotation.y = a * 2;
    }
    dots.rotation.y = t * 0.015;
    group.rotation.y += (target.x * 0.5 - group.rotation.y) * 0.05;
    group.rotation.x += (target.y * 0.3 - group.rotation.x) * 0.05;
    renderer.render(scene, camera);
  })();
}

startScene();
