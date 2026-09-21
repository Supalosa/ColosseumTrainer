import { formatWaveTime } from "../js/WaveTimer";

describe("wave timer", () => {
  test.each([
    [0, "0:00.0"],
    [1, "0:00.6"],
    [67, "0:40.2"],
    [100, "1:00.0"],
  ])("formats %i ticks as %s", (ticks, expected) => {
    expect(formatWaveTime(ticks)).toBe(expected);
  });
});
