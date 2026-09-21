# TODO: LOS URL wave-start imports

## Current behavior

- LOS suffixes have the form `?11114r.14111.11082.14107.#2822`.
- The first four-digit groups encode NPC coordinates/type; a trailing letter
  encodes manticore style (`r`, `m`, `M`, or a pattern).
- The hash encodes the player location. `_ws` indicates that the URL represents
  the beginning of a wave; without `_ws`, NPCs are placed immediately as an
  in-progress snapshot.
- URL-started waves still show the start modal, but wave selection and force
  double south are hidden because the URL defines the wave contents.
- Imported coordinates are translated into trainer coordinates by `(+10, +9)`.
- `_ws` imports use the delayed wave spawn pathing and spawn the Fremennik
  warband. Non-`_ws` imports place NPCs immediately without spawn delays.

## Important fixes already made

- Avoid spawning the Fremennik warband twice during `_ws` countdown. Duplicate
  insertion caused pooled Fremenniks to be processed twice per tick and move
  extremely fast.
- Manticore `ur` means “uncharged, but style known”. The SDK now stores a
  preselected style separately; when the manticore performs normal style
  selection it adopts that preselection, with an initial attack delay of 10.
- Reinforcements are suppressed for imported URLs because the URL does not
  identify the wave number, and therefore does not identify their composition.

## Reinforcements

An LOS URL contains the current NPC composition and player location, but no
wave number. The trainer therefore cannot reliably determine which
reinforcements to spawn:

- waves 1–3: Jaguar Warrior
- waves 4–6: Serpent Shaman + Jaguar Warrior
- waves 7–9: Minotaur
- waves 10–11: Minotaur + Serpent Shaman
- wave 12 has its own behavior

For `_ws` imports, the start modal asks which reinforcement composition should
spawn, including a `None` option. `None` is the default. A selected composition
spawns after the normal reinforcement delay. Non-`_ws` snapshots do not offer
the selector or invent future reinforcements.

Until decided, test both `_ws` and non-`_ws` URLs and verify that NPCs are only
inserted once and that movement/attack timing matches the intended snapshot.

## Settings/origin note

Settings are scoped by browser origin (`localhost` and `127.0.0.1` have separate
localStorage). The consolidated trainer key is `colosseum-trainer:settings`.
The legacy migration previously hardcoded `forceDoubleSouth`, `npcsAggressive`,
and `waveNumber` to defaults; it now preserves the old individual keys. If a
default consolidated blob was already created, remove that key once on the
affected origin and reload to migrate the old values.

## Additional observations to investigate

- Prayer switching sometimes happens noticeably earlier than on the real
  client. This can cause a user to switch prayers too early. Compare the
  trainer's projectile/attack prediction timing with the client's tick and
  animation/impact timing, especially around manticore and Fremennik attacks.
- Settings still appear to occasionally revert or become corrupted. The origin
  split explains some resets, but the remaining issue may be in tile-marker
  color/enabled-state persistence (nullable colors, checkbox changes, or
  serialization/migration). Verify the exact JSON stored under
  `osrs-sdk:settings` and `colosseum-trainer:settings`, including the difference
  between a disabled marker and a missing/null color.
