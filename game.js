(() => {
  // =========================================================
  // 1. PROCEDURAL WEB AUDIO ENGINE
  // =========================================================
  class SoundEngine {
    constructor() { this.ctx = null; }
    init() {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
    }
    playWeaponSound(wpnKey) {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (wpnKey === 'KNIFE') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.13);
        return;
      }

      if (wpnKey === 'ROCKET') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.28);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.3);
        return;
      }

      if (wpnKey === 'OPERATOR') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(125, now);
        osc.frequency.exponentialRampToValueAtTime(22, now + 0.35);
        gain.gain.setValueAtTime(0.68, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.37);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.37);
        return;
      }

      const freq = wpnKey === 'SHERIFF' ? 140 : (wpnKey === 'ODIN' ? 220 : 175);
      const dur = wpnKey === 'SHERIFF' ? 0.16 : 0.09;
      osc.type = wpnKey === 'ODIN' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + dur);
      gain.gain.setValueAtTime(0.42, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + dur);
    }

    playExplosion() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(18, now + 0.55);
      gain.gain.setValueAtTime(0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.58);
    }

    playHit(isHead) {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isHead ? 2150 : 540, now);
      if (isHead) osc.frequency.setValueAtTime(2880, now + 0.03);
      gain.gain.setValueAtTime(isHead ? 0.5 : 0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isHead ? 0.15 : 0.06));
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.16);
    }

    playSwitchClick() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.setValueAtTime(1380, now + 0.04);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.12);
    }

    playFlashbang() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3400, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.65);
    }
  }

  const sfx = new SoundEngine();

  // =========================================================
  // 2. FLOATING 3D DAMAGE NUMBER SYSTEM
  // =========================================================
  const dmgLayer = document.getElementById('dmg-layer');
  const activeDamagePopups = [];

  function spawnDamageNumber(worldPos, dmgAmount, isHeadshot, isKill) {
    const el = document.createElement('div');
    el.className = 'dmg-popup' + (isHeadshot ? ' headshot' : '') + (isKill ? ' kill' : '');
    el.textContent = `-${dmgAmount}${isHeadshot ? ' ⌖' : ''}`;
    dmgLayer.appendChild(el);

    activeDamagePopups.push({
      el,
      worldPos: worldPos.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.45,
        0.35,
        (Math.random() - 0.5) * 0.45
      )),
      velY: 1.85,
      life: 0.85,
      maxLife: 0.85
    });
  }

  function updateDamagePopups(dt, camera) {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;

    for (let i = activeDamagePopups.length - 1; i >= 0; i--) {
      const p = activeDamagePopups[i];
      p.life -= dt;
      if (p.life <= 0) {
        p.el.remove();
        activeDamagePopups.splice(i, 1);
        continue;
      }

      p.worldPos.y += p.velY * dt;
      const proj = p.worldPos.clone().project(camera);

      // Hide if behind camera lens
      if (proj.z > 1) {
        p.el.style.display = 'none';
        continue;
      }

      p.el.style.display = 'block';
      const sx = (proj.x * halfW) + halfW;
      const sy = -(proj.y * halfH) + halfH;
      const scale = 0.85 + 0.35 * (p.life / p.maxLife);
      p.el.style.left = `${sx}px`;
      p.el.style.top = `${sy}px`;
      p.el.style.opacity = Math.min(1, (p.life / p.maxLife) * 1.4).toFixed(2);
      p.el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(2)})`;
    }
  }

  // =========================================================
  // 3. ARTICULATED HUMANOID CYBER-AGENT BUILDER + 3D HP BAR
  // =========================================================
  function createStructuredAgentMesh(primaryHex, accentHex, visorHex, userDataRef, includeHealthBar = false) {
    const root = new THREE.Group();

    const armorMat = new THREE.MeshStandardMaterial({ color: primaryHex, roughness: 0.3, metalness: 0.65 });
    const darkJointMat = new THREE.MeshStandardMaterial({ color: 0x11161d, roughness: 0.55, metalness: 0.35 });
    const accentMat = new THREE.MeshStandardMaterial({
      color: accentHex,
      roughness: 0.25,
      emissive: accentHex,
      emissiveIntensity: 0.35
    });
    const visorMat = new THREE.MeshBasicMaterial({ color: visorHex });

    const bodyParts = [];

    // Pelvis
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.28, 12), darkJointMat);
    pelvis.position.y = 1.02;
    root.add(pelvis);
    bodyParts.push(pelvis);

    // Sculpted V-Taper Chest & Armor Plate
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.32, 0.78, 12), armorMat);
    chest.position.y = 1.54;
    root.add(chest);
    bodyParts.push(chest);

    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.52, 0.44), armorMat.clone());
    chestPlate.position.y = 1.58;
    root.add(chestPlate);
    bodyParts.push(chestPlate);

    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.46, 10), visorMat);
    core.rotation.x = Math.PI / 2;
    core.position.set(0, 1.6, 0);
    root.add(core);

    // Collar & Neck
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.06, 8, 16), accentMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.96;
    root.add(collar);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.22, 10), darkJointMat);
    neck.position.y = 2.08;
    root.add(neck);

    // Sculpted Helmet + Visor (Headshot Target)
    const headGroup = new THREE.Group();
    headGroup.position.y = 2.38;

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 18), armorMat);
    helmet.scale.set(0.92, 1.08, 1.02);
    headGroup.add(helmet);

    const visor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.31, 0.31, 0.14, 14, 1, false, -Math.PI * 0.35, Math.PI * 0.7),
      visorMat
    );
    visor.rotation.y = Math.PI;
    visor.position.set(0, 0.03, 0.03);
    headGroup.add(visor);

    const earL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.16), accentMat);
    earL.position.set(-0.31, 0.02, 0);
    const earR = earL.clone();
    earR.position.x = 0.31;
    headGroup.add(earL, earR);
    root.add(headGroup);

    // Articulated Arms
    function buildArm(side) {
      const armPivot = new THREE.Group();
      armPivot.position.set(side * 0.52, 1.84, 0);

      const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), accentMat);
      pauldron.scale.set(1.1, 0.85, 1.1);
      armPivot.add(pauldron);

      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.095, 0.42, 8), armorMat);
      upperArm.position.y = -0.24;
      armPivot.add(upperArm);

      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), darkJointMat);
      elbow.position.y = -0.46;
      armPivot.add(elbow);

      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.08, 0.38, 8), darkJointMat);
      forearm.position.set(0, -0.66, -0.06);
      forearm.rotation.x = 0.25;
      armPivot.add(forearm);

      bodyParts.push(upperArm, forearm);
      return armPivot;
    }

    const armL = buildArm(-1);
    const armR = buildArm(1);
    root.add(armL, armR);

    // Articulated Legs
    function buildLeg(side) {
      const legPivot = new THREE.Group();
      legPivot.position.set(side * 0.2, 0.92, 0);

      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.46, 10), armorMat);
      thigh.position.y = -0.23;
      legPivot.add(thigh);

      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.125, 8, 8), accentMat);
      knee.position.set(0, -0.48, -0.03);
      legPivot.add(knee);

      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.095, 0.44, 10), darkJointMat);
      shin.position.y = -0.7;
      legPivot.add(shin);

      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.32), armorMat);
      boot.position.set(0, -0.88, -0.05);
      legPivot.add(boot);

      bodyParts.push(thigh, shin);
      return legPivot;
    }

    const legL = buildLeg(-1);
    const legR = buildLeg(1);
    root.add(legL, legR);

    // Optional 3D Overhead Health Bar
    let hbFill = null;
    if (includeHealthBar) {
      const hbBg = new THREE.Mesh(
        new THREE.PlaneGeometry(1.18, 0.13),
        new THREE.MeshBasicMaterial({ color: 0x06090d, side: THREE.DoubleSide })
      );
      hbBg.position.y = 3.02;
      root.add(hbBg);

      hbFill = new THREE.Mesh(
        new THREE.PlaneGeometry(1.12, 0.08),
        new THREE.MeshBasicMaterial({ color: 0x00f5d4, side: THREE.DoubleSide })
      );
      hbFill.position.set(0, 3.02, 0.01);
      root.add(hbFill);
    }

    if (userDataRef) {
      helmet.userData = { ...userDataRef, part: 'head' };
      visor.userData = { ...userDataRef, part: 'head' };
      bodyParts.forEach(p => {
        p.userData = { ...userDataRef, part: 'body' };
      });
    }

    return { root, helmet, chestPlate, bodyParts, armL, armR, legL, legR, hbFill };
  }

  // =========================================================
  // 4. REALISTIC SCENE, LIGHTING & TACTICAL PRACTICE RANGE
  // =========================================================
  const container = document.getElementById('game-canvas');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080c12);
  scene.fog = new THREE.FogExp2(0x080c12, 0.0085);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 250);
  const playerYaw = new THREE.Object3D();
  const playerPitch = new THREE.Object3D();

  // Fixed Spawns
  const SPAWN_PRACTICE = { x: 0, y: 2.6, z: 26, yaw: 0 };       // Firing Line Booth
  const SPAWN_HOST     = { x: 0, y: 2.6, z: 38, yaw: 0 };       // South P2P Base
  const SPAWN_JOIN     = { x: 0, y: 2.6, z: -38, yaw: Math.PI };// North P2P Base

  playerYaw.position.set(SPAWN_PRACTICE.x, SPAWN_PRACTICE.y, SPAWN_PRACTICE.z);
  playerYaw.add(playerPitch);
  playerPitch.add(camera);
  scene.add(playerYaw);

  // Local Player TPP Agent
  const selfAgent = createStructuredAgentMesh(0x1b2634, 0xff4655, 0x00f5d4, null, false);
  selfAgent.root.position.set(0, -2.6, 0);
  selfAgent.root.visible = false;
  playerYaw.add(selfAgent.root);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  container.appendChild(renderer.domElement);

  // Realistic Multi-Layer Lighting
  scene.add(new THREE.HemisphereLight(0xdbe8ff, 0x101824, 0.75));
  const sunLight = new THREE.DirectionalLight(0xfff5e4, 0.95);
  sunLight.position.set(35, 65, 45);
  scene.add(sunLight);

  const rangePointLight1 = new THREE.PointLight(0x00f5d4, 0.9, 45);
  rangePointLight1.position.set(-14, 9, -8);
  scene.add(rangePointLight1);

  const rangePointLight2 = new THREE.PointLight(0xff4655, 0.8, 45);
  rangePointLight2.position.set(14, 9, -8);
  scene.add(rangePointLight2);

  // Procedural High-Contrast Architectural Textures
  function createArchTexture(bgHex, gridHex, subGridHex) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = subGridHex;
    ctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += 128) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }

    ctx.strokeStyle = gridHex;
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  function makeLabelTexture(title, subtitle, accentColor) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0d1520';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 10;
    ctx.strokeRect(6, 6, 500, 244);

    ctx.fillStyle = '#ece8e1';
    ctx.font = 'bold 44px Rajdhani, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, 256, 115);

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 34px Rajdhani, sans-serif';
    ctx.fillText(subtitle, 256, 178);
    return new THREE.CanvasTexture(c);
  }

  const floorTex = createArchTexture('#101722', '#1f2e42', '#15202e');
  floorTex.repeat.set(36, 36);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(92, 92),
    new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.65, metalness: 0.2 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const wallTex = createArchTexture('#16202c', '#ff4655', '#1e2c3d');
  wallTex.repeat.set(18, 3);
  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.5, metalness: 0.3 });

  const coverTex = createArchTexture('#192635', '#00f5d4', '#213245');
  coverTex.repeat.set(2, 2);
  const coverMat = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.4, metalness: 0.4 });

  const radTex = createArchTexture('#13322d', '#00f5d4', '#19423b');
  const radMat = new THREE.MeshStandardMaterial({
    map: radTex,
    roughness: 0.25,
    metalness: 0.5,
    emissive: 0x002620
  });

  const colliders = [];
  const envMeshes = [floor];

  function addBox(x, y, z, w, h, d, mat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y + h / 2, z);
    scene.add(m);
    envMeshes.push(m);
    colliders.push({
      minX: x - w / 2, maxX: x + w / 2,
      minY: y, maxY: y + h,
      minZ: z - d / 2, maxZ: z + d / 2
    });
    return m;
  }

  // Outer Facility Perimeter Walls + Overhead Light Beams
  addBox(0, 0, -45, 90, 14, 2, wallMat);
  addBox(0, 0, 45, 90, 14, 2, wallMat);
  addBox(-45, 0, 0, 2, 14, 90, wallMat);
  addBox(45, 0, 0, 2, 14, 90, wallMat);

  // Overhead Architectural Roof Girders
  for (let z = -30; z <= 30; z += 15) {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(88, 0.8, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x151e29, metalness: 0.8, roughness: 0.2 })
    );
    beam.position.set(0, 13.5, z);
    scene.add(beam);

    const neonStrip = new THREE.Mesh(
      new THREE.BoxGeometry(70, 0.15, 0.4),
      new THREE.MeshBasicMaterial({ color: z === 0 ? 0xff4655 : 0x00f5d4 })
    );
    neonStrip.position.set(0, 13.0, z);
    scene.add(neonStrip);
  }

  // Distance Range Lines on Floor (10m, 20m, 35m from Firing Line z = +22)
  function addDistanceLine(zPos, labelStr) {
    const lineMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(52, 0.18),
      new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.4 })
    );
    lineMesh.rotation.x = -Math.PI / 2;
    lineMesh.position.set(0, 0.03, zPos);
    scene.add(lineMesh);

    const signTex = makeLabelTexture(labelStr, 'RANGE MARKER', '#00f5d4');
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 1.8),
      new THREE.MeshBasicMaterial({ map: signTex })
    );
    sign.position.set(28, 1.6, zPos);
    sign.rotation.y = -Math.PI / 4;
    scene.add(sign);
  }

  addDistanceLine(12, '10 METERS');
  addDistanceLine(2, '20 METERS');
  addDistanceLine(-13, '35 METERS');

  // Tactical Cover Pillars (Placed along outer flanks so center practice lanes stay wide open)
  addBox(-24, 0, 4, 5, 4.5, 3, coverMat);
  addBox(24, 0, 4, 5, 4.5, 3, coverMat);
  addBox(-24, 0, -16, 5, 5, 4, radMat);
  addBox(24, 0, -16, 5, 5, 4, radMat);

  // P2P Spawn Base Shields & Glowing Base Pads
  addBox(0, 0, 32, 6.5, 3.0, 1.4, coverMat);
  addBox(0, 0, -32, 6.5, 3.0, 1.4, coverMat);

  const southPad = new THREE.Mesh(
    new THREE.CylinderGeometry(3.5, 3.5, 0.1, 24),
    new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.38 })
  );
  southPad.position.set(0, 0.06, 38);
  scene.add(southPad);

  const northPad = new THREE.Mesh(
    new THREE.CylinderGeometry(3.5, 3.5, 0.1, 24),
    new THREE.MeshBasicMaterial({ color: 0xff4655, transparent: true, opacity: 0.38 })
  );
  northPad.position.set(0, 0.06, -38);
  scene.add(northPad);

  // =========================================================
  // 5. 6 FIXED BOT SPAWN BAYS & SHOOTABLE 3D RANGE CONSOLE
  // =========================================================
  const FIXED_BOT_SPAWN_BAYS = [
    { id: 0, x: -12, z: 12 }, // Bay 1: 10m Left
    { id: 1, x:  12, z: 12 }, // Bay 2: 10m Right
    { id: 2, x:  -7, z:  2 }, // Bay 3: 20m Left-Center
    { id: 3, x:   7, z:  2 }, // Bay 4: 20m Right-Center
    { id: 4, x: -14, z: -13 },// Bay 5: 35m Deep Left
    { id: 5, x:  14, z: -13 } // Bay 6: 35m Deep Right
  ];

  // Build Glowing Holographic Spawn Bay Rings on the Floor
  FIXED_BOT_SPAWN_BAYS.forEach((bay) => {
    const padRing = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.45, 24),
      new THREE.MeshBasicMaterial({ color: 0x00f5d4, side: THREE.DoubleSide })
    );
    padRing.rotation.x = -Math.PI / 2;
    padRing.position.set(bay.x, 0.05, bay.z);
    scene.add(padRing);

    const padBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.1, 0.08, 24),
      new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.2 })
    );
    padBase.position.set(bay.x, 0.04, bay.z);
    scene.add(padBase);
  });

  // Practice Range Configuration State
  const rangeConfig = {
    botStrafe: false,       // Static by default for clean aim training, shoot button to toggle Strafe
    botArmor: false,        // false = 100 HP, true = 150 HP (Heavy Shield)
    infiniteAmmo: true,     // Infinite ammo enabled by default in Practice Range
    challengeActive: false,
    challengeKillsLeft: 30,
    challengeStartTime: 0
  };

  // Build Interactive 3D Shootable Range Control Console near Firing Line (Left Wall)
  const consoleButtons = [];
  const consoleFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 5.5, 13.5),
    new THREE.MeshStandardMaterial({ color: 0x101822, metalness: 0.7, roughness: 0.3 })
  );
  consoleFrame.position.set(-18, 3.2, 20);
  consoleFrame.rotation.y = Math.PI / 3.2;
  scene.add(consoleFrame);

  function createShootableButton(localZ, title, getSubtitleFn, getColorFn, onTrigger) {
    const btnMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 1.8, 2.9),
      new THREE.MeshBasicMaterial({ map: makeLabelTexture(title, getSubtitleFn(), getColorFn()) })
    );
    btnMesh.position.set(0.32, 0.2, localZ);
    consoleFrame.add(btnMesh);

    const btnObj = {
      mesh: btnMesh,
      title,
      getSubtitleFn,
      getColorFn,
      onTrigger,
      refreshTexture() {
        this.mesh.material.map = makeLabelTexture(this.title, this.getSubtitleFn(), this.getColorFn());
        this.mesh.material.needsUpdate = true;
      }
    };
    btnMesh.userData = { isConsoleButton: true, controller: btnObj };
    consoleButtons.push(btnMesh);
    return btnObj;
  }

  const btnStrafe = createShootableButton(
    -4.5,
    'BOT MOVEMENT',
    () => rangeConfig.botStrafe ? 'STRAFING' : 'STATIC',
    () => rangeConfig.botStrafe ? '#ffbe0b' : '#00f5d4',
    () => {
      rangeConfig.botStrafe = !rangeConfig.botStrafe;
      showBanner(rangeConfig.botStrafe ? 'BOTS: STRAFING ON' : 'BOTS: STATIC SPAWNS');
    }
  );

  const btnArmor = createShootableButton(
    -1.5,
    'BOT ARMOR',
    () => rangeConfig.botArmor ? '150 HP (HEAVY)' : '100 HP (BASE)',
    () => rangeConfig.botArmor ? '#ff4655' : '#00f5d4',
    () => {
      rangeConfig.botArmor = !rangeConfig.botArmor;
      bots.forEach(b => b.resetStats());
      showBanner(rangeConfig.botArmor ? 'BOT ARMOR: 150 HP' : 'BOT ARMOR: 100 HP');
    }
  );

  const btnInfAmmo = createShootableButton(
    1.5,
    'AMMO MODE',
    () => rangeConfig.infiniteAmmo ? 'INFINITE AMMO' : 'STANDARD MAG',
    () => rangeConfig.infiniteAmmo ? '#00f5d4' : '#ffbe0b',
    () => {
      rangeConfig.infiniteAmmo = !rangeConfig.infiniteAmmo;
      updateHUD();
      showBanner(rangeConfig.infiniteAmmo ? 'INFINITE AMMO ON' : 'STANDARD MAGS ON');
    }
  );

  const btnChallenge = createShootableButton(
    4.5,
    'SPEED TRIAL',
    () => rangeConfig.challengeActive ? `${rangeConfig.challengeKillsLeft} LEFT` : 'START 30-BOT',
    () => rangeConfig.challengeActive ? '#ff4655' : '#ffbe0b',
    () => {
      rangeConfig.challengeActive = true;
      rangeConfig.challengeKillsLeft = 30;
      rangeConfig.challengeStartTime = performance.now();
      resetPracticeTelemetry();
      showBanner('30-BOT SPEED TRIAL STARTED!');
    }
  );

  // =========================================================
  // 6. 6-WEAPON ARSENAL (VANDAL, ODIN, SHERIFF, OPERATOR, RPG, KNIFE)
  // =========================================================
  const WEAPONS = [
    {
      id: 'VANDAL', name: 'VANDAL // RIFLE',
      ammo: 25, maxAmmo: 25, reserve: 75,
      fireRate: 0.098, headDmg: 160, bodyDmg: 40,
      speedMult: 1.0, spread: 0.01, reloadTime: 1100
    },
    {
      id: 'ODIN', name: 'ODIN // MINIGUN',
      ammo: 100, maxAmmo: 100, reserve: 200,
      fireRate: 0.055, headDmg: 95, bodyDmg: 34,
      speedMult: 0.86, spread: 0.02, reloadTime: 2100
    },
    {
      id: 'SHERIFF', name: 'SHERIFF // REVOLVER',
      ammo: 6, maxAmmo: 6, reserve: 36,
      fireRate: 0.24, headDmg: 195, bodyDmg: 55,
      speedMult: 1.05, spread: 0.003, reloadTime: 950
    },
    {
      id: 'OPERATOR', name: 'OPERATOR // SNIPER',
      ammo: 5, maxAmmo: 5, reserve: 25,
      fireRate: 0.95, headDmg: 255, bodyDmg: 150,
      speedMult: 0.82, spread: 0.0, reloadTime: 1650
    },
    {
      id: 'ROCKET', name: 'SHOWSTOPPER // RPG',
      ammo: 3, maxAmmo: 3, reserve: 15,
      fireRate: 0.85, headDmg: 185, bodyDmg: 185,
      speedMult: 0.88, spread: 0.0, reloadTime: 1500
    },
    {
      id: 'KNIFE', name: 'REAVER // KARAMBIT',
      ammo: '∞', maxAmmo: '∞', reserve: '∞',
      fireRate: 0.36, headDmg: 150, bodyDmg: 75,
      speedMult: 1.35, spread: 0, reloadTime: 0
    }
  ];

  let currentWpnIdx = 0;

  const weaponRoot = new THREE.Group();
  playerPitch.add(weaponRoot);

  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1c2128, metalness: 0.75, roughness: 0.25 });
  const neonCyan = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
  const neonRed = new THREE.MeshBasicMaterial({ color: 0xff4655 });
  const neonGold = new THREE.MeshBasicMaterial({ color: 0xffbe0b });
  const neonPurple = new THREE.MeshBasicMaterial({ color: 0x9d4edd });

  // 0: Vandal
  const vandalMesh = new THREE.Group();
  vandalMesh.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.13, 0.65), darkMetal));
  const vBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 8), darkMetal);
  vBarrel.rotation.x = Math.PI / 2; vBarrel.position.set(0, 0.03, -0.45);
  const vStrip = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.02, 0.45), neonCyan);
  vStrip.position.set(0, 0.04, -0.05);
  vandalMesh.add(vBarrel, vStrip);
  weaponRoot.add(vandalMesh);

  // 1: Odin Minigun
  const odinMesh = new THREE.Group();
  odinMesh.add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.55), darkMetal));
  const odinRotor = new THREE.Group();
  odinRotor.position.set(0, 0, -0.45);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.55, 6), darkMetal);
    b.rotation.x = Math.PI / 2;
    b.position.set(Math.cos(angle) * 0.048, Math.sin(angle) * 0.048, 0);
    odinRotor.add(b);
  }
  const rotorRing = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 12), neonRed);
  rotorRing.rotation.x = Math.PI / 2; rotorRing.position.z = -0.18;
  odinRotor.add(rotorRing);
  odinMesh.add(odinRotor);
  odinMesh.visible = false;
  weaponRoot.add(odinMesh);

  // 2: Sheriff
  const sheriffMesh = new THREE.Group();
  const sFrame = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.36), darkMetal);
  const sCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.1, 8), neonCyan);
  sCyl.rotation.x = Math.PI / 2; sCyl.position.set(0, 0.02, -0.02);
  sheriffMesh.add(sFrame, sCyl);
  sheriffMesh.visible = false;
  weaponRoot.add(sheriffMesh);

  // 3: Operator Sniper
  const operatorMesh = new THREE.Group();
  const opChassis = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.15, 0.82), darkMetal);
  const opBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.95, 10), darkMetal);
  opBarrel.rotation.x = Math.PI / 2; opBarrel.position.set(0, 0.03, -0.78);
  const opBrake = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.12), neonRed);
  opBrake.position.set(0, 0.03, -1.25);
  const opScopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.042, 0.38, 12), darkMetal);
  opScopeTube.rotation.x = Math.PI / 2; opScopeTube.position.set(0, 0.13, -0.1);
  operatorMesh.add(opChassis, opBarrel, opBrake, opScopeTube);
  operatorMesh.visible = false;
  weaponRoot.add(operatorMesh);

  // 4: Showstopper Rocket Launcher
  const rocketLauncherMesh = new THREE.Group();
  const rlTube = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.95, 14), darkMetal);
  rlTube.rotation.x = Math.PI / 2; rlTube.position.set(0, 0.04, -0.2);
  const rlMuzzleCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.105, 0.14, 14), neonGold);
  rlMuzzleCollar.rotation.x = Math.PI / 2; rlMuzzleCollar.position.set(0, 0.04, -0.66);
  const rlExhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.12, 0.16, 14), neonRed);
  rlExhaust.rotation.x = Math.PI / 2; rlExhaust.position.set(0, 0.04, 0.28);
  const rlWarheadTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 12), neonRed);
  rlWarheadTip.rotation.x = -Math.PI / 2; rlWarheadTip.position.set(0, 0.04, -0.76);
  rocketLauncherMesh.add(rlTube, rlMuzzleCollar, rlExhaust, rlWarheadTip);
  rocketLauncherMesh.visible = false;
  weaponRoot.add(rocketLauncherMesh);

  // 5: Karambit Knife
  const knifeMesh = new THREE.Group();
  const kRing = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.008, 8, 16), neonPurple);
  const kHandle = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.11, 0.035), darkMetal);
  kHandle.position.set(0, 0.07, 0);
  const kBlade = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.18, 4), neonCyan);
  kBlade.position.set(0, 0.18, -0.04); kBlade.rotation.x = -0.55;
  knifeMesh.add(kRing, kHandle, kBlade);
  knifeMesh.visible = false;
  weaponRoot.add(knifeMesh);

  const weaponMeshes = [vandalMesh, odinMesh, sheriffMesh, operatorMesh, rocketLauncherMesh, knifeMesh];

  const flashMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0 });
  const muzzleFlash = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 6), flashMat);
  muzzleFlash.rotation.x = -Math.PI / 2;
  muzzleFlash.position.set(0, 0.02, -0.85);
  weaponRoot.add(muzzleFlash);

  const fppHipOffset = new THREE.Vector3(0.28, -0.24, -0.48);
  const fppAdsOffset = new THREE.Vector3(0.12, -0.28, -0.38);
  const tppWeaponOffset = new THREE.Vector3(0.54, -0.55, -0.35);
  weaponRoot.position.copy(fppHipOffset);

  function equipWeapon(idx) {
    if (idx < 0 || idx >= WEAPONS.length) return;
    currentWpnIdx = idx;
    player.reloading = false;
    toggleADS(false);
    weaponMeshes.forEach((m, i) => m.visible = (i === idx));
    for (let i = 0; i < WEAPONS.length; i++) {
      document.getElementById(`slot-w${i + 1}`).classList.toggle('active', i === idx);
    }
    updateHUD();
  }

  // =========================================================
  // 7. FIXED-BAY PRACTICE BOTS (WITH OVERHEAD HP & DAMAGE POPUPS)
  // =========================================================
  const bots = [];
  const headHitboxes = [];
  const bodyHitboxes = [];

  class PracticeBot {
    constructor(bay) {
      this.bay = bay;
      this.maxHp = rangeConfig.botArmor ? 150 : 100;
      this.hp = this.maxHp;
      this.speed = 5.4;
      this.blindTimer = 0;
      this.strafeDir = bay.id % 2 === 0 ? 1 : -1;
      this.walkCycle = Math.random() * 10;
      this.isDead = false;

      this.agent = createStructuredAgentMesh(0x232c3b, 0xff4655, 0xffbe0b, { bot: this }, true);
      this.group = this.agent.root;
      this.group.position.set(bay.x, 0, bay.z);

      headHitboxes.push(this.agent.helmet);
      this.agent.bodyParts.forEach(p => bodyHitboxes.push(p));

      this.blindRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.45, 0.05, 6, 16),
        new THREE.MeshBasicMaterial({ color: 0xffbe0b })
      );
      this.blindRing.rotation.x = Math.PI / 2;
      this.blindRing.position.y = 3.25;
      this.blindRing.visible = false;
      this.group.add(this.blindRing);

      scene.add(this.group);
    }

    resetStats() {
      this.maxHp = rangeConfig.botArmor ? 150 : 100;
      this.hp = this.maxHp;
      this.updateHealthBar();
    }

    updateHealthBar() {
      if (!this.agent.hbFill) return;
      const ratio = Math.max(0.001, this.hp / this.maxHp);
      this.agent.hbFill.scale.x = ratio;
      this.agent.hbFill.material.color.setHex(ratio > 0.5 ? 0x00f5d4 : (ratio > 0.25 ? 0xffbe0b : 0xff4655));
    }

    takeDamage(dmg, isHead, hitPoint, wpnName) {
      if (this.isDead) return;
      this.hp -= dmg;
      const killed = this.hp <= 0;

      // Spawn Floating 3D Damage Number at Impact / Head
      const popupPos = hitPoint
        ? hitPoint.clone()
        : this.group.position.clone().add(new THREE.Vector3(0, 2.5, 0));
      spawnDamageNumber(popupPos, dmg, isHead, killed);

      // Brief Hit Flash on Chest Armor
      this.agent.chestPlate.material.emissive.setHex(0x666666);
      setTimeout(() => {
        if (this.agent && this.agent.chestPlate) {
          this.agent.chestPlate.material.emissive.setHex(0x000000);
        }
      }, 55);

      this.updateHealthBar();

      if (killed) {
        this.isDead = true;
        spawnSparks(this.group.position.clone().add(new THREE.Vector3(0, 1.9, 0)), 0xff4655, 16);
        this.hideForRespawn();

        player.kills++;
        if (isHead) player.headshotKills++;
        if (!player.ultActive && player.ultPoints < player.maxUltPoints) player.ultPoints++;
        if (player.ultActive) {
          player.hp = 100;
          player.armor = 50;
        }

        addKillfeed(`BOT [BAY ${this.bay.id + 1}]`, wpnName || WEAPONS[currentWpnIdx].id, isHead);

        // Check 30-Bot Speed Challenge
        if (rangeConfig.challengeActive) {
          rangeConfig.challengeKillsLeft--;
          btnChallenge.refreshTexture();
          if (rangeConfig.challengeKillsLeft <= 0) {
            const elapsed = ((performance.now() - rangeConfig.challengeStartTime) / 1000).toFixed(2);
            rangeConfig.challengeActive = false;
            btnChallenge.refreshTexture();
            showBanner(`30 BOTS CLEARED IN ${elapsed}s!`);
          }
        }

        updateHUD();

        // Respawn cleanly in the exact same Fixed Spawn Bay after 950ms
        setTimeout(() => {
          if (!p2pConnected) this.respawnInBay();
        }, 950);
      }
    }

    hideForRespawn() {
      this.group.visible = false;
      this.group.position.y = -100;
    }

    respawnInBay() {
      this.isDead = false;
      this.maxHp = rangeConfig.botArmor ? 150 : 100;
      this.hp = this.maxHp;
      this.updateHealthBar();
      this.group.position.set(this.bay.x, 0, this.bay.z);
      this.group.visible = true;
      spawnSparks(new THREE.Vector3(this.bay.x, 1.2, this.bay.z), 0x00f5d4, 8);
    }

    purge() {
      scene.remove(this.group);
      const hIdx = headHitboxes.indexOf(this.agent.helmet);
      if (hIdx > -1) headHitboxes.splice(hIdx, 1);
      this.agent.bodyParts.forEach(p => {
        const bIdx = bodyHitboxes.indexOf(p);
        if (bIdx > -1) bodyHitboxes.splice(bIdx, 1);
      });
    }

    update(dt, playerPos) {
      if (this.isDead) return;

      if (this.blindTimer > 0) {
        this.blindTimer -= dt;
        this.blindRing.visible = true;
        this.blindRing.rotation.z += dt * 8;
        return;
      }
      this.blindRing.visible = false;

      this.group.lookAt(playerPos.x, 0, playerPos.z);

      // Fixed Bay Patrol (Only strafes within 3.2m of its assigned bay pad if Strafe is enabled)
      if (rangeConfig.botStrafe) {
        const nextX = this.group.position.x + this.strafeDir * this.speed * dt;
        if (Math.abs(nextX - this.bay.x) > 3.2) {
          this.strafeDir *= -1;
        } else {
          this.group.position.x = nextX;
        }
        this.walkCycle += dt * 11;
        this.agent.legL.rotation.x = Math.sin(this.walkCycle) * 0.45;
        this.agent.legR.rotation.x = -Math.sin(this.walkCycle) * 0.45;
        this.agent.armL.rotation.x = -Math.sin(this.walkCycle) * 0.35;
        this.agent.armR.rotation.x = Math.sin(this.walkCycle) * 0.35;
      } else {
        // Snap smoothly back to exact Bay Center when Static mode is selected
        this.group.position.x = THREE.MathUtils.lerp(this.group.position.x, this.bay.x, dt * 8);
        this.group.position.z = THREE.MathUtils.lerp(this.group.position.z, this.bay.z, dt * 8);
        this.agent.legL.rotation.x = 0;
        this.agent.legR.rotation.x = 0;
        this.agent.armL.rotation.x = 0;
        this.agent.armR.rotation.x = 0;
      }
    }
  }

  function initFixedRangeBots() {
    while (bots.length > 0) {
      bots.pop().purge();
    }
    FIXED_BOT_SPAWN_BAYS.forEach(bay => {
      bots.push(new PracticeBot(bay));
    });
    updateHUD();
  }

  // =========================================================
  // 8. P2P 1v1 MULTIPLAYER ENGINE
  // =========================================================
  let peer = null;
  let conn = null;
  let p2pConnected = false;
  let isHostPlayer = true;
  let lastProcessedDeathId = null;

  const remoteOpponent = {
    agent: null,
    hp: 100,
    kills: 0,
    active: false,
    targetPos: new THREE.Vector3(0, 0, -38),
    targetYaw: 0
  };

  function buildRemoteOpponentAvatar() {
    remoteOpponent.agent = createStructuredAgentMesh(0x282218, 0xffbe0b, 0xff4655, { isRemotePlayer: true }, true);
    remoteOpponent.agent.root.position.set(0, -100, 0);
    scene.add(remoteOpponent.agent.root);
  }
  buildRemoteOpponentAvatar();

  function respawnAtArenaBase() {
    const base = p2pConnected ? (isHostPlayer ? SPAWN_HOST : SPAWN_JOIN) : SPAWN_PRACTICE;
    playerYaw.position.set(base.x, base.y, base.z);
    playerYaw.rotation.y = base.yaw;
    playerPitch.rotation.x = 0;
    player.vel.set(0, 0, 0);
    player.hp = 100;
    player.armor = 50;
    WEAPONS.forEach(w => { if (w.id !== 'KNIFE') w.ammo = w.maxAmmo; });
    updateHUD();
  }

  function setupConnection(c, asHost) {
    conn = c;
    isHostPlayer = asHost;

    conn.on('open', () => {
      p2pConnected = true;
      remoteOpponent.active = true;
      rangeConfig.infiniteAmmo = false; // Fair ammo mags in P2P 1v1

      // Purge all practice bots in P2P Duel Mode
      while (bots.length > 0) bots.pop().purge();
      consoleFrame.visible = false;

      player.kills = 0;
      remoteOpponent.kills = 0;
      respawnAtArenaBase();

      const rivalSpawn = isHostPlayer ? SPAWN_JOIN : SPAWN_HOST;
      remoteOpponent.targetPos.set(rivalSpawn.x, 0, rivalSpawn.z);
      remoteOpponent.agent.root.position.copy(remoteOpponent.targetPos);

      document.getElementById('p2p-status').textContent = 'STATUS: P2P 1v1 ARENA LIVE! FIXED NORTH/SOUTH BASE SPAWNS';
      document.getElementById('net-indicator').textContent = 'P2P 1v1 ARENA';
      showBanner('P2P 1V1 DUEL LIVE');
      updateHUD();
    });

    conn.on('data', (data) => {
      if (data.type === 'move') {
        remoteOpponent.targetPos.set(data.x, data.y - 2.6, data.z);
        remoteOpponent.targetYaw = data.yaw;
      } else if (data.type === 'tracer') {
        spawnTracer(
          new THREE.Vector3(data.sx, data.sy, data.sz),
          new THREE.Vector3(data.ex, data.ey, data.ez),
          data.color
        );
      } else if (data.type === 'rocket_spawn') {
        spawnRocketProjectile(
          new THREE.Vector3(data.ox, data.oy, data.oz),
          new THREE.Vector3(data.dx, data.dy, data.dz),
          false
        );
      } else if (data.type === 'hit') {
        damagePlayer(data.dmg, true, data.wpnName, data.isHead);
      } else if (data.type === 'flash') {
        checkPlayerFlashed(new THREE.Vector3(data.x, data.y, data.z));
      } else if (data.type === 'kill_confirm') {
        if (data.deathId && data.deathId !== lastProcessedDeathId) {
          lastProcessedDeathId = data.deathId;
          player.kills++;
          if (data.isHead) player.headshotKills++;
          if (!player.ultActive && player.ultPoints < player.maxUltPoints) player.ultPoints++;
          addKillfeed('RIVAL (P2P)', data.wpnName || 'WEAPON', data.isHead);
          showBanner(`ROUND WON // ${player.kills} - ${remoteOpponent.kills}`);
          respawnAtArenaBase();
        }
      }
    });
  }

  document.getElementById('host-btn').addEventListener('click', () => {
    const code = 'AETHER-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    document.getElementById('p2p-status').textContent = 'INITIALIZING P2P SERVER...';
    if (peer) peer.destroy();
    peer = new Peer(code);
    peer.on('open', (id) => {
      document.getElementById('room-code-display').value = id;
      document.getElementById('p2p-status').textContent = `WAITING FOR FRIEND TO JOIN CODE: ${id}`;
    });
    peer.on('connection', (c) => setupConnection(c, true));
  });

  document.getElementById('copy-btn').addEventListener('click', () => {
    const val = document.getElementById('room-code-display').value;
    if (val) navigator.clipboard.writeText(val);
  });

  document.getElementById('join-btn').addEventListener('click', () => {
    const targetCode = document.getElementById('join-code-input').value.trim().toUpperCase();
    if (!targetCode) return;
    document.getElementById('p2p-status').textContent = `CONNECTING TO ${targetCode}...`;
    if (peer) peer.destroy();
    peer = new Peer();
    peer.on('open', () => {
      const c = peer.connect(targetCode);
      setupConnection(c, false);
    });
  });

  // =========================================================
  // 9. COMBAT, DIRECT HITSCAN & SHOWSTOPPER ROCKET ENGINE
  // =========================================================
  const player = {
    hp: 100, armor: 50,
    vel: new THREE.Vector3(),
    onGround: true,
    reloading: false,
    ads: false,
    sniperZoomLevel: 1,
    isTPP: false,
    kills: 0,
    headshotKills: 0,
    shotsFired: 0,
    shotsHit: 0,
    ultPoints: 0, maxUltPoints: 4,
    ultActive: false, ultTimer: 0,
    lastShotTime: 0,
    odinSpin: 0,
    knifeAnim: 0,
    cds: { c: 0, q: 0, e: 0 }
  };

  function resetPracticeTelemetry() {
    player.kills = 0;
    player.headshotKills = 0;
    player.shotsFired = 0;
    player.shotsHit = 0;
    updateHUD();
  }

  function toggleCameraPerspective() {
    player.isTPP = !player.isTPP;
    selfAgent.root.visible = player.isTPP && !(player.ads && WEAPONS[currentWpnIdx].id === 'OPERATOR');
    const label = document.getElementById('cam-mode-label');
    label.textContent = player.isTPP ? 'TPP (3RD PERSON)' : 'FPP (1ST PERSON)';
    label.style.color = player.isTPP ? '#ffbe0b' : '#00f5d4';
    showBanner(player.isTPP ? 'THIRD-PERSON VIEW' : 'FIRST-PERSON VIEW');
  }

  function toggleADS(state) {
    const wpn = WEAPONS[currentWpnIdx];
    if (wpn.id === 'KNIFE' || wpn.id === 'ROCKET') state = false;
    player.ads = state;

    const holoOverlay = document.getElementById('ads-overlay');
    const sniperOverlay = document.getElementById('sniper-overlay');

    if (!state) {
      player.sniperZoomLevel = 1;
      holoOverlay.classList.remove('active');
      sniperOverlay.classList.remove('active');
      operatorMesh.visible = (wpn.id === 'OPERATOR');
      selfAgent.root.visible = player.isTPP;
    } else {
      if (wpn.id === 'OPERATOR') {
        sniperOverlay.classList.add('active');
        holoOverlay.classList.remove('active');
        operatorMesh.visible = false;
        selfAgent.root.visible = false;
        updateSniperZoomLabel();
      } else {
        holoOverlay.classList.add('active');
        sniperOverlay.classList.remove('active');
      }
    }
  }

  function cycleSniperZoom() {
    if (!player.ads || WEAPONS[currentWpnIdx].id !== 'OPERATOR') return;
    player.sniperZoomLevel = player.sniperZoomLevel === 1 ? 2 : 1;
    updateSniperZoomLabel();
  }

  function updateSniperZoomLabel() {
    const lbl = document.getElementById('sniper-zoom-label');
    lbl.textContent = player.sniperZoomLevel === 1
      ? '2.5X ZOOM // [SHIFT] OR [D-RIGHT] FOR 5.0X'
      : '5.0X HIGH ZOOM // [SHIFT] OR [D-RIGHT] FOR 2.5X';
  }

  const tracers = [];
  const particles = [];
  const activeRockets = [];
  const activeExplosions = [];

  function spawnTracer(start, end, colorHex) {
    const geom = new THREE.BufferGeometry().setFromPoints([start, end]);
    const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.95 });
    const line = new THREE.Line(geom, mat);
    scene.add(line);
    tracers.push({ line, mat, life: 0.14 });
  }

  function spawnSparks(pos, colorHex, count = 8) {
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.11, 0.11),
        new THREE.MeshBasicMaterial({ color: colorHex })
      );
      m.position.copy(pos);
      scene.add(m);
      particles.push({
        mesh: m,
        vel: new THREE.Vector3((Math.random()-0.5)*10, Math.random()*7+1, (Math.random()-0.5)*10),
        life: 0.4
      });
    }
  }

  function spawnRocketProjectile(origin, dir, isLocalOwner) {
    const rocketGroup = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 10), neonGold);
    body.rotation.x = Math.PI / 2;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 10), neonRed);
    cone.rotation.x = -Math.PI / 2;
    cone.position.z = -0.35;
    rocketGroup.add(body, cone);

    rocketGroup.position.copy(origin);
    rocketGroup.lookAt(origin.clone().add(dir));
    scene.add(rocketGroup);

    activeRockets.push({
      mesh: rocketGroup,
      vel: dir.clone().normalize().multiplyScalar(58),
      isLocalOwner,
      life: 4.0
    });
  }

  function detonateRocket(pos, isLocalOwner) {
    sfx.playExplosion();
    spawnSparks(pos, 0xffbe0b, 26);
    spawnSparks(pos, 0xff4655, 18);

    const shockMat = new THREE.MeshBasicMaterial({
      color: 0xff4655,
      transparent: true,
      opacity: 0.75
    });
    const shockSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 18), shockMat);
    shockSphere.position.copy(pos);
    scene.add(shockSphere);
    activeExplosions.push({ mesh: shockSphere, mat: shockMat, scale: 1.0, life: 0.35 });

    if (!isLocalOwner) return;

    const blastRadius = 9.5;
    for (let i = bots.length - 1; i >= 0; i--) {
      const b = bots[i];
      if (b.isDead) continue;
      const d = b.group.position.distanceTo(pos);
      if (d < blastRadius) {
        const dmg = Math.round(185 * (1 - (d / blastRadius) * 0.6));
        b.takeDamage(dmg, false, b.group.position.clone().add(new THREE.Vector3(0, 2.2, 0)), 'ROCKET');
        sfx.playHit(false);
        triggerHitmarker(true);
      }
    }

    if (remoteOpponent.active && p2pConnected && conn) {
      const d = remoteOpponent.agent.root.position.distanceTo(pos);
      if (d < blastRadius) {
        const dmg = Math.round(185 * (1 - (d / blastRadius) * 0.6));
        spawnDamageNumber(remoteOpponent.agent.root.position.clone().add(new THREE.Vector3(0, 2.4, 0)), dmg, false, dmg >= 100);
        conn.send({ type: 'hit', dmg, isHead: false, wpnName: 'ROCKET' });
        sfx.playHit(true);
        triggerHitmarker(true);
      }
    }
  }

  function fireWeapon(now) {
    const wpn = WEAPONS[currentWpnIdx];
    if (player.reloading || !isPointerLocked) return;

    let interval = wpn.fireRate;
    if (wpn.id === 'ODIN') {
      interval = Math.max(0.038, wpn.fireRate - player.odinSpin * 0.022);
    }
    if (player.ultActive) interval *= 0.72;

    if (now - player.lastShotTime < interval) return;

    if (wpn.id !== 'KNIFE') {
      if (wpn.ammo <= 0) {
        reloadWeapon();
        return;
      }
      if (!player.ultActive && !rangeConfig.infiniteAmmo) {
        wpn.ammo--;
      }
    }

    player.lastShotTime = now;
    sfx.playWeaponSound(wpn.id);

    // KNIFE MELEE
    if (wpn.id === 'KNIFE') {
      player.knifeAnim = 1.0;
      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(0, 0), camera);
      ray.far = player.isTPP ? 8.5 : 4.5;
      const targets = [...headHitboxes, ...bodyHitboxes];
      if (remoteOpponent.active) {
        targets.push(remoteOpponent.agent.helmet, ...remoteOpponent.agent.bodyParts);
      }
      const hits = ray.intersectObjects(targets, false);
      if (hits.length > 0) {
        processTargetHit(hits[0].object, wpn.headDmg, wpn.bodyDmg, wpn.id, hits[0].point);
        spawnSparks(hits[0].point, 0x00f5d4, 10);
      }
      updateHUD();
      return;
    }

    // ROCKET LAUNCHER
    if (wpn.id === 'ROCKET') {
      weaponRoot.position.z += 0.12;
      playerPitch.rotation.x = Math.min(Math.PI / 2.1, playerPitch.rotation.x + 0.035);

      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(0, 0), camera);
      const muzzlePos = new THREE.Vector3();
      muzzleFlash.getWorldPosition(muzzlePos);

      const dir = ray.ray.direction.clone().normalize();
      spawnRocketProjectile(muzzlePos, dir, true);

      if (p2pConnected && conn) {
        conn.send({
          type: 'rocket_spawn',
          ox: muzzlePos.x, oy: muzzlePos.y, oz: muzzlePos.z,
          dx: dir.x, dy: dir.y, dz: dir.z
        });
      }
      updateHUD();
      return;
    }

    // DIRECT HITSCAN GUNS
    player.shotsFired++;
    flashMat.opacity = 0.95;
    weaponRoot.position.z += 0.05;
    if (wpn.id === 'ODIN') player.odinSpin = Math.min(1.0, player.odinSpin + 0.14);

    let spread = player.ads ? wpn.spread * 0.25 : wpn.spread;
    if (wpn.id === 'OPERATOR' && !player.ads) spread = 0.065;

    const screenCoords = new THREE.Vector2(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(screenCoords, camera);

    const muzzlePos = new THREE.Vector3();
    muzzleFlash.getWorldPosition(muzzlePos);

    const targets = [...consoleButtons, ...headHitboxes, ...bodyHitboxes, ...envMeshes];
    if (remoteOpponent.active) {
      targets.push(remoteOpponent.agent.helmet, ...remoteOpponent.agent.bodyParts);
    }

    const hits = raycaster.intersectObjects(targets, false);
    const tracerColor = (player.ultActive || wpn.id === 'OPERATOR') ? 0xff4655 : 0x00f5d4;

    if (hits.length > 0) {
      const hit = hits[0];
      spawnTracer(muzzlePos, hit.point, tracerColor);
      broadcastTracer(muzzlePos, hit.point, tracerColor);

      // 1. Check if player shot the 3D Range Configuration Board
      if (hit.object.userData && hit.object.userData.isConsoleButton) {
        player.shotsFired--; // Don't penalize accuracy when shooting UI buttons
        sfx.playSwitchClick();
        const ctrl = hit.object.userData.controller;
        ctrl.onTrigger();
        ctrl.refreshTexture();
        spawnSparks(hit.point, 0xffbe0b, 8);
      }
      // 2. Check if player hit a Bot or P2P Rival
      else if (hit.object.userData && (hit.object.userData.bot || hit.object.userData.isRemotePlayer)) {
        player.shotsHit++;
        processTargetHit(hit.object, wpn.headDmg, wpn.bodyDmg, wpn.id, hit.point);
      } else {
        spawnSparks(hit.point, 0x00f5d4, 5);
      }
    } else {
      const endPt = raycaster.ray.origin.clone().addScaledVector(raycaster.ray.direction, 120);
      spawnTracer(muzzlePos, endPt, tracerColor);
      broadcastTracer(muzzlePos, endPt, tracerColor);
    }

    const kick = wpn.id === 'OPERATOR' ? 0.032 : (player.ads ? 0.006 : 0.01);
    playerPitch.rotation.x = Math.min(Math.PI / 2.1, playerPitch.rotation.x + kick);
    updateHUD();
  }

  function processTargetHit(obj, headDmg, bodyDmg, wpnId, hitPoint) {
    const isHead = obj.userData.part === 'head';
    const dmg = isHead ? headDmg : bodyDmg;
    sfx.playHit(isHead);
    triggerHitmarker(isHead);

    if (obj.userData.bot) {
      obj.userData.bot.takeDamage(dmg, isHead, hitPoint, wpnId);
    } else if (obj.userData.isRemotePlayer && p2pConnected && conn) {
      spawnDamageNumber(hitPoint, dmg, isHead, dmg >= 100);
      conn.send({ type: 'hit', dmg, isHead, wpnName: wpnId });
    }
  }

  function broadcastTracer(s, e, color) {
    if (p2pConnected && conn) {
      conn.send({
        type: 'tracer',
        sx: s.x, sy: s.y, sz: s.z,
        ex: e.x, ey: e.y, ez: e.z,
        color
      });
    }
  }

  function reloadWeapon() {
    const wpn = WEAPONS[currentWpnIdx];
    if (wpn.id === 'KNIFE' || player.reloading || wpn.ammo === wpn.maxAmmo || wpn.reserve <= 0) return;
    player.reloading = true;
    if (player.ads) toggleADS(false);
    document.getElementById('weapon-name').textContent = 'RELOADING...';
    setTimeout(() => {
      const need = wpn.maxAmmo - wpn.ammo;
      const take = Math.min(need, wpn.reserve);
      wpn.ammo += take;
      if (!rangeConfig.infiniteAmmo) wpn.reserve -= take;
      player.reloading = false;
      updateHUD();
    }, wpn.reloadTime);
  }

  // =========================================================
  // 10. AGENT ABILITIES
  // =========================================================
  function castFlashbang() {
    if (player.cds.c > 0) return;
    player.cds.c = 9;

    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(0, 0), camera);
    const flashPos = playerYaw.position.clone().addScaledVector(ray.ray.direction, 11);
    flashPos.y = Math.max(1.5, flashPos.y);

    const flashSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffbe0b })
    );
    flashSphere.position.copy(flashPos);
    scene.add(flashSphere);

    setTimeout(() => {
      sfx.playFlashbang();
      spawnSparks(flashPos, 0xffbe0b, 22);
      scene.remove(flashSphere);

      bots.forEach(b => {
        if (!b.isDead && b.group.position.distanceTo(flashPos) < 28) b.blindTimer = 3.5;
      });

      if (p2pConnected && conn) {
        conn.send({ type: 'flash', x: flashPos.x, y: flashPos.y, z: flashPos.z });
      }
      showBanner('SOLAR FLASH DETONATED');
    }, 320);
  }

  function checkPlayerFlashed(flashPos) {
    const toFlash = new THREE.Vector3().subVectors(flashPos, playerYaw.position).normalize();
    const lookDir = new THREE.Vector3();
    camera.getWorldDirection(lookDir);
    if (lookDir.dot(toFlash) > 0.25 && playerYaw.position.distanceTo(flashPos) < 35) {
      sfx.playFlashbang();
      const fs = document.getElementById('flash-screen');
      fs.style.opacity = '0.95';
      setTimeout(() => {
        fs.style.transition = 'opacity 1.6s ease-out';
        fs.style.opacity = '0';
        setTimeout(() => fs.style.transition = 'opacity 0.08s linear', 1650);
      }, 600);
    }
  }

  function castHeal() {
    if (player.cds.q > 0 || (player.hp >= 100 && player.armor >= 50)) return;
    player.cds.q = 10;
    player.hp = Math.min(100, player.hp + 75);
    player.armor = Math.min(50, player.armor + 50);
    setVignette('inset 0 0 85px rgba(0, 245, 212, 0.65)');
    showBanner('BIO-SURGE // FULL RESTORE');
    updateHUD();
  }

  function castDash(stickX = 0, stickY = 0) {
    if (player.cds.e > 0) return;
    player.cds.e = 5;
    const fwd = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw.rotation.y);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw.rotation.y);
    const dir = new THREE.Vector3();
    if (keys['KeyW'] || stickY < -0.2) dir.add(fwd);
    if (keys['KeyS'] || stickY > 0.2) dir.sub(fwd);
    if (keys['KeyD'] || stickX > 0.2) dir.add(right);
    if (keys['KeyA'] || stickX < -0.2) dir.sub(right);
    if (dir.lengthSq() === 0) dir.copy(fwd);
    dir.normalize();

    player.vel.x = dir.x * 44;
    player.vel.z = dir.z * 44;
    camera.fov = 90;
    camera.updateProjectionMatrix();
    setVignette('inset 0 0 70px rgba(0, 245, 212, 0.5)');
  }

  function castUltimate() {
    if (player.ultPoints < player.maxUltPoints || player.ultActive) return;
    player.ultPoints = 0;
    player.ultActive = true;
    player.ultTimer = 14.0;
    WEAPONS[currentWpnIdx].ammo = WEAPONS[currentWpnIdx].maxAmmo;
    setVignette('inset 0 0 95px rgba(255, 70, 85, 0.55)');
    showBanner('OVERDRIVE ACTIVATED');
    updateHUD();
  }

  // =========================================================
  // 11. HUD, TELEMETRY & PLAYER DAMAGE
  // =========================================================
  let isRespawning = false;

  function damagePlayer(dmg, fromP2P, wpnName = 'WEAPON', isHead = false) {
    if (isRespawning) return;

    if (player.armor > 0) {
      const absorb = Math.min(player.armor, Math.ceil(dmg * 0.65));
      player.armor -= absorb;
      player.hp -= (dmg - absorb);
    } else {
      player.hp -= dmg;
    }
    setVignette('inset 0 0 90px rgba(255, 70, 85, 0.75)');

    if (player.hp <= 0) {
      isRespawning = true;
      if (fromP2P && p2pConnected && conn) {
        const deathId = Date.now() + '-' + Math.random().toString(36).substring(2, 6);
        conn.send({ type: 'kill_confirm', deathId, wpnName, isHead });
        remoteOpponent.kills++;
        addKillfeed('YOU', wpnName, isHead, 'RIVAL');
      }
      respawnAtArenaBase();
      showBanner('ELIMINATED // BASE RESPAWN');
      setTimeout(() => { isRespawning = false; }, 250);
    }
    updateHUD();
  }

  const hitmarkerEl = document.getElementById('hitmarker');
  let hmTimer = null;
  function triggerHitmarker(isHead) {
    hitmarkerEl.className = isHead ? 'headshot' : '';
    hitmarkerEl.style.opacity = '1';
    hitmarkerEl.style.transform = 'scale(1.2)';
    clearTimeout(hmTimer);
    hmTimer = setTimeout(() => {
      hitmarkerEl.style.opacity = '0';
      hitmarkerEl.style.transform = 'scale(0.7)';
    }, 90);
  }

  function setVignette(str) {
    const v = document.getElementById('vignette');
    v.style.boxShadow = str;
    setTimeout(() => { if (!player.ultActive) v.style.boxShadow = 'none'; }, 280);
  }

  function showBanner(txt) {
    const b = document.getElementById('banner');
    b.textContent = txt;
    b.style.opacity = '1';
    b.style.transform = 'translate(-50%, -50%) scale(1)';
    setTimeout(() => {
      b.style.opacity = '0';
      b.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }, 1500);
  }

  function addKillfeed(victim, wpnName, isHead, killer = 'ÆTHERON') {
    const feed = document.getElementById('killfeed');
    const item = document.createElement('div');
    item.className = 'kill-item';
    item.innerHTML = `${killer} <span style="color:#00f5d4">[${wpnName}${isHead ? ' ⌖' : ''}]</span> ${victim}`;
    feed.appendChild(item);
    setTimeout(() => item.remove(), 3200);
  }

  function updateHUD() {
    const wpn = WEAPONS[currentWpnIdx];
    document.getElementById('hud-hp').textContent = Math.max(0, Math.floor(player.hp));
    document.getElementById('hud-armor').textContent = Math.max(0, Math.floor(player.armor));
    document.getElementById('weapon-name').textContent = wpn.name;
    document.getElementById('hud-ammo').textContent = (player.ultActive || rangeConfig.infiniteAmmo) ? '∞' : wpn.ammo;
    document.getElementById('hud-mag').textContent = rangeConfig.infiniteAmmo ? '∞' : wpn.reserve;

    document.getElementById('hud-kills').textContent = player.kills;
    document.getElementById('hud-p2p-kills').textContent = remoteOpponent.kills;

    const hsPct = player.kills > 0 ? Math.round((player.headshotKills / player.kills) * 100) : 0;
    const accPct = player.shotsFired > 0 ? Math.round((player.shotsHit / player.shotsFired) * 100) : 100;
    document.getElementById('hud-hs').textContent = `${hsPct}%`;
    document.getElementById('hud-acc').textContent = `${accPct}%`;

    const ultSlot = document.getElementById('slot-x');
    const ultStatus = document.getElementById('ult-status');
    if (player.ultActive) {
      ultStatus.textContent = `${player.ultTimer.toFixed(1)}s`;
      ultSlot.classList.add('ready');
    } else if (player.ultPoints >= player.maxUltPoints) {
      ultStatus.textContent = 'READY';
      ultSlot.classList.add('ready');
    } else {
      ultStatus.textContent = `${player.ultPoints} / ${player.maxUltPoints}`;
      ultSlot.classList.remove('ready');
    }
  }

  // =========================================================
  // 12. CONTROLLER + KEYBOARD/MOUSE INPUT HANDLERS
  // =========================================================
  const keys = {};
  let isPointerLocked = false;
  let isMouseFiring = false;
  let sensitivity = 1.0;
  let buyMenuOpen = false;
  const prevPadButtons = {};

  window.addEventListener('gamepadconnected', (e) => {
    const padEl = document.getElementById('pad-status');
    padEl.textContent = `CONTROLLER ACTIVE (${e.gamepad.id.substring(0, 18)})`;
    padEl.style.color = '#00f5d4';
    showBanner('CONTROLLER CONNECTED');
  });

  window.addEventListener('gamepaddisconnected', () => {
    const padEl = document.getElementById('pad-status');
    padEl.textContent = 'KEYBOARD + MOUSE READY';
    padEl.style.color = '#ffbe0b';
  });

  function pollGamepad(dt) {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
    if (!gp) return { moveX: 0, moveY: 0, firing: false };

    if (!isPointerLocked && (gp.buttons[9]?.pressed || gp.buttons[0]?.pressed)) {
      sfx.init();
      document.getElementById('menu-overlay').style.display = 'none';
      isPointerLocked = true;
    }

    const deadzone = 0.14;
    const lx = Math.abs(gp.axes[0]) > deadzone ? gp.axes[0] : 0;
    const ly = Math.abs(gp.axes[1]) > deadzone ? gp.axes[1] : 0;
    const rx = Math.abs(gp.axes[2]) > deadzone ? gp.axes[2] : 0;
    const ry = Math.abs(gp.axes[3]) > deadzone ? gp.axes[3] : 0;

    if (rx !== 0 || ry !== 0) {
      let zoomMult = 1.0;
      if (player.ads) {
        zoomMult = WEAPONS[currentWpnIdx].id === 'OPERATOR'
          ? (player.sniperZoomLevel === 2 ? 0.28 : 0.45)
          : 0.6;
      }
      const lookSpeed = 2.8 * sensitivity * zoomMult * dt;
      playerYaw.rotation.y -= rx * lookSpeed;
      playerPitch.rotation.x -= ry * lookSpeed;
      playerPitch.rotation.x = Math.min(Math.PI / 2.2, Math.max(-Math.PI / 2.2, playerPitch.rotation.x));
    }

    const btnPressed = (idx) => {
      const curr = Boolean(gp.buttons[idx] && (gp.buttons[idx].pressed || gp.buttons[idx].value > 0.5));
      const justPressed = curr && !prevPadButtons[idx];
      prevPadButtons[idx] = curr;
      return justPressed;
    };

    const ltDown = Boolean(gp.buttons[6] && (gp.buttons[6].pressed || gp.buttons[6].value > 0.4));
    if (ltDown !== prevPadButtons['lt_hold']) {
      prevPadButtons['lt_hold'] = ltDown;
      if (WEAPONS[currentWpnIdx].id === 'OPERATOR') {
        if (ltDown) toggleADS(!player.ads);
      } else {
        toggleADS(ltDown);
      }
    }

    const rtFiring = Boolean(gp.buttons[7] && (gp.buttons[7].pressed || gp.buttons[7].value > 0.4));

    if (btnPressed(0) && player.onGround) {
      player.vel.y = 11.8;
      player.onGround = false;
    }
    if (btnPressed(1)) castDash(lx, ly);
    if (btnPressed(2)) reloadWeapon();
    if (btnPressed(3)) equipWeapon((currentWpnIdx + 1) % WEAPONS.length);

    const lbDown = Boolean(gp.buttons[4]?.pressed);
    const rbDown = Boolean(gp.buttons[5]?.pressed);
    if (lbDown && rbDown) {
      castUltimate();
    } else {
      if (btnPressed(4)) castFlashbang();
      if (btnPressed(5)) castHeal();
    }

    if (btnPressed(12) || btnPressed(8)) toggleCameraPerspective();
    if (btnPressed(15) || btnPressed(11)) cycleSniperZoom();

    return { moveX: lx, moveY: ly, firing: rtFiring };
  }

  function checkCylinderCollision(x, y, z, r) {
    if (x < -43.5 || x > 43.5 || z < -43.5 || z > 43.5) return true;
    for (const b of colliders) {
      if (y + 1.8 > b.minY && y - 2.4 < b.maxY) {
        const cx = Math.max(b.minX, Math.min(x, b.maxX));
        const cz = Math.max(b.minZ, Math.min(z, b.maxZ));
        const dx = x - cx, dz = z - cz;
        if (dx * dx + dz * dz < r * r) return true;
      }
    }
    return false;
  }

  document.getElementById('sens-slider').addEventListener('input', (e) => {
    sensitivity = parseFloat(e.target.value);
    document.getElementById('sens-val').textContent = sensitivity.toFixed(1);
  });

  document.getElementById('reset-pos-btn').addEventListener('click', () => {
    respawnAtArenaBase();
    container.requestPointerLock();
  });

  document.getElementById('start-btn').addEventListener('click', () => {
    sfx.init();
    container.requestPointerLock();
  });

  document.querySelectorAll('.buy-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-wpn'), 10);
      equipWeapon(idx);
      buyMenuOpen = false;
      document.getElementById('buy-menu').style.display = 'none';
      container.requestPointerLock();
    });
  });

  document.addEventListener('pointerlockchange', () => {
    isPointerLocked = (document.pointerLockElement === container);
    if (!isPointerLocked && !buyMenuOpen) {
      document.getElementById('menu-overlay').style.display = 'flex';
      isMouseFiring = false;
    } else if (isPointerLocked) {
      document.getElementById('menu-overlay').style.display = 'none';
      document.getElementById('buy-menu').style.display = 'none';
      buyMenuOpen = false;
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isPointerLocked) return;
    let zoomSensMult = 1.0;
    if (player.ads) {
      if (WEAPONS[currentWpnIdx].id === 'OPERATOR') {
        zoomSensMult = player.sniperZoomLevel === 2 ? 0.22 : 0.38;
      } else {
        zoomSensMult = 0.55;
      }
    }
    const scale = 0.002 * sensitivity * zoomSensMult;
    playerYaw.rotation.y -= e.movementX * scale;
    playerPitch.rotation.x -= e.movementY * scale;
    playerPitch.rotation.x = Math.min(Math.PI / 2.2, Math.max(-Math.PI / 2.2, playerPitch.rotation.x));
  });

  document.addEventListener('mousedown', (e) => {
    if (!isPointerLocked) return;
    if (e.button === 0) isMouseFiring = true;
    if (e.button === 2) {
      if (WEAPONS[currentWpnIdx].id === 'KNIFE') {
        player.knifeAnim = 1.5;
      } else {
        toggleADS(!player.ads);
      }
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (e.button === 0) isMouseFiring = false;
    if (e.button === 2 && WEAPONS[currentWpnIdx].id !== 'OPERATOR') {
      toggleADS(false);
    }
  });

  document.addEventListener('contextmenu', e => e.preventDefault());

  document.addEventListener('keydown', (e) => {
    keys[e.code] = true;

    if (e.code === 'KeyB') {
      buyMenuOpen = !buyMenuOpen;
      if (buyMenuOpen) {
        document.exitPointerLock();
        document.getElementById('menu-overlay').style.display = 'none';
        document.getElementById('buy-menu').style.display = 'flex';
      } else {
        document.getElementById('buy-menu').style.display = 'none';
        container.requestPointerLock();
      }
      return;
    }

    if (!isPointerLocked) return;

    if (e.code === 'KeyV') toggleCameraPerspective();
    if (e.code === 'F3') {
      e.preventDefault();
      resetPracticeTelemetry();
      showBanner('TELEMETRY STATS RESET');
    }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') cycleSniperZoom();

    if (e.code === 'Digit1') equipWeapon(0);
    if (e.code === 'Digit2') equipWeapon(1);
    if (e.code === 'Digit3') equipWeapon(2);
    if (e.code === 'Digit4') equipWeapon(3);
    if (e.code === 'Digit5') equipWeapon(4);
    if (e.code === 'Digit6') equipWeapon(5);

    if (e.code === 'KeyR') reloadWeapon();
    if (e.code === 'KeyC') castFlashbang();
    if (e.code === 'KeyQ') castHeal();
    if (e.code === 'KeyE') castDash();
    if (e.code === 'KeyX') castUltimate();

    if (e.code === 'Space' && player.onGround) {
      player.vel.y = 11.8;
      player.onGround = false;
    }
  });

  document.addEventListener('keyup', (e) => keys[e.code] = false);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // =========================================================
  // 13. 120+ FPS MAIN ENGINE LOOP
  // =========================================================
  initFixedRangeBots();
  updateHUD();

  let lastTime = performance.now();
  let frames = 0;
  let fpsTimer = performance.now();
  let netSyncTimer = 0;

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    frames++;
    if (now - fpsTimer >= 400) {
      document.getElementById('fps-counter').textContent = Math.round((frames * 1000) / (now - fpsTimer));
      frames = 0;
      fpsTimer = now;
    }

    // Update Challenge Timer HUD
    if (rangeConfig.challengeActive) {
      const elapsed = ((now - rangeConfig.challengeStartTime) / 1000).toFixed(1);
      document.getElementById('hud-timer').textContent = `${elapsed}s (${rangeConfig.challengeKillsLeft})`;
    } else {
      document.getElementById('hud-timer').textContent = 'FREE';
    }

    const timeSec = now / 1000;
    const padState = pollGamepad(dt);

    if (isPointerLocked) {
      if (isMouseFiring || padState.firing) {
        fireWeapon(timeSec);
      } else {
        player.odinSpin = Math.max(0, player.odinSpin - dt * 1.5);
      }

      if (currentWpnIdx === 1 && player.odinSpin > 0) {
        odinRotor.rotation.z += dt * 32 * player.odinSpin;
      }

      if (player.knifeAnim > 0) {
        player.knifeAnim = Math.max(0, player.knifeAnim - dt * 5);
        knifeMesh.rotation.z = Math.sin(player.knifeAnim * Math.PI * 2) * 1.4;
        knifeMesh.position.z = -Math.sin(player.knifeAnim * Math.PI) * 0.25;
      } else {
        knifeMesh.rotation.z = 0;
        knifeMesh.position.z = 0;
      }

      // Movement
      const fwd = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw.rotation.y);
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw.rotation.y);
      const wish = new THREE.Vector3();

      if (keys['KeyW']) wish.add(fwd);
      if (keys['KeyS']) wish.sub(fwd);
      if (keys['KeyD']) wish.add(right);
      if (keys['KeyA']) wish.sub(right);

      if (padState.moveY !== 0) wish.addScaledVector(fwd, -padState.moveY);
      if (padState.moveX !== 0) wish.addScaledVector(right, padState.moveX);
      if (wish.lengthSq() > 1) wish.normalize();

      const wpnMult = WEAPONS[currentWpnIdx].speedMult;
      const baseSpeed = (player.ads ? 7.2 : (player.ultActive ? 13.8 : 11.4)) * wpnMult;

      player.vel.x = THREE.MathUtils.lerp(player.vel.x, wish.x * baseSpeed, dt * 12);
      player.vel.z = THREE.MathUtils.lerp(player.vel.z, wish.z * baseSpeed, dt * 12);
      player.vel.y -= 28.0 * dt;

      const nx = playerYaw.position.x + player.vel.x * dt;
      if (!checkCylinderCollision(nx, playerYaw.position.y, playerYaw.position.z, 0.7)) {
        playerYaw.position.x = nx;
      }
      const nz = playerYaw.position.z + player.vel.z * dt;
      if (!checkCylinderCollision(playerYaw.position.x, playerYaw.position.y, nz, 0.7)) {
        playerYaw.position.z = nz;
      }

      playerYaw.position.y += player.vel.y * dt;
      if (playerYaw.position.y <= 2.6) {
        playerYaw.position.y = 2.6;
        player.vel.y = 0;
        player.onGround = true;
      }

      // TPP Walk Animation
      if (player.isTPP && wish.lengthSq() > 0.05 && player.onGround) {
        selfAgent.legL.rotation.x = Math.sin(timeSec * 14) * 0.45;
        selfAgent.legR.rotation.x = -Math.sin(timeSec * 14) * 0.45;
        selfAgent.armL.rotation.x = -Math.sin(timeSec * 14) * 0.35;
        selfAgent.armR.rotation.x = Math.sin(timeSec * 14) * 0.35;
      } else {
        selfAgent.legL.rotation.x = 0;
        selfAgent.legR.rotation.x = 0;
        selfAgent.armL.rotation.x = 0;
        selfAgent.armR.rotation.x = 0;
      }

      // FPP vs TPP Camera Positioning
      const isOperatorScoped = player.ads && WEAPONS[currentWpnIdx].id === 'OPERATOR';
      if (!player.isTPP || isOperatorScoped) {
        camera.position.lerp(new THREE.Vector3(0, 0, 0), dt * 18);
        weaponRoot.position.lerp(player.ads ? fppAdsOffset : fppHipOffset, dt * 16);
      } else {
        const desiredCamLocal = player.ads
          ? new THREE.Vector3(0.75, 0.25, 2.3)
          : new THREE.Vector3(0.95, 0.45, 3.8);

        const headWorld = new THREE.Vector3();
        playerPitch.getWorldPosition(headWorld);
        const camWorldTarget = desiredCamLocal.clone().applyMatrix4(playerPitch.matrixWorld);
        const dirToCam = new THREE.Vector3().subVectors(camWorldTarget, headWorld);
        const maxDist = dirToCam.length();
        dirToCam.normalize();

        const camRay = new THREE.Raycaster(headWorld, dirToCam, 0.1, maxDist);
        const wallHits = camRay.intersectObjects(envMeshes, false);
        if (wallHits.length > 0) {
          const safeDist = Math.max(0.4, wallHits[0].distance - 0.35);
          desiredCamLocal.normalize().multiplyScalar(safeDist);
        }

        camera.position.lerp(desiredCamLocal, dt * 16);
        weaponRoot.position.lerp(tppWeaponOffset, dt * 16);
      }

      let targetFov = 75;
      if (player.ads) {
        if (WEAPONS[currentWpnIdx].id === 'OPERATOR') {
          targetFov = player.sniperZoomLevel === 2 ? 14 : 28;
        } else {
          targetFov = 48;
        }
      }
      if (Math.abs(camera.fov - targetFov) > 0.1) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, dt * 15);
        camera.updateProjectionMatrix();
      }

      if (flashMat.opacity > 0) flashMat.opacity = Math.max(0, flashMat.opacity - dt * 22);

      ['c', 'q', 'e'].forEach(k => {
        const slot = document.getElementById(`slot-${k}`);
        const cdEl = document.getElementById(`cd-${k}`);
        if (player.cds[k] > 0) {
          player.cds[k] = Math.max(0, player.cds[k] - dt);
          slot.classList.remove('ready');
          slot.classList.add('cooldown');
          cdEl.style.display = 'flex';
          cdEl.textContent = Math.ceil(player.cds[k]);
        } else {
          slot.classList.add('ready');
          slot.classList.remove('cooldown');
          cdEl.style.display = 'none';
        }
      });

      if (player.ultActive) {
        player.ultTimer -= dt;
        if (player.ultTimer <= 0) {
          player.ultActive = false;
          document.getElementById('vignette').style.boxShadow = 'none';
        }
        updateHUD();
      }
    }

    // Rockets & Shockwaves
    for (let i = activeRockets.length - 1; i >= 0; i--) {
      const r = activeRockets[i];
      r.life -= dt;
      const stepDist = r.vel.length() * dt;
      const dir = r.vel.clone().normalize();

      const ray = new THREE.Raycaster(r.mesh.position, dir, 0, stepDist + 0.4);
      const targets = [...envMeshes, ...headHitboxes, ...bodyHitboxes];
      if (remoteOpponent.active && r.isLocalOwner) {
        targets.push(remoteOpponent.agent.helmet, ...remoteOpponent.agent.bodyParts);
      }

      const hits = ray.intersectObjects(targets, false);
      if (hits.length > 0 || r.life <= 0) {
        const impactPt = hits.length > 0 ? hits[0].point : r.mesh.position.clone();
        detonateRocket(impactPt, r.isLocalOwner);
        scene.remove(r.mesh);
        activeRockets.splice(i, 1);
      } else {
        r.mesh.position.addScaledVector(r.vel, dt);
        spawnSparks(r.mesh.position, 0xffbe0b, 1);
      }
    }

    for (let i = activeExplosions.length - 1; i >= 0; i--) {
      const ex = activeExplosions[i];
      ex.life -= dt;
      ex.scale += dt * 26;
      ex.mesh.scale.setScalar(ex.scale);
      ex.mat.opacity = Math.max(0, ex.life * 2.2);
      if (ex.life <= 0) {
        scene.remove(ex.mesh);
        ex.mesh.geometry.dispose();
        ex.mat.dispose();
        activeExplosions.splice(i, 1);
      }
    }

    // P2P Sync
    if (p2pConnected && conn && now - netSyncTimer > 33) {
      netSyncTimer = now;
      conn.send({
        type: 'move',
        x: playerYaw.position.x,
        y: playerYaw.position.y,
        z: playerYaw.position.z,
        yaw: playerYaw.rotation.y
      });
    }

    if (remoteOpponent.active) {
      const prevPos = remoteOpponent.agent.root.position.clone();
      remoteOpponent.agent.root.position.lerp(remoteOpponent.targetPos, dt * 15);
      remoteOpponent.agent.root.rotation.y = remoteOpponent.targetYaw;

      if (prevPos.distanceTo(remoteOpponent.agent.root.position) > 0.01) {
        remoteOpponent.agent.legL.rotation.x = Math.sin(timeSec * 14) * 0.45;
        remoteOpponent.agent.legR.rotation.x = -Math.sin(timeSec * 14) * 0.45;
      } else {
        remoteOpponent.agent.legL.rotation.x = 0;
        remoteOpponent.agent.legR.rotation.x = 0;
      }
    }

    // Update Practice Bots in their Fixed Spawn Bays
    if (!p2pConnected) {
      for (let i = 0; i < bots.length; i++) {
        bots[i].update(dt, playerYaw.position);
      }
    }

    for (let i = tracers.length - 1; i >= 0; i--) {
      tracers[i].life -= dt;
      tracers[i].mat.opacity = Math.max(0, tracers[i].life * 7);
      if (tracers[i].life <= 0) {
        scene.remove(tracers[i].line);
        tracers[i].line.geometry.dispose();
        tracers[i].mat.dispose();
        tracers.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      p.vel.y -= 18 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      if (p.life <= 0) {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        particles.splice(i, 1);
      }
    }

    // Project 3D Floating Damage Popups onto 2D HUD
    updateDamagePopups(dt, camera);

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
})();