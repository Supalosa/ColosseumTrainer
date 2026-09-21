import { decodeLosWaveUrl, translateLosCoordinate } from "../js/LosWaveUrl";

describe("LOS wave URLs", () => {
  test("decodes mob tokens, packed player coordinates, and wave-start flag", () => {
    const decoded = decodeLosWaveUrl(new URL("https://example.test/?11114r.14111.11082.14107.#2822_ws"));

    expect(decoded).toEqual({
      mobs: [
        { x: 11, y: 11, type: 4, extra: "r" },
        { x: 14, y: 11, type: 1, extra: null },
        { x: 11, y: 8, type: 2, extra: null },
        { x: 14, y: 10, type: 7, extra: null },
      ],
      player: { x: 6, y: 11 },
      fromWaveStart: true,
    });
  });

  test("translates solver coordinates into trainer coordinates", () => {
    expect(translateLosCoordinate({ x: 6, y: 11 })).toEqual({ x: 16, y: 20 });
  });
});
