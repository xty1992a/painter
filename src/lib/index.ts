import { TinyEmitter } from "tiny-emitter";
import Renderer from "./renderer";
import Events from "./events";
import { getWXCanvas } from "./utils";
import Store from "./store";
import state from "./store/state";
import { RenderPayload, Options, RenderConfig } from "./types";

class Painter extends TinyEmitter {
  public renderer: Renderer;
  public events: Events;
  public unlisten: Function;
  private $store: Store;

  /** store中取出的值 */
  private $options: Options;
  private jsonList: RenderPayload[];
  private configList: RenderConfig[];
  private currentKey: string;

  private mapStore() {
    const getters = ["HEIGHT", "WIDTH", "dpr", "configList"];
    const states = ["jsonList", "currentKey"];
    this.$store.mapGetters(getters).call(this);
    this.$store.mapState({ $options: "options" }).call(this);
    this.$store.mapState(states).call(this);
  }

  constructor(options: Options) {
    super();
    this.handleStore(options);
  }

  public async init() {
    this.handleEvents();
    await this.handleRender();
  }

  private handleStore(options: Options) {
    this.$store = new Store(state);
    this.$store.commit("SET_OPTIONS", options);
    this.mapStore();
  }

  private handleEvents() {
    const { listen } = this.$options;
    const events = (this.events = new Events({ listen, $store: this.$store }));

    events.on(Events.ON_PICK, (e) => {
      this.$store.commit("SET_CURRENT_KEY", e);
      e && this.addDragRect();
    });

    events.on(Events.CONFIG_MOVE, (e) => {
      const json = this.jsonList.find((it) => it.id === this.currentKey);
      if (!json) return;
      const x = json.x + e.deltaX / this.$options.width;
      const y = json.y + e.deltaY / this.$options.height;
      console.log(x, y, this.configList);
      this.$store.commit(
        "SET_JSON_LIST",
        this.jsonList.map((it) => {
          return it.id === json.id ? { ...json, x, y } : it;
        })
      );
      this.render();
    });
    this.unlisten = () => {};
  }

  private addDragRect() {}

  private async handleRender() {
    const { width, height, dpr, canvas: selector } = this.$options;
    const { node: canvas }: any = await getWXCanvas(selector);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    this.renderer = new Renderer({
      canvas,
    });
  }

  public loadJSON(json: RenderPayload[]) {
    this.$store.commit("SET_JSON_LIST", json);
  }

  public async render() {
    const json = [...this.configList];
    this.renderer.clear();
    while (json.length) {
      const item = json.shift();
      if (!item) break;
      await this.renderer.draw(item);
    }
  }

  public destroy() {
    this.events.unlisten();
  }
}

export default Painter;
