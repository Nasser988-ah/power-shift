/** Adaptive quality for phones, tablets, and desktops. */
export function detectQuality() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 700;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const low =
    saveData ||
    mem <= 2 ||
    cores <= 2 ||
    (coarse && narrow) ||
    /Android.*(Go|Lite)|iPhone\s(SE|6|7|8)/i.test(navigator.userAgent);

  if (low) {
    return {
      tier: "low",
      dpr: 1,
      antialias: false,
      shadows: false,
      fogFar: 16,
      pixelTone: 1.08,
    };
  }

  if (coarse || narrow || mem <= 4) {
    return {
      tier: "medium",
      dpr: Math.min(window.devicePixelRatio || 1, 1.25),
      antialias: false,
      shadows: false,
      fogFar: 17,
      pixelTone: 1.05,
    };
  }

  return {
    tier: "high",
    dpr: Math.min(window.devicePixelRatio || 1, 1.75),
    antialias: true,
    shadows: false,
    fogFar: 18,
    pixelTone: 1.05,
  };
}
