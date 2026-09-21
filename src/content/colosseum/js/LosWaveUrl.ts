export type LosMobSpec = { x: number; y: number; type: number; extra: string | null };

export type LosWaveImport = {
  mobs: LosMobSpec[];
  player: { x: number; y: number } | null;
  fromWaveStart: boolean;
};

/** Decode the compact spawn URL emitted by osrs-colosseum's LOS solver. */
export function decodeLosWaveUrl(url: URL): LosWaveImport | null {
  const tokens = url.search.slice(1).split(".").filter(Boolean);
  if (tokens.length === 0) return null;
  const mobs: LosMobSpec[] = [];
  for (const token of tokens) {
    const match = /^(\d{2})(\d{2})(\d)(.*)$/.exec(token);
    if (!match) return null;
    mobs.push({ x: Number(match[1]), y: Number(match[2]), type: Number(match[3]), extra: match[4] || null });
  }
  const hashParts = url.hash.slice(1).split("_");
  const coordinateToken = hashParts[0]?.split(".").find(Boolean);
  let player: { x: number; y: number } | null = null;
  if (coordinateToken && /^\d+$/.test(coordinateToken)) {
    const encoded = Number(coordinateToken);
    player = { x: encoded & 0xff, y: (encoded >> 8) & 0xff };
  }
  return { mobs, player, fromWaveStart: hashParts.includes("ws") };
}

/** Decode a pasted URL only when it came from the Colosim LOS solver. */
export function decodePastedLosWaveUrl(text: string): LosWaveImport | null {
  const value = text.trim();
  if (!value.includes("los.colosim.com")) return null;
  try {
    return decodeLosWaveUrl(new URL(value));
  } catch {
    return null;
  }
}

/** The trainer map is the solver map translated by (+10, +9). */
export function translateLosCoordinate(coordinate: { x: number; y: number }) {
  return { x: coordinate.x + 10, y: coordinate.y + 9 };
}
