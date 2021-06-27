import Taro, { FC } from "@tarojs/taro";
import { useCallback, useEffect, useRef } from "react";
import { View, Canvas } from "@tarojs/components";
import Painter from "../../lib";
import Events from "../../lib/events";
import "./index.less";

const Index: FC = () => {
  const painter = useRef<Painter | null>(null);
  useEffect(() => {
    const info = Taro.getSystemInfoSync();
    // @ts-ignore
    wx.dpr = info.pixelRatio;
    console.log(info);

    setTimeout(async () => {
      painter.current = new Painter({
        canvas: "#cvs",
        dpr: info.pixelRatio,
        width: info.windowWidth,
        height: info.windowHeight,
        listen: true,
      });

      await painter.current?.init();
      painter.current?.loadJSON([
        {
          config: {
            resource:
              "https://img2.baidu.com/it/u=3053365523,1822625584&fm=26&fmt=auto&gp=0.jpg",
          },
          type: "image",
          x: 0,
          y: 0,
          w: 1,
          h: 1,
          id: "1",
          d: 0,
        },
        {
          config: {
            resource:
              "https://img1.baidu.com/it/u=1543566503,4176103758&fm=26&fmt=auto&gp=0.jpg",
          },
          type: "image",
          x: 0,
          y: 0,
          w: 0.0267 * 10,
          h: 0.0149 * 10,
          id: "2",
          d: 30,
        },
        {
          config: {
            color: "#000",
          },
          type: "rect",
          x: 0,
          y: 0,
          w: 0.0267 * 10,
          h: 0.0149 * 10,
          id: "3",
          d: 30,
        },
      ]);

      painter.current?.render();
    }, 20);
  }, []);

  const onStart = useCallback((e) => {
    painter.current?.events.emit(Events.ON_START, Events.transTaroEvent(e));
    e.stopPropagation();
    e.preventDefault();
  }, []);
  const onMove = useCallback((e) => {
    painter.current?.events.emit(Events.ON_MOVE, Events.transTaroEvent(e));
    e.stopPropagation();
    e.preventDefault();
  }, []);
  const onEnd = useCallback((e) => {
    painter.current?.events.emit(Events.ON_END, Events.transTaroEvent(e));
    e.stopPropagation();
    e.preventDefault();
  }, []);

  return (
    <View className="index">
      <Canvas
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        onTouchCancel={(e) => {
          console.log(e);
        }}
        style={{ width: "100vw", height: "100vh" }}
        type="2d"
        id="cvs"
      />
    </View>
  );
};

Index.config = {
  navigationStyle: "custom",
};

export default Index;
