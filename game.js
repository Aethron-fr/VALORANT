(() => {
  'use strict';

  // ============================================================================
  // 1. SYNTHESIZED TACTICAL WEB AUDIO ENGINE
  // ============================================================================
  class TacticalAudio {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }
    playGunshot(type) {
      if (!this.ctx || this.muted) return;
      const now = this.ctx.currentTime;

      if (type === 'knife') {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.11);
        g.gain.setValueAtTime(0.28, now);
        g.gain.exponentialRampToValueAtTime(0.004, now + 0.12);
        osc.connect(g); g.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.12);
        return;
      }

      const dur = type === 'operator' || type === 'rocket' ? 0.36 : (type === 'phantom' || type === 'spectre' ? 0.08 : 0.14);
      const bufSize = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.28));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = (type === 'phantom' || type === 'spectre') ? 'bandpass' : 'lowpass';
      filter.frequency.setValueAtTime(type === 'operator' ? 950 : (type === 'phantom' ? 1800 : 2400), now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(type === 'operator' ? 0.48 : 0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + dur);

      noise.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
      noise.start(now);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = type === 'odin' ? 'sawtooth' : 'triangle';
      const startFreq = type === 'operator' ? 140 : (type === 'vandal' ? 210 : 250);
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + dur * 0.85);
      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.005, now + dur * 0.85);
      osc.connect(oscGain); oscGain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + dur);
    }

    playReloadSound(stage) {
      if (!this.ctx || this.muted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      if (stage === 'out') {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
      } else if (stage === 'in') {
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.09);
      } else {
        osc.frequency.setValueAtTime(980, now);
        osc.frequency.exponentialRampToValueAtTime(1420, now + 0.06);
      }
      g.gain.setValueAtTime(0.24, now);
      g.gain.exponentialRampToValueAtTime(0.004, now + 0.1);
      osc.connect(g); g.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.11);
    }

    playExplosion() {
      if (!this.ctx || this.muted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(18, now + 0.55);
      g.gain.setValueAtTime(0.7, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
      osc.connect(g); g.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.58);
    }

    playHitmarker(isHeadshot) {
      if (!this.ctx || this.muted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = isHeadshot ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(isHeadshot ? 1380 : 780, now);
      osc.frequency.exponentialRampToValueAtTime(isHeadshot ? 2580 : 420, now + (isHeadshot ? 0.11 : 0.055));
      gain.gain.setValueAtTime(isHeadshot ? 0.3 : 0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + (isHeadshot ? 0.12 : 0.06));
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.13);
    }

    playKillChime(streak) {
      if (!this.ctx || this.muted) return;
      const now = this.ctx.currentTime;
      const baseNotes = [523.25, 587.33, 659.25, 783.99, 1046.50];
      const freq = baseNotes[Math.min(streak - 1, 4)];
      const notes = streak >= 5 ? [freq * 0.5, freq * 0.75, freq, freq * 1.25, freq * 1.5] : [freq * 0.5, freq];
      notes.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.045);
        g.gain.setValueAtTime(0.22, now + idx * 0.045);
        g.gain.exponentialRampToValueAtTime(0.002, now + idx * 0.045 + (streak >= 5 ? 0.85 : 0.42));
        osc.connect(g); g.connect(this.ctx.destination);
        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + (streak >= 5 ? 0.9 : 0.45));
      });
    }

    playAbility(kind) {
      if (!this.ctx || this.muted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      if (kind === 'heal') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.45);
        g.gain.setValueAtTime(0.24, now);
        g.gain.exponentialRampToValueAtTime(0.005, now + 0.5);
      } else if (kind === 'flash') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(920, now);
        osc.frequency.exponentialRampToValueAtTime(2400, now + 0.25);
        g.gain.setValueAtTime(0.24, now);
        g.gain.exponentialRampToValueAtTime(0.005, now + 0.28);
      } else if (kind === 'dash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);
        g.gain.setValueAtTime(0.25, now);
        g.gain.exponentialRampToValueAtTime(0.005, now + 0.24);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.65);
        g.gain.setValueAtTime(0.3, now);
        g.gain.exponentialRampToValueAtTime(0.005, now + 0.7);
      }
      osc.connect(g); g.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.72);
    }
  }

  const audio = new TacticalAudio();

  // ============================================================================
  // 2. COMPLETE WEAPON & AGENT DEFINITIONS
  // ============================================================================
  const WEAPONS = {
    vandal: {
      id: 'vandal', name: 'VANDAL', slot: 1, cost: 2900,
      magSize: 25, reserveMax: 75, fireRate: 9.75, reloadTime: 2.1,
      dmgHead: 160, dmgBody: 40, dmgLeg: 34,
      recoilPitch: 0.015, recoilYaw: 0.007, spread: 0.005,
      auto: true, pellets: 1, zoomFov: 50, desc: '1-TAP HEADSHOT // AUTO',
      colorHex: 0xff4655
    },
    phantom: {
      id: 'phantom', name: 'PHANTOM', slot: 1, cost: 2900,
      magSize: 30, reserveMax: 90, fireRate: 11.0, reloadTime: 2.0,
      dmgHead: 156, dmgBody: 39, dmgLeg: 33,
      recoilPitch: 0.012, recoilYaw: 0.006, spread: 0.0035,
      auto: true, pellets: 1, zoomFov: 50, desc: 'SILENCED // TIGHT SPRAY',
      colorHex: 0x00f5d4
    },
    operator: {
      id: 'operator', name: 'OPERATOR', slot: 1, cost: 4700,
      magSize: 5, reserveMax: 15, fireRate: 0.9, reloadTime: 2.8,
      dmgHead: 255, dmgBody: 150, dmgLeg: 120,
      recoilPitch: 0.055, recoilYaw: 0.01, spread: 0.0002,
      auto: false, pellets: 1, zoomFov: 18, isSniper: true, desc: 'SNIPER // 255 HS / 150 BODY',
      colorHex: 0xf5c542
    },
    odin: {
      id: 'odin', name: 'ODIN MINIGUN', slot: 1, cost: 3200,
      magSize: 100, reserveMax: 200, fireRate: 15.5, reloadTime: 3.0,
      dmgHead: 95, dmgBody: 38, dmgLeg: 30,
      recoilPitch: 0.01, recoilYaw: 0.009, spread: 0.014,
      auto: true, pellets: 1, zoomFov: 54, desc: '100-ROUND ROTARY // HIGH ROF',
      colorHex: 0xff4655
    },
    rocket: {
      id: 'rocket', name: 'SHOWSTOPPER RPG', slot: 1, cost: 3600,
      magSize: 3, reserveMax: 12, fireRate: 1.1, reloadTime: 2.4,
      dmgHead: 185, dmgBody: 185, dmgLeg: 150,
      recoilPitch: 0.045, recoilYaw: 0.01, spread: 0.0,
      auto: false, pellets: 1, zoomFov: 58, isRocket: true, desc: 'EXPLOSIVE SPLASH // 185 DMG',
      colorHex: 0xf5c542
    },
    spectre: {
      id: 'spectre', name: 'SPECTRE', slot: 1, cost: 1600,
      magSize: 30, reserveMax: 90, fireRate: 13.3, reloadTime: 1.8,
      dmgHead: 78, dmgBody: 26, dmgLeg: 22,
      recoilPitch: 0.01, recoilYaw: 0.007, spread: 0.01,
      auto: true, pellets: 1, zoomFov: 55, desc: 'SUPPRESSED SMG // RUN & GUN',
      colorHex: 0x00f5d4
    },
    judge: {
      id: 'judge', name: 'JUDGE', slot: 1, cost: 1850,
      magSize: 7, reserveMax: 28, fireRate: 3.5, reloadTime: 2.1,
      dmgHead: 34, dmgBody: 17, dmgLeg: 14,
      recoilPitch: 0.03, recoilYaw: 0.018, spread: 0.048,
      auto: true, pellets: 8, zoomFov: 60, desc: 'AUTO SHOTGUN // 8 PELLETS',
      colorHex: 0xf5c542
    },
    sheriff: {
      id: 'sheriff', name: 'SHERIFF', slot: 2, cost: 800,
      magSize: 6, reserveMax: 24, fireRate: 4.0, reloadTime: 1.9,
      dmgHead: 159, dmgBody: 55, dmgLeg: 46,
      recoilPitch: 0.035, recoilYaw: 0.008, spread: 0.0025,
      auto: false, pellets: 1, zoomFov: 56, desc: 'HEAVY REVOLVER // 159 HS',
      colorHex: 0xf5c542
    },
    classic: {
      id: 'classic', name: 'CLASSIC', slot: 2, cost: 0,
      magSize: 12, reserveMax: 36, fireRate: 6.75, reloadTime: 1.6,
      dmgHead: 78, dmgBody: 26, dmgLeg: 22,
      recoilPitch: 0.011, recoilYaw: 0.005, spread: 0.007,
      auto: false, pellets: 1, zoomFov: 58, desc: 'TACTICAL SIDEARM // SEMI',
      colorHex: 0x00f5d4
    },
    knife: {
      id: 'knife', name: 'RADIANITE KARAMBIT', slot: 3, cost: 0,
      magSize: 1, reserveMax: 1, fireRate: 2.4, reloadTime: 0,
      dmgHead: 150, dmgBody: 75, dmgLeg: 75,
      recoilPitch: 0, recoilYaw: 0, spread: 0,
      auto: false, pellets: 1, isMelee: true, range: 4.2, zoomFov: 72, desc: 'MELEE // +25% SPRINT BOOST',
      colorHex: 0x9d4edd
    }
  };

  const AGENTS = {
    vex: {
      name: 'VEX', role: 'DUELIST',
      c: { name: 'BIO-SURGE HEAL', icon: '✚', max: 2 },
      q: { name: 'CURVE FLASH', icon: '✦', max: 2 },
      e: { name: 'TAILWIND DASH', icon: '⚡', max: 2 },
      x: { name: 'EMPRESS ULT', icon: '♛', max: 6 }
    },
    sage: {
      name: 'SAGE-09', role: 'SENTINEL',
      c: { name: 'VITALITY ORB', icon: '✚', max: 2 },
      q: { name: 'CRYO SLOW ORB', icon: '❄', max: 2 },
      e: { name: 'BARRIER WALL', icon: '🧱', max: 1 },
      x: { name: 'AEGIS TURRET', icon: '🛡', max: 6 }
    },
    sova: {
      name: 'SOVA-X', role: 'INITIATOR',
      c: { name: 'NANO-STIM HEAL', icon: '✚', max: 2 },
      q: { name: 'SHOCK BOLT', icon: '⚡', max: 2 },
      e: { name: 'RECON SONAR', icon: '◎', max: 2 },
      x: { name: 'HUNTERS FURY', icon: '☄', max: 6 }
    }
  };

  // ============================================================================
  // 3. THREE.JS 3D SCENE, PBR MATERIALS & ARTICULATED HUMANOID BUILDER
  // ============================================================================
  const viewport = document.getElementById('gl-viewport');
  const fxCanvas = document.getElementById('fx-canvas');
  const fxCtx = fxCanvas.getContext('2d');
  const radarCanvas = document.getElementById('radar-canvas');
  const radarCtx = radarCanvas.getContext('2d');
  const fpsGraphCanvas = document.getElementById('fps-graph');
  const fpsGraphCtx = fpsGraphCanvas.getContext('2d');
  const dmgLayer = document.getElementById('dmg-layer');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080d14);
  scene.fog = new THREE.FogExp2(0x080d14, 0.0095);

  const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.05, 220);
  const playerYaw = new THREE.Object3D();
  const playerPitch = new THREE.Object3D();
  playerYaw.add(playerPitch);
  playerPitch.add(camera);
  scene.add(playerYaw);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  viewport.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xdbe8ff, 0x101824, 0.78));
  const dirLight = new THREE.DirectionalLight(0xfff4e2, 0.92);
  dirLight.position.set(30, 65, 40);
  scene.add(dirLight);

  function createGridTexture(bgHex, lineHex) {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = bgHex; ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = lineHex; ctx.lineWidth = 4; ctx.strokeRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  const floorTex = createGridTexture('#111822', '#1d2b3c');
  floorTex.repeat.set(38, 38);
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 84),
    new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.75, metalness: 0.15 })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  scene.add(floorMesh);

  // A-Site Glowing Plant Zone Pad
  const sitePad = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 14),
    new THREE.MeshBasicMaterial({ color: 0xff4655, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
  );
  sitePad.rotation.x = -Math.PI / 2;
  sitePad.position.set(0, 0.03, -17);
  scene.add(sitePad);

  // Static Map Geometry (Used by Three.js 3D Meshes, Line-of-Sight Raycaster & Collisions)
  const STATIC_MAP_BOXES = [
    { x: 0, y: 4.5, z: -38, w: 68, h: 9, d: 1.5, color: 0x1c2532, type: 'wall' },
    { x: 0, y: 4.5, z: 38,  w: 68, h: 9, d: 1.5, color: 0x1c2532, type: 'wall' },
    { x: -34, y: 4.5, z: 0, w: 1.5, h: 9, d: 76, color: 0x1c2532, type: 'wall' },
    { x: 34, y: 4.5, z: 0,  w: 1.5, h: 9, d: 76, color: 0x1c2532, type: 'wall' },

    // A-Site Central Radianite Reactor
    { x: 0, y: 2.6, z: -18, w: 4.2, h: 5.2, d: 4.2, color: 0x124e47, type: 'radianite' },
    { x: 0, y: 5.4, z: -18, w: 4.6, h: 0.4, d: 4.6, color: 0x00f5d4, type: 'neon' },

    // Radianite Crates on A-Site
    { x: -7.5, y: 1.15, z: -16, w: 2.3, h: 2.3, d: 2.3, color: 0x165b50, type: 'crate' },
    { x: -7.5, y: 3.1, z: -16,  w: 1.8, h: 1.6, d: 1.8, color: 0x1d7063, type: 'crate' },
    { x: 7.5, y: 1.15, z: -15,  w: 2.4, h: 2.3, d: 4.2, color: 0xc85a28, type: 'crate' },

    // Heaven Overlook Platform
    { x: 0, y: 1.6, z: -31, w: 20, h: 3.2, d: 8, color: 0x232e3c, type: 'wall' },
    { x: -5.5, y: 3.75, z: -27.2, w: 6.5, h: 1.1, d: 0.5, color: 0xff4655, type: 'wall' },
    { x: 5.5,  y: 3.75, z: -27.2, w: 6.5, h: 1.1, d: 0.5, color: 0xff4655, type: 'wall' },

    // Mid Courtyard Divider Walls
    { x: -13, y: 3.2, z: -3, w: 10, h: 6.4, d: 2.2, color: 0x263242, type: 'wall' },
    { x: 13,  y: 3.2, z: -3, w: 10, h: 6.4, d: 2.2, color: 0x263242, type: 'wall' },

    // Mid Courtyard Cover
    { x: 0, y: 1.3, z: 2, w: 3.4, h: 2.6, d: 3.4, color: 0x2a3748, type: 'wall' },
    { x: -19, y: 1.2, z: 5, w: 2.6, h: 2.4, d: 2.6, color: 0x165b50, type: 'crate' },
    { x: 19,  y: 1.2, z: 5, w: 2.6, h: 2.4, d: 2.6, color: 0xc85a28, type: 'crate' },

    // Attacker Approach Cover
    { x: -10, y: 2.5, z: 16, w: 7.5, h: 5.0, d: 2.0, color: 0x222d3b, type: 'wall' },
    { x: 10,  y: 2.5, z: 16, w: 7.5, h: 5.0, d: 2.0, color: 0x222d3b, type: 'wall' },
    { x: 0,   y: 1.0, z: 23, w: 4.5, h: 2.0, d: 1.6, color: 0x2f3b4c, type: 'crate' }
  ];

  const envMeshes = [floorMesh];
  STATIC_MAP_BOXES.forEach(b => {
    const mat = new THREE.MeshStandardMaterial({
      color: b.color,
      roughness: b.type === 'neon' ? 0.1 : 0.55,
      metalness: 0.35,
      emissive: b.type === 'neon' ? b.color : 0x000000,
      emissiveIntensity: b.type === 'neon' ? 0.6 : 0
    });
    const m = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), mat);
    m.position.set(b.x, b.y, b.z);
    m.updateMatrixWorld();
    scene.add(m);
    envMeshes.push(m);
  });

  // Articulated Humanoid Agent Builder
  function createArticulatedAgent(primaryHex, accentHex, visorHex, userDataTag, withHpBar = true) {
    const root = new THREE.Group();
    const armorMat = new THREE.MeshStandardMaterial({ color: primaryHex, roughness: 0.32, metalness: 0.6 });
    const jointMat = new THREE.MeshStandardMaterial({ color: 0x12171f, roughness: 0.6 });
    const accentMat = new THREE.MeshStandardMaterial({ color: accentHex, emissive: accentHex, emissiveIntensity: 0.3 });
    const visorMat = new THREE.MeshBasicMaterial({ color: visorHex });

    const hitParts = [];

    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.24, 10), jointMat);
    pelvis.position.y = 0.78;
    root.add(pelvis);
    hitParts.push({ mesh: pelvis, part: 'body' });

    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.28, 0.66, 10), armorMat);
    chest.position.y = 1.22;
    root.add(chest);
    hitParts.push({ mesh: chest, part: 'body' });

    const core = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.44), accentMat);
    core.position.y = 1.26;
    root.add(core);

    const headGroup = new THREE.Group();
    headGroup.position.y = 1.76;
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 14), armorMat);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.28), visorMat);
    visor.position.set(0, 0.02, 0.12);
    headGroup.add(helmet, visor);
    root.add(headGroup);
    hitParts.push({ mesh: helmet, part: 'head' }, { mesh: visor, part: 'head' });

    function makeLimb(xOff, yOff, rTop, rBot, len, mat, partName) {
      const pivot = new THREE.Group();
      pivot.position.set(xOff, yOff, 0);
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, len, 8), mat);
      mesh.position.y = -len * 0.5;
      pivot.add(mesh);
      hitParts.push({ mesh, part: partName });
      return pivot;
    }

    const armL = makeLimb(-0.44, 1.48, 0.09, 0.075, 0.62, armorMat, 'body');
    const armR = makeLimb(0.44, 1.48, 0.09, 0.075, 0.62, armorMat, 'body');
    const legL = makeLimb(-0.16, 0.68, 0.12, 0.09, 0.68, jointMat, 'leg');
    const legR = makeLimb(0.16, 0.68, 0.12, 0.09, 0.68, jointMat, 'leg');
    root.add(armL, armR, legL, legR);

    let hbFill = null;
    if (withHpBar) {
      const hbBg = new THREE.Mesh(
        new THREE.PlaneGeometry(0.95, 0.11),
        new THREE.MeshBasicMaterial({ color: 0x070b10, side: THREE.DoubleSide })
      );
      hbBg.position.y = 2.25;
      root.add(hbBg);

      hbFill = new THREE.Mesh(
        new THREE.PlaneGeometry(0.9, 0.07),
        new THREE.MeshBasicMaterial({ color: 0xff4655, side: THREE.DoubleSide })
      );
      hbFill.position.set(0, 2.25, 0.01);
      root.add(hbFill);
    }

    if (userDataTag) {
      hitParts.forEach(hp => {
        hp.mesh.userData = { ...userDataTag, part: hp.part };
      });
    }

    return { root, helmet, chest, armL, armR, legL, legR, hbFill, hitParts };
  }

  const selfAgent = createArticulatedAgent(0x1b2634, 0xff4655, 0x00f5d4, null, false);
  selfAgent.root.visible = false;
  playerYaw.add(selfAgent.root);

  // ============================================================================
  // 4. BESPOKE 3D MULTI-PART WEAPON MODELS (EVERY GUN HAS ITS OWN SCULPTED SHAPE!)
  // ============================================================================
  const weaponRig = new THREE.Group();
  playerPitch.add(weaponRig);

  const matGunDark = new THREE.MeshStandardMaterial({ color: 0x161c24, metalness: 0.82, roughness: 0.24 });
  const matGunSteel = new THREE.MeshStandardMaterial({ color: 0x2c3746, metalness: 0.88, roughness: 0.18 });
  const matGunGrip = new THREE.MeshStandardMaterial({ color: 0x0e1217, roughness: 0.85, metalness: 0.1 });
  const matCyanGlow = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
  const matRedGlow = new THREE.MeshBasicMaterial({ color: 0xff4655 });
  const matGoldGlow = new THREE.MeshBasicMaterial({ color: 0xf5c542 });
  const matPurpleGlow = new THREE.MeshBasicMaterial({ color: 0x9d4edd });

  const weaponModels = {};
  let activeMagMesh = null;
  let activeBoltMesh = null;
  let odinBarrelsPivot = null;

  // Helper to build common ergonomic Pistol Grip & Trigger Guard
  function addErgonomicGripAndStock(group, hasStock = true, stockLen = 0.24) {
    // Angled Pistol Grip
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.15, 0.065), matGunGrip);
    grip.position.set(0, -0.1, 0.14);
    grip.rotation.x = 0.28;
    group.add(grip);

    // Trigger Guard
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.08), matGunSteel);
    guard.position.set(0, -0.065, 0.07);
    group.add(guard);

    if (hasStock) {
      // Tactical Buttstock + Cheek Rest + Rubber Pad
      const stockMain = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.09, stockLen), matGunDark);
      stockMain.position.set(0, -0.015, 0.22 + stockLen * 0.5);
      const stockPad = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.13, 0.03), matGunGrip);
      stockPad.position.set(0, -0.025, 0.22 + stockLen);
      group.add(stockMain, stockPad);
    }
  }

  // 1. VANDAL (AK-47 / Sci-Fi Heavy Rifle: Angled Gas Tube, Curved Banana Mag, Holo Sight, Muzzle Brake)
  function buildVandal3D() {
    const g = new THREE.Group();
    addErgonomicGripAndStock(g, true, 0.24);

    // Upper & Lower Receiver
    const rec = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.105, 0.34), matGunDark);
    rec.position.set(0, 0.02, 0.02);
    const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.082, 0.26), matGunSteel);
    handguard.position.set(0, 0.018, -0.26);
    g.add(rec, handguard);

    // Precision Rifle Barrel & Gas Tube
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.017, 0.36, 12), matGunSteel);
    barrel.rotation.x = Math.PI / 2; barrel.position.set(0, 0.02, -0.5);
    const gasTube = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.28, 10), matGunDark);
    gasTube.rotation.x = Math.PI / 2; gasTube.position.set(0, 0.055, -0.32);
    const gasBlock = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.055, 0.04), matGunSteel);
    gasBlock.position.set(0, 0.038, -0.45);
    const brake = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.065, 8), matRedGlow);
    brake.rotation.x = Math.PI / 2; brake.position.set(0, 0.02, -0.69);
    g.add(barrel, gasTube, gasBlock, brake);

    // Radianite Red Trim Strip & Holo Sight
    const neon = new THREE.Mesh(new THREE.BoxGeometry(0.076, 0.014, 0.38), matRedGlow);
    neon.position.set(0, 0.045, -0.08);
    const sightHood = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.045, 0.08), matGunSteel);
    sightHood.position.set(0, 0.09, 0.03);
    g.add(neon, sightHood);

    // Detachable Curved Magazine
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.23, 0.085), matGunSteel);
    mag.position.set(0, -0.13, -0.07);
    mag.rotation.x = 0.26;
    const magTrim = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.025, 0.09), matRedGlow);
    magTrim.position.y = -0.105;
    mag.add(magTrim);
    g.add(mag);

    // Charging Bolt
    const bolt = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.018, 0.05), matGoldGlow);
    bolt.position.set(-0.045, 0.045, 0.02);
    g.add(bolt);

    g.userData = { mag, bolt, muzzleZ: -0.74 };
    return g;
  }

  // 2. PHANTOM (Integrated Long Cylindrical Suppressor, Sleek Bullpup-Style Receiver, Cyan Glow)
  function buildPhantom3D() {
    const g = new THREE.Group();
    addErgonomicGripAndStock(g, true, 0.22);

    const rec = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.1, 0.38), matGunSteel);
    rec.position.set(0, 0.02, -0.02);
    // Integrated Fat Silencer Tube
    const suppressor = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.44, 16), matGunDark);
    suppressor.rotation.x = Math.PI / 2;
    suppressor.position.set(0, 0.022, -0.42);
    const supRing = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.025, 16), matCyanGlow);
    supRing.rotation.x = Math.PI / 2;
    supRing.position.set(0, 0.022, -0.61);

    const neon = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.015, 0.42), matCyanGlow);
    neon.position.set(0, 0.045, -0.06);

    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.22, 0.075), matGunDark);
    mag.position.set(0, -0.13, -0.05);
    mag.rotation.x = 0.12;
    const bolt = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.016, 0.045), matCyanGlow);
    bolt.position.set(-0.042, 0.045, 0.0);

    g.add(rec, suppressor, supRing, neon, mag, bolt);
    g.userData = { mag, bolt, muzzleZ: -0.66 };
    return g;
  }

  // 3. OPERATOR SNIPER (Massive .50-Cal Fluted Barrel, Dual-Lens Scope, Bipod, Heavy Muzzle Brake)
  function buildOperator3D() {
    const g = new THREE.Group();
    addErgonomicGripAndStock(g, true, 0.28);

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.12, 0.52), matGunDark);
    chassis.position.set(0, 0.025, -0.06);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.024, 0.72, 12), matGunSteel);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.03, -0.66);

    const brake = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.048, 0.11), matGoldGlow);
    brake.position.set(0, 0.03, -1.04);

    // Dual-Cone Sniper Scope Assembly + Mount Rings
    const scopeMount1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.03), matGunSteel);
    scopeMount1.position.set(0, 0.1, 0.04);
    const scopeMount2 = scopeMount1.clone();
    scopeMount2.position.set(0, 0.1, -0.14);

    const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.022, 0.34, 14), matGunDark);
    scopeTube.rotation.x = Math.PI / 2;
    scopeTube.position.set(0, 0.135, -0.05);
    const scopeBell = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.026, 0.09, 14), matGunSteel);
    scopeBell.rotation.x = Math.PI / 2;
    scopeBell.position.set(0, 0.135, -0.25);
    const scopeLens = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.01, 14), matCyanGlow);
    scopeLens.rotation.x = Math.PI / 2;
    scopeLens.position.set(0, 0.135, -0.295);

    // Folded Tactical Bipod Legs
    const bipodL = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.22, 6), matGunSteel);
    bipodL.rotation.x = Math.PI / 2;
    bipodL.position.set(-0.035, -0.035, -0.38);
    const bipodR = bipodL.clone();
    bipodR.position.x = 0.035;

    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.15, 0.13), matGunSteel);
    mag.position.set(0, -0.09, -0.08);
    const bolt = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), matGoldGlow);
    bolt.position.set(0.055, 0.04, 0.06);

    g.add(chassis, barrel, brake, scopeMount1, scopeMount2, scopeTube, scopeBell, scopeLens, bipodL, bipodR, mag, bolt);
    g.userData = { mag, bolt, muzzleZ: -1.1 };
    return g;
  }

  // 4. ODIN MINIGUN (Rotary 6-Barrel Cluster, Heavy Box Drum Mag, Top Chainsaw Carry Handle)
  function buildOdin3D() {
    const g = new THREE.Group();
    addErgonomicGripAndStock(g, true, 0.2);

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.15, 0.44), matGunDark);
    body.position.set(0, 0.01, -0.04);

    // Top Chainsaw Carry Handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.022, 0.04), matGunSteel);
    handle.position.set(0, 0.12, -0.14);

    // Spinning 6-Barrel Gatling Cluster
    const rotor = new THREE.Group();
    rotor.position.set(0, 0.01, -0.46);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.48, 8), matGunSteel);
      b.rotation.x = Math.PI / 2;
      b.position.set(Math.cos(a) * 0.042, Math.sin(a) * 0.042, 0);
      rotor.add(b);
    }
    const clamp1 = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.03, 14), matRedGlow);
    clamp1.rotation.x = Math.PI / 2; clamp1.position.z = -0.16;
    const clamp2 = clamp1.clone(); clamp2.position.z = 0.1;
    rotor.add(clamp1, clamp2);
    odinBarrelsPivot = rotor;

    // Heavy Box Drum Magazine
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.16), matGoldGlow);
    mag.position.set(0, -0.14, -0.06);
    const bolt = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.025, 0.06), matRedGlow);
    bolt.position.set(-0.08, 0.04, 0.02);

    g.add(body, handle, rotor, mag, bolt);
    g.userData = { mag, bolt, muzzleZ: -0.74 };
    return g;
  }

  // 5. SHOWSTOPPER ROCKET LAUNCHER (Shoulder Launch Tube, Venturi Exhaust Cone, Protruding Warhead)
  function buildRocket3D() {
    const g = new THREE.Group();
    addErgonomicGripAndStock(g, false);

    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.88, 16), matGunDark);
    tube.rotation.x = Math.PI / 2;
    tube.position.set(0, 0.05, -0.12);

    const collarFront = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.082, 0.12, 16), matGoldGlow);
    collarFront.rotation.x = Math.PI / 2;
    collarFront.position.set(0, 0.05, -0.52);

    const venturiRear = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.105, 0.18, 16), matRedGlow);
    venturiRear.rotation.x = Math.PI / 2;
    venturiRear.position.set(0, 0.05, 0.36);

    // Detachable Warhead (Moves out & in during reload!)
    const warhead = new THREE.Group();
    const wBody = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.22, 12), matGoldGlow);
    wBody.rotation.x = Math.PI / 2;
    const wTip = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.22, 12), matRedGlow);
    wTip.rotation.x = -Math.PI / 2;
    wTip.position.z = -0.2;
    warhead.add(wBody, wTip);
    warhead.position.set(0, 0.05, -0.58);

    const bolt = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.08), matCyanGlow);
    bolt.position.set(-0.08, 0.08, -0.15);

    g.add(tube, collarFront, venturiRear, warhead, bolt);
    g.userData = { mag: warhead, bolt, muzzleZ: -0.82 };
    return g;
  }

  // 6. SPECTRE SMG (Compact Receiver, Fat Integrally Suppressed Barrel, Extended Vertical Mag)
  function buildSpectre3D() {
    const g = new THREE.Group();
    addErgonomicGripAndStock(g, true, 0.16);

    const rec = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.095, 0.26), matGunDark);
    rec.position.set(0, 0.02, 0.0);
    const silencer = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.28, 14), matGunSteel);
    silencer.rotation.x = Math.PI / 2;
    silencer.position.set(0, 0.02, -0.26);
    const neon = new THREE.Mesh(new THREE.BoxGeometry(0.066, 0.012, 0.24), matCyanGlow);
    neon.position.set(0, 0.04, 0.0);

    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.24, 0.048), matGunSteel);
    mag.position.set(0, -0.14, -0.06);
    const bolt = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.015, 0.04), matCyanGlow);
    bolt.position.set(-0.038, 0.04, -0.02);

    g.add(rec, silencer, neon, mag, bolt);
    g.userData = { mag, bolt, muzzleZ: -0.44 };
    return g;
  }

  // 7. JUDGE AUTO-SHOTGUN (Heavy Twin-Tube Barrel, Round Drum Magazine)
  function buildJudge3D() {
    const g = new THREE.Group();
    addErgonomicGripAndStock(g, true, 0.2);

    const rec = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.11, 0.34), matGunDark);
    rec.position.set(0, 0.02, -0.02);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.36, 12), matGunSteel);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.03, -0.35);

    // Cylindrical Drum Magazine
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.09, 16), matGoldGlow);
    drum.rotation.x = Math.PI / 2;
    drum.position.set(0, -0.1, -0.08);
    const bolt = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.02, 0.06), matRedGlow);
    bolt.position.set(0.05, 0.04, 0.0);

    g.add(rec, barrel, drum, bolt);
    g.userData = { mag: drum, bolt, muzzleZ: -0.56 };
    return g;
  }

  // 8. SHERIFF REVOLVER (Long Heavy Octagonal Slab Barrel, Revolving 6-Shot Cylinder, Hammer)
  function buildSheriff3D() {
    const g = new THREE.Group();
    addErgonomicGripAndStock(g, false);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.08, 0.18), matGunSteel);
    frame.position.set(0, 0.01, 0.06);
    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.068, 0.28), matGunSteel);
    barrel.position.set(0, 0.025, -0.16);
    const neon = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.012, 0.26), matGoldGlow);
    neon.position.set(0, 0.045, -0.16);

    // Revolving 6-Chamber Cylinder (Swings out on reload!)
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.085, 8), matRedGlow);
    cyl.rotation.x = Math.PI / 2;
    cyl.position.set(0, 0.015, 0.04);

    const hammer = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.035, 0.03), matGoldGlow);
    hammer.position.set(0, 0.06, 0.15);

    g.add(frame, barrel, neon, cyl, hammer);
    g.userData = { mag: cyl, bolt: hammer, muzzleZ: -0.34 };
    return g;
  }

  // 9. CLASSIC PISTOL (Tactical Compact Sidearm, Slide & Grip Mag)
  function buildClassic3D() {
    const g = new THREE.Group();
    addErgonomicGripAndStock(g, false);

    const slide = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.068, 0.26), matGunDark);
    slide.position.set(0, 0.025, 0.02);
    const neon = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.012, 0.2), matCyanGlow);
    neon.position.set(0, 0.035, 0.01);

    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.14, 0.05), matCyanGlow);
    mag.position.set(0, -0.11, 0.14);
    mag.rotation.x = 0.28;

    g.add(slide, neon, mag);
    g.userData = { mag, bolt: slide, muzzleZ: -0.14 };
    return g;
  }

  // 10. REAVER KARAMBIT KNIFE (Finger Ring, Curved Ergonomic Handle, Glowing Claw Blade)
  function buildKnife3D() {
    const g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.009, 10, 20), matPurpleGlow);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.13, 10), matGunDark);
    handle.position.set(0, 0.08, -0.01);
    handle.rotation.x = -0.2;

    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.034, 0.22, 4), matCyanGlow);
    blade.position.set(0, 0.2, -0.07);
    blade.rotation.x = -0.75;

    g.add(ring, handle, blade);
    g.userData = { mag: null, bolt: null, muzzleZ: -0.2 };
    return g;
  }

  weaponModels.vandal = buildVandal3D();
  weaponModels.phantom = buildPhantom3D();
  weaponModels.operator = buildOperator3D();
  weaponModels.odin = buildOdin3D();
  weaponModels.rocket = buildRocket3D();
  weaponModels.spectre = buildSpectre3D();
  weaponModels.judge = buildJudge3D();
  weaponModels.sheriff = buildSheriff3D();
  weaponModels.classic = buildClassic3D();
  weaponModels.knife = buildKnife3D();

  Object.values(weaponModels).forEach(m => {
    m.visible = false;
    weaponRig.add(m);
  });

  // Muzzle Flash Cone
  const flashMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0 });
  const muzzleFlash = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.28, 6), flashMat);
  muzzleFlash.rotation.x = -Math.PI / 2;
  weaponRig.add(muzzleFlash);

  const fppHipPos = new THREE.Vector3(0.26, -0.22, -0.46);
  const fppAdsPos = new THREE.Vector3(0.0, -0.16, -0.34);
  const tppWpnPos = new THREE.Vector3(0.48, -0.35, -0.3);
  weaponRig.position.copy(fppHipPos);

  function updateWeapon3DAppearance() {
    const wpn = getCurrentWeapon();
    Object.keys(weaponModels).forEach(k => {
      weaponModels[k].visible = (k === wpn.id);
    });
    const activeGroup = weaponModels[wpn.id];
    if (activeGroup) {
      activeMagMesh = activeGroup.userData.mag;
      activeBoltMesh = activeGroup.userData.bolt;
      if (activeMagMesh && !activeMagMesh.userData.homeY) {
        activeMagMesh.userData.homeY = activeMagMesh.position.y;
        activeMagMesh.userData.homeX = activeMagMesh.position.x;
      }
      if (activeBoltMesh && activeBoltMesh.userData.homeZ === undefined) {
        activeBoltMesh.userData.homeZ = activeBoltMesh.position.z;
      }
      muzzleFlash.position.set(0, 0.03, activeGroup.userData.muzzleZ || -0.7);
      flashMat.color.setHex(wpn.colorHex || 0x00f5d4);
    }
  }

  // ============================================================================
  // 5. GAME STATE & FLOATING DAMAGE POPUPS
  // ============================================================================
  const state = {
    running: false,
    paused: true,
    agentId: 'vex',
    gameMode: 'tactical',
    botDifficulty: 1.0,
    sensitivity: 4.5,
    turboFpsMode: true,
    isTPP: false,

    scoreAlly: 0,
    scoreEnemy: 0,
    roundNumber: 1,
    roundTimeLeft: 100,
    roundPhase: 'COMBAT PHASE',
    spike: {
      planted: false,
      x: 0, y: 0, z: -15,
      timer: 45.0,
      plantProgress: 0
    },

    player: {
      x: 0, y: 0, z: 28,
      vx: 0, vy: 0, vz: 0,
      yaw: 0, pitch: 0,
      hp: 100, maxHp: 100,
      shield: 50, maxShield: 50,
      credits: 4500,
      grounded: true,
      crouching: false,
      walking: false,
      ads: false,
      fov: 72,
      currentFov: 72,
      speedBoostTimer: 0,

      primary: 'vandal',
      secondary: 'classic',
      activeSlot: 1,
      ammo: {},
      fireCooldown: 0,
      reloading: false,
      reloadTimer: 0,
      reloadTotal: 2.1,
      reloadStageMask: 0,
      inspectTimer: 0,
      recoilOffsetPitch: 0,
      recoilOffsetYaw: 0,
      muzzleFlashTimer: 0,
      bobPhase: 0,

      charges: { c: 2, q: 2, e: 2, x: 4 },
      healingTimer: 0,
      ultActiveTimer: 0,
      huntersFuryShots: 0,
      roundKills: 0,
      totalKills: 0,
      hitmarkerTimer: 0,
      hitmarkerHeadshot: false
    },

    bots: []
  };

  Object.keys(WEAPONS).forEach(k => {
    state.player.ammo[k] = { mag: WEAPONS[k].magSize, res: WEAPONS[k].reserveMax };
  });

  const activePopups = [];
  function spawnDamagePopup(wx, wy, wz, text, isHeadshot) {
    const el = document.createElement('div');
    el.className = 'dmg-popup' + (isHeadshot ? ' headshot' : '');
    el.textContent = text;
    dmgLayer.appendChild(el);
    activePopups.push({
      el,
      pos: new THREE.Vector3(wx + (Math.random() - 0.5) * 0.35, wy, wz),
      life: 0.85,
      maxLife: 0.85
    });
  }

  function updateDamagePopups(dt) {
    const hw = window.innerWidth * 0.5;
    const hh = window.innerHeight * 0.5;
    for (let i = activePopups.length - 1; i >= 0; i--) {
      const p = activePopups[i];
      p.life -= dt;
      if (p.life <= 0) {
        p.el.remove();
        activePopups.splice(i, 1);
        continue;
      }
      p.pos.y += dt * 1.6;
      const proj = p.pos.clone().project(camera);
      if (proj.z > 1) {
        p.el.style.display = 'none';
        continue;
      }
      p.el.style.display = 'block';
      p.el.style.left = `${proj.x * hw + hw}px`;
      p.el.style.top = `${-proj.y * hh + hh}px`;
      p.el.style.opacity = (p.life / p.maxLife).toFixed(2);
    }
  }

  // ============================================================================
  // 6. P2P WEBRTC 1V1 MULTIPLAYER ENGINE
  // ============================================================================
  let peer = null;
  let conn = null;
  let p2pConnected = false;
  let isHostPlayer = true;
  let lastDeathId = null;

  const remoteRival = {
    agent: createArticulatedAgent(0x282018, 0xf5c542, 0xff4655, { isRemoteRival: true }, true),
    active: false,
    targetPos: new THREE.Vector3(0, 0, -32),
    targetYaw: 0
  };
  remoteRival.agent.root.position.set(0, -100, 0);
  scene.add(remoteRival.agent.root);

  function bindP2PConnection(c, asHost) {
    conn = c;
    isHostPlayer = asHost;
    conn.on('open', () => {
      p2pConnected = true;
      remoteRival.active = true;
      document.getElementById('p2p-status-txt').textContent = 'CONNECTED! CLICK LOCK IN & DEPLOY FOR 1V1 ARENA DUEL!';
      document.getElementById('p2p-status-txt').style.color = '#00f5d4';
      document.getElementById('net-status-tag').textContent = 'P2P 1V1 LIVE';
      startNewRound(true);
    });

    conn.on('data', (data) => {
      if (data.type === 'move') {
        remoteRival.targetPos.set(data.x, data.y, data.z);
        remoteRival.targetYaw = data.yaw;
      } else if (data.type === 'tracer') {
        spawn3DTracer(
          new THREE.Vector3(data.sx, data.sy, data.sz),
          new THREE.Vector3(data.ex, data.ey, data.ez),
          data.colorHex
        );
      } else if (data.type === 'hit') {
        applyPlayerDamage(data.dmg, { name: 'RIVAL (P2P)' }, data.wpnName, data.isHead);
      } else if (data.type === 'kill_confirm') {
        if (data.deathId && data.deathId !== lastDeathId) {
          lastDeathId = data.deathId;
          state.scoreAlly++;
          state.player.roundKills++;
          audio.playKillChime(state.player.roundKills);
          triggerKillMedal(state.player.roundKills);
          addKillFeed('YOU', 'RIVAL (P2P)', data.wpnName || 'VANDAL', data.isHead);
          showAnnouncement('ROUND WON // RIVAL ELIMINATED', `SCORE: ${state.scoreAlly} - ${state.scoreEnemy}`);
          setTimeout(() => startNewRound(false), 2200);
        }
      }
    });
  }

  document.getElementById('btn-host-p2p').addEventListener('click', () => {
    const code = 'VALO-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    document.getElementById('p2p-status-txt').textContent = 'GENERATING P2P ROOM...';
    if (peer) peer.destroy();
    peer = new Peer(code);
    peer.on('open', (id) => {
      document.getElementById('p2p-host-code').value = id;
      document.getElementById('p2p-status-txt').textContent = `SHARE CODE [${id}] WITH YOUR FRIEND`;
    });
    peer.on('connection', (c) => bindP2PConnection(c, true));
  });

  document.getElementById('btn-copy-p2p').addEventListener('click', () => {
    const val = document.getElementById('p2p-host-code').value;
    if (val) navigator.clipboard.writeText(val);
  });

  document.getElementById('btn-join-p2p').addEventListener('click', () => {
    const code = document.getElementById('p2p-join-code').value.trim().toUpperCase();
    if (!code) return;
    document.getElementById('p2p-status-txt').textContent = `CONNECTING TO ${code}...`;
    if (peer) peer.destroy();
    peer = new Peer();
    peer.on('open', () => {
      const c = peer.connect(code);
      bindP2PConnection(c, false);
    });
  });

  // ============================================================================
  // 7. INPUT HANDLING (KEYBOARD, MOUSE & PC GAMEPAD CONTROLLER)
  // ============================================================================
  const keys = {};
  let mouseDownLeft = false;
  const prevPadBtns = {};

  function toggleFppTpp() {
    state.isTPP = !state.isTPP;
    selfAgent.root.visible = state.isTPP && !(state.player.ads && getCurrentWeapon().isSniper);
    document.getElementById('cam-label').textContent = state.isTPP ? 'TPP' : 'FPP';
    showAnnouncement(state.isTPP ? 'THIRD-PERSON VIEW [TPP]' : 'FIRST-PERSON VIEW [FPP]', 'PRESS [V] TO SWITCH');
  }

  window.addEventListener('keydown', (e) => {
    const code = e.code;
    keys[code] = true;

    if (code === 'KeyB') { e.preventDefault(); toggleBuyMenu(); return; }
    if (code === 'KeyM') { e.preventDefault(); openStartMenu(); return; }
    if (!state.running || state.paused) return;

    if (code === 'KeyV') toggleFppTpp();
    if (code === 'Digit1') switchWeaponSlot(1);
    if (code === 'Digit2') switchWeaponSlot(2);
    if (code === 'Digit3') switchWeaponSlot(3);
    if (code === 'KeyR') startReload();
    if (code === 'KeyF') { state.player.inspectTimer = 1.4; }
    if (code === 'KeyC') castAbilityC();
    if (code === 'KeyQ') castAbilityQ();
    if (code === 'KeyE') castAbilityE();
    if (code === 'KeyX') castAbilityX();
  });

  window.addEventListener('keyup', (e) => { keys[e.code] = false; });

  viewport.addEventListener('mousedown', (e) => {
    if (state.paused) return;
    if (document.pointerLockElement !== viewport) viewport.requestPointerLock();
    if (e.button === 0) {
      mouseDownLeft = true;
      tryFireWeapon(true);
    } else if (e.button === 2) {
      state.player.ads = !state.player.ads;
      selfAgent.root.visible = state.isTPP && !(state.player.ads && getCurrentWeapon().isSniper);
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button === 0) mouseDownLeft = false;
  });

  window.addEventListener('contextmenu', (e) => e.preventDefault());

  window.addEventListener('mousemove', (e) => {
    if (!state.running || state.paused) return;
    if (document.pointerLockElement === viewport) {
      const wpn = getCurrentWeapon();
      const zoomMult = state.player.ads ? (wpn.isSniper ? 0.3 : 0.65) : 1.0;
      const sens = state.sensitivity * 0.00048 * zoomMult;
      state.player.yaw -= e.movementX * sens;
      state.player.pitch = Math.max(-1.42, Math.min(1.42, state.player.pitch - e.movementY * sens));
    }
  });

  function pollGamepadController(dt) {
    const gps = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gps[0] || gps[1] || gps[2] || gps[3];
    if (!gp) return { lx: 0, ly: 0, rt: false };

    const dz = 0.14;
    const lx = Math.abs(gp.axes[0]) > dz ? gp.axes[0] : 0;
    const ly = Math.abs(gp.axes[1]) > dz ? gp.axes[1] : 0;
    const rx = Math.abs(gp.axes[2]) > dz ? gp.axes[2] : 0;
    const ry = Math.abs(gp.axes[3]) > dz ? gp.axes[3] : 0;

    if (rx !== 0 || ry !== 0) {
      const lookSpeed = state.sensitivity * 0.52 * dt;
      state.player.yaw -= rx * lookSpeed;
      state.player.pitch = Math.max(-1.42, Math.min(1.42, state.player.pitch - ry * lookSpeed));
    }

    const justPressed = (idx) => {
      const cur = !!(gp.buttons[idx] && (gp.buttons[idx].pressed || gp.buttons[idx].value > 0.5));
      const hit = cur && !prevPadBtns[idx];
      prevPadBtns[idx] = cur;
      return hit;
    };

    if (justPressed(0) && state.player.grounded) {
      state.player.vy = 7.6;
      state.player.grounded = false;
    }
    if (justPressed(1)) castAbilityE();
    if (justPressed(2)) startReload();
    if (justPressed(3)) switchWeaponSlot((state.player.activeSlot % 3) + 1);
    if (justPressed(4)) castAbilityC();
    if (justPressed(5)) castAbilityQ();
    if (justPressed(12) || justPressed(8)) toggleFppTpp();

    const lt = !!(gp.buttons[6] && gp.buttons[6].value > 0.4);
    if (lt !== prevPadBtns['lt']) {
      prevPadBtns['lt'] = lt;
      state.player.ads = lt;
    }
    const rt = !!(gp.buttons[7] && gp.buttons[7].value > 0.4);
    return { lx, ly, rt };
  }

  function getCurrentWeapon() {
    const p = state.player;
    if (p.activeSlot === 1) return WEAPONS[p.primary];
    if (p.activeSlot === 2) return WEAPONS[p.secondary];
    return WEAPONS.knife;
  }

  function switchWeaponSlot(slot) {
    const p = state.player;
    if (p.activeSlot === slot) return;
    p.activeSlot = slot;
    p.ads = false;
    p.reloading = false;
    p.fireCooldown = 0.16;
    updateWeapon3DAppearance();
    updateHud();
  }

  function startReload() {
    const p = state.player;
    const wpn = getCurrentWeapon();
    if (wpn.isMelee || p.reloading) return;
    const ammoObj = p.ammo[wpn.id];
    if (ammoObj.mag >= wpn.magSize || ammoObj.res <= 0) return;
    p.reloading = true;
    p.ads = false;
    p.reloadTotal = wpn.reloadTime;
    p.reloadTimer = wpn.reloadTime;
    p.reloadStageMask = 1;
    audio.playReloadSound('out');
  }

  // ============================================================================
  // 8. TRUE LINE-OF-SIGHT OCCLUSION CHECK & PHYSICS PROJECTILE ABILITIES
  // ============================================================================
  const dynamicWalls = [];
  const activeSmokes = [];
  const activeZones = [];
  const activeRockets = [];
  const thrownAbilityOrbs = [];
  const activeTracers = [];
  const expandingRings = [];
  let allyTurret = null;
  let healRingMesh = null;

  // TRUE 3D RAYCASTER LINE-OF-SIGHT CHECK (Blocks Bots From Shooting Through Walls or Smokes!)
  const losRaycaster = new THREE.Raycaster();
  function checkLineOfSight3D(fromX, fromY, fromZ, toX, toY, toZ) {
    const origin = new THREE.Vector3(fromX, fromY, fromZ);
    const target = new THREE.Vector3(toX, toY, toZ);
    const dir = new THREE.Vector3().subVectors(target, origin);
    const dist = dir.length();
    if (dist < 0.05) return true;
    dir.normalize();

    losRaycaster.set(origin, dir);
    losRaycaster.near = 0.1;
    losRaycaster.far = dist - 0.15;

    // 1. Check all Static Map Walls, Crates & Dynamic Sage Barrier Walls
    const wallHits = losRaycaster.intersectObjects(envMeshes, false);
    if (wallHits.length > 0) return false;

    // 2. Check Volumetric Smokes (Ray-Sphere Intersection)
    for (let i = 0; i < activeSmokes.length; i++) {
      const s = activeSmokes[i];
      const fx = fromX - s.x, fy = fromY - s.y, fz = fromZ - s.z;
      const proj = -(fx * dir.x + fy * dir.y + fz * dir.z);
      if (proj > 0 && proj < dist) {
        const cx = fromX + dir.x * proj - s.x;
        const cy = fromY + dir.y * proj - s.y;
        const cz = fromZ + dir.z * proj - s.z;
        if (cx * cx + cy * cy + cz * cz < s.radius * s.radius * 0.85) return false;
      }
    }
    return true;
  }

  function spawn3DTracer(startVec, endVec, colorHex, width = 2) {
    const geom = new THREE.BufferGeometry().setFromPoints([startVec, endVec]);
    const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.95, linewidth: width });
    const line = new THREE.Line(geom, mat);
    scene.add(line);
    activeTracers.push({ line, mat, timer: 0.12 });
  }

  function spawnExpandingRing(x, y, z, colorHex, maxRadius, duration = 0.55) {
    const mat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.75, 28), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, y, z);
    scene.add(mesh);
    expandingRings.push({ mesh, mat, maxRadius, timer: duration, maxTimer: duration });
  }

  // ABILITY [C]: SELF-HEAL + 3D GLOWING BIO-AURA RING AT FEET
  function castAbilityC() {
    const p = state.player;
    if (p.charges.c <= 0 && state.gameMode !== 'range') {
      showAnnouncement('NO HEAL CHARGES', 'PRESS [B] TO REFILL IN ARMORY');
      return;
    }
    if (state.gameMode !== 'range') p.charges.c--;
    p.healingTimer = 3.2;
    if (state.agentId === 'sova') p.speedBoostTimer = 4.8;
    audio.playAbility('heal');

    if (!healRingMesh) {
      healRingMesh = new THREE.Mesh(
        new THREE.RingGeometry(1.1, 1.45, 28),
        new THREE.MeshBasicMaterial({ color: 0x00f5d4, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
      );
      healRingMesh.rotation.x = -Math.PI / 2;
      scene.add(healRingMesh);
    }
    healRingMesh.visible = true;
    showAnnouncement('✚ BIO-SURGE HEALING ACTIVE', 'RESTORING HEALTH & RADIANITE SHIELD');
    updateHud();
  }

  // ABILITY [Q]: THROWN 3D PHYSICS PROJECTILES (CURVE FLASH, CRYO SLOW ORB, SHOCK BOLT)
  function castAbilityQ() {
    const p = state.player;
    if (p.charges.q <= 0 && state.gameMode !== 'range') {
      showAnnouncement('NO [Q] CHARGES LEFT', 'BUY FULL ABILITY KIT IN [B] ARMORY');
      return;
    }
    if (state.gameMode !== 'range') p.charges.q--;

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const startPos = new THREE.Vector3(p.x, p.y + 1.52, p.z).addScaledVector(dir, 0.8);

    if (state.agentId === 'vex') {
      // Thrown Curveball Flashbang Orb
      audio.playAbility('flash');
      const orbMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 14, 14),
        new THREE.MeshBasicMaterial({ color: 0xf5c542 })
      );
      orbMesh.position.copy(startPos);
      scene.add(orbMesh);
      thrownAbilityOrbs.push({
        type: 'flash',
        mesh: orbMesh,
        vel: dir.clone().multiplyScalar(22).add(new THREE.Vector3(0, 2.2, 0)),
        gravity: 9.0,
        timer: 0.58
      });
    } else if (state.agentId === 'sage') {
      // Thrown Cryo Slow Orb
      audio.playAbility('heal');
      const orbMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.26, 1),
        new THREE.MeshBasicMaterial({ color: 0x00f5d4 })
      );
      orbMesh.position.copy(startPos);
      scene.add(orbMesh);
      thrownAbilityOrbs.push({
        type: 'slow',
        mesh: orbMesh,
        vel: dir.clone().multiplyScalar(25).add(new THREE.Vector3(0, 3.8, 0)),
        gravity: 16.0,
        timer: 2.2
      });
    } else {
      // Fired Sova Shock Bolt
      audio.playAbility('flash');
      const boltMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x00f5d4 })
      );
      boltMesh.position.copy(startPos);
      scene.add(boltMesh);
      thrownAbilityOrbs.push({
        type: 'shock',
        mesh: boltMesh,
        vel: dir.clone().multiplyScalar(42),
        gravity: 6.5,
        timer: 2.0
      });
    }
    updateHud();
  }

  // ABILITY [E]: DIRECTIONAL TAILWIND DASH + SMOKE / 3-SEGMENT BARRIER WALL / RECON SONAR DART
  function castAbilityE() {
    const p = state.player;
    if (p.charges.e <= 0 && state.gameMode !== 'range') {
      showAnnouncement('NO [E] CHARGES LEFT', 'BUY FULL ABILITY KIT IN [B] ARMORY');
      return;
    }
    if (state.gameMode !== 'range') p.charges.e--;

    const fwdX = -Math.sin(p.yaw), fwdZ = -Math.cos(p.yaw);
    const rightX = Math.cos(p.yaw), rightZ = -Math.sin(p.yaw);

    if (state.agentId === 'vex') {
      audio.playAbility('dash');
      // Drop Volumetric Cloudburst Smoke Sphere
      const smokeMesh = new THREE.Mesh(
        new THREE.SphereGeometry(3.3, 18, 18),
        new THREE.MeshStandardMaterial({ color: 0x1a6872, roughness: 0.9, transparent: true, opacity: 0.88 })
      );
      smokeMesh.position.set(p.x + fwdX * 6.5, 1.65, p.z + fwdZ * 6.5);
      scene.add(smokeMesh);
      activeSmokes.push({ x: smokeMesh.position.x, y: 1.65, z: smokeMesh.position.z, radius: 3.3, timer: 9.0, mesh: smokeMesh });

      // True Directional Jett Dash (Uses WASD input direction)
      let dx = 0, dz = 0;
      if (keys['KeyW']) { dx += fwdX; dz += fwdZ; }
      if (keys['KeyS']) { dx -= fwdX; dz -= fwdZ; }
      if (keys['KeyD']) { dx += rightX; dz += rightZ; }
      if (keys['KeyA']) { dx -= rightX; dz -= rightZ; }
      if (dx === 0 && dz === 0) { dx = fwdX; dz = fwdZ; }
      const dLen = Math.hypot(dx, dz);
      p.vx = (dx / dLen) * 26;
      p.vz = (dz / dLen) * 26;
      p.speedBoostTimer = 0.45;
      showAnnouncement('⚡ TAILWIND DASH + CLOUDBURST SMOKE', 'VISION BLOCKED & REPOSITIONED');
    } else if (state.agentId === 'sage') {
      // 3-Segment Physical Crystal Barrier Wall
      audio.playAbility('ult');
      const wx = p.x + fwdX * 4.8;
      const wz = p.z + fwdZ * 4.8;
      const isZAligned = Math.abs(fwdX) > Math.abs(fwdZ);
      const w = isZAligned ? 1.2 : 6.6;
      const d = isZAligned ? 6.6 : 1.2;

      const wallMat = new THREE.MeshStandardMaterial({
        color: 0x00f5d4,
        roughness: 0.18,
        metalness: 0.45,
        emissive: 0x00443c
      });
      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(w, 2.9, d), wallMat);
      wallMesh.position.set(wx, 1.45, wz);
      wallMesh.updateMatrixWorld();
      scene.add(wallMesh);
      envMeshes.push(wallMesh);
      dynamicWalls.push({ x: wx, y: 1.45, z: wz, w, h: 2.9, d, hp: 450, timer: 22.0, mesh: wallMesh });
      showAnnouncement('🧱 RADIANITE BARRIER WALL DEPLOYED', 'PHYSICAL 3D COVER BLOCKS BULLETS & BOTS');
    } else {
      // Sova Thrown Recon Sonar Beacon
      audio.playAbility('ult');
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const startPos = new THREE.Vector3(p.x, p.y + 1.52, p.z).addScaledVector(dir, 0.8);
      const dartMesh = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.5, 8),
        new THREE.MeshBasicMaterial({ color: 0xff4655 })
      );
      dartMesh.position.copy(startPos);
      scene.add(dartMesh);
      thrownAbilityOrbs.push({
        type: 'recon',
        mesh: dartMesh,
        vel: dir.clone().multiplyScalar(44),
        gravity: 5.0,
        timer: 1.8
      });
    }
    updateHud();
  }

  // ABILITY [X]: ULTIMATE (EMPRESS / AEGIS LASER TURRET / 3-SHOT HUNTER'S FURY RAILGUN)
  function castAbilityX() {
    const p = state.player;
    const maxUlt = AGENTS[state.agentId].x.max;

    // If Sova already has active Hunter's Fury shots remaining, fire one railgun beam immediately!
    if (state.agentId === 'sova' && p.huntersFuryShots > 0) {
      fireHuntersFuryRailgun();
      return;
    }

    if (p.charges.x < maxUlt && state.gameMode !== 'range') {
      showAnnouncement(`ULTIMATE NOT READY (${p.charges.x}/${maxUlt})`, 'GET KILLS OR BUY ULT ORB IN [B]');
      return;
    }
    if (state.gameMode !== 'range') p.charges.x = 0;
    audio.playAbility('ult');

    if (state.agentId === 'vex') {
      p.ultActiveTimer = 14.0;
      p.hp = 100; p.shield = 50;
      state.bots.forEach(b => { if (b.alive) b.revealedTimer = 14.0; });
      showAnnouncement('♛ EMPRESS OVERDRIVE ACTIVATED!', '+45% FIRE RATE • FULL HEAL • THERMAL WALLHACK');
    } else if (state.agentId === 'sage') {
      p.hp = 100; p.shield = 100;
      p.charges.c = 2; p.charges.q = 2; p.charges.e = 1;
      const fwdX = -Math.sin(p.yaw), fwdZ = -Math.cos(p.yaw);

      // Build Multi-Part Sentinel Laser Turret
      const tGroup = new THREE.Group();
      const tBase = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.7, 12), matGunDark);
      tBase.position.y = 0.35;
      const tHead = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.75), matCyanGlow);
      tHead.position.y = 0.9;
      tGroup.add(tBase, tHead);
      tGroup.position.set(p.x + fwdX * 2.6, 0, p.z + fwdZ * 2.6);
      scene.add(tGroup);

      if (allyTurret && allyTurret.mesh) scene.remove(allyTurret.mesh);
      allyTurret = { x: tGroup.position.x, y: 0.95, z: tGroup.position.z, timer: 20.0, fireCd: 0, mesh: tGroup, head: tHead };
      showAnnouncement('🛡 AEGIS TURRET + 100 SHIELD!', 'AUTO-LOCKING SENTINEL TURRET ONLINE');
    } else {
      p.huntersFuryShots = 3;
      p.ultActiveTimer = 10.0;
      fireHuntersFuryRailgun();
    }
    updateHud();
  }

  function fireHuntersFuryRailgun() {
    const p = state.player;
    p.huntersFuryShots--;
    audio.playExplosion();

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const start = new THREE.Vector3(p.x, p.y + 1.45, p.z).addScaledVector(dir, 1.0);

    // 3D Glowing Plasma Cylinder Beam Piercing Across the Entire Arena
    const beamLen = 80;
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.9 });
    const beamMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, beamLen, 12), beamMat);
    beamMesh.position.copy(start).addScaledVector(dir, beamLen * 0.5);
    beamMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    scene.add(beamMesh);
    expandingRings.push({ mesh: beamMesh, mat: beamMat, isBeam: true, timer: 0.5, maxTimer: 0.5 });

    // Damage & Reveal any Bot within cylinder radius (Pierces through all walls!)
    state.bots.forEach(b => {
      if (!b.alive) return;
      const toBot = new THREE.Vector3(b.x - start.x, (b.y + 1.1) - start.y, b.z - start.z);
      const proj = toBot.dot(dir);
      if (proj > 0 && proj < beamLen) {
        const closest = start.clone().addScaledVector(dir, proj);
        const perpDist = Math.hypot(b.x - closest.x, (b.y + 1.1) - closest.y, b.z - closest.z);
        if (perpDist < 1.65) {
          damageBot(b, 120, true, 'HUNTER\'S FURY');
          b.revealedTimer = 6.0;
        }
      }
    });

    showAnnouncement(
      `☄ HUNTER'S FURY FIRED (${p.huntersFuryShots} LEFT)`,
      p.huntersFuryShots > 0 ? 'PRESS [X] AGAIN TO FIRE NEXT RAILGUN BLAST!' : 'ULTIMATE DEPLETED'
    );
  }

  // Detonate Thrown [Q] / [E] Projectiles when they hit floor/walls or expire
  function detonateAbilityProjectile(orb) {
    const pos = orb.mesh.position.clone();
    scene.remove(orb.mesh);

    if (orb.type === 'flash') {
      // Visual Flash Burst
      spawnExpandingRing(pos.x, pos.y, pos.z, 0xf5c542, 6.0, 0.35);

      // Blind Bots that have Line-of-Sight to the Flashbang
      let blindedCount = 0;
      state.bots.forEach(b => {
        if (!b.alive) return;
        const dist = Math.hypot(b.x - pos.x, b.z - pos.z);
        if (dist < 28 && checkLineOfSight3D(pos.x, pos.y, pos.z, b.x, b.y + 1.5, b.z)) {
          b.blindTimer = 4.0;
          blindedCount++;
        }
      });

      // Brief screen flash if player looks directly at own flashbang close-up
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      const toFlash = new THREE.Vector3().subVectors(pos, new THREE.Vector3(state.player.x, state.player.y + 1.5, state.player.z)).normalize();
      if (camDir.dot(toFlash) > 0.55 && checkLineOfSight3D(state.player.x, state.player.y + 1.5, state.player.z, pos.x, pos.y, pos.z)) {
        const fs = document.getElementById('flash-screen');
        fs.style.opacity = '0.55';
        setTimeout(() => { fs.style.opacity = '0'; }, 280);
      }

      showAnnouncement('✦ FLASHBANG DETONATED', `${blindedCount} HOSTILE(S) BLINDED!`);
    } else if (orb.type === 'slow') {
      // Create 3D Crystalline Ice Slow Zone on Floor
      const iceDisk = new THREE.Mesh(
        new THREE.CylinderGeometry(6.5, 6.5, 0.1, 28),
        new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.38 })
      );
      iceDisk.position.set(pos.x, 0.05, pos.z);
      scene.add(iceDisk);
      spawnExpandingRing(pos.x, 0.1, pos.z, 0x00f5d4, 6.5, 0.45);
      activeZones.push({ type: 'slow', x: pos.x, z: pos.z, radius: 6.5, timer: 8.0, mesh: iceDisk });
      showAnnouncement('❄ CRYO SLOW FIELD ACTIVE', 'ENEMIES IN ZONE SLOWED BY 70%');
    } else if (orb.type === 'shock') {
      audio.playExplosion();
      spawnExpandingRing(pos.x, Math.max(0.2, pos.y), pos.z, 0x00f5d4, 6.2, 0.4);
      state.bots.forEach(b => {
        if (!b.alive) return;
        const d = Math.hypot(b.x - pos.x, b.z - pos.z);
        if (d < 6.5) {
          damageBot(b, Math.round(110 * (1 - d / 7.5)), false, 'SHOCK BOLT');
        }
      });
      showAnnouncement('⚡ SHOCK BOLT DETONATED', 'HIGH-VOLTAGE AOE DAMAGE');
    } else if (orb.type === 'recon') {
      // Sova Recon Sonar Beacon: Emits 3 Expanding Radar Rings & Reveals All Bots
      spawnExpandingRing(pos.x, 0.25, pos.z, 0xff4655, 28.0, 0.9);
      state.bots.forEach(b => {
        if (b.alive) b.revealedTimer = 6.5;
      });
      showAnnouncement('◎ RECON SONAR PULSE ACTIVE', 'HOSTILES HIGHLIGHTED THROUGH WALLS!');
    }
  }

  function tryFireWeapon(isInitialClick) {
    const p = state.player;
    if (!state.running || state.paused || p.hp <= 0 || p.reloading) return;
    const wpn = getCurrentWeapon();
    if (!wpn.auto && !isInitialClick) return;
    if (p.fireCooldown > 0) return;

    const ammoObj = p.ammo[wpn.id];
    if (!wpn.isMelee && ammoObj.mag <= 0) {
      startReload();
      return;
    }

    const ultMult = p.ultActiveTimer > 0 && state.agentId === 'vex' ? 1.45 : 1.0;
    p.fireCooldown = 1.0 / (wpn.fireRate * ultMult);
    if (!wpn.isMelee && state.gameMode !== 'range') ammoObj.mag--;

    p.muzzleFlashTimer = 0.06;
    flashMat.opacity = 0.95;
    weaponRig.position.z += 0.045;
    audio.playGunshot(wpn.id);

    const muzzleWorld = new THREE.Vector3();
    muzzleFlash.getWorldPosition(muzzleWorld);

    // Showstopper RPG Projectile
    if (wpn.isRocket) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const rMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xf5c542 })
      );
      rMesh.position.copy(muzzleWorld);
      scene.add(rMesh);
      activeRockets.push({
        mesh: rMesh,
        vel: dir.multiplyScalar(54),
        life: 3.5
      });
      p.recoilOffsetPitch += wpn.recoilPitch;
      updateHud();
      return;
    }

    const moveErr = Math.hypot(p.vx, p.vz) > 2.2 ? 0.022 : 0.0;
    const adsMult = p.ads ? 0.4 : 1.0;

    const botHitMeshes = [];
    state.bots.forEach(b => {
      if (b.alive) {
        b.agent.hitParts.forEach(hp => botHitMeshes.push(hp.mesh));
      }
    });
    if (remoteRival.active) {
      remoteRival.agent.hitParts.forEach(hp => botHitMeshes.push(hp.mesh));
    }

    const allTargets = botHitMeshes.concat(envMeshes);

    for (let pellet = 0; pellet < wpn.pellets; pellet++) {
      const spread = (wpn.spread + moveErr) * adsMult;
      const sx = (Math.random() - 0.5) * spread;
      const sy = (Math.random() - 0.5) * spread;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(sx, sy), camera);
      raycaster.far = wpn.isMelee ? wpn.range : 140;

      const hits = raycaster.intersectObjects(allTargets, false);
      if (hits.length > 0) {
        const hit = hits[0];
        if (!wpn.isMelee) {
          spawn3DTracer(muzzleWorld, hit.point, wpn.colorHex);
          if (p2pConnected && conn) {
            conn.send({
              type: 'tracer',
              sx: muzzleWorld.x, sy: muzzleWorld.y, sz: muzzleWorld.z,
              ex: hit.point.x, ey: hit.point.y, ez: hit.point.z,
              colorHex: wpn.colorHex
            });
          }
        }

        const ud = hit.object.userData;
        if (ud && ud.botRef) {
          const part = ud.part || 'body';
          const dmg = part === 'head' ? wpn.dmgHead : (part === 'body' ? wpn.dmgBody : wpn.dmgLeg);
          damageBot(ud.botRef, dmg, part === 'head', wpn.name, hit.point);
        } else if (ud && ud.isRemoteRival && p2pConnected && conn) {
          const part = ud.part || 'body';
          const dmg = part === 'head' ? wpn.dmgHead : wpn.dmgBody;
          audio.playHitmarker(part === 'head');
          p.hitmarkerTimer = 0.18;
          p.hitmarkerHeadshot = (part === 'head');
          spawnDamagePopup(hit.point.x, hit.point.y, hit.point.z, `-${dmg}`, part === 'head');
          conn.send({ type: 'hit', dmg, isHead: part === 'head', wpnName: wpn.name });
        }
      } else if (!wpn.isMelee) {
        const farPt = raycaster.ray.origin.clone().addScaledVector(raycaster.ray.direction, 95);
        spawn3DTracer(muzzleWorld, farPt, wpn.colorHex);
      }
    }

    p.recoilOffsetPitch = Math.min(0.14, p.recoilOffsetPitch + wpn.recoilPitch * adsMult);
    p.recoilOffsetYaw += (Math.random() - 0.5) * wpn.recoilYaw * 2.0;

    if (!wpn.isMelee && ammoObj.mag <= 0) startReload();
    updateHud();
  }

  function damageBot(bot, dmg, isHeadshot, sourceName, hitVec) {
    if (!bot.alive) return;
    const p = state.player;
    bot.hp -= dmg;
    p.hitmarkerTimer = 0.18;
    p.hitmarkerHeadshot = isHeadshot;
    audio.playHitmarker(isHeadshot);

    const px = hitVec ? hitVec.x : bot.x;
    const py = hitVec ? hitVec.y : bot.y + 1.85;
    const pz = hitVec ? hitVec.z : bot.z;
    spawnDamagePopup(px, py, pz, (isHeadshot ? 'HEADSHOT -' : '-') + dmg, isHeadshot);

    if (bot.agent.hbFill) {
      bot.agent.hbFill.scale.x = Math.max(0.001, bot.hp / bot.maxHp);
    }

    if (bot.hp <= 0) {
      bot.alive = false;
      bot.agent.root.visible = false;
      bot.respawnTimer = (state.gameMode === 'deathmatch' || state.gameMode === 'range') ? 1.4 : 999;
      p.roundKills++;
      p.totalKills++;
      p.credits = Math.min(9000, p.credits + 300);

      const maxUlt = AGENTS[state.agentId].x.max;
      p.charges.x = Math.min(maxUlt, p.charges.x + 1);
      if (p.ultActiveTimer > 0 && state.agentId === 'vex') {
        const wpn = getCurrentWeapon();
        p.ammo[wpn.id].mag = wpn.magSize;
        p.hp = Math.min(100, p.hp + 50);
      }
      if (state.gameMode === 'deathmatch') {
        p.hp = Math.min(100, p.hp + 45);
        p.shield = Math.min(50, p.shield + 25);
      }

      audio.playKillChime(p.roundKills);
      triggerKillMedal(p.roundKills);
      addKillFeed('YOU (' + AGENTS[state.agentId].name + ')', bot.name, sourceName, isHeadshot);

      if (p.roundKills === 5 && state.gameMode === 'tactical') {
        showAnnouncement('★ ACE // TEAM WIPED ★', 'ALL 5 HOSTILES ELIMINATED!');
      }
      checkRoundConditions();
      updateHud();
    }
  }

  // ============================================================================
  // 9. BOT SPAWNING (FIXED BAYS IN RANGE, TACTICAL POSITIONS IN 5V5)
  // ============================================================================
  const BOT_NAMES = ['OMEN-X', 'CYPHER-7', 'REYNA-V', 'CHAMBER-9', 'RAZE-K', 'VIPER-0'];
  const BOT_SPAWNS_DEF = [
    { x: -16, y: 0, z: -22 },
    { x: 16,  y: 0, z: -22 },
    { x: 0,   y: 3.2, z: -30 },
    { x: -8,  y: 0, z: -9 },
    { x: 9,   y: 0, z: -10 }
  ];
  const RANGE_FIXED_BAYS = [
    { x: -12, y: 0, z: -8 },
    { x: -5,  y: 0, z: -12 },
    { x: 0,   y: 0, z: -15 },
    { x: 5,   y: 0, z: -12 },
    { x: 12,  y: 0, z: -8 },
    { x: 0,   y: 3.2, z: -30 }
  ];

  function clearAllBots() {
    state.bots.forEach(b => scene.remove(b.agent.root));
    state.bots = [];
  }

  function spawnBotsForMode() {
    clearAllBots();
    if (p2pConnected) return;

    const count = state.gameMode === 'range' ? 6 : 5;
    for (let i = 0; i < count; i++) {
      const sp = state.gameMode === 'range' ? RANGE_FIXED_BAYS[i] : BOT_SPAWNS_DEF[i % BOT_SPAWNS_DEF.length];
      const maxHp = state.gameMode === 'raid' ? 125 + state.roundNumber * 20 : 150;
      const botObj = {
        id: i,
        name: BOT_NAMES[i % BOT_NAMES.length],
        homeX: sp.x, homeY: sp.y, homeZ: sp.z,
        x: sp.x, y: sp.y, z: sp.z,
        yaw: 0,
        hp: maxHp, maxHp,
        alive: true,
        strafeDir: i % 2 === 0 ? 1 : -1,
        strafeTimer: 1.2 + Math.random(),
        shootCooldown: 1.0 + Math.random() * 0.8,
        blindTimer: 0,
        revealedTimer: 0,
        respawnTimer: 0,
        visibleToPlayer: false,
        animPhase: Math.random() * 6.28,
        agent: null
      };
      botObj.agent = createArticulatedAgent(0x252e3d, 0xff4655, 0xf5c542, { botRef: botObj }, true);
      botObj.agent.root.position.set(sp.x, sp.y, sp.z);
      scene.add(botObj.agent.root);
      state.bots.push(botObj);
    }
  }

  function startNewRound(resetScores) {
    if (resetScores) {
      state.scoreAlly = 0;
      state.scoreEnemy = 0;
      state.roundNumber = 1;
      state.player.credits = 4500;
    }
    const p = state.player;
    if (p2pConnected) {
      p.x = 0; p.y = 0;
      p.z = isHostPlayer ? 32 : -32;
      p.yaw = isHostPlayer ? 0 : Math.PI;
    } else {
      p.x = 0; p.y = 0;
      p.z = state.gameMode === 'range' ? 8 : 28;
      p.yaw = 0;
    }
    p.vx = 0; p.vy = 0; p.vz = 0;
    p.pitch = 0;
    p.hp = 100; p.shield = 50;
    p.roundKills = 0;
    p.reloading = false;
    p.healingTimer = 0;
    p.ultActiveTimer = 0;
    p.huntersFuryShots = 0;
    p.charges.c = Math.max(p.charges.c, 2);
    p.charges.q = Math.max(p.charges.q, 2);
    p.charges.e = Math.max(p.charges.e, 2);

    Object.keys(WEAPONS).forEach(k => {
      p.ammo[k].mag = WEAPONS[k].magSize;
      p.ammo[k].res = WEAPONS[k].reserveMax;
    });

    state.spike.planted = false;
    state.spike.timer = 45.0;
    state.spike.plantProgress = 0;
    state.roundTimeLeft = 100;
    state.roundPhase = 'COMBAT PHASE';

    spawnBotsForMode();
    updateWeapon3DAppearance();
    updateHud();
    showAnnouncement(
      p2pConnected ? 'P2P 1V1 ARENA DUEL' : (state.gameMode === 'range' ? 'PRACTICE RANGE ACTIVE' : `ROUND ${state.roundNumber} // FIGHT`),
      'PRESS [B] FOR PRO BUY MENU • [C/Q/E/X] UPGRADED ABILITIES'
    );
  }

  function checkRoundConditions() {
    if (p2pConnected || state.gameMode === 'range' || state.gameMode === 'deathmatch') return;
    const aliveBots = state.bots.filter(b => b.alive).length;
    if (aliveBots === 0 && state.roundPhase !== 'ROUND WON') {
      state.roundPhase = 'ROUND WON';
      state.scoreAlly++;
      state.roundNumber++;
      state.player.credits = Math.min(9000, state.player.credits + 3000);
      showAnnouncement('ROUND WON // FLAWLESS PROTOCOL', 'NEXT ROUND STARTING IN 3.5 SECONDS...');
      updateHud();
      setTimeout(() => { if (state.running) startNewRound(false); }, 3400);
    }
  }

  // ============================================================================
  // 10. SIMULATION, WALL-OCCLUDED BOT AI & 3-STAGE RELOAD ANIMATION
  // ============================================================================
  function collidePlayerMap(nx, ny, nz, radius) {
    const allWalls = STATIC_MAP_BOXES.concat(dynamicWalls);
    let rx = nx, rz = nz;
    for (let i = 0; i < allWalls.length; i++) {
      const b = allWalls[i];
      if (ny + 1.75 < b.y - b.h * 0.5 || ny + 0.35 > b.y + b.h * 0.5) continue;
      const halfW = b.w * 0.5 + radius;
      const halfD = b.d * 0.5 + radius;
      const dx = rx - b.x;
      const dz = rz - b.z;
      if (Math.abs(dx) < halfW && Math.abs(dz) < halfD) {
        const ox = halfW - Math.abs(dx);
        const oz = halfD - Math.abs(dz);
        if (ox < oz) rx += dx > 0 ? ox : -ox;
        else rz += dz > 0 ? oz : -oz;
      }
    }
    return { x: rx, z: rz };
  }

  function updateSimulation(dt, nowSec) {
    if (!state.running || state.paused) return;
    const p = state.player;
    const wpn = getCurrentWeapon();
    const pad = pollGamepadController(dt);

    // Spike & Round Timer
    if (state.gameMode === 'tactical' && !p2pConnected) {
      if (state.spike.planted) {
        state.spike.timer -= dt;
        if (state.spike.timer <= 0 && state.roundPhase === 'SPIKE PLANTED') {
          state.roundPhase = 'ROUND WON';
          state.scoreAlly++;
          state.roundNumber++;
          state.bots.forEach(b => { b.alive = false; b.agent.root.visible = false; });
          showAnnouncement('💥 SPIKE DETONATED // ROUND WON', 'ATTACKERS WIN THE ROUND');
          setTimeout(() => { if (state.running) startNewRound(false); }, 3400);
        }
      } else if (state.roundPhase === 'COMBAT PHASE') {
        state.roundTimeLeft = Math.max(0, state.roundTimeLeft - dt);
      }
    }

    // Spike Plant Interaction (Hold [4] on A-Site)
    const inSite = Math.hypot(p.x - 0, p.z - (-17)) < 8.5;
    const interactBar = document.getElementById('interaction-bar');
    if (state.gameMode === 'tactical' && !state.spike.planted && inSite && keys['Digit4'] && p.hp > 0) {
      interactBar.style.display = 'block';
      state.spike.plantProgress += dt / 3.0;
      document.getElementById('interaction-fill').style.width = Math.min(100, state.spike.plantProgress * 100) + '%';
      if (state.spike.plantProgress >= 1.0) {
        state.spike.planted = true;
        state.spike.x = p.x; state.spike.z = p.z;
        state.roundPhase = 'SPIKE PLANTED';
        p.credits = Math.min(9000, p.credits + 300);
        interactBar.style.display = 'none';
        audio.playAbility('ult');
        showAnnouncement('⚠ SPIKE PLANTED ON A-SITE', 'DEFEND THE SPIKE FOR 45 SECONDS!');
      }
    } else {
      state.spike.plantProgress = 0;
      interactBar.style.display = 'none';
    }

    // Movement
    p.crouching = !!(keys['ControlLeft'] || keys['KeyZ']);
    p.walking = !!keys['ShiftLeft'];
    const baseSpeed = wpn.isMelee ? 8.2 : 6.6;
    const boostMult = p.speedBoostTimer > 0 ? 1.35 : (p.ultActiveTimer > 0 && state.agentId === 'vex' ? 1.2 : 1.0);
    const speed = baseSpeed * (p.crouching ? 0.55 : (p.walking ? 0.62 : 1.0)) * boostMult;

    const fwdX = -Math.sin(p.yaw), fwdZ = -Math.cos(p.yaw);
    const rightX = Math.cos(p.yaw), rightZ = -Math.sin(p.yaw);
    let moveX = 0, moveZ = 0;
    if (keys['KeyW'] || keys['ArrowUp'])    { moveX += fwdX; moveZ += fwdZ; }
    if (keys['KeyS'] || keys['ArrowDown'])  { moveX -= fwdX; moveZ -= fwdZ; }
    if (keys['KeyD'] || keys['ArrowRight']) { moveX += rightX; moveZ += rightZ; }
    if (keys['KeyA'] || keys['ArrowLeft'])  { moveX -= rightX; moveZ -= rightZ; }
    if (pad.ly !== 0) { moveX -= fwdX * pad.ly; moveZ -= fwdZ * pad.ly; }
    if (pad.lx !== 0) { moveX += rightX * pad.lx; moveZ += rightZ * pad.lx; }

    const moveLen = Math.hypot(moveX, moveZ);
    if (moveLen > 0.001) {
      moveX /= moveLen; moveZ /= moveLen;
      p.bobPhase += dt * (p.walking ? 6 : 11);
    }

    if (p.speedBoostTimer <= 0.25) {
      p.vx = moveX * speed;
      p.vz = moveZ * speed;
    } else {
      p.vx *= Math.pow(0.08, dt);
      p.vz *= Math.pow(0.08, dt);
    }

    if (keys['Space'] && p.grounded) {
      p.vy = 7.6;
      p.grounded = false;
    }
    p.vy -= 19.5 * dt;

    const nextPos = collidePlayerMap(p.x + p.vx * dt, p.y, p.z + p.vz * dt, 0.45);
    p.x = nextPos.x; p.z = nextPos.z;
    p.y += p.vy * dt;

    let floorY = 0;
    const allWalls = STATIC_MAP_BOXES.concat(dynamicWalls);
    for (let b of allWalls) {
      if (Math.abs(p.x - b.x) < b.w * 0.5 + 0.3 && Math.abs(p.z - b.z) < b.d * 0.5 + 0.3) {
        const topY = b.y + b.h * 0.5;
        if (p.y >= topY - 0.45 && topY > floorY) floorY = topY;
      }
    }
    if (p.y <= floorY) {
      p.y = floorY; p.vy = 0; p.grounded = true;
    }

    const locTag = document.getElementById('radar-location-tag');
    if (p.z < -25) locTag.textContent = 'A-HEAVEN // OVERLOOK';
    else if (p.z < -8) locTag.textContent = 'A-SITE // REACTOR';
    else if (p.z < 10) locTag.textContent = 'MID COURTYARD';
    else locTag.textContent = 'ATTACKER SPAWN // MAIN';

    // Cooldowns & Multi-Stage Reload Animation
    if (p.fireCooldown > 0) p.fireCooldown -= dt;
    if (p.muzzleFlashTimer > 0) p.muzzleFlashTimer -= dt;
    if (p.hitmarkerTimer > 0) p.hitmarkerTimer -= dt;
    if (p.inspectTimer > 0) p.inspectTimer -= dt;
    if (p.speedBoostTimer > 0) p.speedBoostTimer -= dt;
    if (p.ultActiveTimer > 0) p.ultActiveTimer -= dt;
    if (flashMat.opacity > 0) flashMat.opacity = Math.max(0, flashMat.opacity - dt * 22);

    if (wpn.id === 'odin' && (mouseDownLeft || pad.rt) && odinBarrelsPivot) {
      odinBarrelsPivot.rotation.z += dt * 34;
    }

    p.recoilOffsetPitch *= Math.pow(0.002, dt);
    p.recoilOffsetYaw *= Math.pow(0.002, dt);

    const targetFov = p.ads ? wpn.zoomFov : p.fov;
    p.currentFov += (targetFov - p.currentFov) * Math.min(1, dt * 16);
    camera.fov = p.currentFov;
    camera.updateProjectionMatrix();

    // 3-Stage 3D Reload Animation State Machine
    if (p.reloading) {
      p.reloadTimer -= dt;
      const prog = 1.0 - Math.max(0, p.reloadTimer / p.reloadTotal);
      const homeY = activeMagMesh ? (activeMagMesh.userData.homeY ?? -0.13) : -0.13;
      const homeZ = activeBoltMesh ? (activeBoltMesh.userData.homeZ ?? 0.02) : 0.02;

      if (prog < 0.35) {
        const t = prog / 0.35;
        weaponRig.rotation.z = THREE.MathUtils.lerp(0, 0.55, t);
        weaponRig.rotation.x = THREE.MathUtils.lerp(0, 0.25, t);
        if (activeMagMesh) activeMagMesh.position.y = THREE.MathUtils.lerp(homeY, homeY - 0.42, t);
      } else if (prog < 0.72) {
        if (p.reloadStageMask < 2) {
          p.reloadStageMask = 2;
          audio.playReloadSound('in');
        }
        const t = (prog - 0.35) / 0.37;
        weaponRig.rotation.z = 0.55;
        weaponRig.rotation.x = 0.25 + Math.sin(t * Math.PI) * 0.08;
        if (activeMagMesh) activeMagMesh.position.y = THREE.MathUtils.lerp(homeY - 0.42, homeY, t);
      } else {
        if (p.reloadStageMask < 3) {
          p.reloadStageMask = 3;
          audio.playReloadSound('rack');
        }
        const t = (prog - 0.72) / 0.28;
        weaponRig.rotation.z = THREE.MathUtils.lerp(0.55, 0, t);
        weaponRig.rotation.x = THREE.MathUtils.lerp(0.25, 0, t);
        if (activeMagMesh) activeMagMesh.position.y = homeY;
        if (activeBoltMesh) activeBoltMesh.position.z = homeZ + Math.sin(t * Math.PI) * 0.12;
      }

      if (p.reloadTimer <= 0) {
        p.reloading = false;
        weaponRig.rotation.set(0, 0, 0);
        if (activeMagMesh) activeMagMesh.position.y = homeY;
        if (activeBoltMesh) activeBoltMesh.position.z = homeZ;
        const ammoObj = p.ammo[wpn.id];
        const needed = wpn.magSize - ammoObj.mag;
        const take = Math.min(needed, ammoObj.res);
        ammoObj.mag += take;
        if (state.gameMode !== 'range') ammoObj.res -= take;
        updateHud();
      }
    } else if (p.inspectTimer > 0) {
      const a = Math.sin(p.inspectTimer * 4.5);
      weaponRig.rotation.z = a * 0.45;
      weaponRig.rotation.y = a * 0.35;
    } else {
      weaponRig.rotation.x = THREE.MathUtils.lerp(weaponRig.rotation.x, 0, dt * 14);
      weaponRig.rotation.y = THREE.MathUtils.lerp(weaponRig.rotation.y, 0, dt * 14);
      weaponRig.rotation.z = THREE.MathUtils.lerp(weaponRig.rotation.z, 0, dt * 14);
      if ((mouseDownLeft || pad.rt) && wpn.auto) {
        tryFireWeapon(false);
      }
    }

    // Continuous Self-Heal + Following 3D Floor Aura Ring
    if (p.healingTimer > 0) {
      p.healingTimer -= dt;
      const healRate = state.agentId === 'sage' ? 38 : 28;
      p.hp = Math.min(p.maxHp, p.hp + healRate * dt);
      p.shield = Math.min(p.maxShield, p.shield + 14 * dt);
      if (healRingMesh) {
        healRingMesh.position.set(p.x, p.y + 0.05, p.z);
        healRingMesh.rotation.z += dt * 4;
      }
      updateHud();
    } else if (healRingMesh) {
      healRingMesh.visible = false;
    }

    // Update Thrown Ability Projectiles ([Q] Flash, Slow, Shock & [E] Recon Dart)
    for (let i = thrownAbilityOrbs.length - 1; i >= 0; i--) {
      const orb = thrownAbilityOrbs[i];
      orb.timer -= dt;
      orb.vel.y -= orb.gravity * dt;

      const nextP = orb.mesh.position.clone().addScaledVector(orb.vel, dt);
      // Check wall/floor collision along step
      const stepDir = orb.vel.clone().normalize();
      const stepDist = orb.vel.length() * dt;
      losRaycaster.set(orb.mesh.position, stepDir);
      losRaycaster.far = stepDist + 0.25;
      const hits = losRaycaster.intersectObjects(envMeshes, false);

      if (hits.length > 0 || nextP.y <= 0.15 || orb.timer <= 0) {
        if (hits.length > 0) orb.mesh.position.copy(hits[0].point);
        else if (nextP.y <= 0.15) orb.mesh.position.set(nextP.x, 0.15, nextP.z);
        detonateAbilityProjectile(orb);
        thrownAbilityOrbs.splice(i, 1);
      } else {
        orb.mesh.position.copy(nextP);
      }
    }

    // Update Flying Rockets
    for (let i = activeRockets.length - 1; i >= 0; i--) {
      const r = activeRockets[i];
      r.life -= dt;
      const stepDir = r.vel.clone().normalize();
      const stepDist = r.vel.length() * dt;
      losRaycaster.set(r.mesh.position, stepDir);
      losRaycaster.far = stepDist + 0.35;
      const wallHits = losRaycaster.intersectObjects(envMeshes, false);

      if (wallHits.length > 0 || r.mesh.position.y <= 0.2 || r.life <= 0) {
        audio.playExplosion();
        const pos = wallHits.length > 0 ? wallHits[0].point : r.mesh.position.clone();
        spawnExpandingRing(pos.x, Math.max(0.15, pos.y), pos.z, 0xff4655, 8.5, 0.45);
        state.bots.forEach(b => {
          if (!b.alive) return;
          const d = Math.hypot(b.x - pos.x, b.z - pos.z);
          if (d < 9.0) {
            damageBot(b, Math.round(185 * (1 - d / 10.5)), false, 'SHOWSTOPPER RPG');
          }
        });
        scene.remove(r.mesh);
        activeRockets.splice(i, 1);
      } else {
        r.mesh.position.addScaledVector(r.vel, dt);
      }
    }

    // Update Expanding Shockwave / Sonar Rings & Railgun Beams
    for (let i = expandingRings.length - 1; i >= 0; i--) {
      const rg = expandingRings[i];
      rg.timer -= dt;
      if (rg.timer <= 0) {
        scene.remove(rg.mesh);
        expandingRings.splice(i, 1);
        continue;
      }
      const prog = 1.0 - (rg.timer / rg.maxTimer);
      if (!rg.isBeam) {
        const s = 1.0 + prog * rg.maxRadius;
        rg.mesh.scale.set(s, s, 1);
      }
      rg.mat.opacity = Math.max(0, (rg.timer / rg.maxTimer) * 0.85);
    }

    // Cleanup timed entities
    for (let i = activeZones.length - 1; i >= 0; i--) {
      activeZones[i].timer -= dt;
      if (activeZones[i].timer <= 0) {
        if (activeZones[i].mesh) scene.remove(activeZones[i].mesh);
        activeZones.splice(i, 1);
      }
    }
    for (let i = activeSmokes.length - 1; i >= 0; i--) {
      activeSmokes[i].timer -= dt;
      if (activeSmokes[i].timer <= 0) {
        scene.remove(activeSmokes[i].mesh);
        activeSmokes.splice(i, 1);
      }
    }
    for (let i = dynamicWalls.length - 1; i >= 0; i--) {
      dynamicWalls[i].timer -= dt;
      if (dynamicWalls[i].timer <= 0) {
        const wm = dynamicWalls[i].mesh;
        scene.remove(wm);
        const idx = envMeshes.indexOf(wm);
        if (idx > -1) envMeshes.splice(idx, 1);
        dynamicWalls.splice(i, 1);
      }
    }
    for (let i = activeTracers.length - 1; i >= 0; i--) {
      activeTracers[i].timer -= dt;
      activeTracers[i].mat.opacity = Math.max(0, activeTracers[i].timer * 8);
      if (activeTracers[i].timer <= 0) {
        scene.remove(activeTracers[i].line);
        activeTracers.splice(i, 1);
      }
    }

    // Update Sage Auto-Turret (Uses Strict 3D Line-of-Sight Check!)
    if (allyTurret) {
      allyTurret.timer -= dt;
      allyTurret.fireCd -= dt;
      if (allyTurret.timer <= 0) {
        scene.remove(allyTurret.mesh);
        allyTurret = null;
      } else if (allyTurret.fireCd <= 0) {
        for (let b of state.bots) {
          if (b.alive && Math.hypot(b.x - allyTurret.x, b.z - allyTurret.z) < 32 &&
              checkLineOfSight3D(allyTurret.x, 1.1, allyTurret.z, b.x, b.y + 1.3, b.z)) {
            allyTurret.fireCd = 0.42;
            allyTurret.mesh.lookAt(b.x, 0, b.z);
            spawn3DTracer(
              new THREE.Vector3(allyTurret.x, 1.1, allyTurret.z),
              new THREE.Vector3(b.x, b.y + 1.25, b.z),
              0x00f5d4
            );
            damageBot(b, 20, false, 'AEGIS TURRET');
            break;
          }
        }
      }
    }

    // Update AI Bots (WITH STRICT WALL & SMOKE LINE-OF-SIGHT CHECK!)
    state.bots.forEach(b => {
      if (!b.alive) {
        if (b.respawnTimer < 100) {
          b.respawnTimer -= dt;
          if (b.respawnTimer <= 0) {
            b.alive = true;
            b.hp = b.maxHp;
            b.x = b.homeX; b.y = b.homeY; b.z = b.homeZ;
            b.agent.root.position.set(b.x, b.y, b.z);
            b.agent.root.visible = true;
            if (b.agent.hbFill) b.agent.hbFill.scale.x = 1;
          }
        }
        return;
      }

      if (b.blindTimer > 0) b.blindTimer -= dt;
      if (b.revealedTimer > 0) b.revealedTimer -= dt;

      let slowMult = 1.0;
      for (let z of activeZones) {
        if (z.type === 'slow' && Math.hypot(b.x - z.x, b.z - z.z) < z.radius) slowMult = 0.3;
      }

      b.strafeTimer -= dt;
      if (b.strafeTimer <= 0) {
        b.strafeDir = -b.strafeDir;
        b.strafeTimer = 1.0 + Math.random() * 1.2;
      }
      b.animPhase += dt * 8 * slowMult;

      const strafeSpeed = (state.gameMode === 'range' ? 2.8 : 3.6) * slowMult;
      const toPx = p.x - b.x, toPz = p.z - b.z;
      b.yaw = Math.atan2(toPx, toPz);

      const rightBx = Math.cos(b.yaw), rightBz = -Math.sin(b.yaw);
      const nx = b.x + rightBx * b.strafeDir * strafeSpeed * dt;
      const nz = b.z + rightBz * b.strafeDir * strafeSpeed * dt;

      if (state.gameMode === 'range') {
        if (Math.abs(nx - b.homeX) < 2.8) b.x = nx;
        else b.strafeDir *= -1;
      } else {
        const col = collidePlayerMap(nx, b.y, nz, 0.5);
        b.x = Math.max(-31, Math.min(31, col.x));
        b.z = Math.max(-34, Math.min(34, col.z));
      }

      b.agent.root.position.set(b.x, b.y, b.z);
      b.agent.root.rotation.y = b.yaw;
      b.agent.legL.rotation.x = Math.sin(b.animPhase) * 0.42;
      b.agent.legR.rotation.x = -Math.sin(b.animPhase) * 0.42;

      // Check True 3D Line-of-Sight against all Walls, Crates, Barriers & Smokes!
      const hasClearLoS = checkLineOfSight3D(b.x, b.y + 1.55, b.z, p.x, p.y + (p.crouching ? 1.1 : 1.55), p.z);
      b.visibleToPlayer = hasClearLoS;

      // Bots ONLY shoot if not in Practice Range, not Blinded, AND have 100% clear Line-of-Sight!
      if (state.gameMode !== 'range' && b.blindTimer <= 0 && hasClearLoS) {
        const dist = Math.hypot(toPx, toPz);
        if (dist < 42) {
          b.shootCooldown -= dt * state.botDifficulty * slowMult;
          if (b.shootCooldown <= 0) {
            b.shootCooldown = (0.68 + Math.random() * 0.5) / state.botDifficulty;
            spawn3DTracer(
              new THREE.Vector3(b.x, b.y + 1.4, b.z),
              new THREE.Vector3(p.x + (Math.random() - 0.5) * 0.6, p.y + 1.2, p.z + (Math.random() - 0.5) * 0.6),
              0xff4655
            );
            const hitProb = Math.max(0.15, 0.48 - dist * 0.007) * state.botDifficulty * slowMult;
            if (Math.random() < hitProb) {
              applyPlayerDamage(Math.round(13 * state.botDifficulty), b, 'VANDAL', false);
            }
          }
        }
      }
    });

    // Update Camera Rig & FPP / TPP Positioning
    const bobY = Math.sin(p.bobPhase) * 0.028;
    const eyeY = (p.crouching ? 1.15 : 1.65) + bobY;
    playerYaw.position.set(p.x, p.y, p.z);
    playerYaw.rotation.y = p.yaw + p.recoilOffsetYaw;
    playerPitch.position.set(0, eyeY, 0);
    playerPitch.rotation.x = p.pitch + p.recoilOffsetPitch;

    if (state.isTPP && !(p.ads && wpn.isSniper)) {
      camera.position.lerp(new THREE.Vector3(0.85, 0.35, 3.4), dt * 16);
      weaponRig.position.lerp(tppWpnPos, dt * 16);
      selfAgent.legL.rotation.x = moveLen > 0 ? Math.sin(nowSec * 12) * 0.45 : 0;
      selfAgent.legR.rotation.x = moveLen > 0 ? -Math.sin(nowSec * 12) * 0.45 : 0;
    } else {
      camera.position.lerp(new THREE.Vector3(0, 0, 0), dt * 18);
      weaponRig.position.lerp(p.ads ? fppAdsPos : fppHipPos, dt * 16);
    }

    if (p2pConnected && conn) {
      conn.send({ type: 'move', x: p.x, y: p.y, z: p.z, yaw: p.yaw });
    }
    if (remoteRival.active) {
      remoteRival.agent.root.position.lerp(remoteRival.targetPos, dt * 15);
      remoteRival.agent.root.rotation.y = remoteRival.targetYaw;
    }
  }

  function applyPlayerDamage(dmg, attackerBot, wpnName = 'VANDAL', isHead = false) {
    const p = state.player;
    if (p.hp <= 0) return;
    const absorb = Math.min(p.shield, Math.ceil(dmg * 0.66));
    p.shield -= absorb;
    p.hp = Math.max(0, p.hp - (dmg - absorb));

    const vig = document.getElementById('screen-vignette');
    vig.style.boxShadow = 'inset 0 0 90px rgba(255, 45, 65, 0.75)';
    setTimeout(() => { vig.style.boxShadow = 'none'; }, 180);

    if (p.hp <= 0) {
      if (p2pConnected && conn) {
        const deathId = Date.now() + '-' + Math.random().toString(36).substring(2, 6);
        conn.send({ type: 'kill_confirm', deathId, wpnName, isHead });
      }
      addKillFeed(attackerBot ? attackerBot.name : 'HOSTILE', 'YOU', wpnName, isHead);
      if (state.gameMode === 'deathmatch') {
        showAnnouncement('ELIMINATED // RESPAWNING', 'INSTANT DEATHMATCH RE-DEPLOY');
        setTimeout(() => {
          p.hp = 100; p.shield = 50;
          p.x = (Math.random() - 0.5) * 30; p.z = 24;
          updateHud();
        }, 1100);
      } else {
        state.scoreEnemy++;
        state.roundNumber++;
        state.roundPhase = 'ROUND LOST';
        showAnnouncement('ROUND LOST // AGENT DOWN', 'RE-DEPLOYING NEXT ROUND...');
        setTimeout(() => { if (state.running) startNewRound(false); }, 2600);
      }
    }
    updateHud();
  }

  // ============================================================================
  // 11. RENDER 3D SCENE + 2D TACTICAL OVERLAY + THERMAL WALLHACK BOXES
  // ============================================================================
  function resizeAll() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    fxCanvas.width = w;
    fxCanvas.height = h;
  }
  window.addEventListener('resize', resizeAll);
  resizeAll();

  function renderFrame() {
    const p = state.player;
    const wpn = getCurrentWeapon();

    // Hide 3D gun mesh while inside Sniper full-screen lens
    weaponRig.visible = !(p.ads && wpn.isSniper);

    renderer.render(scene, camera);

    const w = fxCanvas.width;
    const h = fxCanvas.height;
    const cx = w * 0.5, cy = h * 0.5;

    fxCtx.clearRect(0, 0, w, h);

    // 1. Draw Thermal Recon / Empress Wallhack Diamonds & Blinded Status Over Bots
    state.bots.forEach(b => {
      if (!b.alive) return;
      const isRevealed = b.revealedTimer > 0 || (p.ultActiveTimer > 0 && state.agentId === 'vex');
      if (!isRevealed && b.blindTimer <= 0) return;

      const worldCenter = new THREE.Vector3(b.x, b.y + 1.15, b.z);
      const proj = worldCenter.project(camera);
      if (proj.z > 1) return;

      const sx = (proj.x * 0.5 + 0.5) * w;
      const sy = (-proj.y * 0.5 + 0.5) * h;

      fxCtx.save();
      if (isRevealed) {
        fxCtx.strokeStyle = '#f5c542';
        fxCtx.lineWidth = 2;
        fxCtx.strokeRect(sx - 18, sy - 32, 36, 64);
        fxCtx.fillStyle = '#f5c542';
        fxCtx.font = '800 11px Rajdhani';
        fxCtx.textAlign = 'center';
        fxCtx.fillText('REVEALED', sx, sy - 37);
      }
      if (b.blindTimer > 0) {
        fxCtx.fillStyle = '#00f5d4';
        fxCtx.font = '900 12px Rajdhani';
        fxCtx.textAlign = 'center';
        fxCtx.fillText('✦ BLINDED', sx, sy - 50);
      }
      fxCtx.restore();
    });

    // 2. Active Healing / Ultimate Screen Frame Glow
    if (p.healingTimer > 0) {
      fxCtx.strokeStyle = 'rgba(0, 245, 212, 0.55)';
      fxCtx.lineWidth = 8;
      fxCtx.strokeRect(4, 4, w - 8, h - 8);
    } else if (p.ultActiveTimer > 0) {
      fxCtx.strokeStyle = 'rgba(255, 70, 85, 0.55)';
      fxCtx.lineWidth = 8;
      fxCtx.strokeRect(4, 4, w - 8, h - 8);
    }

    // 3. Sniper Scope OR Tactical Crosshair
    if (p.ads && wpn.isSniper) {
      const r = Math.min(w, h) * 0.41;
      fxCtx.save();
      fxCtx.fillStyle = 'rgba(6, 10, 15, 0.92)';
      fxCtx.beginPath();
      fxCtx.rect(0, 0, w, h);
      fxCtx.arc(cx, cy, r, 0, Math.PI * 2, true);
      fxCtx.fill();

      fxCtx.strokeStyle = '#00f5d4';
      fxCtx.lineWidth = 2;
      fxCtx.beginPath();
      fxCtx.arc(cx, cy, r, 0, Math.PI * 2);
      fxCtx.stroke();

      fxCtx.strokeStyle = 'rgba(255, 70, 85, 0.85)';
      fxCtx.lineWidth = 1.2;
      fxCtx.beginPath();
      fxCtx.moveTo(cx - r, cy); fxCtx.lineTo(cx + r, cy);
      fxCtx.moveTo(cx, cy - r); fxCtx.lineTo(cx, cy + r);
      fxCtx.stroke();
      fxCtx.restore();
    } else {
      const gap = 4 + Math.min(16, (p.recoilOffsetPitch * 200) + (Math.hypot(p.vx, p.vz) * 0.7));
      const len = 7;
      fxCtx.save();
      fxCtx.strokeStyle = '#00f5d4';
      fxCtx.lineWidth = 2;
      fxCtx.beginPath();
      fxCtx.moveTo(cx, cy - gap - len); fxCtx.lineTo(cx, cy - gap);
      fxCtx.moveTo(cx, cy + gap);       fxCtx.lineTo(cx, cy + gap + len);
      fxCtx.moveTo(cx - gap - len, cy); fxCtx.lineTo(cx - gap, cy);
      fxCtx.moveTo(cx + gap, cy);       fxCtx.lineTo(cx + gap + len, cy);
      fxCtx.stroke();

      if (p.reloading) {
        const prog = 1.0 - Math.max(0, p.reloadTimer / p.reloadTotal);
        fxCtx.strokeStyle = '#f5c542';
        fxCtx.lineWidth = 3;
        fxCtx.beginPath();
        fxCtx.arc(cx, cy, 22, -Math.PI * 0.5, -Math.PI * 0.5 + prog * Math.PI * 2);
        fxCtx.stroke();

        fxCtx.fillStyle = '#00f5d4';
        fxCtx.font = '800 12px Rajdhani, sans-serif';
        fxCtx.textAlign = 'center';
        const stageTxt = prog < 0.35 ? 'MAG OUT' : (prog < 0.72 ? 'MAG IN' : 'CHAMBERING');
        fxCtx.fillText(`RELOADING // ${stageTxt}`, cx, cy + 38);
      }

      if (p.hitmarkerTimer > 0) {
        fxCtx.strokeStyle = p.hitmarkerHeadshot ? '#ff4655' : '#ece8e1';
        fxCtx.lineWidth = p.hitmarkerHeadshot ? 2.8 : 2.0;
        const hm = p.hitmarkerHeadshot ? 12 : 8;
        fxCtx.beginPath();
        fxCtx.moveTo(cx - hm, cy - hm); fxCtx.lineTo(cx - 3, cy - 3);
        fxCtx.moveTo(cx + hm, cy - hm); fxCtx.lineTo(cx + 3, cy - 3);
        fxCtx.moveTo(cx - hm, cy + hm); fxCtx.lineTo(cx - 3, cy + 3);
        fxCtx.moveTo(cx + hm, cy + hm); fxCtx.lineTo(cx + 3, cy + 3);
        fxCtx.stroke();
      }
      fxCtx.restore();
    }

    renderRadarMinimap();
  }

  function renderRadarMinimap() {
    const rw = radarCanvas.width, rh = radarCanvas.height;
    radarCtx.clearRect(0, 0, rw, rh);
    radarCtx.fillStyle = '#0a121a';
    radarCtx.fillRect(0, 0, rw, rh);

    const scale = 2.15;
    const toRx = (wx) => rw * 0.5 + wx * scale;
    const toRy = (wz) => rh * 0.5 + wz * scale;

    radarCtx.fillStyle = 'rgba(255, 70, 85, 0.16)';
    radarCtx.strokeStyle = 'rgba(255, 70, 85, 0.55)';
    radarCtx.fillRect(toRx(-8), toRy(-24), 16 * scale, 14 * scale);
    radarCtx.strokeRect(toRx(-8), toRy(-24), 16 * scale, 14 * scale);

    radarCtx.fillStyle = '#2b3948';
    for (let b of STATIC_MAP_BOXES) {
      radarCtx.fillRect(toRx(b.x - b.w * 0.5), toRy(b.z - b.d * 0.5), b.w * scale, b.d * scale);
    }

    radarCtx.fillStyle = '#00f5d4';
    for (let b of dynamicWalls) {
      radarCtx.fillRect(toRx(b.x - b.w * 0.5), toRy(b.z - b.d * 0.5), b.w * scale, b.d * scale);
    }

    const p = state.player;
    for (let b of state.bots) {
      if (!b.alive) continue;
      // Only show bots on radar if visible in LoS, revealed by Sova/Empress, or in Practice Range
      if (b.visibleToPlayer || b.revealedTimer > 0 || p.ultActiveTimer > 0 || state.gameMode === 'range') {
        radarCtx.fillStyle = b.revealedTimer > 0 ? '#f5c542' : '#ff4655';
        radarCtx.beginPath();
        radarCtx.arc(toRx(b.x), toRy(b.z), 4, 0, Math.PI * 2);
        radarCtx.fill();
      }
    }

    if (remoteRival.active) {
      radarCtx.fillStyle = '#f5c542';
      radarCtx.beginPath();
      radarCtx.arc(toRx(remoteRival.agent.root.position.x), toRy(remoteRival.agent.root.position.z), 4.5, 0, Math.PI * 2);
      radarCtx.fill();
    }

    const px = toRx(p.x), py = toRy(p.z);
    radarCtx.fillStyle = 'rgba(0, 245, 212, 0.2)';
    radarCtx.beginPath();
    radarCtx.moveTo(px, py);
    radarCtx.arc(px, py, 28, -p.yaw - Math.PI * 0.5 - 0.5, -p.yaw - Math.PI * 0.5 + 0.5);
    radarCtx.closePath();
    radarCtx.fill();

    radarCtx.fillStyle = '#00f5d4';
    radarCtx.beginPath();
    radarCtx.arc(px, py, 4.2, 0, Math.PI * 2);
    radarCtx.fill();
  }

  // ============================================================================
  // 12. HUD, MENUS & SHOP BINDINGS
  // ============================================================================
  function updateHud() {
    const p = state.player;
    const wpn = getCurrentWeapon();
    const ag = AGENTS[state.agentId];

    document.getElementById('hud-hp-val').textContent = Math.ceil(p.hp);
    document.getElementById('hud-shield-val').textContent = Math.ceil(p.shield);
    const hpFill = document.getElementById('hud-hp-fill');
    hpFill.style.width = Math.max(0, Math.min(100, p.hp)) + '%';
    hpFill.style.background = p.hp > 35 ? 'var(--val-cyan)' : 'var(--val-red)';

    document.getElementById('hud-agent-name').textContent = ag.name;
    document.getElementById('hud-credits').textContent = p.credits.toLocaleString();
    document.getElementById('buy-credits-val').textContent = p.credits.toLocaleString();
    document.getElementById('shop-curr-primary').textContent = WEAPONS[p.primary].name;
    document.getElementById('shop-curr-secondary').textContent = WEAPONS[p.secondary].name;

    [1, 2, 3].forEach(s => {
      document.getElementById('pill-slot-' + s).classList.toggle('active', p.activeSlot === s);
    });

    document.getElementById('hud-weapon-name').textContent = wpn.name;
    document.getElementById('hud-fire-mode').textContent = wpn.desc;
    const ammoObj = p.ammo[wpn.id];
    document.getElementById('hud-ammo-mag').textContent = wpn.isMelee ? '∞' : ammoObj.mag;
    document.getElementById('hud-ammo-res').textContent = wpn.isMelee ? '' : '/ ' + ammoObj.res;

    document.getElementById('score-ally').textContent = state.scoreAlly;
    document.getElementById('score-enemy').textContent = state.scoreEnemy;
    document.getElementById('round-phase-label').textContent = state.roundPhase;

    ['c', 'q', 'e', 'x'].forEach(k => {
      const def = ag[k];
      document.getElementById('icon-' + k).textContent = def.icon;
      document.getElementById('name-' + k).textContent = def.name;
      const dotsEl = document.getElementById('dots-' + k);
      dotsEl.innerHTML = '';
      const cur = p.charges[k];
      for (let i = 0; i < def.max; i++) {
        const d = document.createElement('div');
        d.className = 'charge-dot' + (k === 'x' ? ' ult-pip' : '') + (i < cur ? ' filled' : '');
        dotsEl.appendChild(d);
      }
      const slotEl = document.getElementById('slot-' + k);
      const isReady = k === 'x' ? (cur >= def.max || p.huntersFuryShots > 0) : cur > 0;
      slotEl.classList.toggle('ready', isReady);
      slotEl.classList.toggle('empty', !isReady);
    });

    const allyRoster = document.getElementById('ally-roster');
    allyRoster.innerHTML = `<div class="agent-pip ${p.hp <= 0 ? 'dead' : ''}">${ag.name.slice(0,3)}</div>`;
    const enemyRoster = document.getElementById('enemy-roster');
    if (p2pConnected) {
      enemyRoster.innerHTML = `<div class="agent-pip enemy">RIV</div>`;
    } else {
      enemyRoster.innerHTML = state.bots.map(b =>
        `<div class="agent-pip enemy ${!b.alive ? 'dead' : ''}">${b.name.slice(0,2)}</div>`
      ).join('');
    }
  }

  let bannerTimeout = null;
  function showAnnouncement(title, sub) {
    const m = document.getElementById('banner-main');
    const s = document.getElementById('banner-sub');
    m.textContent = title;
    s.textContent = sub || '';
    m.classList.add('show');
    if (bannerTimeout) clearTimeout(bannerTimeout);
    bannerTimeout = setTimeout(() => { m.classList.remove('show'); }, 2400);
  }

  let medalTimeout = null;
  function triggerKillMedal(streak) {
    const emb = document.getElementById('kill-emblem');
    const pips = document.getElementById('kill-pips-row');
    emb.textContent = streak >= 5 ? 'ACE' : `${streak}K`;
    emb.classList.add('active');
    pips.innerHTML = '';
    for (let i = 0; i < Math.min(5, streak); i++) {
      const pip = document.createElement('div');
      pip.className = 'kill-star-pip';
      pips.appendChild(pip);
    }
    if (medalTimeout) clearTimeout(medalTimeout);
    medalTimeout = setTimeout(() => { emb.classList.remove('active'); }, 2200);
  }

  function addKillFeed(killer, victim, weaponName, isHeadshot) {
    const feed = document.getElementById('kill-feed');
    const el = document.createElement('div');
    el.className = 'kill-item';
    el.innerHTML = `<span style="color:var(--val-cyan)">${killer}</span>
      <span style="color:var(--val-muted)">[${weaponName}${isHeadshot ? ' 🎯' : ''}]</span>
      <span style="color:var(--val-red)">${victim}</span>`;
    feed.prepend(el);
    setTimeout(() => { el.remove(); }, 4500);
  }

  const startModal = document.getElementById('start-modal');
  const buyModal = document.getElementById('buy-modal');

  document.querySelectorAll('#agent-select-grid .agent-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#agent-select-grid .agent-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.agentId = card.dataset.agent;
      updateHud();
    });
  });

  document.querySelectorAll('#mode-select-grid .mode-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#mode-select-grid .mode-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.gameMode = card.dataset.mode;
    });
  });

  document.getElementById('sens-slider').addEventListener('input', (e) => {
    state.sensitivity = parseFloat(e.target.value);
    document.getElementById('sens-val').textContent = state.sensitivity.toFixed(1);
  });

  document.getElementById('bot-diff').addEventListener('change', (e) => {
    state.botDifficulty = parseFloat(e.target.value);
  });

  document.getElementById('btn-lock-in').addEventListener('click', () => {
    audio.init();
    startModal.style.display = 'none';
    buyModal.style.display = 'none';
    state.running = true;
    state.paused = false;
    startNewRound(true);
    viewport.requestPointerLock();
  });

  function openStartMenu() {
    if (document.pointerLockElement) document.exitPointerLock();
    state.paused = true;
    buyModal.style.display = 'none';
    startModal.style.display = 'flex';
  }

  function toggleBuyMenu() {
    if (startModal.style.display !== 'none') return;
    if (buyModal.style.display === 'flex') {
      buyModal.style.display = 'none';
      state.paused = false;
      viewport.requestPointerLock();
    } else {
      if (document.pointerLockElement) document.exitPointerLock();
      state.paused = true;
      updateHud();
      buyModal.style.display = 'flex';
    }
  }

  document.getElementById('btn-close-buy').addEventListener('click', toggleBuyMenu);
  document.getElementById('btn-open-buy').addEventListener('click', toggleBuyMenu);
  document.getElementById('btn-open-menu').addEventListener('click', openStartMenu);
  document.getElementById('btn-switch-agent').addEventListener('click', openStartMenu);
  document.getElementById('btn-toggle-view').addEventListener('click', toggleFppTpp);
  document.getElementById('btn-heal-now').addEventListener('click', () => {
    audio.init();
    castAbilityC();
  });

  document.querySelectorAll('[data-buy-weapon]').forEach(item => {
    item.addEventListener('click', () => {
      audio.init();
      const wid = item.dataset.buyWeapon;
      const wpn = WEAPONS[wid];
      const p = state.player;
      if (p.credits >= wpn.cost || state.gameMode === 'range') {
        if (state.gameMode !== 'range') p.credits -= wpn.cost;
        if (wpn.slot === 1) p.primary = wid;
        else p.secondary = wid;
        p.activeSlot = wpn.slot;
        p.reloading = false;
        p.ammo[wid].mag = wpn.magSize;
        p.ammo[wid].res = wpn.reserveMax;
        document.querySelectorAll('[data-buy-weapon]').forEach(el => el.classList.remove('equipped'));
        item.classList.add('equipped');
        updateWeapon3DAppearance();
        audio.playReloadSound('rack');
        updateHud();
      }
    });
  });

  document.querySelectorAll('[data-buy-util]').forEach(item => {
    item.addEventListener('click', () => {
      audio.init();
      const uid = item.dataset.buyUtil;
      const p = state.player;
      if (uid === 'light_shield' && p.credits >= 400) {
        p.credits -= 400; p.shield = Math.max(p.shield, 25);
      } else if (uid === 'heavy_shield' && p.credits >= 1000) {
        p.credits -= 1000; p.shield = 50; p.hp = 100;
      } else if (uid === 'refill_abilities' && p.credits >= 600) {
        p.credits -= 600; p.charges.c = 2; p.charges.q = 2; p.charges.e = 2;
      } else if (uid === 'ult_orb' && p.credits >= 1200) {
        p.credits -= 1200; p.charges.x = AGENTS[state.agentId].x.max;
      }
      audio.playAbility('heal');
      updateHud();
    });
  });

  // ============================================================================
  // 13. 120–240+ FPS MESSAGECHANNEL TURBO ENGINE LOOP
  // ============================================================================
  let lastFrameTime = performance.now();
  let fpsFrameCount = 0;
  let fpsLastSample = performance.now();
  const fpsHistory = new Array(36).fill(144);

  const btnFpsMode = document.getElementById('btn-fps-mode');
  btnFpsMode.addEventListener('click', () => {
    state.turboFpsMode = !state.turboFpsMode;
    btnFpsMode.textContent = state.turboFpsMode ? 'FPS: TURBO 144+' : 'FPS: VSYNC';
    btnFpsMode.classList.toggle('active', state.turboFpsMode);
    document.getElementById('fps-mode-tag').textContent = state.turboFpsMode
      ? 'TURBO UNCAPPED (120+ TARGET)'
      : 'NATIVE DISPLAY VSYNC';
  });

  const channel = new MessageChannel();
  function scheduleNextTick() {
    if (state.turboFpsMode) {
      channel.port2.postMessage(null);
    } else {
      requestAnimationFrame(engineLoop);
    }
  }
  channel.port1.onmessage = () => engineLoop(performance.now());

  function engineLoop(nowMs) {
    const rawDt = (nowMs - lastFrameTime) * 0.001;
    if (state.turboFpsMode && rawDt < 0.0046) {
      scheduleNextTick();
      return;
    }
    lastFrameTime = nowMs;
    const dt = Math.min(0.05, Math.max(0.001, rawDt));

    updateSimulation(dt, nowMs * 0.001);
    updateDamagePopups(dt);
    renderFrame();

    const tSec = state.spike.planted ? Math.ceil(state.spike.timer) : Math.ceil(state.roundTimeLeft);
    const mins = Math.floor(tSec / 60);
    const secs = tSec % 60;
    const timerEl = document.getElementById('round-timer');
    timerEl.textContent = state.spike.planted
      ? `${secs}.${Math.floor((state.spike.timer % 1) * 10)}`
      : `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    timerEl.style.color = state.spike.planted ? 'var(--val-red)' : 'var(--val-cream)';

    fpsFrameCount++;
    const elapsedSample = nowMs - fpsLastSample;
    if (elapsedSample >= 250) {
      const currentFps = Math.round((fpsFrameCount * 1000) / elapsedSample);
      const frameMs = (elapsedSample / fpsFrameCount).toFixed(1);
      fpsFrameCount = 0;
      fpsLastSample = nowMs;

      document.getElementById('fps-counter').textContent = `${currentFps} FPS`;
      document.getElementById('frame-time-txt').textContent = `${frameMs} ms`;
      fpsHistory.push(currentFps);
      fpsHistory.shift();

      fpsGraphCtx.clearRect(0, 0, 76, 26);
      fpsGraphCtx.strokeStyle = '#00f5d4';
      fpsGraphCtx.lineWidth = 1.5;
      fpsGraphCtx.beginPath();
      for (let i = 0; i < fpsHistory.length; i++) {
        const gx = (i / (fpsHistory.length - 1)) * 76;
        const gy = 24 - Math.min(22, (fpsHistory[i] / 220) * 22);
        if (i === 0) fpsGraphCtx.moveTo(gx, gy);
        else fpsGraphCtx.lineTo(gx, gy);
      }
      fpsGraphCtx.stroke();
    }

    scheduleNextTick();
  }

  spawnBotsForMode();
  updateWeapon3DAppearance();
  updateHud();
  scheduleNextTick();
})();
