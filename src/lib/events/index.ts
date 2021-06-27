import { TinyEmitter } from "tiny-emitter";
import { CanvasTouchEvent } from "@tarojs/components/types/common";
import { RenderConfig, Point } from "src/lib/types";
import Store from "../store";
import { StateType } from "../store/state";
import { NumMath } from "../utils";

type Interface = Pick<StateType, "currentKey">;

interface Options {
  listen: boolean;
  $store: Store;
}

class Events extends TinyEmitter implements Interface {
  state: { [key: string]: any } = {};
  $store: Store;
  unlisten: Function = () => {};

  /** store */
  configList: RenderConfig[];
  currentKey: string;

  constructor(options: Options) {
    super();
    this.$store = options.$store;
    if (options.listen) {
      this.unlisten = this.listen();
    }
    this.mapStore();
  }

  listen() {
    this.on(Events.ON_START, this.onStart);
    this.on(Events.ON_MOVE, this.onMove);
    this.on(Events.ON_END, this.onEnd);

    return () => {
      this.off(Events.ON_START, this.onStart);
      this.off(Events.ON_MOVE, this.onMove);
      this.off(Events.ON_END, this.onEnd);
    };
  }

  mapStore() {
    const states = ["currentKey"];
    const getters = ["configList"];
    this.$store.mapState(states).call(this);
    this.$store.mapGetters(getters).call(this);
  }

  onStart = (e) => {
    this.state.start = true;
    this.state = {
      ...this.state,
      startX: e.x,
      startY: e.y,
    };
  };
  onMove = (e) => {
    if (!this.state.start) return;
    this.state.moved = true;
    console.log(this.currentKey);

    if (this.currentKey) {
      console.log("已选中，移动");
      this.emit(Events.CONFIG_MOVE, {
        deltaX: e.x - this.state.startX,
        deltaY: e.y - this.state.startY,
      });
    }

    this.state = {
      ...this.state,
      startX: e.x,
      startY: e.y,
    };
    // console.log("on move", e);
  };
  onEnd = (e) => {
    console.log("on end", e);

    if (!this.state.moved) {
      // 绘制顺序是从0-1，即后面绘制在上方
      // 点击时判断，则在后面的应优先被点击
      const config = this.configList.reverse().find((it) => {
        return NumMath.isHit(it, e);
      });
      let key = config?.id ?? "";
      if (this.currentKey && key !== this.currentKey) {
        key = "";
      }
      this.emit(Events.ON_PICK, key);
    }

    this.state.start = false;
    this.state.moved = false;
  };

  static ON_START = "on-start";
  static ON_MOVE = "on-move";
  static ON_END = "on-end";
  static ON_PICK = "on-pick";

  static CONFIG_MOVE = "move";

  static transTaroEvent = (e: CanvasTouchEvent): Point => {
    const [point] = e.touches.length ? e.touches : e.changedTouches;
    return {
      type: e.type,
      x: point?.x ?? 0,
      y: point?.y ?? 0,
    };
  };
}

export default Events;
