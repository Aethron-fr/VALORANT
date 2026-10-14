<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VALO-STRIKE // PROTOCOL 07 — Apex 3D Tactical Shooter (144+ FPS)</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

<div id="game-container">
  <!-- 3D Hardware-Accelerated Three.js WebGL Viewport -->
  <div id="gl-viewport"></div>

  <!-- 2D Tactical Overlay Canvas (Crosshair, Hitmarkers, Reload Ring, Thermal Wallhack Box, Sniper Scope) -->
  <canvas id="fx-canvas"></canvas>

  <!-- Floating 3D Damage Popups Container -->
  <div id="dmg-layer"></div>

  <!-- Screen Vignettes & Flashbang Overlay -->
  <div id="screen-vignette"></div>
  <div id="flash-screen"></div>

  <!-- Top-Left Live Radar Minimap -->
  <div id="radar-container">
    <canvas id="radar-canvas" width="180" height="180"></canvas>
    <div id="radar-location-tag">A-SITE // COURTYARD</div>
    <div id="cam-perspective-tag">VIEW: <span id="cam-label">FPP</span> [V]</div>
  </div>

  <!-- Top Match Scoreboard & Alive Roster -->
  <div id="hud-top">
    <div class="team-roster" id="ally-roster"></div>
    <div class="score-box">
      <div class="score-num score-ally" id="score-ally">0</div>
      <div class="timer-center">
        <div id="round-timer">1:40</div>
        <div id="round-phase-label">COMBAT PHASE</div>
      </div>
      <div class="score-num score-enemy" id="score-enemy">0</div>
    </div>
    <div class="team-roster" id="enemy-roster"></div>
  </div>

  <!-- Top-Right High-FPS Telemetry & Quick Controls -->
  <div id="telemetry-bar">
    <div class="perf-card">
      <div>
        <div class="fps-big" id="fps-counter">144 FPS</div>
        <div class="telemetry-label" id="fps-mode-tag">TURBO UNCAPPED (120+ TARGET)</div>
      </div>
      <div class="telemetry-metric">
        <span id="frame-time-txt" class="frame-ms">4.2 ms</span>
        <span class="telemetry-label" id="net-status-tag">SOLO / BOT SQUAD</span>
      </div>
      <canvas id="fps-graph" width="76" height="26"></canvas>
    </div>
    <div class="quick-controls-row">
      <button class="hud-mini-btn active" id="btn-fps-mode">FPS: TURBO 144+</button>
      <button class="hud-mini-btn" id="btn-toggle-view">[V] FPP / TPP</button>
      <button class="hud-mini-btn" id="btn-open-buy">[B] ARMORY</button>
      <button class="hud-mini-btn" id="btn-heal-now">[C] HEAL</button>
      <button class="hud-mini-btn" id="btn-open-menu">[M] LOBBY / P2P</button>
    </div>
  </div>

  <!-- Kill Feed -->
  <div id="kill-feed"></div>

  <!-- Center Announcement Banner -->
  <div id="center-announcement">
    <div class="banner-title" id="banner-main">ROUND START</div>
    <div class="banner-sub" id="banner-sub">ELIMINATE HOSTILES OR PLANT THE SPIKE</div>
  </div>

  <!-- Spike Plant / Defuse Interaction Progress -->
  <div id="interaction-bar">
    <div id="interaction-label">PLANTING SPIKE [HOLD 4]</div>
    <div class="progress-track"><div id="interaction-fill"></div></div>
  </div>

  <!-- Valorant Kill Skull Emblem -->
  <div id="kill-medal-dock">
    <div id="kill-emblem">☠</div>
    <div id="kill-pips-row"></div>
  </div>

  <!-- Bottom Tactical HUD -->
  <div id="hud-bottom">
    <!-- Left: Shield + Health -->
    <div class="vitals-panel">
      <div class="shield-block">
        <span class="vital-label">SHIELD</span>
        <span id="hud-shield-val">50</span>
      </div>
      <div class="hp-block">
        <span class="vital-label">HEALTH // <span id="hud-agent-name" class="cyan-txt">VEX</span></span>
        <span id="hud-hp-val">100</span>
        <div class="hp-bar-track"><div id="hud-hp-fill"></div></div>
      </div>
    </div>

    <!-- Center: 4 Signature Abilities (C, Q, E, X) -->
    <div class="abilities-dock">
      <div class="ability-slot ready" id="slot-c">
        <span class="ability-key">C / LB</span>
        <div class="ability-icon" id="icon-c">✚</div>
        <div class="ability-name" id="name-c">BIO-SURGE HEAL</div>
        <div class="charge-dots" id="dots-c"></div>
      </div>
      <div class="ability-slot ready" id="slot-q">
        <span class="ability-key">Q / RB</span>
        <div class="ability-icon" id="icon-q">✦</div>
        <div class="ability-name" id="name-q">CURVE FLASH</div>
        <div class="charge-dots" id="dots-q"></div>
      </div>
      <div class="ability-slot ready" id="slot-e">
        <span class="ability-key">E / B</span>
        <div class="ability-icon" id="icon-e">⚡</div>
        <div class="ability-name" id="name-e">TAILWIND DASH</div>
        <div class="charge-dots" id="dots-e"></div>
      </div>
      <div class="ability-slot ult" id="slot-x">
        <span class="ability-key">X / LB+RB</span>
        <div class="ability-icon" id="icon-x">♛</div>
        <div class="ability-name" id="name-x">EMPRESS ULT</div>
        <div class="charge-dots" id="dots-x"></div>
      </div>
    </div>

    <!-- Right: Credits, Hotbar & Equipped Weapon -->
    <div class="arsenal-panel">
      <div class="slot-pills-row">
        <span class="slot-pill active" id="pill-slot-1">[1] PRIMARY</span>
        <span class="slot-pill" id="pill-slot-2">[2] SIDEARM</span>
        <span class="slot-pill" id="pill-slot-3">[3] KARAMBIT</span>
        <span class="credits-pill">¤ <span id="hud-credits">4,500</span></span>
      </div>
      <div class="weapon-box">
        <div class="ammo-display">
          <span id="hud-ammo-mag">25</span>
          <span id="hud-ammo-res">/ 75</span>
        </div>
        <div class="weapon-meta">
          <div id="hud-weapon-name">VANDAL</div>
          <div id="hud-fire-mode">1-TAP HEADSHOT // AUTO</div>
        </div>
      </div>
    </div>
  </div>

  <!-- START / AGENT, MODE & P2P MULTIPLAYER LOBBY MODAL -->
  <div class="modal-overlay" id="start-modal">
    <div class="modal-card">
      <div class="brand-header">
        <div>
          <div class="brand-title">VALO-STRIKE <span>// PROTOCOL 07</span></div>
          <div class="brand-sub">
            TRUE 3D WEAPON MODELS &bull; WALL-OCCLUDED BOT AI &bull; PHYSICS PROJECTILE ABILITIES &bull; P2P 1V1 &bull; 144+ FPS
          </div>
        </div>
        <div class="fps-badge-pill" id="pad-indicator">⚡ KB/M + CONTROLLER READY</div>
      </div>

      <!-- P2P 1v1 Multiplayer Bar -->
      <div class="p2p-lobby-bar">
        <div class="p2p-col">
          <div class="section-label" style="margin-bottom:4px;">PEER-TO-PEER (P2P) 1V1 FRIEND DUEL</div>
          <div id="p2p-status-txt">STATUS: OFFLINE SQUAD MODE (CONNECT CODE FOR LIVE 1V1 ARENA)</div>
        </div>
        <div class="p2p-actions">
          <button class="btn-secondary btn-sm" id="btn-host-p2p">1. Generate Code</button>
          <input type="text" class="p2p-code-box" id="p2p-host-code" readonly placeholder="ROOM CODE" />
          <button class="btn-secondary btn-sm" id="btn-copy-p2p">Copy</button>
          <input type="text" class="p2p-code-box" id="p2p-join-code" placeholder="PASTE FRIEND CODE" />
          <button class="btn-secondary btn-sm" id="btn-join-p2p">2. Connect</button>
        </div>
      </div>

      <div class="section-label">1. SELECT YOUR RADIANT AGENT (PHYSICS PROJECTILE ABILITIES + HEAL KIT)</div>
      <div class="grid-3" id="agent-select-grid">
        <div class="agent-card selected" data-agent="vex">
          <div class="role-tag">DUELIST // ENTRY FRAGGER</div>
          <div class="card-title">VEX (JETT / REYNA KIT)</div>
          <ul class="kit-list">
            <li><span class="kit-key">C</span> <b>Vital Surge Heal:</b> Spawns a 3D Bio-Aura ring restoring +80 HP &amp; +30 Shield.</li>
            <li><span class="kit-key">Q</span> <b>Curveball Flash:</b> Throws a physical 3D flash orb that blinds enemies in LoS.</li>
            <li><span class="kit-key">E</span> <b>Tailwind Dash + Smoke:</b> Instant directional dash + drops vision-blocking smoke.</li>
            <li><span class="kit-key">X</span> <b>Empress Overdrive:</b> +45% Fire Rate, Instant Heal/Reload on Kill &amp; Thermal Wallhack!</li>
          </ul>
        </div>

        <div class="agent-card" data-agent="sage">
          <div class="role-tag">SENTINEL // MEDIC &amp; BARRIER</div>
          <div class="card-title">SAGE-09 (TACTICAL HEALER)</div>
          <ul class="kit-list">
            <li><span class="kit-key">C</span> <b>Radianite Vitality Orb:</b> Full 100 HP &amp; 50 Shield rapid bio-restoration aura.</li>
            <li><span class="kit-key">Q</span> <b>Cryo Slow Orb:</b> Throws a 3D ice projectile that bursts into a 70% slow zone.</li>
            <li><span class="kit-key">E</span> <b>Solid Barrier Wall:</b> Raises a 3-segment physical crystal wall that blocks bullets.</li>
            <li><span class="kit-key">X</span> <b>Aegis Guardian:</b> Deploys an auto-tracking Sentinel Laser Turret + 100 Shield!</li>
          </ul>
        </div>

        <div class="agent-card" data-agent="sova">
          <div class="role-tag">INITIATOR // RECON &amp; SHOCK</div>
          <div class="card-title">SOVA-X (RECON HUNTER)</div>
          <ul class="kit-list">
            <li><span class="kit-key">C</span> <b>Nano-Stim Injector:</b> Restores +75 HP + 30% tactical movement speed boost.</li>
            <li><span class="kit-key">Q</span> <b>Shock Bolt:</b> Fires a physical electric arc bolt dealing up to 110 AoE damage.</li>
            <li><span class="kit-key">E</span> <b>Recon Sonar Dart:</b> Fires a sensor beacon that pulses 3 times, revealing enemies through walls.</li>
            <li><span class="kit-key">X</span> <b>Hunter's Fury Railgun:</b> Grants 3 Wall-Piercing Plasma Railgun blasts (Press X)!</li>
          </ul>
        </div>
      </div>

      <div class="section-label">2. SELECT TACTICAL GAME MODE</div>
      <div class="grid-4" id="mode-select-grid">
        <div class="mode-card selected" data-mode="tactical">
          <div class="role-tag">5V5 ROUND CLUTCH</div>
          <div class="card-title" style="font-size:15px;">SPIKE SITE ASSAULT</div>
          <div class="mode-desc">Eliminate the 5-bot tactical squad or plant &amp; defend the Spike on A-Site.</div>
        </div>
        <div class="mode-card" data-mode="deathmatch">
          <div class="role-tag">CONTINUOUS ACTION</div>
          <div class="card-title" style="font-size:15px;">FFA DEATHMATCH</div>
          <div class="mode-desc">Instant respawns, kills restore health &amp; armor, non-stop gunfights.</div>
        </div>
        <div class="mode-card" data-mode="range">
          <div class="role-tag">FIXED SPAWN BAYS</div>
          <div class="card-title" style="font-size:15px;">PRACTICE RANGE</div>
          <div class="mode-desc">6 Fixed Spawn Bay pads, floating damage numbers, infinite abilities &amp; aim warm-up.</div>
        </div>
        <div class="mode-card" data-mode="raid">
          <div class="role-tag">ESCALATING WAVES</div>
          <div class="card-title" style="font-size:15px;">RADIANITE SURVIVAL</div>
          <div class="mode-desc">Survive aggressive AI waves with heavy armor and bonus credit drops.</div>
        </div>
      </div>

      <div class="controls-strip">
        <div class="ctrl-chip"><b>WASD / L-Stick</b> Move</div>
        <div class="ctrl-chip"><b>Mouse / R-Stick</b> Aim</div>
        <div class="ctrl-chip"><b>LMB / RT</b> Fire</div>
        <div class="ctrl-chip"><b>RMB / LT</b> Scope / ADS</div>
        <div class="ctrl-chip"><b>[R] / [X]</b> 3D Mag Reload</div>
        <div class="ctrl-chip"><b>[F]</b> Inspect Weapon</div>
        <div class="ctrl-chip"><b>[V] / D-Up</b> FPP / TPP View</div>
        <div class="ctrl-chip"><b>[C/Q/E/X]</b> Abilities</div>
        <div class="ctrl-chip"><b>[1/2/3]</b> Primary / Sidearm / Knife</div>
        <div class="ctrl-chip"><b>[4 Hold]</b> Plant Spike</div>
        <div class="ctrl-chip"><b>[B]</b> Pro Buy Menu</div>
      </div>

      <div class="launch-btn-row">
        <div class="settings-inline">
          <label>
            Sensitivity:
            <input type="range" id="sens-slider" min="1" max="10" step="0.5" value="4.5" />
            <span id="sens-val">4.5</span>
          </label>
          <label>
            Bot Difficulty:
            <select id="bot-diff">
              <option value="0.65">IRON / SILVER (Recruit)</option>
              <option value="1.0" selected>DIAMOND / ASCENDANT (Tactical)</option>
              <option value="1.45">RADIANT (Sharpshooter)</option>
            </select>
          </label>
        </div>
        <button class="btn-valorant" id="btn-lock-in">LOCK IN &amp; DEPLOY [CLICK]</button>
      </div>
    </div>
  </div>

  <!-- OVERHAULED VALORANT BUY MENU MODAL ([B]) -->
  <div class="modal-overlay" id="buy-modal">
    <div class="modal-card buy-modal-card">
      <div class="buy-top-bar">
        <div>
          <div class="brand-title">TACTICAL ARMORY <span>// BUY PHASE</span></div>
          <div class="brand-sub">Click any weapon, heavy ordnance, shield, or ability kit to equip immediately. Press <b>[B]</b> to return to combat.</div>
        </div>
        <div class="buy-loadout-summary">
          <div class="loadout-pill">PRIMARY: <b id="shop-curr-primary">VANDAL</b></div>
          <div class="loadout-pill">SIDEARM: <b id="shop-curr-secondary">CLASSIC</b></div>
          <div class="credits-big-box">CREDITS: ¤ <span id="buy-credits-val">4,500</span></div>
        </div>
      </div>

      <div class="buy-grid-pro">
        <!-- COLUMN 1: SIDEARMS -->
        <div class="buy-column">
          <div class="buy-col-header">SIDEARMS <span>[KEY 2]</span></div>

          <div class="pro-shop-card" data-buy-weapon="classic">
            <div class="shop-card-top">
              <span class="shop-wpn-title">CLASSIC</span>
              <span class="shop-wpn-price">FREE</span>
            </div>
            <svg class="wpn-svg" viewBox="0 0 120 42">
              <path d="M25,12 L88,12 L88,23 L48,23 L40,38 L24,38 L30,23 L25,23 Z" fill="#8b978f"/>
              <rect x="35" y="15" width="42" height="3" fill="#00f5d4"/>
            </svg>
            <div class="dmg-matrix">
              <span>HD: <b>78</b></span><span>BD: <b>26</b></span><span>LG: <b>22</b></span>
            </div>
          </div>

          <div class="pro-shop-card" data-buy-weapon="sheriff">
            <div class="shop-card-top">
              <span class="shop-wpn-title">SHERIFF</span>
              <span class="shop-wpn-price">¤ 800</span>
            </div>
            <svg class="wpn-svg" viewBox="0 0 120 42">
              <path d="M18,10 L102,10 L102,20 L54,20 L45,39 L28,39 L34,22 L18,22 Z" fill="#ece8e1"/>
              <circle cx="48" cy="16" r="5" fill="#ff4655"/>
            </svg>
            <div class="dmg-matrix">
              <span>HD: <b>159</b></span><span>BD: <b>55</b></span><span>LG: <b>46</b></span>
            </div>
          </div>
        </div>

        <!-- COLUMN 2: SMGS, SHOTGUNS & HEAVY -->
        <div class="buy-column">
          <div class="buy-col-header">SMGS &amp; HEAVY <span>[KEY 1]</span></div>

          <div class="pro-shop-card" data-buy-weapon="spectre">
            <div class="shop-card-top">
              <span class="shop-wpn-title">SPECTRE</span>
              <span class="shop-wpn-price">¤ 1,600</span>
            </div>
            <svg class="wpn-svg" viewBox="0 0 140 42">
              <path d="M14,14 L124,14 L124,21 L72,21 L68,38 L56,38 L58,23 L38,23 L30,36 L18,36 L24,22 L14,22 Z" fill="#9ec5ab"/>
              <rect x="92" y="15" width="30" height="5" fill="#00f5d4"/>
            </svg>
            <div class="dmg-matrix">
              <span>HD: <b>78</b></span><span>BD: <b>26</b></span><span>ROF: <b>13.3/s</b></span>
            </div>
          </div>

          <div class="pro-shop-card" data-buy-weapon="judge">
            <div class="shop-card-top">
              <span class="shop-wpn-title">JUDGE SHOTGUN</span>
              <span class="shop-wpn-price">¤ 1,850</span>
            </div>
            <svg class="wpn-svg" viewBox="0 0 140 42">
              <path d="M10,13 L122,13 L122,22 L76,22 L76,36 L52,36 L52,22 L28,22 L18,35 L8,35 Z" fill="#f5c542"/>
              <circle cx="64" cy="28" r="9" fill="#ff4655"/>
            </svg>
            <div class="dmg-matrix">
              <span>8 PELLETS</span><span>HD: <b>34x8</b></span><span>AUTO</span>
            </div>
          </div>

          <div class="pro-shop-card" data-buy-weapon="odin">
            <div class="shop-card-top">
              <span class="shop-wpn-title">ODIN MINIGUN</span>
              <span class="shop-wpn-price">¤ 3,200</span>
            </div>
            <svg class="wpn-svg" viewBox="0 0 140 42">
              <rect x="14" y="10" width="66" height="16" fill="#ece8e1"/>
              <rect x="80" y="11" width="50" height="4" fill="#ff4655"/>
              <rect x="80" y="17" width="50" height="4" fill="#00f5d4"/>
              <rect x="42" y="26" width="24" height="14" fill="#f5c542"/>
            </svg>
            <div class="dmg-matrix">
              <span>100 MAG</span><span>HD: <b>95</b></span><span>ROTARY</span>
            </div>
          </div>

          <div class="pro-shop-card special-rpg" data-buy-weapon="rocket">
            <div class="shop-card-top">
              <span class="shop-wpn-title" style="color:#f5c542;">SHOWSTOPPER RPG</span>
              <span class="shop-wpn-price">¤ 3,600</span>
            </div>
            <svg class="wpn-svg" viewBox="0 0 140 42">
              <rect x="12" y="13" width="96" height="12" fill="#f5c542"/>
              <polygon points="108,9 134,19 108,29" fill="#ff4655"/>
            </svg>
            <div class="dmg-matrix">
              <span>185 SPLASH DMG</span><span>3D SHOCKWAVE</span>
            </div>
          </div>
        </div>

        <!-- COLUMN 3: RIFLES & SNIPER -->
        <div class="buy-column">
          <div class="buy-col-header">RIFLES &amp; SNIPER <span>[KEY 1]</span></div>

          <div class="pro-shop-card" data-buy-weapon="phantom">
            <div class="shop-card-top">
              <span class="shop-wpn-title">PHANTOM</span>
              <span class="shop-wpn-price">¤ 2,900</span>
            </div>
            <svg class="wpn-svg" viewBox="0 0 150 42">
              <path d="M8,14 L138,14 L138,20 L82,20 L74,38 L62,38 L66,22 L36,22 L24,35 L10,35 Z" fill="#00f5d4"/>
            </svg>
            <div class="dmg-matrix">
              <span>HD: <b>156</b></span><span>BD: <b>39</b></span><span>SILENCED</span>
            </div>
          </div>

          <div class="pro-shop-card equipped" data-buy-weapon="vandal">
            <div class="shop-card-top">
              <span class="shop-wpn-title">VANDAL</span>
              <span class="shop-wpn-price">¤ 2,900</span>
            </div>
            <svg class="wpn-svg" viewBox="0 0 150 42">
              <path d="M8,13 L134,13 L134,20 L80,20 L70,39 L56,39 L62,22 L34,22 L22,36 L8,36 Z" fill="#ff4655"/>
              <rect x="28" y="15" width="60" height="3" fill="#ece8e1"/>
            </svg>
            <div class="dmg-matrix">
              <span>HD: <b>160 (1-TAP)</b></span><span>BD: <b>40</b></span><span>LG: <b>34</b></span>
            </div>
          </div>

          <div class="pro-shop-card" data-buy-weapon="operator">
            <div class="shop-card-top">
              <span class="shop-wpn-title" style="color:#ff4655;">OPERATOR SNIPER</span>
              <span class="shop-wpn-price">¤ 4,700</span>
            </div>
            <svg class="wpn-svg" viewBox="0 0 150 42">
              <rect x="44" y="6" width="38" height="6" fill="#00f5d4"/>
              <path d="M6,15 L146,15 L146,20 L78,20 L74,36 L62,36 L64,22 L28,22 L16,34 L6,34 Z" fill="#ece8e1"/>
            </svg>
            <div class="dmg-matrix">
              <span>HD: <b>255</b></span><span>BD: <b>150 (1-SHOT)</b></span><span>DUAL ZOOM</span>
            </div>
          </div>
        </div>

        <!-- COLUMN 4: SHIELDS & ABILITY RESUPPLY -->
        <div class="buy-column">
          <div class="buy-col-header">SHIELDS &amp; KIT</div>

          <div class="pro-shop-card" data-buy-util="light_shield">
            <div class="shop-card-top">
              <span class="shop-wpn-title">LIGHT SHIELDS</span>
              <span class="shop-wpn-price">¤ 400</span>
            </div>
            <div class="util-desc">+25 Radianite Armor Absorption (66% Damage Reduction)</div>
          </div>

          <div class="pro-shop-card" data-buy-util="heavy_shield">
            <div class="shop-card-top">
              <span class="shop-wpn-title" style="color:#00f5d4;">HEAVY SHIELDS</span>
              <span class="shop-wpn-price">¤ 1,000</span>
            </div>
            <div class="util-desc">+50 Max Armor + Instant 100 HP Full Bio-Restore</div>
          </div>

          <div class="pro-shop-card" data-buy-util="refill_abilities">
            <div class="shop-card-top">
              <span class="shop-wpn-title">FULL ABILITY KIT</span>
              <span class="shop-wpn-price">¤ 600</span>
            </div>
            <div class="util-desc">Refills [C] Bio-Heal, [Q] Flash/Slow/Shock, and [E] Signature Charges</div>
          </div>

          <div class="pro-shop-card" data-buy-util="ult_orb">
            <div class="shop-card-top">
              <span class="shop-wpn-title" style="color:#f5c542;">RADIANITE ULT ORB</span>
              <span class="shop-wpn-price">¤ 1,200</span>
            </div>
            <div class="util-desc">Instant 100% Ultimate Charge [X] (Empress / Aegis / Hunter's Fury)</div>
          </div>
        </div>
      </div>

      <div class="launch-btn-row" style="margin-top:16px;">
        <button class="btn-secondary" id="btn-switch-agent">CHANGE AGENT / P2P LOBBY [M]</button>
        <button class="btn-valorant" id="btn-close-buy">RESUME COMBAT [B]</button>
      </div>
    </div>
  </div>
</div>

<!-- THREE.JS & PEERJS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>
<script src="game.js"></script>
</body>
</html>
