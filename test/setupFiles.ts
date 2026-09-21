/* eslint-disable @typescript-eslint/no-empty-function */

const canvasContext = {
  arc: jest.fn(),
  beginPath: jest.fn(),
  clearRect: jest.fn(),
  closePath: jest.fn(),
  drawImage: jest.fn(),
  fill: jest.fn(),
  fillRect: jest.fn(),
  fillText: jest.fn(),
  lineTo: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  moveTo: jest.fn(),
  restore: jest.fn(),
  rotate: jest.fn(),
  save: jest.fn(),
  scale: jest.fn(),
  setTransform: jest.fn(),
  stroke: jest.fn(),
  strokeText: jest.fn(),
  translate: jest.fn(),
};

global.OffscreenCanvas = jest.fn().mockImplementation((width: number, height: number) => {
  return {
    height,
    width,
    oncontextlost: jest.fn(),
    oncontextrestored: jest.fn(),
    getContext: jest.fn(() => canvasContext),
    convertToBlob: jest.fn(),
    transferToImageBitmap: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => canvasContext as any);

global.fetch = jest.fn().mockImplementation(() => ({
  arrayBuffer: () => new ArrayBuffer(0),
}));

Object.defineProperty(globalThis, "ResizeObserver", {
  configurable: true,
  value: class ResizeObserverMock {
    constructor(private readonly callback: (entries: Array<{ contentRect: { width: number; height: number } }>) => void) {}

    observe() {
      this.callback([{ contentRect: { width: window.innerWidth, height: window.innerHeight } }]);
    }

    disconnect() {}
  },
});

jest.mock("osrs-sdk", () => {
  const originalModule = jest.requireActual<typeof import("osrs-sdk")>(
    "osrs-sdk",
  );
  return {
    ...originalModule,
    Assets: {
      getAssetUrl(x: any) {
        return x;
      }
    },
    SoundCache: {
      preload() {},
      play() {}
    }
  };
});

jest.mock("three", () => {
  const actual = jest.requireActual<typeof import("three")>("three");
  return {
    ...actual,
    WebGLRenderer: class WebGLRendererMock {
      public domElement = document.createElement("canvas");
      public compileAsync = jest.fn().mockResolvedValue(undefined);
      public render = jest.fn();
      public setSize = jest.fn();
    },
  };
});
jest.spyOn(document, "getElementById").mockImplementation((elementId: string) => {
  const c = document.createElement("canvas");
  c.ariaLabel = elementId;
  return c;
});

/*
const nextRandom = [];
Random.setRandom(() => {
  if (nextRandom.length > 0) {
    return nextRandom.shift();
  }
  Random.memory = (Random.memory + 13.37) % 180;
  return Math.abs(Math.sin(Random.memory * 0.0174533));
});

Settings.readFromStorage();
*/

jest.requireMock<typeof import("osrs-sdk")>("osrs-sdk").Settings.readFromStorage();
