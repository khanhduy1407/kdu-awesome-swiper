import Swiper, { SwiperOptions } from 'swiper'
import _Kdu, { PluginFunction } from 'kdu'
import { CoreNames } from './constants'
import getDirective from './directive'
import getSwiperComponent from './swiper'
import SwiperSlideComponent from './slide'

export interface InstallFunction extends PluginFunction<SwiperOptions> {
  installed?: boolean
}

const getInstaller = (SwiperClass: typeof Swiper) => {
  const install: InstallFunction = (Kdu: typeof _Kdu, globalOptions?: SwiperOptions) => {
    if (install.installed) return

    const SwiperComponent = getSwiperComponent(SwiperClass)
    if (globalOptions) {
      (SwiperComponent as any).options.props.defaultOptions.default = () => globalOptions
    }

    Kdu.component(CoreNames.SwiperComponent, SwiperComponent)
    Kdu.component(CoreNames.SwiperSlideComponent, SwiperSlideComponent)
    Kdu.directive(CoreNames.SwiperDirective, getDirective(SwiperClass, globalOptions))
    install.installed = true
  }
  return install
}

export default function exporter(SwiperClass: typeof Swiper) {
  return {
    version: 'PACKAGE_VERSION',
    install: getInstaller(SwiperClass),
    directive: getDirective(SwiperClass),
    [CoreNames.SwiperComponent as const]: getSwiperComponent(SwiperClass),
    [CoreNames.SwiperSlideComponent as const]: SwiperSlideComponent
  }
}
