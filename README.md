# valo2.0
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PROTOCOL // ÆTHER v4.0 - P2P Arena, Rocket Launcher & Controller Support</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&display=swap');

  * {
    box-sizing: border-box;
    user-select: none;
    margin: 0;
    padding: 0;
  }

  body, html {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #090c10;
    font-family: 'Rajdhani', sans-serif;
    color: #ece8e1;
  }

  #game-canvas {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  #hud {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  #vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    transition: box-shadow 0.15s ease-out;
  }

  #flash-screen {
    position: absolute;
    inset: 0;
    background: #ffffff;
    opacity: 0;
    pointer-events: none;
    z-index: 6;
    transition: opacity 0.08s linear;
  }

  /* STANDARD HOLO ADS OVERLAY */
  #ads-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.12s ease;
    background: radial-gradient(circle at center, transparent 58%, rgba(0, 245, 212, 0.08) 65%, rgba(9, 12, 16, 0.65) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #ads-overlay.active { opacity: 1; }

  .holo-ring {
    width: 240px;
    height: 240px;
    border: 1.5px solid rgba(0, 245, 212, 0.35);
    border-radius: 50%;
    position: relative;
    box-shadow: 0 0 20px rgba(0, 245, 212, 0.15);
  }

  .holo-ring::before, .holo-ring::after {
    content: '';
    position: absolute;
    background: rgba(255, 70, 85, 0.5);
  }
  .holo-ring::before { top: 50%; left: -18px; right: -18px; height: 1px; }
  .holo-ring::after { left: 50%; top: -18px; bottom: -18px; width: 1px; }

  /* OPERATOR SNIPER DUAL-ZOOM SCOPE */
  #sniper-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.08s ease;
    background: radial-gradient(circle at center, transparent 37%, #05070a 38.5%, #05070a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #sniper-overlay.active { opacity: 1; }

  .sniper-reticle {
    width: 74vh;
    height: 74vh;
    border: 2px solid #00f5d4;
    border-radius: 50%;
    position: relative;
    box-shadow: inset 0 0 40px rgba(0, 245, 212, 0.2);
  }

  .sniper-line-h {
    position: absolute;
    top: 50%; left: 0; right: 0; height: 1px;
    background: rgba(255, 70, 85, 0.85);
  }

  .sniper-line-v {
    position: absolute;
    left: 50%; top: 0; bottom: 0; width: 1px;
    background: rgba(255, 70, 85, 0.85);
  }

  .sniper-zoom-tag {
    position: absolute;
    bottom: 18%; left: 50%;
    transform: translateX(-50%);
    background: rgba(9, 12, 16, 0.85);
    border: 1px solid #00f5d4;
    padding: 3px 12px;
    font-size: 13px;
    font-weight: 800;
    color: #00f5d4;
    letter-spacing: 2px;
  }

  /* TOP SCOREBOARD BAR */
  .top-bar {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 28px;
    background: rgba(15, 25, 35, 0.9);
    padding: 8px 32px;
    border-top: 3px solid #ff4655;
    clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 100%, 0 100%);
    backdrop-filter: blur(6px);
  }

  .score-box { text-align: center; }
  .score-label { font-size: 11px; letter-spacing: 2px; color: #8b978f; text-transform: uppercase; }
  .score-val { font-size: 28px; font-weight: 800; color: #ece8e1; line-height: 1; }
  .score-val.accent { color: #00f5d4; }
  .score-val.enemy { color: #ff4655; }

  /* TELEMETRY & BADGES */
  .telemetry {
    position: absolute;
    top: 16px;
    right: 24px;
    text-align: right;
    font-size: 13px;
    letter-spacing: 1.5px;
    color: #00f5d4;
    background: rgba(15, 25, 35, 0.85);
    padding: 6px 14px;
    border-right: 3px solid #00f5d4;
  }

  .cam-badge {
    position: absolute;
    top: 16px;
    left: 24px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: #ece8e1;
    background: rgba(15, 25, 35, 0.85);
    padding: 6px 14px;
    border-left: 3px solid #ffbe0b;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* 6-SLOT WEAPON HOTBAR */
  .weapon-bar {
    position: absolute;
    bottom: 115px;
    right: 50px;
    display: flex;
    gap: 6px;
  }

  .wpn-slot {
    background: rgba(15, 25, 35, 0.82);
    border: 1px solid rgba(255,255,255,0.12);
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #8b978f;
    transition: all 0.12s;
  }

  .wpn-slot.active {
    color: #090c10;
    background: #00f5d4;
    border-color: #00f5d4;
    box-shadow: 0 0 12px rgba(0, 245, 212, 0.4);
  }

  /* PRECISION SMALL DOT CROSSHAIR */
  #crosshair-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #crosshair-dot {
    width: 4px;
    height: 4px;
    background-color: #00ffff;
    border-radius: 50%;
    box-shadow: 0 0 2px #000, 0 0 6px #00ffff;
  }

  #hitmarker {
    position: absolute;
    width: 22px;
    height: 22px;
    opacity: 0;
    transition: opacity 0.05s ease-out, transform 0.05s ease-out;
    transform: scale(0.7);
  }

  #hitmarker::before, #hitmarker::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 100%; height: 2px;
    background: #ffffff;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  #hitmarker::after { transform: translate(-50%, -50%) rotate(-45deg); }
  #hitmarker.headshot::before, #hitmarker.headshot::after {
    background: #ff4655;
    height: 3px;
    box-shadow: 0 0 8px #ff4655;
  }

  #killfeed {
    position: absolute;
    top: 75px;
    right: 24px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-end;
  }

  .kill-item {
    background: rgba(15, 25, 35, 0.9);
    border-right: 3px solid #ff4655;
    padding: 4px 12px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  /* BOTTOM HUD */
  .bottom-hud {
    position: absolute;
    bottom: 24px;
    left: 0;
    width: 100%;
    padding: 0 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .vitals-panel {
    display: flex;
    align-items: baseline;
    gap: 18px;
    background: linear-gradient(90deg, rgba(15,25,35,0.92) 0%, rgba(15,25,35,0.4) 100%);
    padding: 12px 28px;
    border-left: 4px solid #00f5d4;
    min-width: 260px;
  }

  .hp-val {
    font-size: 54px;
    font-weight: 800;
    line-height: 0.9;
    color: #ffffff;
    text-shadow: 0 0 15px rgba(0, 245, 212, 0.35);
  }

  .shield-label { font-size: 11px; color: #8b978f; letter-spacing: 1.5px; }
  .shield-val { font-size: 26px; font-weight: 700; color: #00f5d4; }

  .abilities-panel {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }

  .ability-slot {
    width: 78px;
    height: 78px;
    background: rgba(15, 25, 35, 0.9);
    border: 1px solid rgba(236, 232, 225, 0.2);
    border-bottom: 3px solid #ece8e1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 6px;
    position: relative;
  }

  .ability-slot.ready { border-bottom-color: #00f5d4; }
  .ability-slot.ult.ready {
    border-bottom-color: #ff4655;
    background: rgba(255, 70, 85, 0.2);
    box-shadow: 0 0 20px rgba(255, 70, 85, 0.4);
  }
  .ability-slot.cooldown { opacity: 0.45; border-bottom-color: #ff4655; }
  .ability-key { font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.12); padding: 1px 6px; }
  .ability-icon { font-size: 22px; font-weight: 800; color: #00f5d4; }
  .ability-slot.ult .ability-icon { color: #ff4655; }
  .ability-name { font-size: 10px; letter-spacing: 1px; color: #8b978f; text-transform: uppercase; }

  .cd-overlay {
    position: absolute;
    inset: 0;
    background: rgba(9, 12, 16, 0.88);
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 800;
    color: #ff4655;
  }

  .ammo-panel {
    display: flex;
    align-items: baseline;
    gap: 12px;
    background: linear-gradient(270deg, rgba(15,25,35,0.92) 0%, rgba(15,25,35,0.4) 100%);
    padding: 12px 28px;
    border-right: 4px solid #ff4655;
    min-width: 260px;
    justify-content: flex-end;
  }

  .ammo-curr { font-size: 54px; font-weight: 800; line-height: 0.9; color: #ffffff; }
  .ammo-mag { font-size: 24px; font-weight: 700; color: #8b978f; }
  .weapon-tag { font-size: 12px; letter-spacing: 1.5px; color: #ff4655; margin-right: auto; align-self: center; font-weight: 800; }

  #banner {
    position: absolute;
    top: 22%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    font-size: 34px;
    font-weight: 800;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: #ece8e1;
    text-shadow: 0 0 25px rgba(255, 70, 85, 0.85);
    opacity: 0;
    transition: all 0.2s ease;
    pointer-events: none;
  }

  /* BUY MENU MODAL ([B] KEY) */
  #buy-menu {
    position: absolute;
    inset: 0;
    z-index: 8;
    background: rgba(9, 12, 16, 0.88);
    backdrop-filter: blur(8px);
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .buy-grid {
    display: grid;
    grid-template-columns: repeat(3, 260px);
    gap: 16px;
    margin-top: 20px;
  }

  .buy-card {
    background: rgba(15, 25, 35, 0.95);
    border: 1px solid rgba(0, 245, 212, 0.3);
    border-left: 4px solid #00f5d4;
    padding: 18px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .buy-card:hover {
    background: rgba(0, 245, 212, 0.15);
    transform: translateY(-2px);
  }

  .buy-title { font-size: 20px; font-weight: 800; color: #ece8e1; }
  .buy-desc { font-size: 13px; color: #8b978f; margin-top: 4px; }

  /* MAIN MENU & P2P LOBBY */
  #menu-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    background: radial-gradient(circle at center, rgba(15, 25, 35, 0.85) 0%, rgba(9, 12, 16, 0.97) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
  }

  .menu-card {
    background: rgba(15, 25, 35, 0.95);
    border: 1px solid rgba(255, 70, 85, 0.35);
    border-top: 4px solid #ff4655;
    padding: 26px 40px;
    max-width: 840px;
    width: 95%;
    text-align: center;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
  }

  .game-title { font-size: 42px; font-weight: 800; letter-spacing: 5px; color: #ece8e1; }
  .game-sub { font-size: 13px; letter-spacing: 3px; color: #00f5d4; margin-bottom: 14px; text-transform: uppercase; }

  .p2p-box {
    background: rgba(9, 12, 16, 0.75);
    border: 1px solid rgba(0, 245, 212, 0.35);
    padding: 14px;
    margin-bottom: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .p2p-row {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .p2p-input {
    background: #090c10;
    border: 1px solid #00f5d4;
    color: #00f5d4;
    padding: 7px 14px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-align: center;
    width: 190px;
    text-transform: uppercase;
  }

  .btn-small {
    background: #1e2c3a;
    color: #ece8e1;
    border: 1px solid #00f5d4;
    padding: 7px 15px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1.5px;
    cursor: pointer;
    text-transform: uppercase;
    transition: 0.15s;
  }

  .btn-small:hover {
    background: #00f5d4;
    color: #090c10;
  }

  #p2p-status {
    font-size: 13px;
    color: #ffbe0b;
    letter-spacing: 1.5px;
    font-weight: 700;
  }

  .controls-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 18px;
    text-align: left;
    margin-bottom: 14px;
    background: rgba(9, 12, 16, 0.55);
    padding: 12px 18px;
    border-left: 3px solid #ff4655;
    font-size: 13.5px;
  }

  .ctrl-key { color: #00f5d4; font-weight: 800; margin-right: 6px; }
  .pad-key { color: #ffbe0b; font-weight: 800; margin-left: 4px; }

  .settings-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin-bottom: 16px;
    font-size: 14px;
  }

  .deploy-btn {
    background: #ff4655;
    color: #ece8e1;
    border: none;
    padding: 13px 46px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 4px;
    text-transform: uppercase;
    cursor: pointer;
    clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
    transition: 0.15s;
  }

  .deploy-btn:hover {
    background: #00f5d4;
    color: #090c10;
    box-shadow: 0 0 25px rgba(0, 245, 212, 0.5);
  }
</style>
</head>
<body>

<div id="game-canvas"></div>
<div id="flash-screen"></div>

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

  <!-- CAMERA & CONTROLLER BADGE -->
  <div class="cam-badge">
    <div>VIEW: <span id="cam-mode-label" style="color:#00f5d4;">FPP (1ST PERSON)</span> [V / D-UP]</div>
    <div>INPUT: <span id="pad-status" style="color:#ffbe0b;">KEYBOARD + MOUSE READY</span></div>
  </div>

  <div class="top-bar">
    <div class="score-box">
      <div class="score-label">Your Kills</div>
      <div class="score-val accent" id="hud-kills">0</div>
    </div>
    <div class="score-box">
      <div class="score-label">Rival Kills</div>
      <div class="score-val enemy" id="hud-p2p-kills">0</div>
    </div>
    <div class="score-box" id="bots-score-box">
      <div class="score-label">AI Bots</div>
      <div class="score-val" id="hud-bots">4</div>
    </div>
  </div>

  <div class="telemetry">
    <span id="fps-counter">144</span> FPS // <span id="net-indicator">PRACTICE RANGE</span>
  </div>

  <div class="weapon-bar">
    <div class="wpn-slot active" id="slot-w1">[1] VANDAL</div>
    <div class="wpn-slot" id="slot-w2">[2] ODIN MINIGUN</div>
    <div class="wpn-slot" id="slot-w3">[3] SHERIFF</div>
    <div class="wpn-slot" id="slot-w4">[4] OPERATOR</div>
    <div class="wpn-slot" id="slot-w5" style="border-color:#ffbe0b;">[5] ROCKET LAUNCHER</div>
    <div class="wpn-slot" id="slot-w6">[6] KARAMBIT</div>
  </div>

  <div id="crosshair-wrap">
    <div id="crosshair-dot"></div>
    <div id="hitmarker"></div>
  </div>

  <div id="banner">ROUND START</div>
  <div id="killfeed"></div>

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

<!-- BUY MENU ([B] KEY) -->
<div id="buy-menu">
  <div class="game-title" style="font-size:32px;">ARMORY // SELECT LOADOUT</div>
  <div class="game-sub">PRESS [B] OR CLICK TO EQUIP WEAPON</div>
  <div class="buy-grid">
    <div class="buy-card" data-wpn="0">
      <div class="buy-title">[1] VANDAL RIFLE</div>
      <div class="buy-desc">160 Headshot / 40 Body • Direct Precision Hitscan</div>
    </div>
    <div class="buy-card" data-wpn="1">
      <div class="buy-title">[2] ODIN MINIGUN</div>
      <div class="buy-desc">100-Round Rotary Gattling • Accelerating Fire Rate</div>
    </div>
    <div class="buy-card" data-wpn="2">
      <div class="buy-title">[3] SHERIFF REVOLVER</div>
      <div class="buy-desc">195 Headshot / 55 Body • High-Caliber Hand Cannon</div>
    </div>
    <div class="buy-card" data-wpn="3" style="border-left-color:#ff4655;">
      <div class="buy-title" style="color:#ff4655;">[4] OPERATOR SNIPER</div>
      <div class="buy-desc">255 Headshot / 150 Body (1-Shot Kill) • Dual-Zoom Scope</div>
    </div>
    <div class="buy-card" data-wpn="4" style="border-left-color:#ffbe0b;">
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
    <div class="game-title">PROTOCOL // ÆTHER v4.0</div>
    <div class="game-sub">1v1 P2P Duel Arena • Showstopper Rocket Launcher • Articulated Agents • Controller + KB/M</div>

    <div class="p2p-box">
      <div style="font-size:14px; font-weight:800; color:#ece8e1; letter-spacing:1.5px;">
        PEER-TO-PEER (P2P) 1v1 DUEL ARENA (AUTO-HIDES BOTS & USES FIXED BASE SPAWNS)
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
      <div id="p2p-status">STATUS: SOLO RANGE (CONNECT P2P TO ENTER 1v1 ARENA)</div>
    </div>

    <div class="controls-grid">
      <div><span class="ctrl-key">MOVE / AIM:</span> WASD + Mouse <span class="pad-key">| L-Stick + R-Stick</span></div>
      <div><span class="ctrl-key">FIRE / SCOPE:</span> L-Click / R-Click <span class="pad-key">| RT / LT</span></div>
      <div><span class="ctrl-key">[5] ROCKET RPG:</span> High-Explosive Splash <span class="pad-key">| [Y] Cycle Gun</span></div>
      <div><span class="ctrl-key">[4] OPERATOR:</span> 1-Shot Sniper + [SHIFT] Zoom <span class="pad-key">| D-Right</span></div>
      <div><span class="ctrl-key">[V] FPP / TPP:</span> 1st / 3rd Person View <span class="pad-key">| D-Up / Select</span></div>
      <div><span class="ctrl-key">[C] / [Q]:</span> Flashbang / Heal +75 HP <span class="pad-key">| LB / RB</span></div>
      <div><span class="ctrl-key">[E] TAILWIND:</span> Directional Jett Dash <span class="pad-key">| [B] Button</span></div>
      <div><span class="ctrl-key">[X] OVERDRIVE:</span> Infinite Ammo + Rapid Fire <span class="pad-key">| LB + RB</span></div>
    </div>

    <div class="settings-row">
      <span>MOUSE / STICK SENSITIVITY: <strong id="sens-val">1.0</strong></span>
      <input type="range" id="sens-slider" min="0.2" max="3.0" step="0.1" value="1.0">
      <label style="cursor:pointer; display:flex; align-items:center; gap:6px;" id="bot-toggle-wrap">
        <input type="checkbox" id="toggle-bots" checked> PRACTICE BOTS (AUTO-OFF IN P2P)
      </label>
    </div>

    <button class="deploy-btn" id="start-btn">DEPLOY TO ARENA</button>
  </div>
</div>

<!-- THREE.JS & PEERJS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>

<script>
(() => {
  // =========================================================
  // 1. PROCEDURAL AUDIO SYNTHESIZER (GUNS, SNIPER & ROCKET)
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
        // Rocket launch whoosh + ignition punch
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.28);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.3);
        return;
      }

      if (wpnKey === 'OPERATOR') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(125, now);
        osc.frequency.exponentialRampToValueAtTime(22, now + 0.34);
        gain.gain.setValueAtTime(0.65, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.36);
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
      // Sub-bass boom
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(18, now + 0.55);
      gain.gain.setValueAtTime(0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.58);

      // White noise blast roar
      const bufSize = this.ctx.sampleRate * 0.45;
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.55, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      noise.connect(filter); filter.connect(nGain); nGain.connect(this.ctx.destination);
      noise.start(now);
    }

    playHit(isHead) {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isHead ? 2100 : 540, now);
      if (isHead) osc.frequency.setValueAtTime(2800, now + 0.03);
      gain.gain.setValueAtTime(isHead ? 0.48 : 0.26, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isHead ? 0.14 : 0.06));
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.15);
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
  // 2. ARTICULATED HUMANOID AGENT BUILDER (NO BOX AVATARS!)
  // =========================================================
  function createStructuredAgentMesh(primaryHex, accentHex, visorHex, userDataRef) {
    const root = new THREE.Group();

    const armorMat = new THREE.MeshStandardMaterial({ color: primaryHex, roughness: 0.35, metalness: 0.55 });
    const darkJointMat = new THREE.MeshStandardMaterial({ color: 0x11161d, roughness: 0.6, metalness: 0.3 });
    const accentMat = new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.3, emissive: accentHex, emissiveIntensity: 0.25 });
    const visorMat = new THREE.MeshBasicMaterial({ color: visorHex });

    // Hitbox references for precise head & body registration
    const bodyParts = [];

    // 1. Pelvis / Tactical Belt
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.28, 10), darkJointMat);
    pelvis.position.y = 1.02;
    root.add(pelvis);
    bodyParts.push(pelvis);

    // 2. Sculpted V-Taper Chest Torso + Glowing Reactor Core
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.32, 0.78, 10), armorMat);
    chest.position.y = 1.54;
    root.add(chest);
    bodyParts.push(chest);

    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.52, 0.44), armorMat);
    chestPlate.position.y = 1.58;
    root.add(chestPlate);
    bodyParts.push(chestPlate);

    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.46, 8), visorMat);
    core.rotation.x = Math.PI / 2;
    core.position.set(0, 1.6, 0);
    root.add(core);

    // 3. Tactical Collar & Neck
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.06, 8, 14), accentMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.96;
    root.add(collar);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.22, 10), darkJointMat);
    neck.position.y = 2.08;
    root.add(neck);

    // 4. Sculpted Cyber Helmet + Visor + Ear Comms (Headshot Target)
    const headGroup = new THREE.Group();
    headGroup.position.y = 2.38;

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), armorMat);
    helmet.scale.set(0.92, 1.08, 1.02);
    headGroup.add(helmet);

    const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.14, 12, 1, false, -Math.PI * 0.35, Math.PI * 0.7), visorMat);
    visor.rotation.y = Math.PI;
    visor.position.set(0, 0.03, 0.03);
    headGroup.add(visor);

    const earL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.16), accentMat);
    earL.position.set(-0.31, 0.02, 0);
    const earR = earL.clone();
    earR.position.x = 0.31;
    headGroup.add(earL, earR);

    root.add(headGroup);

    // 5. Articulated Left & Right Arms (Shoulder Pauldron + Upper Arm + Forearm + Gauntlet)
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

    // 6. Articulated Left & Right Legs (Thigh + Knee Pad + Shin + Tactical Boot)
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

    // Tag all hitboxes if userDataRef is provided
    if (userDataRef) {
      helmet.userData = { ...userDataRef, part: 'head' };
      visor.userData = { ...userDataRef, part: 'head' };
      bodyParts.forEach(p => {
        p.userData = { ...userDataRef, part: 'body' };
      });
    }

    return {
      root,
      helmet,
      bodyParts,
      armL,
      armR,
      legL,
      legR
    };
  }

  // =========================================================
  // 3. THREE.JS SCENE & SYMMETRICAL 1v1 DUEL ARENA
  // =========================================================
  const container = document.getElementById('game-canvas');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e14);
  scene.fog = new THREE.FogExp2(0x0a0e14, 0.009);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 240);
  const playerYaw = new THREE.Object3D();
  const playerPitch = new THREE.Object3D();

  // Fixed Spawn Constants for Symmetrical Arena
  const SPAWN_HOST = { x: 0, y: 2.6, z: 38, yaw: 0 };           // South Attacker Base facing North
  const SPAWN_JOIN = { x: 0, y: 2.6, z: -38, yaw: Math.PI };    // North Defender Base facing South

  playerYaw.position.set(SPAWN_HOST.x, SPAWN_HOST.y, SPAWN_HOST.z);
  playerYaw.add(playerPitch);
  playerPitch.add(camera);
  scene.add(playerYaw);

  // Build Local Player Structured Agent for TPP View
  const selfAgent = createStructuredAgentMesh(0x1b2634, 0xff4655, 0x00f5d4, null);
  selfAgent.root.position.set(0, -2.6, 0);
  selfAgent.root.visible = false;
  playerYaw.add(selfAgent.root);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xdbe6f0, 0.75));
  const dirLight = new THREE.DirectionalLight(0xfff4e6, 0.85);
  dirLight.position.set(30, 60, 40);
  scene.add(dirLight);

  function createGridTex(bg, line) {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.strokeRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  const floorTex = createGridTex('#121a24', '#1d2b3a');
  floorTex.repeat.set(45, 45);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(92, 92),
    new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.8 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const wallTex = createGridTex('#1b2531', '#ff4655');
  wallTex.repeat.set(20, 4);
  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.5 });

  const coverTex = createGridTex('#1e2c3a', '#00f5d4');
  coverTex.repeat.set(2, 2);
  const coverMat = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.5 });

  const radTex = createGridTex('#163832', '#00f5d4');
  const radMat = new THREE.MeshStandardMaterial({ map: radTex, roughness: 0.3, emissive: 0x002b24 });

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
  }

  // Symmetrical 1v1 Competitive Arena Layout
  addBox(0, 0, -45, 90, 12, 2, wallMat);
  addBox(0, 0, 45, 90, 12, 2, wallMat);
  addBox(-45, 0, 0, 2, 12, 90, wallMat);
  addBox(45, 0, 0, 2, 12, 90, wallMat);

  // glowing Spawn Base Pads (South Cyan Pad & North Gold/Red Pad)
  const southPad = new THREE.Mesh(
    new THREE.CylinderGeometry(3.8, 3.8, 0.1, 24),
    new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.35 })
  );
  southPad.position.set(0, 0.06, 38);
  scene.add(southPad);

  const northPad = new THREE.Mesh(
    new THREE.CylinderGeometry(3.8, 3.8, 0.1, 24),
    new THREE.MeshBasicMaterial({ color: 0xff4655, transparent: true, opacity: 0.35 })
  );
  northPad.position.set(0, 0.06, -38);
  scene.add(northPad);

  // Spawn Base Head-Glitch Shields (Prevents instant spawn-sniping)
  addBox(0, 0, 31, 7, 3.2, 1.5, coverMat);
  addBox(0, 0, -31, 7, 3.2, 1.5, coverMat);

  // Center Radianite Tower & Symmetrical Wing Lanes
  addBox(0, 0, 0, 6.5, 5.5, 6.5, radMat);
  addBox(-15, 0, -10, 6, 4.5, 3, coverMat);
  addBox(15, 0, -10, 6, 4.5, 3, coverMat);
  addBox(-15, 0, 10, 6, 4.5, 3, coverMat);
  addBox(15, 0, 10, 6, 4.5, 3, coverMat);
  addBox(-10, 0, -22, 8, 5, 2.5, radMat);
  addBox(10, 0, 22, 8, 5, 2.5, radMat);
  addBox(10, 0, -22, 8, 5, 2.5, radMat);
  addBox(-10, 0, 22, 8, 5, 2.5, radMat);

  // =========================================================
  // 4. 6-WEAPON ARSENAL (INCLUDING SHOWSTOPPER ROCKET LAUNCHER)
  // =========================================================
  const WEAPONS = [
    {
      id: 'VANDAL', name: 'VANDAL // RIFLE',
      ammo: 25, maxAmmo: 25, reserve: 75,
      fireRate: 0.098, headDmg: 160, bodyDmg: 40,
      speedMult: 1.0, spread: 0.011, reloadTime: 1100
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

  // Build 3D Weapon Models
  const weaponRoot = new THREE.Group();
  playerPitch.add(weaponRoot);

  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1c2128, metalness: 0.7, roughness: 0.3 });
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

  // 4: SHOWSTOPPER ROCKET LAUNCHER MESH
  const rocketLauncherMesh = new THREE.Group();
  const rlTube = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.95, 14), darkMetal);
  rlTube.rotation.x = Math.PI / 2;
  rlTube.position.set(0, 0.04, -0.2);
  const rlMuzzleCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.105, 0.14, 14), neonGold);
  rlMuzzleCollar.rotation.x = Math.PI / 2;
  rlMuzzleCollar.position.set(0, 0.04, -0.66);
  const rlExhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.12, 0.16, 14), neonRed);
  rlExhaust.rotation.x = Math.PI / 2;
  rlExhaust.position.set(0, 0.04, 0.28);
  const rlWarheadTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 12), neonRed);
  rlWarheadTip.rotation.x = -Math.PI / 2;
  rlWarheadTip.position.set(0, 0.04, -0.76);
  rocketLauncherMesh.add(rlTube, rlMuzzleCollar, rlExhaust, rlWarheadTip);
  rocketLauncherMesh.visible = false;
  weaponRoot.add(rocketLauncherMesh);

  // 5: Karambit Knife
  const knifeMesh = new THREE.Group();
  const kRing = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.008, 8, 16), neonPurple);
  const kHandle = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.11, 0.035), darkMetal);
  kHandle.position.set(0, 0.07, 0);
  const kBlade = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.18, 4), neonCyan);
  kBlade.position.set(0, 0.18, -0.04);
  kBlade.rotation.x = -0.55;
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
  // 5. P2P MULTIPLAYER ARENA, FIXED SPAWNS & VERIFIED SCORING
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
    remoteOpponent.agent = createStructuredAgentMesh(0x282218, 0xffbe0b, 0xff4655, { isRemotePlayer: true });
    remoteOpponent.agent.root.position.set(0, -100, 0);
    scene.add(remoteOpponent.agent.root);
  }
  buildRemoteOpponentAvatar();

  function respawnAtArenaBase() {
    const base = isHostPlayer ? SPAWN_HOST : SPAWN_JOIN;
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

      // 1. Hide & Purge all AI Bots immediately in P2P Mode!
      botsEnabled = false;
      document.getElementById('toggle-bots').checked = false;
      document.getElementById('bot-toggle-wrap').style.opacity = '0.4';
      document.getElementById('bots-score-box').style.display = 'none';
      while (bots.length > 0) bots[0].remove();

      // 2. Reset Scores & Teleport both players to their Fixed Arena Spawn Bases
      player.kills = 0;
      remoteOpponent.kills = 0;
      respawnAtArenaBase();

      const rivalSpawn = isHostPlayer ? SPAWN_JOIN : SPAWN_HOST;
      remoteOpponent.targetPos.set(rivalSpawn.x, 0, rivalSpawn.z);
      remoteOpponent.agent.root.position.copy(remoteOpponent.targetPos);

      document.getElementById('p2p-status').textContent = 'STATUS: P2P ARENA LIVE! BOTS HIDDEN • FIXED BASE SPAWNS ACTIVE';
      document.getElementById('p2p-status').style.color = '#00f5d4';
      document.getElementById('net-indicator').textContent = 'P2P 1v1 ARENA';
      showBanner('1V1 ARENA LIVE');
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
        // Verified deduplicated P2P Score Algorithm
        if (data.deathId && data.deathId !== lastProcessedDeathId) {
          lastProcessedDeathId = data.deathId;
          player.kills++;
          if (!player.ultActive && player.ultPoints < player.maxUltPoints) {
            player.ultPoints++;
          }
          if (player.ultActive) {
            player.hp = 100;
            player.armor = 50;
          }
          addKillfeed('RIVAL (P2P)', data.wpnName || 'WEAPON', data.isHead);
          showBanner(`ROUND WON // ${player.kills} - ${remoteOpponent.kills}`);
          // Reset winner back to base for next clean 1v1 duel round
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
    peer.on('error', (err) => {
      document.getElementById('p2p-status').textContent = 'P2P ERROR: ' + err.type;
    });
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
  // 6. ARTICULATED AI BOTS (PRACTICE RANGE ONLY - HIDDEN IN P2P)
  // =========================================================
  const bots = [];
  const headHitboxes = [];
  const bodyHitboxes = [];
  let botsEnabled = true;

  class BotUnit {
    constructor(x, z) {
      this.hp = 100;
      this.maxHp = 100;
      this.speed = 6.2;
      this.blindTimer = 0;
      this.lastShot = 0;
      this.strafeDir = Math.random() > 0.5 ? 1 : -1;
      this.strafeTimer = 0;
      this.walkCycle = Math.random() * 10;

      this.agent = createStructuredAgentMesh(0x232b38, 0xff4655, 0xffbe0b, { bot: this });
      this.group = this.agent.root;
      this.group.position.set(x, 0, z);

      headHitboxes.push(this.agent.helmet);
      this.agent.bodyParts.forEach(p => bodyHitboxes.push(p));

      this.blindRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.45, 0.05, 6, 16),
        new THREE.MeshBasicMaterial({ color: 0xffbe0b })
      );
      this.blindRing.rotation.x = Math.PI / 2;
      this.blindRing.position.y = 2.95;
      this.blindRing.visible = false;
      this.group.add(this.blindRing);

      scene.add(this.group);
    }

    takeDamage(dmg, isHead, wpnName) {
      if (this.hp <= 0) return;
      this.hp -= dmg;

      if (this.hp <= 0) {
        spawnSparks(this.group.position.clone().add(new THREE.Vector3(0, 1.8, 0)), 0xff4655, 14);
        this.remove();
        player.kills++;
        if (!player.ultActive && player.ultPoints < player.maxUltPoints) player.ultPoints++;
        if (player.ultActive) {
          player.hp = Math.min(100, player.hp + 50);
          player.armor = Math.min(50, player.armor + 25);
        }
        addKillfeed('BOT-UNIT', wpnName || WEAPONS[currentWpnIdx].id, isHead);
        updateHUD();
        if (botsEnabled && !p2pConnected && bots.length === 0) {
          setTimeout(spawnBots, 1200);
        }
      }
    }

    remove() {
      scene.remove(this.group);
      const hIdx = headHitboxes.indexOf(this.agent.helmet);
      if (hIdx > -1) headHitboxes.splice(hIdx, 1);
      this.agent.bodyParts.forEach(p => {
        const bIdx = bodyHitboxes.indexOf(p);
        if (bIdx > -1) bodyHitboxes.splice(bIdx, 1);
      });
      const idx = bots.indexOf(this);
      if (idx > -1) bots.splice(idx, 1);
    }

    update(dt, playerPos, time) {
      if (this.blindTimer > 0) {
        this.blindTimer -= dt;
        this.blindRing.visible = true;
        this.blindRing.rotation.z += dt * 8;
        return;
      }
      this.blindRing.visible = false;

      this.group.lookAt(playerPos.x, 0, playerPos.z);

      this.strafeTimer -= dt;
      if (this.strafeTimer <= 0) {
        this.strafeDir *= -1;
        this.strafeTimer = 1.0 + Math.random() * 1.4;
      }

      const toP = new THREE.Vector3().subVectors(playerPos, this.group.position);
      toP.y = 0;
      const dist = toP.length();
      toP.normalize();
      const right = new THREE.Vector3(-toP.z, 0, toP.x);

      const move = new THREE.Vector3();
      if (dist > 14) move.addScaledVector(toP, 0.7);
      else if (dist < 8) move.addScaledVector(toP, -0.5);
      move.addScaledVector(right, this.strafeDir * 0.8);
      move.normalize().multiplyScalar(this.speed * dt);

      const next = this.group.position.clone().add(move);
      if (!checkCylinderCollision(next.x, 1.0, next.z, 0.75)) {
        this.group.position.copy(next);
      } else {
        this.strafeDir *= -1;
      }

      // Articulated Walk Cycle Animation
      this.walkCycle += dt * 11;
      this.agent.legL.rotation.x = Math.sin(this.walkCycle) * 0.45;
      this.agent.legR.rotation.x = -Math.sin(this.walkCycle) * 0.45;
      this.agent.armL.rotation.x = -Math.sin(this.walkCycle) * 0.35;
      this.agent.armR.rotation.x = Math.sin(this.walkCycle) * 0.35;

      if (time - this.lastShot > 1.2 && dist < 46) {
        this.lastShot = time;
        const eye = this.group.position.clone().add(new THREE.Vector3(0, 2.3, 0));
        const dir = new THREE.Vector3().subVectors(playerPos, eye).normalize();
        const ray = new THREE.Raycaster(eye, dir, 0.5, dist);
        if (ray.intersectObjects(envMeshes, false).length === 0) {
          spawnTracer(eye, playerPos.clone().add(new THREE.Vector3((Math.random()-0.5)*1.4, -0.4, (Math.random()-0.5)*1.4)), 0xff4655);
          if (Math.random() < 0.32) damagePlayer(12, false, 'BOT', false);
        }
      }
    }
  }

  function spawnBots() {
    if (!botsEnabled || p2pConnected) return;
    const pts = [[-22, -24], [22, -24], [-22, 12], [22, 12]];
    pts.forEach(p => bots.push(new BotUnit(p[0], p[1])));
    updateHUD();
  }

  document.getElementById('toggle-bots').addEventListener('change', (e) => {
    if (p2pConnected) {
      e.target.checked = false;
      return;
    }
    botsEnabled = e.target.checked;
    if (!botsEnabled) {
      while (bots.length > 0) bots[0].remove();
    } else if (bots.length === 0) {
      spawnBots();
    }
    updateHUD();
  });

  // =========================================================
  // 7. CAMERA, DIRECT HITSCAN & SHOWSTOPPER ROCKET ENGINE
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
    ultPoints: 0, maxUltPoints: 4,
    ultActive: false, ultTimer: 0,
    lastShotTime: 0,
    odinSpin: 0,
    knifeAnim: 0,
    cds: { c: 0, q: 0, e: 0 }
  };

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

  // SHOWSTOPPER 3D ROCKET PROJECTILE & EXPLOSION
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

    // Expanding 3D Shockwave Sphere
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0xff4655,
      transparent: true,
      opacity: 0.75,
      wireframe: false
    });
    const shockSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 18), shockMat);
    shockSphere.position.copy(pos);
    scene.add(shockSphere);
    activeExplosions.push({ mesh: shockSphere, mat: shockMat, scale: 1.0, life: 0.35 });

    if (!isLocalOwner) return;

    const blastRadius = 9.5;
    // Splash Damage vs AI Bots
    for (let i = bots.length - 1; i >= 0; i--) {
      const b = bots[i];
      const d = b.group.position.distanceTo(pos);
      if (d < blastRadius) {
        const dmg = Math.round(185 * (1 - (d / blastRadius) * 0.6));
        b.takeDamage(dmg, false, 'ROCKET');
        sfx.playHit(false);
        triggerHitmarker(true);
      }
    }

    // Splash Damage vs P2P Rival
    if (remoteOpponent.active && p2pConnected && conn) {
      const d = remoteOpponent.agent.root.position.distanceTo(pos);
      if (d < blastRadius) {
        const dmg = Math.round(185 * (1 - (d / blastRadius) * 0.6));
        conn.send({ type: 'hit', dmg, isHead: false, wpnName: 'ROCKET' });
        sfx.playHit(true);
        triggerHitmarker(true);
      }
    }
  }

  // DIRECT HITSCAN / ROCKET FIRE (ZERO WALL REFLECTIONS)
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
      if (!player.ultActive) wpn.ammo--;
    }

    player.lastShotTime = now;
    sfx.playWeaponSound(wpn.id);
    updateHUD();

    // 1. KNIFE MELEE
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
        processTargetHit(hits[0].object, wpn.headDmg, wpn.bodyDmg, wpn.id);
        spawnSparks(hits[0].point, 0x00f5d4, 10);
      }
      return;
    }

    // 2. ROCKET LAUNCHER PROJECTILE
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
      return;
    }

    // 3. DIRECT HITSCAN GUNS (NO WALL REFLECTIONS)
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

    const targets = [...headHitboxes, ...bodyHitboxes, ...envMeshes];
    if (remoteOpponent.active) {
      targets.push(remoteOpponent.agent.helmet, ...remoteOpponent.agent.bodyParts);
    }

    const hits = raycaster.intersectObjects(targets, false);
    const tracerColor = (player.ultActive || wpn.id === 'OPERATOR') ? 0xff4655 : 0x00f5d4;

    if (hits.length > 0) {
      const hit = hits[0];
      spawnTracer(muzzlePos, hit.point, tracerColor);
      broadcastTracer(muzzlePos, hit.point, tracerColor);

      if (hit.object.userData && (hit.object.userData.bot || hit.object.userData.isRemotePlayer)) {
        processTargetHit(hit.object, wpn.headDmg, wpn.bodyDmg, wpn.id);
      } else {
        // Bullet stops cleanly on wall impact (No Reflection)
        spawnSparks(hit.point, 0x00f5d4, 5);
      }
    } else {
      const endPt = raycaster.ray.origin.clone().addScaledVector(raycaster.ray.direction, 120);
      spawnTracer(muzzlePos, endPt, tracerColor);
      broadcastTracer(muzzlePos, endPt, tracerColor);
    }

    const kick = wpn.id === 'OPERATOR' ? 0.032 : (player.ads ? 0.006 : 0.01);
    playerPitch.rotation.x = Math.min(Math.PI / 2.1, playerPitch.rotation.x + kick);
  }

  function processTargetHit(obj, headDmg, bodyDmg, wpnId) {
    const isHead = obj.userData.part === 'head';
    const dmg = isHead ? headDmg : bodyDmg;
    sfx.playHit(isHead);
    triggerHitmarker(isHead);

    if (obj.userData.bot) {
      obj.userData.bot.takeDamage(dmg, isHead, wpnId);
    } else if (obj.userData.isRemotePlayer && p2pConnected && conn) {
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
      wpn.reserve -= take;
      player.reloading = false;
      updateHUD();
    }, wpn.reloadTime);
  }

  // =========================================================
  // 8. AGENT ABILITIES
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
        if (b.group.position.distanceTo(flashPos) < 28) b.blindTimer = 3.5;
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
    player.cds.e = 6;
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
  // 9. HUD & AUTHORITATIVE DAMAGE / SCORING
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
    }, 1400);
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
    document.getElementById('hud-ammo').textContent = player.ultActive ? '∞' : wpn.ammo;
    document.getElementById('hud-mag').textContent = wpn.reserve;
    document.getElementById('hud-kills').textContent = player.kills;
    document.getElementById('hud-p2p-kills').textContent = remoteOpponent.kills;
    document.getElementById('hud-bots').textContent = bots.length;

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
  // 10. KEYBOARD, MOUSE & PC CONTROLLER (GAMEPAD API) SUPPORT
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

  function pollGamepad(dt, timeSec) {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
    if (!gp) return { moveX: 0, moveY: 0, firing: false };

    // Close menu with Start (9) or A (0) if on menu screen
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

    // Right Stick Camera Aim
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

    // LT (Button 6) Scope / ADS
    const ltDown = Boolean(gp.buttons[6] && (gp.buttons[6].pressed || gp.buttons[6].value > 0.4));
    if (ltDown !== prevPadButtons['lt_hold']) {
      prevPadButtons['lt_hold'] = ltDown;
      if (WEAPONS[currentWpnIdx].id === 'OPERATOR') {
        if (ltDown) toggleADS(!player.ads);
      } else {
        toggleADS(ltDown);
      }
    }

    // RT (Button 7) Fire
    const rtFiring = Boolean(gp.buttons[7] && (gp.buttons[7].pressed || gp.buttons[7].value > 0.4));

    // A (0): Jump
    if (btnPressed(0) && player.onGround) {
      player.vel.y = 11.8;
      player.onGround = false;
    }
    // B (1): Tailwind Dash
    if (btnPressed(1)) castDash(lx, ly);
    // X (2): Reload
    if (btnPressed(2)) reloadWeapon();
    // Y (3): Cycle Weapon [1]-[6]
    if (btnPressed(3)) equipWeapon((currentWpnIdx + 1) % WEAPONS.length);

    // LB (4) + RB (5) Together = Overdrive Ultimate [X]
    const lbDown = Boolean(gp.buttons[4]?.pressed);
    const rbDown = Boolean(gp.buttons[5]?.pressed);
    if (lbDown && rbDown) {
      castUltimate();
    } else {
      if (btnPressed(4)) castFlashbang();
      if (btnPressed(5)) castHeal();
    }

    // D-Pad Up (12) or Select/Back (8): Toggle FPP / TPP
    if (btnPressed(12) || btnPressed(8)) toggleCameraPerspective();
    // D-Pad Right (15) or R3 (11): Cycle Sniper Zoom
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
  // 11. 120+ FPS MAIN ENGINE LOOP
  // =========================================================
  spawnBots();
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

    const timeSec = now / 1000;
    const padState = pollGamepad(dt, timeSec);

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

      // Combined Keyboard + Controller Stick Movement
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

      // Structured Agent Walk Cycle in TPP
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

    // Update Flying Rockets & Detonations
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

    // Update Expanding Shockwave Spheres
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

    // Sync Position to P2P Friend
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

    // Interpolate P2P Friend Structured Agent + Walk Animation
    if (remoteOpponent.active) {
      const prevPos = remoteOpponent.agent.root.position.clone();
      remoteOpponent.agent.root.position.lerp(remoteOpponent.targetPos, dt * 15);
      remoteOpponent.agent.root.rotation.y = remoteOpponent.targetYaw;

      const moveDelta = prevPos.distanceTo(remoteOpponent.agent.root.position);
      if (moveDelta > 0.01) {
        remoteOpponent.agent.legL.rotation.x = Math.sin(timeSec * 14) * 0.45;
        remoteOpponent.agent.legR.rotation.x = -Math.sin(timeSec * 14) * 0.45;
        remoteOpponent.agent.armL.rotation.x = -Math.sin(timeSec * 14) * 0.35;
        remoteOpponent.agent.armR.rotation.x = Math.sin(timeSec * 14) * 0.35;
      } else {
        remoteOpponent.agent.legL.rotation.x = 0;
        remoteOpponent.agent.legR.rotation.x = 0;
      }
    }

    // Update AI Bots (Only when offline)
    if (!p2pConnected) {
      for (let i = bots.length - 1; i >= 0; i--) {
        bots[i].update(dt, playerYaw.position, timeSec);
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

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
})();
</script>
</body>
</html>
