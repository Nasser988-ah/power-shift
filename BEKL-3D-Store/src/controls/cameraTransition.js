import * as THREE from "three";
import { ROOM } from "../data/products.js";

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Smooth camera move via a center aisle waypoint so paths clear pedestals.
 */
export function createCameraTransition(camera, lookState) {
  let anim = null;

  function isBusy() {
    return !!anim;
  }

  function cancel() {
    anim = null;
  }

  /**
   * @param {{ x:number, z:number, yaw:number, pitch?:number }} target
   * @param {{ onDone?: () => void }} [opts]
   */
  function goTo(target, opts = {}) {
    const from = {
      x: camera.position.x,
      z: camera.position.z,
      yaw: lookState.yaw,
      pitch: lookState.pitch,
    };
    const to = {
      x: THREE.MathUtils.clamp(target.x, ROOM.walk.minX, ROOM.walk.maxX),
      z: THREE.MathUtils.clamp(target.z, ROOM.walk.minZ, ROOM.walk.maxZ),
      yaw: target.yaw,
      pitch: target.pitch ?? -0.08,
    };

    if (reduceMotion()) {
      camera.position.set(to.x, ROOM.eyeY, to.z);
      lookState.yaw = to.yaw;
      lookState.pitch = to.pitch;
      opts.onDone?.();
      return;
    }

    // Waypoint near room center keeps transitions in the open walkway
    const mid = {
      x: THREE.MathUtils.clamp(from.x * 0.35 + to.x * 0.35, -1.2, 1.2),
      z: THREE.MathUtils.clamp((from.z + to.z) * 0.5 * 0.4, -0.4, 1.2),
    };

    const start = performance.now();
    const dur = 900;
    anim = { from, to, mid, start, dur, onDone: opts.onDone };
  }

  function update(now) {
    if (!anim) return;
    const t = Math.min(1, (now - anim.start) / anim.dur);
    const e = t * t * (3 - 2 * t); // smoothstep

    // Two-segment path: from → mid → to
    let x;
    let z;
    if (e < 0.5) {
      const u = e * 2;
      x = THREE.MathUtils.lerp(anim.from.x, anim.mid.x, u);
      z = THREE.MathUtils.lerp(anim.from.z, anim.mid.z, u);
    } else {
      const u = (e - 0.5) * 2;
      x = THREE.MathUtils.lerp(anim.mid.x, anim.to.x, u);
      z = THREE.MathUtils.lerp(anim.mid.z, anim.to.z, u);
    }

    camera.position.set(x, ROOM.eyeY, z);
    lookState.yaw = THREE.MathUtils.lerp(anim.from.yaw, anim.to.yaw, e);
    lookState.pitch = THREE.MathUtils.lerp(anim.from.pitch, anim.to.pitch, e);

    if (t >= 1) {
      const done = anim.onDone;
      camera.position.set(anim.to.x, ROOM.eyeY, anim.to.z);
      lookState.yaw = anim.to.yaw;
      lookState.pitch = anim.to.pitch;
      anim = null;
      done?.();
    }
  }

  return { goTo, update, isBusy, cancel };
}
