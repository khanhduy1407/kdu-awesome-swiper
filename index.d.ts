import type { App } from "kdu";
import { Swiper, SwiperSlide } from "@nkduy/swiper/kdu";

export * from "@nkduy/swiper/kdu";

declare const _default: {
  Swiper: typeof Swiper;
  SwiperSlide: typeof SwiperSlide;
  install(app: App): void;
};

export default _default;
