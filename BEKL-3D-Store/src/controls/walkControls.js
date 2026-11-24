import * as THREE from "three";

export function createWalkControls(camera, canvas, bounds, getObstacles = () => []) {
  const keys = { f: false, b: false, l: false, r: false, sprint: false };
  const look = { yaw: 0, pitch: -0.05 };
  const velocity = new THREE.Vector3();
  const wish = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  let pointerDown = false;
  let lastX = 0;
  let lastY = 0;
  let enabled = false;
  let lookLocked = false;
  const moveStick = { x: 0, y: 0 };
  const lookStick = { x: 0, y: 0 };

  const isCoarse = () => window.matchMedia("(pointer: coarse)").matches;
  const sensibility = isCoarse() ? 0.0042 : 0.0024;

  function setEnabled(v) {
    enabled = v;
  }

  function setLookLocked(v) {
    lookLocked = v;
    if (v) pointerDown = false;
  }

  function onKey(e, down) {
    if (e.code === "KeyW" || e.code === "ArrowUp") keys.f = down;
    if (e.code === "KeyS" || e.code === "ArrowDown") keys.b = down;
    if (e.code === "KeyA" || e.code === "ArrowLeft") keys.l = down;
    if (e.code === "KeyD" || e.code === "ArrowRight") keys.r = down;
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") keys.sprint = down;
  }

  window.addEventListener("keydown", (e) => onKey(e, true));
  window.addEventListener("keyup", (e) => onKey(e, false));

  canvas.addEventListener("pointerdown", (e) => {
    if (!enabled || lookLocked) return;
    if (isCoarse()) return;
    pointerDown = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener("pointerup", () => {
    pointerDown = false;
  });
  window.addEventListener("pointermove", (e) => {
    if (!enabled || !pointerDown || lookLocked || isCoarse()) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    look.yaw -= dx * sensibility;
    look.pitch -= dy * sensibility;
    look.pitch = Math.max(-1.1, Math.min(1.1, look.pitch));
  });

  function bindVirtualStick(base, knob, target, max = 42) {
    if (!base || !knob) return;
    let active = false;
    const center = () => {
      knob.style.transform = "translate(-50%, -50%)";
      target.x = 0;
      target.y = 0;
    };
    const move = (e) => {
      if (!active) return;
      const rect = base.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;
      const len = Math.hypot(dx, dy) || 1;
      const clamped = Math.min(len, max);
      dx = (dx / len) * clamped;
      dy = (dy / len) * clamped;
      knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      target.x = dx / max;
      target.y = -dy / max;
    };
    const start = (e) => {
      e.preventDefault();
      e.stopPropagation();
      active = true;
      base.setPointerCapture(e.pointerId);
      move(e);
    };
    const end = () => {
      active = false;
      center();
    };
    base.addEventListener("pointerdown", start, { passive: false });
    base.addEventListener("pointermove", move, { passive: false });
    base.addEventListener("pointerup", end);
    base.addEventListener("pointercancel", end);
    base.addEventListener("lostpointercapture", end);
  }

  function bindJoystick(moveBase, moveKnob, lookBase, lookKnob) {
    bindVirtualStick(moveBase, moveKnob, moveStick, 44);
    bindVirtualStick(lookBase, lookKnob, lookStick, 44);
  }

  function resolveObstacles(x, z) {
    const obs = getObstacles();
    let nx = x;
    let nz = z;
    for (let i = 0; i < obs.length; i++) {
      const o = obs[i];
      const dx = nx - o.x;
      const dz = nz - o.z;
      const d = Math.hypot(dx, dz);
      const min = o.r || 0.42;
      if (d < min && d > 1e-4) {
        const s = min / d;
        nx = o.x + dx * s;
        nz = o.z + dz * s;
      } else if (d <= 1e-4) {
        nx = o.x + min;
        nz = o.z;
      }
    }
    return { x: nx, z: nz };
  }

  function update(dt, blocked) {
    if (enabled && !blocked && !lookLocked) {
      look.yaw -= lookStick.x * dt * 2.4;
      look.pitch += lookStick.y * dt * 1.8;
      look.pitch = Math.max(-1.05, Math.min(1.05, look.pitch));
    }

    camera.rotation.order = "YXZ";
    camera.rotation.y = look.yaw;
    camera.rotation.x = look.pitch;

    if (!enabled || blocked) {
      velocity.set(0, 0, 0);
      return;
    }

    wish.set(0, 0, 0);
    forward.set(-Math.sin(look.yaw), 0, -Math.cos(look.yaw));
    right.set(Math.cos(look.yaw), 0, -Math.sin(look.yaw));
    const fx = (keys.f ? 1 : 0) - (keys.b ? 1 : 0) + moveStick.y;
    const rx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0) + moveStick.x;
    wish.addScaledVector(forward, fx);
    wish.addScaledVector(right, rx);
    if (wish.lengthSq() > 1) wish.normalize();
    const speed = keys.sprint && !isCoarse() ? 2.6 : isCoarse() ? 1.75 : 1.55;
    velocity.lerp(wish.multiplyScalar(speed), 1 - Math.exp(-dt * 12));

    let nx = camera.position.x + velocity.x * dt;
    let nz = camera.position.z + velocity.z * dt;
    nx = THREE.MathUtils.clamp(nx, bounds.minX, bounds.maxX);
    nz = THREE.MathUtils.clamp(nz, bounds.minZ, bounds.maxZ);
    const cleared = resolveObstacles(nx, nz);
    nx = THREE.MathUtils.clamp(cleared.x, bounds.minX, bounds.maxX);
    nz = THREE.MathUtils.clamp(cleared.z, bounds.minZ, bounds.maxZ);
    camera.position.set(nx, 1.55, nz);
  }

  function openDoorsLook() {
    look.yaw = 0;
    look.pitch = -0.05;
  }

  return { setEnabled, setLookLocked, update, bindJoystick, openDoorsLook, look };
}
