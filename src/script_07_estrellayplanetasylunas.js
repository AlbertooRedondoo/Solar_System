import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let scene, renderer, camera;
let info;
let earthClouds;
let estrella,
  Planetas = [],
  Lunas = [];
let t0 = 0,
  accglobal = 0.001,
  timestamp;

let controls;

//Vista por defecto
let defaultCamPos = new THREE.Vector3(0, -30, -20);
let defaultTarget = new THREE.Vector3(0, 0, 0);

//seguir planeta
let followIndex = null;
const FOLLOW_SMOOTH = 0.08;

//Reloj y giro del Sol
const SUN_SPIN = 0.5; // rad/s
const clock = new THREE.Clock();
init();
animationLoop();

function init() {
  // ---------- UI de título ----------
  info = document.createElement("div");
  info.style.position = "absolute";
  info.style.top = "30px";
  info.style.width = "100%";
  info.style.textAlign = "center";
  info.style.color = "#fff";
  info.style.fontWeight = "bold";
  info.style.backgroundColor = "transparent";
  info.style.zIndex = "1";
  info.style.fontFamily = "Monospace";
  info.innerHTML = "Sistema Solar Alberto Redondo";
  document.body.appendChild(info);

  // ---------- Escena / Cámara / Renderer ----------
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (renderer.outputColorSpace !== undefined) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  document.body.appendChild(renderer.domElement);

  // OrbitControls + vista por defecto
  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.copy(defaultCamPos);
  controls.target.copy(defaultTarget);
  controls.update();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---------- Texturas ----------
  const loader = new THREE.TextureLoader();

  const starsTex = loader.load(
    "src/2k_stars.jpg",
    () => {
      if (starsTex.colorSpace !== undefined)
        starsTex.colorSpace = THREE.SRGBColorSpace;
      if (THREE.EquirectangularReflectionMapping) {
        starsTex.mapping = THREE.EquirectangularReflectionMapping;
      }
      scene.background = starsTex;
    },
    undefined,
    (e) => console.error("No se pudo cargar 2k_stars", e)
  );

  const sunTex = loader.load(
    "src/2k_sun.jpg",
    () => {
      if (sunTex.colorSpace !== undefined)
        sunTex.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    (e) => console.error("No se pudo cargar 2k_sun", e)
  );

  const mercuryTex = loader.load(
    "src/2k_mercury.jpg",
    () => {
      if (mercuryTex.colorSpace !== undefined)
        mercuryTex.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    (e) => console.error("No se pudo cargar 2k_mercury.jpg", e)
  );

  const venusTex = loader.load(
    "src/2k_venus_surface.jpg",
    () => {
      if (venusTex.colorSpace !== undefined)
        venusTex.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    (e) => console.error("No se pudo cargar 2k_venus_surface.jpg", e)
  );

  const earthTex = loader.load("src/earthmap1k.jpg", () => {
    if (earthTex.colorSpace !== undefined)
      earthTex.colorSpace = THREE.SRGBColorSpace;
  });

  const cloudTex = loader.load("src/earthcloudmap.jpg", () => {
    if (cloudTex.colorSpace !== undefined)
      cloudTex.colorSpace = THREE.SRGBColorSpace;
  });

  const moonTex = loader.load(
    "src/2k_moon.jpg",
    () => {
      if (moonTex.colorSpace !== undefined)
        moonTex.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    (e) => console.error("No se pudo cargar 2k_moon.jpg", e)
  );

  const marsTex = loader.load(
    "src/2k_mars.jpg",
    () => {
      if (marsTex.colorSpace !== undefined)
        marsTex.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    (e) => console.error("No se pudo cargar 2k_mars.jpg", e)
  );

  const jupiterTex = loader.load(
    "src/2k_jupiter.jpg",
    () => {
      if (jupiterTex.colorSpace !== undefined)
        jupiterTex.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    (e) => console.error("No se pudo cargar 2k_jupiter.jpg", e)
  );

  const saturnTex = loader.load(
    "src/2k_saturn.jpg",
    () => {
      if (saturnTex.colorSpace !== undefined)
        saturnTex.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    (e) => console.error("No se pudo cargar 2k_saturn.jpg", e)
  );

  const saturnRingTex = loader.load(
    "src/2k_saturn_ring.png",
    () => {
      if (saturnRingTex.colorSpace !== undefined)
        saturnRingTex.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    (e) => console.error("No se pudo cargar 2k_saturn_ring.png", e)
  );

  const uranusTex = loader.load(
    "src/2k_uranus.jpg",
    () => {
      if (uranusTex.colorSpace !== undefined)
        uranusTex.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    (e) => console.error("No se pudo cargar 2k_uranus.jpg", e)
  );

  const neptuneTex = loader.load(
    "src/2k_neptune.jpg",
    () => {
      if (neptuneTex.colorSpace !== undefined)
        neptuneTex.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    (e) => console.error("No se pudo cargar 2k_neptune.jpg", e)
  );

  // ---------- Objetos ----------
  Estrella(2, 0xffff00, sunTex);

  // Luz principal
  const sunLight = new THREE.PointLight(0xffffff, 2.0, 0);
  sunLight.position.set(0, 0, 0);
  estrella.add(sunLight);

  // Luz ambiental tenue
  scene.add(new THREE.AmbientLight(0xffffff, 0.12));

  Planeta(0.2, 3, 2, 0xffffff, 1.0, 1.0, mercuryTex, 0.02); // Mercurio
  Planeta(0.3, 5, 1.8, 0xffffff, 1.0, 1.0, venusTex, 0.004); // Venus
  Planeta(0.8, 7, 1.5, 0xffffff, 1.0, 1.0, earthTex, 0.05); // Tierra

  // Capa de nubes de la Tierra
  {
    const cloudsGeom = new THREE.SphereGeometry(0.805, 32, 32);
    const cloudsMat = new THREE.MeshPhongMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    earthClouds = new THREE.Mesh(cloudsGeom, cloudsMat);
    earthClouds.rotation.x = Math.PI / 2;
    Planetas[2].add(earthClouds);
  }

  Planeta(0.5, 10, 1.2, 0xf0340e, 1.0, 1.0, marsTex, 0.04); // Marte
  Planeta(1.3, 14, 0.9, 0xffe135, 1.0, 1.0, jupiterTex, 0.1); // Júpiter
  Planeta(1.0, 18, 0.7, 0xf5deb3, 1.0, 1.0, saturnTex, 0.09); // Saturno

  // Anillo de Saturno
  {
    const innerR = 1.25;
    const outerR = 2.2;
    const ringGeom = new THREE.RingGeometry(innerR, outerR, 128);
    const ringMat = new THREE.MeshPhongMaterial({
      map: saturnRingTex,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      shininess: 5,
      specular: 0x111111,
    });
    const saturnRing = new THREE.Mesh(ringGeom, ringMat);
    saturnRing.rotation.x = Math.PI / 2;
    Planetas[5].add(saturnRing);
  }

  Planeta(0.7, 22, 0.5, 0x40e0d0, 1.0, 1.0, uranusTex, 0.03); // Urano
  Planeta(0.6, 26, 0.4, 0x0000ff, 1.0, 1.0, neptuneTex, 0.035); // Neptuno

  // Luna de la Tierra
  Luna(Planetas[2], 0.15, 1.2, -3.5, 0xffffff, 0.0, moonTex);

  t0 = Date.now();

  // ---------- UI: Botonera de planetas ----------
  const panel = document.createElement("div");
  panel.style.position = "absolute";
  panel.style.top = "70px";
  panel.style.left = "16px";
  panel.style.padding = "10px";
  panel.style.background = "rgba(0,0,0,0.5)";
  panel.style.borderRadius = "10px";
  panel.style.fontFamily = "system-ui, sans-serif";
  panel.style.color = "#fff";
  panel.style.display = "flex";
  panel.style.flexWrap = "wrap";
  panel.style.gap = "6px";
  panel.style.maxWidth = "360px";
  document.body.appendChild(panel);

  function addBtn(label, onClick) {
    const b = document.createElement("button");
    b.textContent = label;
    b.style.padding = "6px 10px";
    b.style.border = "1px solid #888";
    b.style.borderRadius = "8px";
    b.style.background = "rgba(255,255,255,0.1)";
    b.style.color = "#fff";
    b.style.cursor = "pointer";
    b.style.fontSize = "12px";
    b.onclick = onClick;
    b.onmouseenter = () => (b.style.background = "rgba(255,255,255,0.2)");
    b.onmouseleave = () => (b.style.background = "rgba(255,255,255,0.1)");
    panel.appendChild(b);
  }

  // Índices en tu array Planetas
  const idx = {
    Mercurio: 0,
    Venus: 1,
    Tierra: 2,
    Marte: 3,
    Jupiter: 4,
    Saturno: 5,
    Urano: 6,
    Neptuno: 7,
  };

  // Botones
  addBtn("Default", () => goDefault());
  addBtn("Mercurio", () => focusPlanetFollow(idx.Mercurio));
  addBtn("Venus", () => focusPlanetFollow(idx.Venus));
  addBtn("Tierra", () => focusPlanetFollow(idx.Tierra));
  addBtn("Marte", () => focusPlanetFollow(idx.Marte));
  addBtn("Júpiter", () => focusPlanetFollow(idx.Jupiter));
  addBtn("Saturno", () => focusPlanetFollow(idx.Saturno));
  addBtn("Urano", () => focusPlanetFollow(idx.Urano));
  addBtn("Neptuno", () => focusPlanetFollow(idx.Neptuno));

  // ---- Comportamiento de cámara ----
  function goDefault() {
    followIndex = null;
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.enableZoom = true;

    flyTo(defaultCamPos, defaultTarget, 1000);
  }

  // Enfocar y SEGUIR al planeta mientras se mueve
  function focusPlanetFollow(i) {
    const planet = Planetas[i];
    if (!planet) return;

    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = true;

    followIndex = i;

    const planetPos = new THREE.Vector3();
    planet.getWorldPosition(planetPos);

    const r = planet.userData.radius || 1.0;

    const dir = planetPos.clone().normalize();
    const up = new THREE.Vector3(0, 0, 1);
    let side = up.clone().cross(dir).normalize();
    if (side.lengthSq() < 1e-4) side.set(1, 0, 0);

    const camOffset = dir
      .clone()
      .multiplyScalar(-r * 6.0)
      .add(side.clone().multiplyScalar(r * 3.0))
      .add(up.clone().multiplyScalar(r * 2.2));

    const targetCamPos = planetPos.clone().add(camOffset);
    flyTo(targetCamPos, planetPos, 600);
  }
}

// ---------- Helpers de objeto ----------
function Estrella(rad, col, texture = undefined) {
  const geometry = new THREE.SphereGeometry(rad, 25, 25);
  const material = new THREE.MeshBasicMaterial({ color: col });

  if (texture) {
    material.map = texture;
    material.color.set(0xffffff);
  }

  const sol = new THREE.Mesh(geometry, material);
  sol.rotation.x = Math.PI / 2;
  estrella = sol;
  scene.add(estrella);
}
function Planeta(
  radio,
  dist,
  vel,
  col,
  f1,
  f2,
  texture = undefined,
  spin = 0.0
) {
  const geom = new THREE.SphereGeometry(radio, 32, 32);
  const mat = new THREE.MeshPhongMaterial({
    color: col,
    shininess: 10,
    specular: 0x222222,
  });

  if (texture) {
    mat.map = texture;
    mat.color.set(0xffffff);
  }

  const planeta = new THREE.Mesh(geom, mat);
  planeta.rotation.x = Math.PI / 2;

  planeta.userData = { dist, speed: vel, f1, f2, radius: radio, spin };

  Planetas.push(planeta);
  scene.add(planeta);

  // órbita (línea)
  const curve = new THREE.EllipseCurve(0, 0, dist * f1, dist * f2);
  const points = curve.getPoints(50);
  const geome = new THREE.BufferGeometry().setFromPoints(points);
  const mate = new THREE.LineBasicMaterial({ color: 0xffffff });
  const orbita = new THREE.Line(geome, mate);
  scene.add(orbita);
}

function Luna(planeta, radio, dist, vel, col, angle, texture = undefined) {
  const pivote = new THREE.Object3D();
  pivote.rotation.x = angle;
  planeta.add(pivote);

  const geom = new THREE.SphereGeometry(radio, 32, 32);
  const mat = new THREE.MeshPhongMaterial({
    color: col,
    shininess: 5,
    specular: 0x222222,
  });

  if (texture) {
    mat.map = texture;
    mat.color.set(0xffffff);
  }

  const luna = new THREE.Mesh(geom, mat);
  luna.userData = { dist, speed: vel };

  Lunas.push(luna);
  pivote.add(luna);
}

// ---------- Animación ----------
function animationLoop() {
  timestamp = (Date.now() - t0) * accglobal;
  requestAnimationFrame(animationLoop);

  const dt = clock.getDelta();

  // Orbitas
  for (const p of Planetas) {
    p.position.x =
      Math.cos(timestamp * p.userData.speed) * p.userData.f1 * p.userData.dist;
    p.position.y =
      Math.sin(timestamp * p.userData.speed) * p.userData.f2 * p.userData.dist;

    // Giro paralelo (sobre Z), usando su 'spin'
    if (p.userData.spin) {
      p.rotation.z += p.userData.spin * dt;
    }
  }

  if (earthClouds) {
    earthClouds.rotation.z += 0.02 * dt;
  }

  if (estrella) estrella.rotation.z += SUN_SPIN * dt;

  if (followIndex !== null) {
    const planet = Planetas[followIndex];
    if (planet) {
      const planetPos = new THREE.Vector3();
      planet.getWorldPosition(planetPos);

      const r = planet.userData.radius || 1.0;
      const dir = planetPos.clone().normalize();
      const up = new THREE.Vector3(0, 0, 1);
      let side = up.clone().cross(dir).normalize();
      if (side.lengthSq() < 1e-4) side.set(1, 0, 0);

      const desiredCam = planetPos
        .clone()
        .add(dir.clone().multiplyScalar(-r * 6.0))
        .add(side.clone().multiplyScalar(r * 3.0))
        .add(up.clone().multiplyScalar(r * 2.2));

      camera.position.lerp(desiredCam, FOLLOW_SMOOTH);
      controls.target.lerp(planetPos, FOLLOW_SMOOTH);
      controls.update();
    }
  }

  // Lunas
  for (const l of Lunas) {
    l.position.x = Math.cos(timestamp * l.userData.speed) * l.userData.dist;
    l.position.y = Math.sin(timestamp * l.userData.speed) * l.userData.dist;
  }

  renderer.render(scene, camera);
}

// ---------- Vuelo suave de cámara ----------
function flyTo(targetCamPos, targetLook, duration = 800) {
  const startPos = camera.position.clone();
  const startLook = controls.target.clone();
  const start = performance.now();

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function animate() {
    const now = performance.now();
    const t = Math.min(1, (now - start) / duration);
    const k = easeInOut(t);

    camera.position.lerpVectors(startPos, targetCamPos, k);
    controls.target.lerpVectors(startLook, targetLook, k);
    controls.update();

    if (t < 1) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
