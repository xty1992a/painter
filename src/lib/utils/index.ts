import Taro from "@tarojs/taro";
import { RenderConfig } from "src/lib/types";

interface TextureOptions {
  canvas: any;
}
export class Texture {
  canvas: any;
  storage: {
    [key: string]: any;
  };
  constructor(options: TextureOptions) {
    this.canvas = options.canvas;
    this.storage = {};
  }

  getImage(url: string) {
    return new Promise<any>((resolve) => {
      if (this.storage[url]) return resolve(this.storage[url]);
      const img = this.canvas.createImage();
      img.onload = () => {
        this.storage[url] = img;
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

export function getCenter(rect: Rect) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function getWXCanvas(selector: string) {
  return new Promise((resolve) => {
    Taro.createSelectorQuery()
      .select(selector)
      .fields({ node: true, size: true })
      .exec(([res]) => resolve(res));
  });
}

export class NumMath {
  static isHit(rect: Rect, point: Point) {
    const { x, y } = point;
    const { left, top, width, height } = rect;
    const bottom = top + height;
    const right = left + width;
    return !(x < left || x > right || y < top || y > bottom);
  }
}

export class DragRect {
  left: number;
  top: number;
  width: number;
  height: number;

  get bottom() {
    return this.top + this.height;
  }
  get right() {
    return this.left + this.width;
  }

  constructor(rect: Rect) {
    Object.entries(rect).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  get configList(): RenderConfig[] {
    return [
      {
        id: "drag_top",
        type: "line",
        x,
      },
    ];
  }
}
