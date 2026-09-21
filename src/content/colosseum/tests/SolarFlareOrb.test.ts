import { DelayedAction, Player, TestRegion, Trainer, Viewport, World } from "osrs-sdk";

import { SolarFlareOrb } from "../js/entities/SolarFlareOrb";

describe("Solar flare damage timing", () => {
  let region: TestRegion;
  let world: World;
  let player: Player;
  let flare: SolarFlareOrb;
  let startingHitpoints: number;

  beforeEach(() => {
    DelayedAction.reset();
    Viewport.viewport = { tick: jest.fn() } as unknown as Viewport;
    region = new TestRegion(30, 30);
    world = new World();
    region.world = world;
    world.addRegion(region);

    player = new Player(region, { x: 0, y: 0 });
    player.running = false;
    region.addPlayer(player);
    Trainer.setPlayer(player);
    startingHitpoints = player.currentStats.hitpoint;

    flare = new SolarFlareOrb(region, { x: 10, y: 10 }, 1, 0);
    region.addEntity(flare);
  });

  const prepareNextStep = (location = { x: 10, y: 10 }) => {
    flare.location = { ...location };
    flare.lastLocation = { ...location };
    flare.moveTick = 0;
    flare.waitTicks = 0;
  };

  const placePlayer = (location: { x: number; y: number }) => {
    player.setLocation(location);
    player.destinationLocation = { ...location };
  };

  const movePlayer = (location: { x: number; y: number }) => {
    player.moveTo(location.x, location.y);
  };

  test("stationary player is damaged one tick after the flare leaves their tile", () => {
    prepareNextStep();
    placePlayer({ x: 11, y: 10 });

    world.tickWorld(); // flare enters the player's tile
    expect(player.currentStats.hitpoint).toBe(startingHitpoints);
    world.tickWorld(); // flare's second inclusive tick on the tile
    expect(player.currentStats.hitpoint).toBe(startingHitpoints);
    world.tickWorld(); // flare leaves and damage is queued
    expect(player.currentStats.hitpoint).toBe(startingHitpoints);
    world.tickWorld(); // queued damage lands
    expect(player.currentStats.hitpoint).toBeLessThan(startingHitpoints);
  });

  test("player can leave after entering a path tile with the flare", () => {
    prepareNextStep();
    placePlayer({ x: 11, y: 9 });
    movePlayer({ x: 11, y: 10 });

    world.tickWorld(); // both enter the tile
    expect(player.location).toEqual({ x: 11, y: 10 });
    movePlayer({ x: 11, y: 9 });
    world.tickWorld(); // player has left before the flare's second tile tick
    expect(player.location).toEqual({ x: 11, y: 9 });
    world.tickWorld(2);

    expect(player.currentStats.hitpoint).toBe(startingHitpoints);
  });

  test("one-tick overlap damages when the flare was already waiting on a corner", () => {
    prepareNextStep({ x: 13, y: 10 });
    placePlayer({ x: 14, y: 9 });

    world.tickWorld(); // flare enters its x=14 corner and begins waiting
    world.tickWorld(); // corner tile is now mature
    movePlayer({ x: 14, y: 10 });
    world.tickWorld(); // player enters after the flare's entity phase
    expect(player.location).toEqual({ x: 14, y: 10 });
    expect(player.currentStats.hitpoint).toBe(startingHitpoints);

    movePlayer({ x: 14, y: 9 });
    world.tickWorld(); // overlap is detected, damage is queued, and the player leaves
    expect(player.location).toEqual({ x: 14, y: 9 });
    expect(player.currentStats.hitpoint).toBe(startingHitpoints);
    world.tickWorld(); // queued damage lands
    expect(player.currentStats.hitpoint).toBeLessThan(startingHitpoints);
  });

  test("player can leave after entering a corner simultaneously with the flare", () => {
    prepareNextStep({ x: 13, y: 10 });
    placePlayer({ x: 14, y: 9 });
    movePlayer({ x: 14, y: 10 });

    world.tickWorld(); // both enter the corner
    expect(player.location).toEqual({ x: 14, y: 10 });
    movePlayer({ x: 14, y: 9 });
    world.tickWorld(); // player leaves before the corner's second tile tick
    world.tickWorld(2);

    expect(player.currentStats.hitpoint).toBe(startingHitpoints);
  });
});
