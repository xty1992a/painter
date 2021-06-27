import { CanvasContext } from "@tarojs/taro";
import { TinyEmitter } from "tiny-emitter";
import { Texture, getCenter } from "../utils";
import {
  ImagePayload,
  RectPayload,
  RenderConfig,
  RenderPayload,
} from "../types";

interface Options {
  canvas: any;
}

class Renderer extends TinyEmitter {
  ctx: CanvasContext;
  canvas: any;
  texture: Texture;

  constructor(options: Options) {
    super();
    const { canvas } = options;
    this.canvas = canvas;
    this.texture = new Texture({ canvas });
    this.ctx = canvas.getContext("2d");
    this.init();
  }

  init() {
    const { ctx } = this;
    // @ts-ignore
    const { dpr } = wx;
    ctx.scale(dpr, dpr);
  }

  clear() {
    const {
      ctx,
      canvas: { width, height },
    } = this;

    ctx.clearRect(0, 0, width, height);
  }

  async draw(payload: RenderConfig) {
    const { type } = payload;
    switch (type) {
      case "image":
        await this.drawImage(payload as ImagePayload);
        break;
      case "rect":
        await this.drawRect(payload as RectPayload);
    }
  }

  drawText() {}

  async drawImage(options: ImagePayload) {
    const { ctx } = this;
    const img = await this.texture.getImage(options.resource);
    if (!img) return;
    const {
      width = img.width,
      height = img.height,
      left,
      top,
      degrees = 0,
    } = options;
    const { x, y } = getCenter({ width, height, left, top });
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((degrees * Math.PI) / 180);
    ctx.translate(-x, -y);
    ctx.drawImage(img, left, top, width, height);
    ctx.restore();
  }

  async drawRect(options: RectPayload) {
    const { ctx } = this;
    const { width, height, left, top, color = "#000", degrees = 0 } = options;
    const { x, y } = getCenter({ width, height, left, top });
    console.log("绘制矩形", options, x, y);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((degrees * Math.PI) / 180);
    ctx.translate(-x, -y);
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left + width, top);
    ctx.lineTo(left + width, top + height);
    ctx.lineTo(left, top + height);
    ctx.closePath();
    // ctx.drawImage(img, left, top, width, height);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
  }
}

export default Renderer;
