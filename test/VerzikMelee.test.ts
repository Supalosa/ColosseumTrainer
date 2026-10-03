import { MeleeWeapon, UnitTypes } from "@supalosa/oldschool-trainer-sdk";
import { VerzikMelee } from "../src/content/inferno/js/mobs/VerzikVitur";

// minimal stand-ins: only the fields read by MeleeWeapon's prayer checks
const verzik = { type: UnitTypes.MOB } as any;
const playerProtectingMelee = {
  type: UnitTypes.PLAYER,
  prayerController: {
    matchGroup: () => null,
    overhead: () => ({ feature: () => "melee" }),
  },
} as any;

describe("VerzikMelee", () => {
  it("is not blocked by protect from melee (typeless)", () => {
    expect(new VerzikMelee().isBlockable(verzik, playerProtectingMelee, { attackStyle: "crush" })).toBe(false);
  });

  it("control: a regular melee weapon is blocked by protect from melee", () => {
    expect(new MeleeWeapon().isBlockable(verzik, playerProtectingMelee, { attackStyle: "crush" })).toBe(true);
  });
});
