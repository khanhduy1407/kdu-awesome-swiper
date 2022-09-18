import Kdu, { PropType, KNode, CreateElement } from 'kdu'
import Swiper, { SwiperOptions } from 'swiper'
import { DEFAULT_CLASSES, CoreNames, ComponentPropNames, ComponentEvents } from './constants'
import { handleClickSlideEvent, bindSwiperEvents } from './event'

enum SlotNames {
  ParallaxBg = 'parallax-bg',
  Pagination = 'pagination',
  Scrollbar = 'scrollbar',
  PrevButton = 'button-prev',
  NextButton = 'button-next'
}

export default function getSwiperComponent(SwiperClass: typeof Swiper) {
  return Kdu.extend({
    name: CoreNames.SwiperComponent,
    props: {
      defaultOptions: {
        type: Object as PropType<SwiperOptions>,
        required: false,
        default: () => ({} as SwiperOptions)
      },
      // eslint-disable-next-line kdu/require-default-prop
      options: {
        type: Object as PropType<SwiperOptions>,
        required: false
      },
      [ComponentPropNames.AutoUpdate]: {
        type: Boolean,
        default: true
      },
      [ComponentPropNames.AutoDestroy]: {
        type: Boolean,
        default: true
      },
      [ComponentPropNames.DeleteInstanceOnDestroy]: {
        type: Boolean,
        required: false,
        default: true
      },
      [ComponentPropNames.CleanupStylesOnDestroy]: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data() {
      return {
        [CoreNames.SwiperInstance as const]: null as Swiper | null
      }
    },
    computed: {
      swiperInstance: {
        cache: false,
        set(swiper: Swiper) {
          this[CoreNames.SwiperInstance] = swiper
        },
        get(): Swiper | null {
          return this[CoreNames.SwiperInstance]
        }
      },
      swiperOptions(): SwiperOptions {
        return this.options || this.defaultOptions
      },
      wrapperClass(): string {
        return this.swiperOptions.wrapperClass || DEFAULT_CLASSES.wrapperClass
      }
    },
    methods: {
      // Feature: click event
      handleSwiperClick(event: MouseEvent) {
        handleClickSlideEvent(
          this.swiperInstance,
          event,
          this.$emit.bind(this)
        )
      },
      autoReLoopSwiper() {
        if (this.swiperInstance && this.swiperOptions.loop) {
          const swiper = this.swiperInstance as any
          swiper?.loopDestroy?.()
          swiper?.loopCreate?.()
        }
      },
      updateSwiper() {
        if (this[ComponentPropNames.AutoUpdate] && this.swiperInstance) {
          this.autoReLoopSwiper()
          this.swiperInstance?.update?.()
          this.swiperInstance.navigation?.update?.()
          this.swiperInstance.pagination?.render?.()
          this.swiperInstance.pagination?.update?.()
        }
      },
      destroySwiper() {
        if (this[ComponentPropNames.AutoDestroy] && this.swiperInstance) {
          if ((this.swiperInstance as any).initialized) {
            this.swiperInstance?.destroy?.(
              this[ComponentPropNames.DeleteInstanceOnDestroy],
              this[ComponentPropNames.CleanupStylesOnDestroy]
            )
          }
        }
      },
      initSwiper() {
        this.swiperInstance = new SwiperClass(
          this.$el as HTMLElement,
          this.swiperOptions
        )
        bindSwiperEvents(
          this.swiperInstance,
          this.$emit.bind(this)
        )
        this.$emit(
          ComponentEvents.Ready,
          this.swiperInstance
        )
      }
    },
    mounted() {
      if (!this.swiperInstance) {
        this.initSwiper()
      }
    },
    // Update swiper when the parent component activated with `keep-alive`.
    activated() {
      this.updateSwiper()
    },
    updated() {
      this.updateSwiper()
    },
    beforeDestroy() {
      this.$nextTick(this.destroySwiper)
    },
    render(createElement: CreateElement): KNode {
      return createElement('div',
        {
          staticClass: DEFAULT_CLASSES.containerClass,
          on: {
            click: this.handleSwiperClick
          }
        },
        [
          this.$slots[SlotNames.ParallaxBg],
          createElement('div', {
            class: this.wrapperClass
          }, this.$slots.default),
          this.$slots[SlotNames.Pagination],
          this.$slots[SlotNames.PrevButton],
          this.$slots[SlotNames.NextButton],
          this.$slots[SlotNames.Scrollbar]
        ]
      )
    }
  })
}
