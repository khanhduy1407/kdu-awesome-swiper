import SwiperClass from 'swiper'
import exporter from './exporter'

const KduAwesomeSwiper = exporter(SwiperClass)

export const version = KduAwesomeSwiper.version
export const install = KduAwesomeSwiper.install
export const directive = KduAwesomeSwiper.directive
export const Swiper = KduAwesomeSwiper.Swiper
export const SwiperSlide = KduAwesomeSwiper.SwiperSlide
export default KduAwesomeSwiper
