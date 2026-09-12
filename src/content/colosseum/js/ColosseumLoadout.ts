import { CACHE_ASSETS, Player } from "osrs-sdk";
import type { Loadout } from "osrs-sdk";

export const colosseumLoadout: Loadout = {
  name: "Sol Heredit / Max Scythe",
  equipment: {
    weapon: CACHE_ASSETS.items.scytheOfVitur.id,
    offhand: null,
    helmet: CACHE_ASSETS.items.torvaFullHelm.id,
    necklace: CACHE_ASSETS.items.amuletOfRancour.id,
    cape: CACHE_ASSETS.items.infernalCape.id,
    ammo: CACHE_ASSETS.items.dragonArrows.id,
    chest: CACHE_ASSETS.items.oathplateChest.id,
    legs: CACHE_ASSETS.items.oathplateLegs.id,
    feet: CACHE_ASSETS.items.avernicTreadsMax.id,
    gloves: CACHE_ASSETS.items.ferociousGloves.id,
    ring: CACHE_ASSETS.items.ultorRing.id,
  },
  inventory: [
    CACHE_ASSETS.items.bladeOfSaeldor.id,
    CACHE_ASSETS.items.avernicDefender.id,
    CACHE_ASSETS.items.noxiousHalberd.id,
    CACHE_ASSETS.items.dragonClaws.id,
    CACHE_ASSETS.items.saradominBrew.id,
    CACHE_ASSETS.items.saradominBrew.id,
    CACHE_ASSETS.items.superCombatPotion.id,
    CACHE_ASSETS.items.superCombatPotion.id,
    CACHE_ASSETS.items.saradominBrew.id,
    CACHE_ASSETS.items.saradominBrew.id,
    CACHE_ASSETS.items.superRestore.id,
    CACHE_ASSETS.items.superRestore.id,
    CACHE_ASSETS.items.saradominBrew.id,
    CACHE_ASSETS.items.saradominBrew.id,
    CACHE_ASSETS.items.superRestore.id,
    CACHE_ASSETS.items.superRestore.id,
    CACHE_ASSETS.items.tumekensShadow.id,
    CACHE_ASSETS.items.conflictionGauntlets.id,
    CACHE_ASSETS.items.venatorBow.id,
    CACHE_ASSETS.items.twistedBow.id,
    CACHE_ASSETS.items.occultNecklace.id,
    CACHE_ASSETS.items.eyeOfAyak.id,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
};

export const wavesLoadout: Loadout = {
  name: "Waves / Max gear",
  equipment: {
    weapon: CACHE_ASSETS.items.tumekensShadow.id,
    offhand: null,
    helmet: CACHE_ASSETS.items.torvaFullHelm.id,
    necklace: CACHE_ASSETS.items.occultNecklace.id,
    cape: CACHE_ASSETS.items.infernalCape.id,
    ammo: CACHE_ASSETS.items.seekingDragonArrows.id,
    chest: CACHE_ASSETS.items.oathplateChest.id,
    legs: CACHE_ASSETS.items.oathplateLegs.id,
    feet: CACHE_ASSETS.items.avernicTreadsMax.id,
    gloves: CACHE_ASSETS.items.conflictionGauntlets.id,
    ring: CACHE_ASSETS.items.ultorRing.id,
  },
  inventory: [
    CACHE_ASSETS.items.venatorBow.id,
    CACHE_ASSETS.items.zaryteVambraces.id,
    CACHE_ASSETS.items.scytheOfVitur.id,
    CACHE_ASSETS.items.twistedBow.id,

    CACHE_ASSETS.items.necklaceOfRupture.id,
    CACHE_ASSETS.items.avernicDefender.id,
    CACHE_ASSETS.items.superCombatPotion.id,
    CACHE_ASSETS.items.bastionPotion.id,

    CACHE_ASSETS.items.bladeOfSaeldor.id,
    CACHE_ASSETS.items.ferociousGloves.id,
    CACHE_ASSETS.items.venatorRing.id,
    CACHE_ASSETS.items.masoriBodyF.id,

    CACHE_ASSETS.items.amuletOfRancour.id,
    CACHE_ASSETS.items.dizanasQuiver.id,
    CACHE_ASSETS.items.masoriMaskF.id,
    CACHE_ASSETS.items.masoriChapsF.id,

    CACHE_ASSETS.items.dragonClaws.id,
    CACHE_ASSETS.items.saradominBrew.id,
    CACHE_ASSETS.items.saradominBrew.id,
    CACHE_ASSETS.items.saradominBrew.id,

    CACHE_ASSETS.items.saradominBrew.id,
    CACHE_ASSETS.items.superRestore.id,
    CACHE_ASSETS.items.superRestore.id,
    CACHE_ASSETS.items.superRestore.id,
  ],
};

/** Apply the Colosseum's fixed player stats and starting boost after Region.reset(). */
export function configureColosseumPlayer(player: Player) {
  player.stats.prayer = 99;
  player.currentStats.prayer = 99;
  player.stats.defence = 99;
  player.currentStats.defence = 99;

  // A fake supercombat boost.
  for (const stat of ["attack", "strength", "range", "defence"] as const) {
    const boost = Math.floor(player.stats[stat] * 0.15) + 5;
    player.currentStats[stat] = player.stats[stat] + boost;
  }
}
