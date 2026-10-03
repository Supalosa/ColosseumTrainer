import "../../../../test/setupFiles";

import { DelayedAction, Player, Projectile, Settings, TestRegion, Viewport, World } from "osrs-sdk";
import { colosseumSettings } from "../js/ColosseumSettings";
import { SolHeredit } from "../js/mobs/SolHeredit";

describe("Sol's queued action check", () => {
  let world: World;
  let player: Player;
  let boss: SolHeredit;

  beforeEach(() => {
    DelayedAction.reset();
    Settings.inputDelay = 0;
    colosseumSettings.set({ usePhaseTransitions: true, useSpears: true });
    const region = new TestRegion(40, 40);
    world = new World();
    region.world = world;
    world.addRegion(region);
    Viewport.setupViewport(region, document.createElement("canvas"), document.createElement("div"), true);
    Viewport.viewport.tick = jest.fn();
    player = new Player(region, { x: 10, y: 10 });
    boss = new SolHeredit(region, { x: 25, y: 25 }, { aggro: player });
    boss.stunned = 0;
    boss.phaseId = 0;
    boss.attackDelay = 1;
    boss.currentStats.hitpoint = 1360;
    region.addPlayer(player);
    region.addMob(boss);
    Viewport.viewport.setPlayer(player);
    jest.spyOn(boss as any, "createLaserOrb").mockImplementation(() => {});
    jest.spyOn(boss as any, "tryPlacePool").mockImplementation(() => {});
    jest.spyOn(boss as any, "tryPlacePools").mockImplementation(() => {});
  });

  function queueThresholdHit() {
    boss.addProjectile(new Projectile(null, 20, player, boss, "stab", { setDelay: 1 }));
  }

  test("landing damage triggers a phase before movement and takes priority over an auto", () => {
    player.setLocation({ x: 24, y: 24 });
    const spear = jest.spyOn(boss as any, "attackSpear");
    queueThresholdHit();
    world.tickWorld();
    expect(boss.currentStats.hitpoint).toBe(1340);
    expect(boss.phaseId).toBe(1);
    expect(boss.location).toEqual({ x: 25, y: 25 });
    expect(boss.attackDelay).toBe(7);
    expect(boss.frozen).toBe(5);
    expect(boss.tickNumber).toBe(1);
    expect(spear).not.toHaveBeenCalled();
  });

  test("a phase waits for cooldown zero, then blocks that turn's movement", () => {
    boss.attackDelay = 2;
    queueThresholdHit();
    world.tickWorld();
    expect(boss.phaseId).toBe(0);
    expect(boss.location).not.toEqual({ x: 25, y: 25 });
    const location = { ...boss.location };
    world.tickWorld();
    expect(boss.phaseId).toBe(1);
    expect(boss.location).toEqual(location);
  });

  test("phase movement is blocked on T through T+4 and resumes on T+5", () => {
    queueThresholdHit();
    world.tickWorld(5);
    expect(boss.location).toEqual({ x: 25, y: 25 });
    expect(boss.frozen).toBe(1);
    expect(boss.aggro).toBe(player);
    world.tickWorld();
    expect(boss.location).not.toEqual({ x: 25, y: 25 });
    expect(boss.frozen).toBe(0);
  });

  test("a ready diagonal auto freezes Sol before he can pursue the player", () => {
    boss.currentStats.hitpoint = 1500;
    player.setLocation({ x: 24, y: 24 });
    const spear = jest.spyOn(boss as any, "attackSpear");
    world.tickWorld();
    expect(spear).toHaveBeenCalledTimes(1);
    expect(boss.location).toEqual({ x: 25, y: 25 });
    expect(boss.attackDelay).toBe(7);
    expect(boss.tickNumber).toBe(1);
    expect(boss.forceAttack).toBeNull();
    expect(boss.firstSpear).toBe(false);
  });

  test("lethal queued damage cannot start a phase or attack", () => {
    boss.addProjectile(new Projectile(null, 1360, player, boss, "stab", { setDelay: 1 }));
    world.tickWorld();
    expect(boss.phaseId).toBe(0);
    expect(boss.location).toEqual({ x: 25, y: 25 });
    expect(boss.dying).toBe(boss.deathAnimationLength);
  });
});
