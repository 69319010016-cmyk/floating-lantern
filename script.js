/**
 * ประกวดกระทงออนไลน์ 3D (3D Loy Krathong Online Contest & Voting App)
 * Powered by Three.js & OrbitControls
 * 
 * Features:
 *  1. Full 3D Night Scene: River with procedural waves, radiant Moon, Starfield
 *  2. 3D Cultural Landmarks: Golden Stupa (เจดีย์ทองคำ), Main Temple (วัด), Thai Houses (เรือนไทย)
 *  3. Temple Entrance Arch (ซุ้มประตูวัด) featuring authentic Thai Art "พระอภัยมณีและนางเงือก"
 *  4. 20 Animated Walking People (คนเดินชมงาน 20 คน) in colorful traditional Thai attire
 *  5. 20 Multicolored Floating Krathongs (กระทงหลากสี 20 กระทง) with flame flicker & wave physics
 *  6. 360° Camera Navigation: Rotate, Zoom in/out, Pan, Quick-Focus presets
 *  7. Contestant Photo Capture: Camera selfie / image attachment + name & wish submission
 *  8. Raycaster Tap-to-Vote: Tap any 3D Krathong -> inspect photo & details -> Vote with 1-vote rule
 *  9. Live Leaderboard & Web Audio Soundscape
 */

(function () {
  'use strict';

  // ============================================================
  // 1. DATA MODEL & CONTESTANTS SEED
  // ============================================================
  const STORAGE_KEY_CONTESTANTS = 'loy_krathong_3d_contestants';
  const STORAGE_KEY_VOTES = 'loy_krathong_3d_user_votes';

  // Seed data for 20 contestants (authentic Thai names, provinces, wishes & Krathong styles)
  const SEED_CONTESTANTS = [
    { id: 'c1', name: 'คุณพิมพ์ใจ (สุโขทัย)', wish: 'ขอขมาพระแม่คงคา ขอพรให้บ้านเมืองร่มเย็นเป็นสุข', design: 'emerald', votes: 142, photo: 'phra-aphai-ngueak.png' },
    { id: 'c2', name: 'น้องน้ำใส (เชียงใหม่)', wish: 'ขอให้ครอบครัวมีสุขภาพแข็งแรง ร่ำรวยความสุข', design: 'lotus', votes: 128, photo: 'phra-aphai-ngueak.png' },
    { id: 'c3', name: 'คุณอรรถพล (อยุธยา)', wish: 'ขอให้กิจการค้าขายเจริญรุ่งเรือง เฮงๆ ปังๆ', design: 'gold', votes: 115, photo: 'phra-aphai-ngueak.png' },
    { id: 'c4', name: 'คุณดวงแข (กรุงเทพฯ)', wish: 'ลอยความทุกข์โศกไปกับสายน้ำ เริ่มต้นชีวิตใหม่ที่สดใส', design: 'sapphire', votes: 98, photo: 'phra-aphai-ngueak.png' },
    { id: 'c5', name: 'คุณศุภชัย (นครปฐม)', wish: 'ขอให้การงานราบรื่น ปราศจากอุปสรรคทั้งปวง', design: 'emerald', votes: 85, photo: 'phra-aphai-ngueak.png' },
    { id: 'c6', name: 'น้องแก้วตา (สงขลา)', wish: 'ขอให้พบเจอแต่มิตรภาพที่ดี มีรอยยิ้มในทุกๆ วัน', design: 'lotus', votes: 76, photo: 'phra-aphai-ngueak.png' },
    { id: 'c7', name: 'คุณมนัส (ขอนแก่น)', wish: 'ขอให้การเกษตรได้ผลผลิตงอกงาม น้ำท่าอุดมสมบูรณ์', design: 'gold', votes: 72, photo: 'phra-aphai-ngueak.png' },
    { id: 'c8', name: 'คุณรพีพร (ชลบุรี)', wish: 'ขอพรแห่งสายน้ำ นำพาความรักและครอบครัวอบอุ่น', design: 'sapphire', votes: 68, photo: 'phra-aphai-ngueak.png' },
    { id: 'c9', name: 'คุณธวัชชัย (ภูเก็ต)', wish: 'ขอขมาพระแม่คงคา ท้องทะเลสงบสุข นักท่องเที่ยวปลอดภัย', design: 'emerald', votes: 61, photo: 'phra-aphai-ngueak.png' },
    { id: 'c10', name: 'น้องฟ้าใส (น่าน)', wish: 'ขอให้สอบผ่านทุกวิชา ได้เกรดนิยมดั่งตั้งใจ', design: 'lotus', votes: 55, photo: 'phra-aphai-ngueak.png' },
    { id: 'c11', name: 'คุณวิลาวรรณ (ลำปาง)', wish: 'ขอให้คุณพ่อคุณแม่สุขภาพแข็งแรง อายุยืนยาว', design: 'gold', votes: 49, photo: 'phra-aphai-ngueak.png' },
    { id: 'c12', name: 'คุณเอกสิทธิ์ (ระยอง)', wish: 'ธุรกิจก้าวหน้า การเงินคล่องตัว มั่งมีศรีสุข', design: 'sapphire', votes: 44, photo: 'phra-aphai-ngueak.png' },
    { id: 'c13', name: 'คุณนภาดา (สุราษฎร์ฯ)', wish: 'ขอให้พบเจอเนื้อคู่ที่ดี มีความจริงใจให้กัน', design: 'lotus', votes: 39, photo: 'phra-aphai-ngueak.png' },
    { id: 'c14', name: 'คุณชัชวาล (พิษณุโลก)', wish: 'ขอให้มีพลังใจเข้มแข็ง ก้าวข้ามทุกความท้าทาย', design: 'emerald', votes: 35, photo: 'phra-aphai-ngueak.png' },
    { id: 'c15', name: 'น้องมุกดา (อุบลฯ)', wish: 'ขอให้แสงเทียนส่องทาง สว่างไสวดั่งดวงจันทร์คืนเพ็ญ', design: 'gold', votes: 31, photo: 'phra-aphai-ngueak.png' },
    { id: 'c16', name: 'คุณเกรียงไกร (ราชบุรี)', wish: 'ขอให้การงานเลื่อนขั้น ปลอดภัยในทุกการเดินทาง', design: 'sapphire', votes: 28, photo: 'phra-aphai-ngueak.png' },
    { id: 'c17', name: 'คุณสุชาดา (เพชรบุรี)', wish: 'ขอให้บ้านเมืองสงบสุข ชาวไทยรักใคร่กลมเกลียว', design: 'emerald', votes: 24, photo: 'phra-aphai-ngueak.png' },
    { id: 'c18', name: 'คุณปกรณ์ (นนทบุรี)', wish: 'ขอพรให้มีสติปัญญาแจ่มใส ตัดสินใจสิ่งใดถูกต้อง', design: 'lotus', votes: 21, photo: 'phra-aphai-ngueak.png' },
    { id: 'c19', name: 'คุณวรรณภา (นครศรีฯ)', wish: 'ขอให้ชีวิตราบรื่นดั่งสายน้ำ ไร้โรคภัยเบียดเบียน', design: 'gold', votes: 19, photo: 'phra-aphai-ngueak.png' },
    { id: 'c20', name: 'คุณกิตติศักดิ์ (สระบุรี)', wish: 'ขอให้ครอบครัวเจริญก้าวหน้า มีแต่สิ่งดีๆ เข้ามา', design: 'sapphire', votes: 16, photo: 'phra-aphai-ngueak.png' }
  ];

  let contestants = [];
  function loadContestants() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONTESTANTS);
      if (saved) {
        contestants = JSON.parse(saved);
      } else {
        contestants = [...SEED_CONTESTANTS];
        saveContestants();
      }
    } catch (e) {
      contestants = [...SEED_CONTESTANTS];
    }
  }

  function saveContestants() {
    try {
      localStorage.setItem(STORAGE_KEY_CONTESTANTS, JSON.stringify(contestants));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  function hasVotedFor(id) {
    try {
      return localStorage.getItem('voted_' + id) === 'true';
    } catch (e) {
      return false;
    }
  }

  function recordVoteFor(id) {
    try {
      localStorage.setItem('voted_' + id, 'true');
    } catch (e) {}
  }

  // ============================================================
  // 2. THREE.JS ENGINE SETUP
  // ============================================================
  const container = document.getElementById('canvas3d-container');
  let scene, camera, renderer, controls;
  let riverMesh, riverGeometry;
  let krathongMeshes = [];
  let walkingPeople = [];
  let raycaster, mouse;
  let activeSelectedContestant = null;
  let cameraTargetPosition = null;
  let cameraTargetLookAt = null;

  // Clock & Timing
  const clock = new THREE.Clock();

  // ============================================================
  // NATURAL HYDRODYNAMICS & WAVE FLUID PHYSICS
  // ============================================================

  // Natural Water Height: River swells travel continuously downstream (+Z)
  function getWaterHeight(x, z, t) {
    // 1. Primary downstream river swell (travels down along +Z)
    const swell = Math.sin(z * 0.14 - t * 1.8) * 0.22;
    // 2. Cross-stream lateral ripples
    const cross = Math.cos(x * 0.18 + z * 0.08 - t * 1.4) * 0.14;
    // 3. High-frequency surface chop / water shimmer
    const chop = Math.sin((x * 0.25 - z * 0.2) + t * 2.2) * 0.06;
    return swell + cross + chop;
  }

  // Calculate local water surface slope & normal vectors for physical floating tilts
  function getWaterSlope(x, z, t) {
    const eps = 0.45;
    const hL = getWaterHeight(x - eps, z, t);
    const hR = getWaterHeight(x + eps, z, t);
    const hD = getWaterHeight(x, z - eps, t);
    const hU = getWaterHeight(x, z + eps, t);
    return {
      dhdx: (hR - hL) / (2 * eps),
      dhdz: (hU - hD) / (2 * eps)
    };
  }

  // Natural River Current Velocity Vector Field
  function getRiverFlowVector(x, z, t) {
    // Channel characteristics: left bank at x = -13, thalweg (deep stream) at x = 18
    const riverCenter = 18;
    const halfWidth = 34;
    const distFromCenter = Math.abs(x - riverCenter) / halfWidth;
    const normDist = Math.min(1.0, distFromCenter);

    // Parabolic velocity profile: fastest in the central current, slower near banks
    const baseSpeedZ = 0.046 * (1.0 - 0.52 * normDist * normDist);

    // Natural meandering curvature along river length
    const meanderX = Math.sin(z * 0.04 + 0.8) * 0.012;

    // Fluid turbulence & micro eddies (วังน้ำวนย่อย)
    const eddyX = Math.cos(z * 0.08 + t * 0.3) * 0.007;
    const eddyZ = Math.sin(x * 0.07 + t * 0.25) * 0.005;

    // Bank Cushioning: gently repels Krathongs away from pier and stone embankments
    let bankPushX = 0;
    if (x < -11) {
      bankPushX = (-11 - x) * 0.025;
    } else if (x > 50) {
      bankPushX = -(x - 50) * 0.02;
    }

    return {
      vx: meanderX + eddyX + bankPushX,
      vz: Math.max(0.016, baseSpeedZ + eddyZ)
    };
  }

  function initThree() {
    // 1. Scene & Fog
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050e1d);
    scene.fog = new THREE.FogExp2(0x061224, 0.009);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 52);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.06; // Keep camera above water
    controls.minDistance = 6;
    controls.maxDistance = 135;
    controls.target.set(0, 4, 0);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x223552, 0.95);
    scene.add(ambientLight);

    // Directional Moon Light
    const moonLight = new THREE.DirectionalLight(0xfff5d0, 1.4);
    moonLight.position.set(-35, 75, -55);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.camera.near = 10;
    moonLight.shadow.camera.far = 200;
    moonLight.shadow.camera.left = -60;
    moonLight.shadow.camera.right = 60;
    moonLight.shadow.camera.top = 60;
    moonLight.shadow.camera.bottom = -60;
    scene.add(moonLight);

    // River subtle blue fill light
    const riverLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    riverLight.position.set(40, 30, 20);
    scene.add(riverLight);

    // 6. Raycaster & Pointer
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // 7. Build Environment Elements
    buildSkyAndMoon();
    buildRiver();
    buildRiverbankAndPier();
    buildGoldenStupa();
    buildMainTemple();
    buildThaiHouses();
    buildTempleEntranceArch();
    buildWalkingPeople();
    buildFloatingKrathongs();

    // Window Resize Handler
    window.addEventListener('resize', onWindowResize, false);

    // Mouse / Touch Raycast Listeners
    renderer.domElement.addEventListener('pointerdown', onPointerDown, false);
    renderer.domElement.addEventListener('pointerup', onPointerUp, false);
    renderer.domElement.addEventListener('pointermove', onPointerMove, false);

    // Progress bar animation & hide Loading Screen
    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = '100%';
    setTimeout(() => {
      const loading = document.getElementById('loadingScreen');
      if (loading) loading.classList.add('fade-out');
    }, 850);
  }

  // ============================================================
  // 3. 3D ENVIRONMENT BUILDERS
  // ============================================================

  // 3.1 Sky & Radiant Full Moon
  function buildSkyAndMoon() {
    // 1,200 Star Particles
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 180 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.85); // Upper sky
      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = Math.max(15, radius * Math.cos(phi));
      starPositions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.4,
      transparent: true,
      opacity: 0.85
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Full Moon Sphere
    const moonGeo = new THREE.SphereGeometry(6.5, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xfffae0 });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-35, 75, -75);
    scene.add(moon);

    // Moon Glow Halo Mesh
    const glowGeo = new THREE.SphereGeometry(8.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide
    });
    const moonGlow = new THREE.Mesh(glowGeo, glowMat);
    moonGlow.position.copy(moon.position);
    scene.add(moonGlow);
  }

  // 3.2 Dynamic River Plane
  function buildRiver() {
    riverGeometry = new THREE.PlaneGeometry(160, 160, 64, 64);
    riverGeometry.rotateX(-Math.PI / 2);

    const riverMaterial = new THREE.MeshStandardMaterial({
      color: 0x071b30,
      roughness: 0.2,
      metalness: 0.85,
      transparent: true,
      opacity: 0.94
    });

    riverMesh = new THREE.Mesh(riverGeometry, riverMaterial);
    riverMesh.receiveShadow = true;
    scene.add(riverMesh);
  }

  // 3.3 Riverside Bank, Promenades & Lantern Pier
  function buildRiverbankAndPier() {
    const bankGroup = new THREE.Group();

    // Main Left Bank (Land where temple & people stand)
    const bankGeo = new THREE.BoxGeometry(50, 4, 160);
    const bankMat = new THREE.MeshStandardMaterial({
      color: 0x11231a, // Dark lush riverside earth/stone
      roughness: 0.85,
      metalness: 0.1
    });
    const bank = new THREE.Mesh(bankGeo, bankMat);
    bank.position.set(-45, 1.6, 0);
    bank.receiveShadow = true;
    bankGroup.add(bank);

    // Paved Stone Walkway / Festival Promenade
    const walkGeo = new THREE.BoxGeometry(16, 0.4, 150);
    const walkMat = new THREE.MeshStandardMaterial({
      color: 0x24323d, // Slate stone
      roughness: 0.7,
      metalness: 0.15
    });
    const walkway = new THREE.Mesh(walkGeo, walkMat);
    walkway.position.set(-27, 3.7, 0);
    walkway.receiveShadow = true;
    bankGroup.add(walkway);

    // Wooden Pier / Steps for releasing Krathongs (Dock at x = -16, z = 14)
    const pierGeo = new THREE.BoxGeometry(10, 0.6, 16);
    const pierMat = new THREE.MeshStandardMaterial({
      color: 0x5c3317, // Teak dock wood
      roughness: 0.8
    });
    const pier = new THREE.Mesh(pierGeo, pierMat);
    pier.position.set(-15, 1.8, 14);
    pier.receiveShadow = true;
    bankGroup.add(pier);

    // Pier steps down into the water
    for (let s = 1; s <= 3; s++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.4, 12),
        pierMat
      );
      step.position.set(-15 + s * 1.8, 1.8 - s * 0.45, 14);
      step.receiveShadow = true;
      bankGroup.add(step);
    }

    // Festive Paper Lantern Posts along the promenade
    const postMat = new THREE.MeshStandardMaterial({ color: 0x3d2010 });
    const lanternColors = [0xf59e0b, 0xef4444, 0xec4899, 0x3b82f6, 0x10b981];

    for (let z = -65; z <= 65; z += 18) {
      // Wooden Pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 6, 8), postMat);
      pole.position.set(-19.5, 6.7, z);
      pole.castShadow = true;
      bankGroup.add(pole);

      // Hanging Lantern
      const lanternCol = lanternColors[Math.abs(Math.floor(z / 18)) % lanternColors.length];
      const lanternGeo = new THREE.CylinderGeometry(0.5, 0.65, 1.2, 12);
      const lanternMat = new THREE.MeshStandardMaterial({
        color: lanternCol,
        emissive: lanternCol,
        emissiveIntensity: 0.8,
        roughness: 0.3
      });
      const lantern = new THREE.Mesh(lanternGeo, lanternMat);
      lantern.position.set(-19.5, 9, z);
      bankGroup.add(lantern);

      // Point Light from lantern
      const lanternLight = new THREE.PointLight(lanternCol, 0.8, 12, 2);
      lanternLight.position.set(-19.5, 8.8, z);
      bankGroup.add(lanternLight);
    }

    scene.add(bankGroup);
  }

  // 3.4 Golden Stupa / Pagoda (พระมหาเจดีย์ทองคำ)
  function buildGoldenStupa() {
    const stupaGroup = new THREE.Group();
    stupaGroup.position.set(-36, 3.6, -30);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.85,
      roughness: 0.22,
      emissive: 0xca8a04,
      emissiveIntensity: 0.25
    });

    // 1. Tiered Square Base
    for (let i = 0; i < 4; i++) {
      const baseSize = 14 - i * 1.8;
      const baseHeight = 1.2;
      const baseGeo = new THREE.BoxGeometry(baseSize, baseHeight, baseSize);
      const baseMesh = new THREE.Mesh(baseGeo, goldMat);
      baseMesh.position.y = i * 1.1 + baseHeight / 2;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      stupaGroup.add(baseMesh);
    }

    // 2. Octagonal Plinth
    const octGeo = new THREE.CylinderGeometry(4.2, 4.8, 2, 8);
    const octMesh = new THREE.Mesh(octGeo, goldMat);
    octMesh.position.y = 5.2;
    octMesh.castShadow = true;
    stupaGroup.add(octMesh);

    // 3. Bell-shaped Dome (องค์ระฆัง)
    const bellGeo = new THREE.SphereGeometry(3.6, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const bellMesh = new THREE.Mesh(bellGeo, goldMat);
    bellMesh.position.y = 6.2;
    bellMesh.castShadow = true;
    stupaGroup.add(bellMesh);

    // 4. Throne / Balcony (บัลลังก์)
    const throneGeo = new THREE.BoxGeometry(3.2, 1, 3.2);
    const throneMesh = new THREE.Mesh(throneGeo, goldMat);
    throneMesh.position.y = 9.8;
    throneMesh.castShadow = true;
    stupaGroup.add(throneMesh);

    // 5. Tiered Golden Rings (ปล้องไฉน)
    for (let r = 0; r < 6; r++) {
      const rRadius = 1.4 - r * 0.16;
      const ringGeo = new THREE.CylinderGeometry(rRadius * 0.85, rRadius, 0.6, 16);
      const ringMesh = new THREE.Mesh(ringGeo, goldMat);
      ringMesh.position.y = 10.6 + r * 0.55;
      ringMesh.castShadow = true;
      stupaGroup.add(ringMesh);
    }

    // 6. Tapering Conical Spire & Crystal Tip (ปลียอดและเม็ดน้ำค้าง)
    const spireGeo = new THREE.ConeGeometry(0.55, 6, 16);
    const spireMesh = new THREE.Mesh(spireGeo, goldMat);
    spireMesh.position.y = 16.8;
    spireMesh.castShadow = true;
    stupaGroup.add(spireMesh);

    const tipGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.9
    });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.position.y = 20;
    stupaGroup.add(tipMesh);

    // Dedicated Warm Stupa Spotlight
    const stupaLight = new THREE.PointLight(0xfef08a, 1.8, 38, 1.8);
    stupaLight.position.set(0, 14, 2);
    stupaGroup.add(stupaLight);

    scene.add(stupaGroup);
  }

  // 3.5 Main Temple Hall (พระอุโบสถ / วัด)
  function buildMainTemple() {
    const templeGroup = new THREE.Group();
    templeGroup.position.set(-44, 3.6, 5);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.8 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.4 }); // Crimson Red Thai Roof Tile
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.3 });

    // 1. Plinth / Platform
    const platGeo = new THREE.BoxGeometry(20, 1.2, 28);
    const platform = new THREE.Mesh(platGeo, wallMat);
    platform.position.y = 0.6;
    platform.castShadow = true;
    platform.receiveShadow = true;
    templeGroup.add(platform);

    // 2. White Main Sanctuary Body
    const bodyGeo = new THREE.BoxGeometry(16, 7.5, 24);
    const body = new THREE.Mesh(bodyGeo, wallMat);
    body.position.y = 4.8;
    body.castShadow = true;
    body.receiveShadow = true;
    templeGroup.add(body);

    // 3. Golden Columns (เสาระเบียงโบสถ์)
    for (let cz = -10; cz <= 10; cz += 5) {
      const colGeo = new THREE.CylinderGeometry(0.4, 0.45, 7.5, 12);
      const col = new THREE.Mesh(colGeo, wallMat);
      col.position.set(9, 4.8, cz);
      col.castShadow = true;
      templeGroup.add(col);
    }

    // 4. Multi-Tiered Thai Gabled Roof
    for (let t = 0; t < 3; t++) {
      const roofWidth = 22 - t * 3.5;
      const roofLength = 30 - t * 4;
      const roofPeak = new THREE.Group();
      roofPeak.position.y = 8.5 + t * 2.2;

      // Triangular Gables
      const roofShape = new THREE.ConeGeometry(roofWidth / 1.6, 3, 4);
      roofShape.rotateY(Math.PI / 4);
      roofShape.scale(1, 1, roofLength / (roofWidth / 1.6));
      const roofMesh = new THREE.Mesh(roofShape, roofMat);
      roofMesh.castShadow = true;
      roofPeak.add(roofMesh);

      // Golden Chofah (ช่อฟ้า finial) at both ends of the ridge
      for (let side of [-1, 1]) {
        const chofahGeo = new THREE.ConeGeometry(0.3, 2, 8);
        chofahGeo.rotateZ(side * 0.3);
        const chofah = new THREE.Mesh(chofahGeo, goldTrimMat);
        chofah.position.set(0, 1.5, side * (roofLength / 2.3));
        roofPeak.add(chofah);
      }

      templeGroup.add(roofPeak);
    }

    // 5. Warm Glowing Sanctuary Windows & Doors
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8
    });
    for (let wz = -8; wz <= 8; wz += 4) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.2), windowMat);
      win.position.set(8.05, 4.8, wz);
      win.rotateY(Math.PI / 2);
      templeGroup.add(win);
    }

    // Temple Point Light
    const templeLight = new THREE.PointLight(0xfef08a, 1.5, 30, 2);
    templeLight.position.set(4, 5, 0);
    templeGroup.add(templeLight);

    scene.add(templeGroup);
  }

  // 3.6 Traditional Thai Wooden Houses (เรือนไทย 2 หลัง)
  function buildThaiHouses() {
    const houseGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.75 }); // Teak wood
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });

    const housePositions = [
      { x: -32, z: 38, rot: 0.2 },
      { x: -35, z: 54, rot: -0.15 }
    ];

    housePositions.forEach(pos => {
      const house = new THREE.Group();
      house.position.set(pos.x, 3.6, pos.z);
      house.rotation.y = pos.rot;

      // 1. Wooden Stilts (ใต้ถุนเรือน)
      for (let sx = -4; sx <= 4; sx += 4) {
        for (let sz = -5; sz <= 5; sz += 5) {
          const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 3.2, 8), woodMat);
          stilt.position.set(sx, 1.6, sz);
          stilt.castShadow = true;
          house.add(stilt);
        }
      }

      // 2. House Body (ห้องเรือนไทย)
      const room = new THREE.Mesh(new THREE.BoxGeometry(9, 4, 11), woodMat);
      room.position.set(0, 5, 0);
      room.castShadow = true;
      house.add(room);

      // 3. Curved Thai Gable Roof (หลังคาเรือนทรงปั้นหยา/หน้าจั่ว)
      const roof = new THREE.Mesh(new THREE.ConeGeometry(7, 3.5, 4), roofMat);
      roof.rotateY(Math.PI / 4);
      roof.scale.set(1, 1, 1.4);
      roof.position.set(0, 8.5, 0);
      roof.castShadow = true;
      house.add(roof);

      // 4. Warm glowing window
      const winMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.7
      });
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), winMat);
      win.position.set(4.55, 5, 0);
      win.rotateY(Math.PI / 2);
      house.add(win);

      houseGroup.add(house);
    });

    scene.add(houseGroup);
  }

  // 3.7 Temple Entrance Arch with Authentic Phra Aphai Mani & Nang Ngueak Painting
  function buildTempleEntranceArch() {
    const archGroup = new THREE.Group();
    // Positioned right next to the pier & promenade entrance where visitors walk
    archGroup.position.set(-20, 3.6, -4);
    archGroup.rotation.y = Math.PI / 2;

    const goldArchMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0xb45309,
      emissiveIntensity: 0.3
    });

    // 1. Ornate Arch Pillars (ซุ้มประตูเสาทอง)
    for (let px of [-4.5, 4.5]) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 8.5, 16), goldArchMat);
      pillar.position.set(px, 4.25, 0);
      pillar.castShadow = true;
      archGroup.add(pillar);

      // Decorative Lotus Capital on pillars
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.8, 0.9, 12), goldArchMat);
      cap.position.set(px, 8.6, 0);
      archGroup.add(cap);
    }

    // 2. Crossbeam & Traditional Canopy
    const beam = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.8, 1.2), goldArchMat);
    beam.position.set(0, 8.2, 0);
    archGroup.add(beam);

    const canopy = new THREE.Mesh(new THREE.ConeGeometry(6, 2.2, 4), goldArchMat);
    canopy.rotateY(Math.PI / 4);
    canopy.scale.set(1.4, 1, 0.6);
    canopy.position.set(0, 9.8, 0);
    archGroup.add(canopy);

    // 3. Authentic Traditional Thai Art: "พระอภัยมณีและนางเงือก" (phra-aphai-ngueak.png)
    const textureLoader = new THREE.TextureLoader();
    const artSrc = (typeof window !== 'undefined' && window.PHRA_APHAI_BASE64) ? window.PHRA_APHAI_BASE64 : 'phra-aphai-ngueak.png';
    textureLoader.load(
      artSrc,
      function (artTexture) {
        artTexture.generateMipmaps = true;
        artTexture.minFilter = THREE.LinearMipmapLinearFilter;

        // Create illuminated double-sided art panel
        const artGeo = new THREE.PlaneGeometry(5.2, 7.0);
        const artMat = new THREE.MeshStandardMaterial({
          map: artTexture,
          transparent: true,
          side: THREE.DoubleSide,
          roughness: 0.3,
          metalness: 0.1,
          emissive: 0xfffae0,
          emissiveIntensity: 0.35,
          alphaTest: 0.05
        });

        const artMesh = new THREE.Mesh(artGeo, artMat);
        artMesh.position.set(0, 4.6, 0);
        archGroup.add(artMesh);

        // Dedicated Arch Spotlights on both sides
        const archSpotFront = new THREE.PointLight(0xfef08a, 1.8, 14, 2);
        archSpotFront.position.set(0, 5, 2.8);
        archGroup.add(archSpotFront);

        const archSpotBack = new THREE.PointLight(0xfef08a, 1.8, 14, 2);
        archSpotBack.position.set(0, 5, -2.8);
        archGroup.add(archSpotBack);
      },
      undefined,
      function (err) {
        console.warn('Could not load phra-aphai-ngueak.png texture:', err);
      }
    );

    scene.add(archGroup);
  }

  // ============================================================
  // 4. 20 ANIMATED WALKING PEOPLE (คนเดินชมงาน 20 คน)
  // ============================================================
  function buildWalkingPeople() {
    const silkColors = [
      0xf43f5e, // Rose
      0xf59e0b, // Amber Gold
      0x10b981, // Emerald
      0x3b82f6, // Royal Blue
      0x8b5cf6, // Violet
      0xec4899, // Pink
      0x06b6d4, // Cyan
      0xffffff  // White silk
    ];

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0b0, roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.5 });

    for (let i = 0; i < 20; i++) {
      const personGroup = new THREE.Group();
      const attireCol = silkColors[i % silkColors.length];
      const clothesMat = new THREE.MeshStandardMaterial({ color: attireCol, roughness: 0.5 });

      // Torso / Thai Silk Shirt / Sabai
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 1.1, 8), clothesMat);
      torso.position.y = 1.6;
      torso.castShadow = true;
      personGroup.add(torso);

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), skinMat);
      head.position.y = 2.4;
      head.castShadow = true;
      personGroup.add(head);

      // Hair / Topknot
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), hairMat);
      hair.position.y = 2.45;
      personGroup.add(hair);

      // Traditional Jong Kraben / Pants / Skirt
      const lowerMat = new THREE.MeshStandardMaterial({
        color: silkColors[(i + 3) % silkColors.length],
        roughness: 0.6
      });
      const lowerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.28, 1.0, 8), lowerMat);
      lowerBody.position.y = 0.7;
      lowerBody.castShadow = true;
      personGroup.add(lowerBody);

      // Limbs (for walking swing animation)
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.9, 6), skinMat);
      legL.position.set(-0.16, 0.45, 0);
      personGroup.add(legL);

      const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.9, 6), skinMat);
      legR.position.set(0.16, 0.45, 0);
      personGroup.add(legR);

      // Initial placement along the promenade (-22 to -28 on X, -60 to 60 on Z)
      const startZ = -55 + (i * 5.8);
      const startX = -22 - Math.random() * 6;
      personGroup.position.set(startX, 3.6, startZ);

      // Walking attributes
      const speed = 0.04 + Math.random() * 0.035;
      const direction = i % 2 === 0 ? 1 : -1;
      personGroup.rotation.y = direction > 0 ? 0 : Math.PI;

      walkingPeople.push({
        group: personGroup,
        legL: legL,
        legR: legR,
        speed: speed * direction,
        minZ: -60,
        maxZ: 60,
        animOffset: Math.random() * 10
      });

      scene.add(personGroup);
    }
  }

  // ============================================================
  // 5. 20 MULTICOLORED FLOATING KRATHONGS (กระทงหลากสี 20 กระทง)
  // ============================================================
  const KRATHONG_DESIGN_PALETTES = {
    emerald: { base: 0x15803d, petal: 0x22c55e, petalTrim: 0xfacc15, flower: 0xfef08a },
    gold: { base: 0xca8a04, petal: 0xfacc15, petalTrim: 0xffffff, flower: 0xfef08a },
    lotus: { base: 0x166534, petal: 0xf43f5e, petalTrim: 0xfbcfe8, flower: 0xfde047 },
    sapphire: { base: 0x0369a1, petal: 0x38bdf8, petalTrim: 0xe0f2fe, flower: 0xfef08a }
  };

  function create3DKrathongMesh(contestant, index) {
    const krathongGroup = new THREE.Group();
    const style = KRATHONG_DESIGN_PALETTES[contestant.design] || KRATHONG_DESIGN_PALETTES.emerald;

    // 1. Banana Trunk Disc Base
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.45, 18);
    const baseMat = new THREE.MeshStandardMaterial({
      color: style.base,
      roughness: 0.65
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    krathongGroup.add(baseMesh);

    // 2. Concentric Folded Petals (กลีบกระทงพับวิจิตร)
    const petalGeo = new THREE.ConeGeometry(0.38, 1.1, 4);
    petalGeo.rotateY(Math.PI / 4);

    const petalMat = new THREE.MeshStandardMaterial({
      color: style.petal,
      roughness: 0.45
    });

    // Outer Petal Ring (14 Petals)
    for (let p = 0; p < 14; p++) {
      const angle = (p / 14) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 1.4, 0.4, Math.sin(angle) * 1.4);
      petal.rotation.x = Math.sin(angle) * 0.45;
      petal.rotation.z = -Math.cos(angle) * 0.45;
      petal.rotation.y = -angle;
      petal.castShadow = true;
      krathongGroup.add(petal);
    }

    // Inner Petal Ring (10 Petals)
    const innerPetalMat = new THREE.MeshStandardMaterial({
      color: style.petalTrim,
      roughness: 0.35
    });
    for (let p = 0; p < 10; p++) {
      const angle = (p / 10) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeo, innerPetalMat);
      petal.scale.set(0.8, 0.8, 0.8);
      petal.position.set(Math.cos(angle) * 0.95, 0.5, Math.sin(angle) * 0.95);
      petal.rotation.x = Math.sin(angle) * 0.3;
      petal.rotation.z = -Math.cos(angle) * 0.3;
      petal.rotation.y = -angle;
      petal.castShadow = true;
      krathongGroup.add(petal);
    }

    // 3. Central Marigold Flowers (ดอกดาวเรืองประดับ)
    const flowerMat = new THREE.MeshStandardMaterial({ color: style.flower, roughness: 0.4 });
    for (let f = 0; f < 5; f++) {
      const fAngle = (f / 5) * Math.PI * 2;
      const flower = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24), flowerMat);
      flower.position.set(Math.cos(fAngle) * 0.45, 0.4, Math.sin(fAngle) * 0.45);
      krathongGroup.add(flower);
    }

    // 4. Incense Sticks (ธูป 3 ดอก)
    const incenseMat = new THREE.MeshStandardMaterial({ color: 0xca8a04 });
    for (let inc = -1; inc <= 1; inc++) {
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 6), incenseMat);
      stick.position.set(inc * 0.08, 0.85, -0.2);
      stick.rotation.z = inc * 0.08;
      krathongGroup.add(stick);
    }

    // 5. Candle (เทียนพรรษาเล่มงาม)
    const candleMat = new THREE.MeshStandardMaterial({ color: 0xfffae0 });
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.0, 10), candleMat);
    candle.position.set(0, 0.7, 0.1);
    krathongGroup.add(candle);

    // 6. Flickering Flame (เปลวเทียนทอง)
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffd000 });
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.38, 8), flameMat);
    flame.position.set(0, 1.35, 0.1);
    krathongGroup.add(flame);

    // 7. Dedicated Candle Light
    const candleLight = new THREE.PointLight(0xffa500, 1.5, 6, 2);
    candleLight.position.set(0, 1.5, 0.1);
    krathongGroup.add(candleLight);

    // 8. Hitbox for easy touch/click selection (transparent & raycastable)
    const hitBoxMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    const hitBox = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.4, 2.6, 8),
      hitBoxMat
    );
    hitBox.position.y = 1.0;
    hitBox.userData = { contestant: contestant };
    krathongGroup.add(hitBox);

    // 9. Water Surface Wake Ring (วงระลอกคลื่นรอบกระทง)
    const wakeGeo = new THREE.RingGeometry(1.5, 2.3, 24);
    wakeGeo.rotateX(-Math.PI / 2);
    const wakeMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const wakeRipple = new THREE.Mesh(wakeGeo, wakeMat);
    wakeRipple.position.y = 0.02;
    krathongGroup.add(wakeRipple);

    // Natural Spacing & Corridor Placement (X: -6 to +48, Z: -60 to +60)
    let initX, initZ;
    if (contestant.isNew) {
      // New contestant starts right near the releasing pier/dock!
      initX = -11.5;
      initZ = 14;
    } else {
      const col = index % 4;
      const row = Math.floor(index / 4);
      initX = -4 + col * 12 + (Math.random() * 4 - 2);
      initZ = -55 + row * 24 + (Math.random() * 6 - 3);
    }

    krathongGroup.position.set(initX, 0, initZ);

    // Attach complete hydrodynamic physics state
    krathongGroup.userData = {
      contestant: contestant,
      flame: flame,
      candleLight: candleLight,
      wakeRipple: wakeRipple,
      hitBox: hitBox,
      vx: 0,
      vz: 0.035,
      vy: 0,
      rotSpeedY: (Math.random() - 0.5) * 0.002,
      seed: index * 1.77 + Math.random() * 2
    };

    return krathongGroup;
  }

  function buildFloatingKrathongs() {
    krathongMeshes.forEach(k => scene.remove(k));
    krathongMeshes = [];

    contestants.forEach((c, i) => {
      const kMesh = create3DKrathongMesh(c, i);
      scene.add(kMesh);
      krathongMeshes.push(kMesh);
    });
  }

  // ============================================================
  // 6. ANIMATION & RENDER LOOP
  // ============================================================
  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();
    controls.update();

    // 1. Water Vertex Animation
    if (riverGeometry) {
      const pos = riverGeometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const w = pos.getZ(i); // in plane coordinates
        const h = getWaterHeight(u, w, time);
        pos.setY(i, h);
      }
      pos.needsUpdate = true;
      riverGeometry.computeVertexNormals();
    }

    // 2. Natural Hydrodynamic Krathong Physics Simulation
    const numKrathongs = krathongMeshes.length;

    for (let i = 0; i < numKrathongs; i++) {
      const km = krathongMeshes[i];
      const ud = km.userData;

      // A. Hydrodynamic River Current Vector Field
      const flow = getRiverFlowVector(km.position.x, km.position.z, time);

      // Smooth inertia & momentum (water resistance)
      ud.vx = (ud.vx || 0) * 0.94 + flow.vx * 0.06;
      ud.vz = (ud.vz || 0) * 0.94 + flow.vz * 0.06;

      km.position.x += ud.vx;
      km.position.z += ud.vz;

      // B. Seamless River Wrap-around (continuous flow from upstream)
      if (km.position.z > 78) {
        km.position.z = -75;
        km.position.x = -6 + Math.random() * 42;
        ud.vx = 0;
        ud.vz = 0.035;
      }

      // C. Water Surface Normal & Dynamic Wave Slopes
      const slope = getWaterSlope(km.position.x, km.position.z, time);
      const targetRotX = Math.atan(slope.dhdz);
      const targetRotZ = -Math.atan(slope.dhdx);

      // Inertial wave-alignment tilt (Krathong rocks along with actual wave slopes)
      km.rotation.x += (targetRotX - km.rotation.x) * 0.12;
      km.rotation.z += (targetRotZ - km.rotation.z) * 0.12;

      // D. Vertical Archimedes Buoyancy Spring-Damper
      const targetWaterY = getWaterHeight(km.position.x, km.position.z, time) + 0.15;
      ud.vy = (ud.vy || 0) + (targetWaterY - km.position.y) * 0.24;
      ud.vy *= 0.72; // water viscosity damping
      km.position.y += ud.vy;

      // E. Natural Yaw Micro-Spinning (slow pirouette from uneven water drag)
      ud.targetRotSpeedY = Math.sin(time * 0.35 + ud.seed) * 0.0025;
      ud.rotSpeedY = (ud.rotSpeedY || 0) * 0.96 + ud.targetRotSpeedY * 0.04;
      km.rotation.y += ud.rotSpeedY;

      // F. Candle Flame Physics (sways realistically with river drift & air resistance)
      if (ud.candleLight) {
        ud.candleLight.intensity = 1.3 + Math.sin(time * 12 + ud.seed) * 0.35;
      }
      if (ud.flame) {
        ud.flame.scale.y = 0.85 + Math.sin(time * 15 + ud.seed) * 0.25;
        ud.flame.rotation.z = -ud.vx * 4.0;
        ud.flame.rotation.x = -ud.vz * 2.2;
      }

      // G. Dynamic Water Wake Ripple Ring
      if (ud.wakeRipple) {
        const bobVelocity = Math.abs(ud.vy);
        ud.wakeRipple.scale.setScalar(1.0 + Math.sin(time * 2.5 + ud.seed) * 0.12);
        ud.wakeRipple.material.opacity = 0.12 + bobVelocity * 0.7;
      }
    }

    // 3. Mutual Soft-Body Fluid Repulsion (กระทงไม่ทับซ้อนกันตามหลักธรรมชาติ)
    for (let i = 0; i < numKrathongs; i++) {
      for (let j = i + 1; j < numKrathongs; j++) {
        const k1 = krathongMeshes[i];
        const k2 = krathongMeshes[j];
        const dx = k1.position.x - k2.position.x;
        const dz = k1.position.z - k2.position.z;
        const dist = Math.hypot(dx, dz);
        const minDist = 3.6; // Comfortable separation distance

        if (dist < minDist && dist > 0.01) {
          const overlap = (minDist - dist) / minDist;
          const force = overlap * 0.016; // Gentle fluid deflection
          const nx = dx / dist;
          const nz = dz / dist;

          k1.position.x += nx * force;
          k1.position.z += nz * force;
          k2.position.x -= nx * force;
          k2.position.z -= nz * force;
        }
      }
    }

    // 3. Walking People Animation
    walkingPeople.forEach(wp => {
      // Move along Z promenade
      wp.group.position.z += wp.speed;

      // Reverse direction at endpoints
      if (wp.group.position.z > wp.maxZ) {
        wp.speed = -Math.abs(wp.speed);
        wp.group.rotation.y = Math.PI;
      } else if (wp.group.position.z < wp.minZ) {
        wp.speed = Math.abs(wp.speed);
        wp.group.rotation.y = 0;
      }

      // Leg swing walking cycle
      const swing = Math.sin(time * 8 + wp.animOffset) * 0.45;
      wp.legL.rotation.x = swing;
      wp.legR.rotation.x = -swing;
    });

    // 4. Smooth Camera Lerp for Quick Focus Buttons
    if (cameraTargetPosition && cameraTargetLookAt) {
      camera.position.lerp(cameraTargetPosition, 0.04);
      controls.target.lerp(cameraTargetLookAt, 0.04);

      if (camera.position.distanceTo(cameraTargetPosition) < 0.2) {
        cameraTargetPosition = null;
        cameraTargetLookAt = null;
      }
    }

    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ============================================================
  // 7. RAYCASTER & INTERACTION (CLICK / TAP TO VOTE)
  // ============================================================
  function getIntersectedKrathong(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);

    if (clientX === undefined || clientY === undefined) return null;

    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const hitBoxes = krathongMeshes.map(km => km.userData.hitBox).filter(Boolean);
    const intersects = raycaster.intersectObjects(hitBoxes);

    if (intersects.length > 0) {
      return intersects[0].object.userData.contestant;
    }
    return null;
  }

  const tooltip = document.getElementById('krathongHoverTooltip');
  let pointerDownState = { x: 0, y: 0, time: 0 };

  function onPointerMove(event) {
    const hitContestant = getIntersectedKrathong(event);
    renderer.domElement.style.cursor = hitContestant ? 'pointer' : 'grab';

    if (tooltip) {
      if (hitContestant && event.clientX !== undefined) {
        tooltip.innerHTML = `🪔 <strong>${hitContestant.name}</strong> • แตะเพื่อโหวต`;
        tooltip.style.left = event.clientX + 'px';
        tooltip.style.top = event.clientY + 'px';
        tooltip.style.display = 'block';
      } else {
        tooltip.style.display = 'none';
      }
    }
  }

  function onPointerDown(event) {
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    pointerDownState = { x: clientX, y: clientY, time: Date.now() };
  }

  function onPointerUp(event) {
    if (tooltip) tooltip.style.display = 'none';

    const clientX = event.clientX || (event.changedTouches && event.changedTouches[0].clientX);
    const clientY = event.clientY || (event.changedTouches && event.changedTouches[0].clientY);
    if (clientX === undefined || clientY === undefined) return;

    const dist = Math.hypot(clientX - pointerDownState.x, clientY - pointerDownState.y);
    const elapsed = Date.now() - pointerDownState.time;

    // Distinguish quick tap (< 10px movement and < 450ms) from camera orbit drag
    if (dist < 10 && elapsed < 450) {
      const hitContestant = getIntersectedKrathong(event);
      if (hitContestant) {
        openVoteModal(hitContestant);
      } else if (riverMesh) {
        // Natural water ripple impulse: tapping the water surface gently pushes nearby Krathongs
        const riverHits = raycaster.intersectObject(riverMesh);
        if (riverHits.length > 0) {
          const pt = riverHits[0].point;
          createWaterTouchRipple(pt.x, pt.z);
        }
      }
    }
  }

  // Interactive Water Ripple Impulse (แตะผิวน้ำแล้วเกิดระลอกคลื่นผลักกระทงตามธรรมชาติ)
  function createWaterTouchRipple(rx, rz) {
    krathongMeshes.forEach(km => {
      const dx = km.position.x - rx;
      const dz = km.position.z - rz;
      const dist = Math.hypot(dx, dz);
      if (dist < 14 && dist > 0.1) {
        const push = ((14 - dist) / 14) * 0.032;
        km.userData.vx = (km.userData.vx || 0) + (dx / dist) * push;
        km.userData.vz = (km.userData.vz || 0) + (dz / dist) * push;
      }
    });
  }

  // ============================================================
  // 8. MODAL CONTROLS & VOTE SYSTEM
  // ============================================================

  // --- Modal 2: Vote Popup ---
  const voteModal = document.getElementById('voteModal');
  const closeVoteModalBtn = document.getElementById('closeVoteModalBtn');
  const voteBtn = document.getElementById('voteBtn');
  const voteBtnLabel = document.getElementById('voteBtnLabel');
  const voteModalPhoto = document.getElementById('voteModalPhoto');
  const voteModalRank = document.getElementById('voteModalRank');
  const voteModalName = document.getElementById('voteModalName');
  const voteModalWish = document.getElementById('voteModalWish');
  const voteModalDesign = document.getElementById('voteModalDesign');
  const voteModalScore = document.getElementById('voteModalScore');

  const DESIGN_LABELS = {
    emerald: '🌿 กระทงใบตองมรกต',
    gold: '👑 กระทงบัวทองคำ',
    lotus: '🌸 กระทงบัวชมพูสวรรค์',
    sapphire: '💎 กระทงแก้วสมุทร'
  };

  function openVoteModal(contestant) {
    activeSelectedContestant = contestant;

    // Calculate Rank
    const sorted = [...contestants].sort((a, b) => b.votes - a.votes);
    const rankIndex = sorted.findIndex(c => c.id === contestant.id) + 1;

    // Fill UI
    const fallbackPhoto = (typeof window !== 'undefined' && window.PHRA_APHAI_BASE64) ? window.PHRA_APHAI_BASE64 : 'phra-aphai-ngueak.png';
    voteModalPhoto.src = contestant.photo || fallbackPhoto;
    voteModalRank.textContent = '#' + rankIndex;
    voteModalName.textContent = contestant.name;
    voteModalWish.textContent = `"${contestant.wish}"`;
    voteModalDesign.textContent = DESIGN_LABELS[contestant.design] || '🪔 กระทงวิจิตร';
    voteModalScore.textContent = contestant.votes;

    // Check if device already voted for this contestant
    const alreadyVoted = hasVotedFor(contestant.id);
    if (alreadyVoted) {
      voteBtn.classList.add('voted');
      voteBtnLabel.textContent = 'คุณโหวตให้กระทงนี้แล้ว ❤️';
    } else {
      voteBtn.classList.remove('voted');
      voteBtnLabel.textContent = 'โหวตให้กระทงนี้';
    }

    voteModal.style.display = 'flex';
  }

  function closeVoteModal() {
    voteModal.style.display = 'none';
    activeSelectedContestant = null;
  }

  closeVoteModalBtn.addEventListener('click', closeVoteModal);
  voteModal.addEventListener('click', (e) => {
    if (e.target === voteModal) closeVoteModal();
  });

  // Vote Action (1 vote per device rule)
  voteBtn.addEventListener('click', () => {
    if (!activeSelectedContestant) return;

    if (hasVotedFor(activeSelectedContestant.id)) {
      alert('คุณได้ร่วมโหวตให้กระทงใบนี้ไปแล้ว ขอบคุณที่ร่วมส่งกำลังใจครับ! 🙏');
      return;
    }

    // Increment Vote
    activeSelectedContestant.votes += 1;
    recordVoteFor(activeSelectedContestant.id);
    saveContestants();

    // Update UI
    voteModalScore.textContent = activeSelectedContestant.votes;
    voteBtn.classList.add('voted');
    voteBtnLabel.textContent = 'โหวตสำเร็จแล้ว! ❤️';

    // Update Live Ticker
    const ticker = document.getElementById('tickerMsg');
    if (ticker) {
      ticker.textContent = `🎉 มีการโหวตให้ ${activeSelectedContestant.name} (+1 คะแนน)`;
    }

    // Canvas Confetti Celebration!
    if (window.confetti) {
      window.confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#fde047', '#ef4444', '#f43f5e', '#ffffff']
      });
    }

    playChime();
  });

  // --- Modal 1: Submit Contestant (Camera / Photo + Name + Wish) ---
  const submitModal = document.getElementById('submitModal');
  const openSubmitModalBtn = document.getElementById('openSubmitModalBtn');
  const closeSubmitModalBtn = document.getElementById('closeSubmitModalBtn');
  const cancelSubmitBtn = document.getElementById('cancelSubmitBtn');
  const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');

  const cameraInput = document.getElementById('cameraInput');
  const capturePhotoBtn = document.getElementById('capturePhotoBtn');
  const removePhotoBtn = document.getElementById('removePhotoBtn');
  const photoPreview = document.getElementById('photoPreview');
  const photoPlaceholder = document.getElementById('photoPlaceholder');

  const contestantNameInput = document.getElementById('contestantNameInput');
  const contestantWishInput = document.getElementById('contestantWishInput');
  let selectedKrathongStyle = 'emerald';
  let capturedPhotoData = null;

  openSubmitModalBtn.addEventListener('click', () => {
    submitModal.style.display = 'flex';
  });

  function closeSubmitModal() {
    submitModal.style.display = 'none';
  }

  closeSubmitModalBtn.addEventListener('click', closeSubmitModal);
  cancelSubmitBtn.addEventListener('click', closeSubmitModal);
  submitModal.addEventListener('click', (e) => {
    if (e.target === submitModal) closeSubmitModal();
  });

  // Photo Capture / File Selection
  capturePhotoBtn.addEventListener('click', () => {
    cameraInput.click();
  });

  // Downscale large camera photos to prevent exceeding localStorage quota
  function compressImage(file, maxDim, callback) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      const img = new Image();
      img.onload = function () {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        callback(dataUrl);
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }

  cameraInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      compressImage(file, 480, (compressedDataUrl) => {
        capturedPhotoData = compressedDataUrl;
        photoPreview.src = capturedPhotoData;
        photoPreview.style.display = 'block';
        photoPlaceholder.style.display = 'none';
        removePhotoBtn.style.display = 'inline-flex';
      });
    }
  });

  removePhotoBtn.addEventListener('click', () => {
    capturedPhotoData = null;
    photoPreview.src = '';
    photoPreview.style.display = 'none';
    photoPlaceholder.style.display = 'block';
    removePhotoBtn.style.display = 'none';
    cameraInput.value = '';
  });

  // Preset Wish Chips
  document.querySelectorAll('.wish-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      contestantWishInput.value = chip.getAttribute('data-wish');
    });
  });

  // Krathong Design Selector Grid
  document.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedKrathongStyle = card.getAttribute('data-style');
    });
  });

  // Confirm Submit New Krathong
  confirmSubmitBtn.addEventListener('click', () => {
    const name = contestantNameInput.value.trim();
    const wish = contestantWishInput.value.trim();

    if (!name) {
      alert('กรุณาป้อนชื่อผู้เข้าประกวด / ตัวแทนครับ');
      contestantNameInput.focus();
      return;
    }

    if (!wish) {
      alert('กรุณาป้อนคำอธิษฐานวันเพ็ญครับ');
      contestantWishInput.focus();
      return;
    }

    // Create New Contestant
    const newContestant = {
      id: 'c_' + Date.now(),
      name: name,
      wish: wish,
      design: selectedKrathongStyle,
      votes: 1, // initial vote
      photo: capturedPhotoData || 'phra-aphai-ngueak.png',
      isNew: true
    };

    contestants.unshift(newContestant);
    saveContestants();

    // Create 3D Krathong into Scene
    const newMesh = create3DKrathongMesh(newContestant, contestants.length);
    scene.add(newMesh);
    krathongMeshes.push(newMesh);

    // Close Modal & Reset Form
    closeSubmitModal();
    contestantNameInput.value = '';
    contestantWishInput.value = '';
    removePhotoBtn.click();

    // Confetti celebration
    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#fde047', '#f59e0b', '#10b981', '#3b82f6', '#ffffff']
      });
    }

    playChime();

    // Update Live Ticker
    const ticker = document.getElementById('tickerMsg');
    if (ticker) {
      ticker.textContent = `🎊 คุณ ${name} ปล่อยกระทงลงสู่แม่น้ำ 3D แล้ว!`;
    }

    // Smoothly focus camera on the newly launched Krathong near the dock
    focusCameraOn(new THREE.Vector3(-8, 8, 22), new THREE.Vector3(-12, 1, 14));
  });

  // --- Modal 3: Leaderboard ---
  const leaderboardModal = document.getElementById('leaderboardModal');
  const leaderboardBtn = document.getElementById('leaderboardBtn');
  const closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');
  const closeLeaderboardFooterBtn = document.getElementById('closeLeaderboardFooterBtn');
  const leaderboardList = document.getElementById('leaderboardList');

  function renderLeaderboard() {
    leaderboardList.innerHTML = '';
    const sorted = [...contestants].sort((a, b) => b.votes - a.votes);
    const fallbackPhoto = (typeof window !== 'undefined' && window.PHRA_APHAI_BASE64) ? window.PHRA_APHAI_BASE64 : 'phra-aphai-ngueak.png';

    sorted.forEach((c, idx) => {
      const item = document.createElement('div');
      item.className = 'leader-item';

      const rankBadge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

      item.innerHTML = `
        <div class="leader-left">
          <span class="leader-rank">${rankBadge}</span>
          <img class="leader-avatar" src="${c.photo || fallbackPhoto}" alt="${c.name}">
          <div class="leader-info">
            <h4>${c.name}</h4>
            <p>${c.wish}</p>
          </div>
        </div>
        <div class="leader-score">
          <span class="leader-score-num">${c.votes}</span>
          <span class="leader-score-label">คะแนน</span>
        </div>
      `;

      // Clicking an item in leaderboard finds and focuses their Krathong in 3D!
      item.addEventListener('click', () => {
        leaderboardModal.style.display = 'none';
        const targetMesh = krathongMeshes.find(km => km.userData.contestant.id === c.id);
        if (targetMesh) {
          focusCameraOn(
            new THREE.Vector3(targetMesh.position.x + 4, targetMesh.position.y + 6, targetMesh.position.z + 10),
            targetMesh.position
          );
        }
      });

      leaderboardList.appendChild(item);
    });
  }

  leaderboardBtn.addEventListener('click', () => {
    renderLeaderboard();
    leaderboardModal.style.display = 'flex';
  });

  closeLeaderboardBtn.addEventListener('click', () => leaderboardModal.style.display = 'none');
  closeLeaderboardFooterBtn.addEventListener('click', () => leaderboardModal.style.display = 'none');
  leaderboardModal.addEventListener('click', (e) => {
    if (e.target === leaderboardModal) leaderboardModal.style.display = 'none';
  });

  // --- Modal 4: Help Guide ---
  const helpModal = document.getElementById('helpModal');
  const helpBtn = document.getElementById('helpBtn');
  const closeHelpBtn = document.getElementById('closeHelpBtn');
  const closeHelpFooterBtn = document.getElementById('closeHelpFooterBtn');

  helpBtn.addEventListener('click', () => helpModal.style.display = 'flex');
  closeHelpBtn.addEventListener('click', () => helpModal.style.display = 'none');
  closeHelpFooterBtn.addEventListener('click', () => helpModal.style.display = 'none');
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) helpModal.style.display = 'none';
  });

  // ============================================================
  // 9. CAMERA QUICK-FOCUS PRESETS
  // ============================================================
  function focusCameraOn(camPos, lookAtPos) {
    cameraTargetPosition = camPos;
    cameraTargetLookAt = lookAtPos;
  }

  // Reset to default overview
  document.getElementById('resetViewBtn').addEventListener('click', () => {
    focusCameraOn(new THREE.Vector3(0, 20, 52), new THREE.Vector3(0, 4, 0));
  });

  // Focus near water level / Krathongs
  document.getElementById('focusRiverBtn').addEventListener('click', () => {
    focusCameraOn(new THREE.Vector3(4, 5, 24), new THREE.Vector3(2, 1, 0));
  });

  // Focus on Temple Entrance Arch (พระอภัยมณีและนางเงือก)
  document.getElementById('focusArchBtn').addEventListener('click', () => {
    focusCameraOn(new THREE.Vector3(-14, 5.5, 6), new THREE.Vector3(-20, 5.5, -4));
  });

  // Camera Hint auto fade out
  setTimeout(() => {
    const hint = document.getElementById('cameraHint');
    if (hint) hint.classList.add('hidden');
  }, 7500);

  // ============================================================
  // 10. WEB AUDIO API SOUND GENERATOR
  // ============================================================
  let audioCtx = null;
  let isAudioPlaying = false;
  let streamNoiseNode = null;
  let gainNode = null;

  function initAudio() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // 1. Synthesize relaxing river water pink noise
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.08;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to sound like soft flowing water
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.18;

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    whiteNoise.start(0);
    streamNoiseNode = whiteNoise;
  }

  // Play peaceful Thai pentatonic chime
  function playChime() {
    if (!audioCtx) return;
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00]; // C5, D5, E5, G5, A5
    const osc = audioCtx.createOscillator();
    const chimeGain = audioCtx.createGain();

    const freq = notes[Math.floor(Math.random() * notes.length)];
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    chimeGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);

    osc.connect(chimeGain);
    chimeGain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.8);
  }

  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');

  audioToggleBtn.addEventListener('click', () => {
    if (!audioCtx) initAudio();

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isAudioPlaying = !isAudioPlaying;
    if (gainNode) {
      gainNode.gain.setValueAtTime(isAudioPlaying ? 0.18 : 0.0001, audioCtx.currentTime);
    }
    audioIcon.textContent = isAudioPlaying ? '🔊' : '🌊';
  });

  // Language Toggle (TH / EN)
  const langToggleBtn = document.getElementById('langToggleBtn');
  const langTH = document.getElementById('langTH');
  const langEN = document.getElementById('langEN');
  let currentLang = 'th';

  langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'th' ? 'en' : 'th';
    langTH.classList.toggle('active', currentLang === 'th');
    langEN.classList.toggle('active', currentLang === 'en');

    if (currentLang === 'en') {
      document.getElementById('appTitle').textContent = '3D Krathong Contest';
      document.querySelector('.sub-title').textContent = 'Online Voting & Full Moon Festival';
      document.querySelector('.main-label').textContent = 'Submit 3D Krathong';
      document.querySelector('.sub-label').textContent = 'Take Selfie & Join River Contest';
      document.querySelector('.ticker-pill').textContent = '🔥 Live Voting:';
      document.getElementById('tickerMsg').textContent = 'Tap any floating Krathong in 3D river to view photo & vote!';
      document.getElementById('cameraHint').textContent = '🖐️ Rotate 360° | 🔍 Zoom in-out | 🪔 Tap Krathong to Vote';
    } else {
      document.getElementById('appTitle').textContent = 'ประกวดกระทง 3D';
      document.querySelector('.sub-title').textContent = 'Loy Krathong Online Contest & Vote';
      document.querySelector('.main-label').textContent = 'ถ่ายรูปส่งกระทงประกวด';
      document.querySelector('.sub-label').textContent = 'ร่วมลอยกระทง 3D & ชิงคะแนนโหวต';
      document.querySelector('.ticker-pill').textContent = '🔥 กำลังโหวต:';
      document.getElementById('tickerMsg').textContent = 'แตะที่กระทงในแม่น้ำ 3D เพื่อดูรูปและโหวตคะแนน';
      document.getElementById('cameraHint').textContent = '🖐️ หมุน 360° | 🔍 ซูมเข้า-ออก | 🪔 แตะกระทงเพื่อโหวต';
    }
  });

  // ============================================================
  // 11. BOOTSTRAP APP
  // ============================================================
  window.addEventListener('DOMContentLoaded', () => {
    loadContestants();
    initThree();
    animate();
  });

})();
