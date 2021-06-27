type RenderType = "image" | "text" | "line" | "rect";

export interface Options {
  canvas: string;
  dpr: number;
  width: number;
  height: number;
  listen: boolean;
}

export type RenderPayload<Config = any> = {
  id: string;
  type: RenderType;
  x: number;
  y: number;
  w: number;
  h: number;
  d: number; // 旋转角度
  config?: Config;
};

export type RenderConfig = ImagePayload | RectPayload | LinePayload;

export interface Point {
  type: string;
  x: number;
  y: number;
}

export interface ImagePayload {
  type: "image";
  resource: string;
  left: number;
  top: number;
  width: number;
  height: number;
  degrees?: number;
}

export interface RectPayload {
  type: "rect";
  left: number;
  top: number;
  width: number;
  height: number;
  color?: string;
  degrees?: number;
}

export interface LinePayload {
  type: "line";
  color?: string;
  lineWidth: number;
  start: Point;
  end: Point;
  degrees?: number;
}
