<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PROTOCOL // ÆTHER v5.0 — Tactical Practice Range & P2P Arena</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- 3D WEBGL VIEWPORT -->
  <div id="game-canvas"></div>
  <div id="flash-screen"></div>

  <!-- FLOATING DAMAGE NUMBERS CONTAINER -->
  <div id="dmg-layer"></div>

  <!-- TACTICAL HUD -->
  <div id="hud">
    <div id="vignette"></div>

    <!-- HOLOGRAPHIC ADS OVERLAY -->
    <div id="ads-overlay">
      <div class="holo-ring"></div>
    </div>

    <!-- OPERATOR SNIPER DUAL-ZOOM SCOPE -->
    <div id="sniper-overlay">
      <div class="sniper-reticle">
        <div class="sniper-line-h"></div>
        <div class="sniper-line-v"></div>
        <div class="sniper-zoom-tag" id="sniper-zoom-label">2.5X ZOOM // [SHIFT] OR [D-RIGHT] FOR 5.0X</div>
      </div>
    </div>

    <!-- TOP-LEFT CAMERA, INPUT & RANGE CONFIG BADGE -->
    <div class="cam-badge">
      <div>VIEW: <span id="cam-mode-label" class="cyan">FPP (1ST PERSON)</span> [V / D-UP]</div>
      <div>INPUT: <span id="pad-status" class="gold">KEYBOARD + MOUSE READY</span></div>
      <div class="range-sub">SHOOT THE 3D CONSOLE BOARD (LEFT WALL) TO CONFIGURE BOTS</div>
    </div>

    <!-- TOP CENTER TELEMETRY & PRACTICE ANALYTICS BAR -->
    <div class="top-bar">
      <div class="score-box">
        <div class="score-label">Eliminations</div>
        <div class="score-val accent" id="hud-kills">0</div>
      </div>
      <div class="score-box">
        <div class="score-label">Headshot %</div>
        <div class="score-val gold" id="hud-hs">0%</div>
      </div>
      <div class="score-box">
        <div class="score-label">Accuracy</div>
        <div class="score-val" id="hud-acc">100%</div>
      </div>
      <div class="score-box" id="rival-score-box">
        <div class="score-label">P2P Rival</div>
        <div class="score-val enemy" id="hud-p2p-kills">0</div>
      </div>
      <div class="score-box" id="timer-score-box">
        <div class="score-label">Challenge</div>
        <div class="score-val" id="hud-timer">FREE</div>
      </div>
    </div>

    <!-- TOP-RIGHT FPS & NETWORK STATUS -->
    <div class="telemetry">
      <span id="fps-counter">144</span> FPS // <span id="net-indicator">TACTICAL RANGE</span>
    </div>

    <!-- 6-WEAPON HOTBAR -->
    <div class="weapon-bar">
      <div class="wpn-slot active" id="slot-w1">[1] VANDAL</div>
      <div class="wpn-slot" id="slot-w2">[2] ODIN MINIGUN</div>
      <div class="wpn-slot" id="slot-w3">[3] SHERIFF</div>
      <div class="wpn-slot" id="slot-w4">[4] OPERATOR</div>
      <div class="wpn-slot rpg" id="slot-w5">[5] ROCKET RPG</div>
      <div class="wpn-slot" id="slot-w6">[6] KARAMBIT</div>
    </div>

    <!-- SMALL CYAN DOT CROSSHAIR -->
    <div id="crosshair-wrap">
      <div id="crosshair-dot"></div>
      <div id="hitmarker"></div>
    </div>

    <div id="banner">RANGE READY</div>
    <div id="killfeed"></div>

    <!-- BOTTOM TACTICAL BAR -->
    <div class="bottom-hud">
      <div class="vitals-panel">
        <div>
          <div class="shield-label">HEALTH</div>
          <div class="hp-val" id="hud-hp">100</div>
        </div>
        <div>
          <div class="shield-label">ARMOR</div>
          <div class="shield-val" id="hud-armor">50</div>
        </div>
      </div>

      <div class="abilities-panel">
        <div class="ability-slot ready" id="slot-c">
          <span class="ability-key">C / LB</span>
          <span class="ability-icon">☀</span>
          <span class="ability-name">Flashbang</span>
          <div class="cd-overlay" id="cd-c"></div>
        </div>
        <div class="ability-slot ready" id="slot-q">
          <span class="ability-key">Q / RB</span>
          <span class="ability-icon">✚</span>
          <span class="ability-name">Bio-Surge</span>
          <div class="cd-overlay" id="cd-q"></div>
        </div>
        <div class="ability-slot ready" id="slot-e">
          <span class="ability-key">E / B</span>
          <span class="ability-icon">⚡</span>
          <span class="ability-name">Tailwind</span>
          <div class="cd-overlay" id="cd-e"></div>
        </div>
        <div class="ability-slot ult" id="slot-x">
          <span class="ability-key">X / LB+RB</span>
          <span class="ability-icon">♛</span>
          <span class="ability-name" id="ult-status">0 / 4</span>
          <div class="cd-overlay" id="cd-x"></div>
        </div>
      </div>

      <div class="ammo-panel">
        <div class="weapon-tag" id="weapon-name">VANDAL // RIFLE</div>
        <div class="ammo-curr" id="hud-ammo">25</div>
        <div class="ammo-mag">/ <span id="hud-mag">75</span></div>
      </div>
    </div>
  </div>

  <!-- ARMORY BUY MENU ([B] KEY) -->
  <div id="buy-menu">
    <div class="game-title" style="font-size:32px;">TACTICAL ARMORY // SELECT LOADOUT</div>
    <div class="game-sub">PRESS [B] OR CLICK TO EQUIP WEAPON</div>
    <div class="buy-grid">
      <div class="buy-card" data-wpn="0">
        <div class="buy-title">[1] VANDAL RIFLE</div>
        <div class="buy-desc">160 Headshot / 40 Body • Precision 1-Tap Rifle</div>
      </div>
      <div class="buy-card" data-wpn="1">
        <div class="buy-title">[2] ODIN MINIGUN</div>
        <div class="buy-desc">100-Round Rotary Gattling • Accelerating Fire Rate</div>
      </div>
      <div class="buy-card" data-wpn="2">
        <div class="buy-title">[3] SHERIFF REVOLVER</div>
        <div class="buy-desc">195 Headshot / 55 Body • High-Caliber Hand Cannon</div>
      </div>
      <div class="buy-card sniper-card" data-wpn="3">
        <div class="buy-title" style="color:#ff4655;">[4] OPERATOR SNIPER</div>
        <div class="buy-desc">255 Headshot / 150 Body (1-Shot Kill) • Dual-Zoom Scope</div>
      </div>
      <div class="buy-card rpg-card" data-wpn="4">
        <div class="buy-title" style="color:#ffbe0b;">[5] SHOWSTOPPER RPG</div>
        <div class="buy-desc">185 Explosive Splash Damage • 3D Shockwave Blast Radius</div>
      </div>
      <div class="buy-card" data-wpn="5">
        <div class="buy-title">[6] REAVER KARAMBIT</div>
        <div class="buy-desc">75 Melee Slash (150 Backstab) • +35% Sprint Speed Boost</div>
      </div>
    </div>
  </div>

  <!-- MAIN MENU & P2P LOBBY -->
  <div id="menu-overlay">
    <div class="menu-card">
      <div class="game-title">PROTOCOL // ÆTHER v5.0</div>
      <div class="game-sub">Modular Practice Facility • 3D Damage Numbers • Fixed Spawn Bays • P2P 1v1 Arena</div>

      <div class="p2p-box">
        <div class="p2p-header">
          PEER-TO-PEER (P2P) 1v1 DUEL LOBBY (AUTO-CLEARS RANGE BOTS & LOCKS ARENA SPAWNS)
        </div>
        <div class="p2p-row">
          <button class="btn-small" id="host-btn">1. Create Room Code</button>
          <input type="text" class="p2p-input" id="room-code-display" readonly placeholder="NO CODE YET">
          <button class="btn-small" id="copy-btn">Copy</button>
        </div>
        <div class="p2p-row">
          <input type="text" class="p2p-input" id="join-code-input" placeholder="ENTER FRIEND CODE">
          <button class="btn-small" id="join-btn">2. Connect to Friend</button>
        </div>
        <div id="p2p-status">STATUS: TACTICAL PRACTICE RANGE ACTIVE (6 FIXED BOT SPAWN BAYS)</div>
      </div>

      <div class="controls-grid">
        <div><span class="ctrl-key">SHOOT 3D BOARD:</span> Toggle Strafe / 150 Armor / 30-Bot Challenge</div>
        <div><span class="ctrl-key">DAMAGE NUMBERS:</span> Gold/Red = Headshot • Cyan = Body Hit</div>
        <div><span class="ctrl-key">MOVE / AIM:</span> WASD + Mouse <span class="pad-key">| L-Stick + R-Stick</span></div>
        <div><span class="ctrl-key">FIRE / SCOPE:</span> L-Click / R-Click <span class="pad-key">| RT / LT</span></div>
        <div><span class="ctrl-key">[1]-[6] / [B]:</span> Vandal / Odin / Sheriff / Sniper / RPG / Knife</div>
        <div><span class="ctrl-key">[V] FPP / TPP:</span> 1st / 3rd Person View <span class="pad-key">| D-Up / Select</span></div>
        <div><span class="ctrl-key">[C] / [Q] / [E]:</span> Flash / Heal / Dash <span class="pad-key">| LB / RB / B</span></div>
        <div><span class="ctrl-key">[F3] RESET STATS:</span> Reset Accuracy & Headshot Telemetry</div>
      </div>

      <div class="settings-row">
        <span>SENSITIVITY: <strong id="sens-val">1.0</strong></span>
        <input type="range" id="sens-slider" min="0.2" max="3.0" step="0.1" value="1.0">
        <button class="btn-small" id="reset-pos-btn">Respawn at Firing Line</button>
      </div>

      <button class="deploy-btn" id="start-btn">ENTER TACTICAL RANGE</button>
    </div>
  </div>

  <!-- EXTERNAL LIBRARIES & MODULAR GAME SCRIPT -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>
  <script src="game.js"></script>
</body>
</html>
