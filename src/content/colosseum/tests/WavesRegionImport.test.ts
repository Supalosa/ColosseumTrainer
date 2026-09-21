import "../../../../test/setupFiles";

import { WavesRegion } from "../js/WavesRegion";

describe("WavesRegion LOS imports", () => {
  const originalUrl = window.location.href;

  afterEach(() => {
    window.history.replaceState({}, "", originalUrl);
  });

  test("mid-wave imported NPCs claim their occupied tiles", () => {
    window.history.replaceState({}, "", "/waves.html?10102.11102");
    const region = new WavesRegion();
    region.initialiseRegion();

    region.requestWaveStart();
    region.postTick();
    region.postTick();

    expect(region.mobs).toHaveLength(2);
    expect(region.mobs.map((mob) => mob.location)).toEqual([
      { x: 20, y: 19 },
      { x: 21, y: 19 },
    ]);
    expect(region.hasTileCollisionFlags(20, 19, 1)).toBe(true);
    expect(region.hasTileCollisionFlags(21, 19, 1)).toBe(true);
  });
});
