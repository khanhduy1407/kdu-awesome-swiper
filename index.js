import { Swiper, SwiperSlide } from "@nkduy/swiper/kdu";
export * from "@nkduy/swiper/kdu";
export default {
  Swiper: Swiper,
  SwiperSlide: SwiperSlide,
  install(app) {
    app.component("Swiper", Swiper);
    app.component("SwiperSlide", SwiperSlide);
  },
};
