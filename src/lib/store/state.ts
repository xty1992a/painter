import { Options, RenderPayload } from "../types";
export interface StateType {
  jsonList: RenderPayload[];
  options: Options;
  currentKey: string;
}

interface Store<State> {
  state: State;
  getters: {
    [key: string]: (state: State, getters: any) => any;
  };
  mutations: {
    [key: string]: (state: State, payload: any) => void;
  };
}

const store: Store<StateType> = {
  state: {
    jsonList: [],
    currentKey: "",
    options: {
      canvas: "",
      dpr: 1,
      width: 0,
      height: 0,
      listen: false,
    },
  },
  mutations: {
    SET_CURRENT_KEY: (state, key) => (state.currentKey = key),
    SET_JSON_LIST: (state, list) => {
      state.jsonList = list;
    },
    SET_OPTIONS: (state, options) => {
      state.options = options;
    },
  },
  getters: {
    dpr: (state) => state.options.dpr,
    width: (state) => state.options.width,
    height: (state) => state.options.height,
    WIDTH: (state, getter) => state.options.width * getter.dpr,
    HEIGHT: (state, getter) => state.options.height * getter.dpr,
    configList: (state, getters) => {
      const { width, height } = getters;

      return state.jsonList.map((it) => {
        const { type, config, d, x, y, w, h, id } = it;
        const result: any = {
          type,
          id: id,
          width: w * width,
          height: h * height,
          left: x * width,
          top: y * height,
          degrees: d,
        };

        switch (type) {
          case "image":
            result.resource = config.resource;
            break;
          case "rect":
            result.color = config.color;
            break;
        }
        return result;
      });
    },
  },
};

export default store;
