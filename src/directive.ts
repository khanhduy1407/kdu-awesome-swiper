import { DirectiveOptions, KNode } from 'kdu'
import { DirectiveBinding } from 'kdu/types/options'
import Swiper, { SwiperOptions } from 'swiper'
import { DEFAULT_CLASSES, CoreNames, ComponentEvents, ComponentPropNames } from './constants'
import { handleClickSlideEvent, bindSwiperEvents } from './event'
import { kebabcase } from './utils'

const INSTANCE_NAME_KEY = 'instanceName'

export default function getDirective(SwiperClass: typeof Swiper, globalOptions?: SwiperOptions): DirectiveOptions {

  const getStandardisedOptionByAttrs = (knode: KNode, key: string): any => {
    const value = knode.data?.attrs?.[key]
    return value !== undefined
      ? value
      : knode.data?.attrs?.[kebabcase(key)]
  }

  // Get swiper instace name in directive
  const getSwiperInstanceName = (element: HTMLElement, binding: DirectiveBinding, knode: KNode): string => {
    return (
      binding.arg ||
      getStandardisedOptionByAttrs(knode, INSTANCE_NAME_KEY) ||
      element.id ||
      CoreNames.SwiperInstance
    )
  }

  const getSwiperInstance = (element: HTMLElement, binding: DirectiveBinding, knode: KNode): Swiper | null => {
    const instanceName = getSwiperInstanceName(element, binding, knode)
    return (knode.context as any)[instanceName] || null
  }

  const getSwipeOptions = (binding: DirectiveBinding): SwiperOptions => {
    return binding.value || globalOptions
  }

  const getBooleanValueByInput = (input: any): boolean => {
    return [true, undefined, null, ''].includes(input)
  }

  // Emit event in Kdu directive
  const getEventEmiter = (knode: KNode) => {
    const handlers = knode.data?.on || knode.componentOptions?.listeners
    return (name: string, ...args: any[]) => {
      const handle = (handlers as any)?.[name]
      if (handle) {
        handle.fns(...args)
      }
    }
  }

  return {
    // Init
    bind(element, binding, knode) {
      // auto class name
      if (element.className.indexOf(DEFAULT_CLASSES.containerClass) === -1) {
        element.className += ((element.className ? ' ' : '') + DEFAULT_CLASSES.containerClass)
      }
      // bind click event
      element.addEventListener('click', event => {
        const emitEvent = getEventEmiter(knode)
        const swiper = getSwiperInstance(element, binding, knode)
        handleClickSlideEvent(swiper, event, emitEvent)
      })
    },
    // DOM inserted
    inserted(element, binding, knode) {
      const context = knode.context
      const swiperOptions = getSwipeOptions(binding)
      const instanceName = getSwiperInstanceName(element, binding, knode)
      const emitEvent = getEventEmiter(knode)

      const kduContext = context as any
      let swiper: Swiper = kduContext?.[instanceName]

      // Swiper will destroy but not delete instance, when used <keep-alive>
      if (!swiper || (swiper as any).destroyed) {
        swiper = new SwiperClass(element, swiperOptions)
        kduContext[instanceName] = swiper
        bindSwiperEvents(swiper, emitEvent)
        emitEvent(ComponentEvents.Ready, swiper)
        // MARK: Reinstance when the nexttick with <keep-alive>
        // Kdu.nextTick(instancing) | setTimeout(instancing)
      }
    },
    // On options changed or DOM updated
    componentUpdated(element, binding, knode) {
      const autoUpdate = getStandardisedOptionByAttrs(
        knode,
        ComponentPropNames.AutoUpdate
      )
      if (getBooleanValueByInput(autoUpdate)) {
        const swiper = getSwiperInstance(element, binding, knode)
        if (swiper) {
          const swiperOptions = getSwipeOptions(binding)
          const isLoop = swiperOptions.loop
          if (isLoop) {
            ;(swiper as any)?.loopDestroy?.()
          }
          swiper?.update?.()
          swiper.navigation?.update?.()
          swiper.pagination?.render?.()
          swiper.pagination?.update?.()
          if (isLoop) {
            ;(swiper as any)?.loopCreate?.()
            swiper?.update?.()
          }
        }
      }
    },
    // Destroy this directive
    unbind(element, binding, knode) {
      const autoDestroy = getStandardisedOptionByAttrs(
        knode,
        ComponentPropNames.AutoDestroy
      )
      if (getBooleanValueByInput(autoDestroy)) {
        const swiper = getSwiperInstance(element, binding, knode)
        if (swiper && (swiper as any).initialized) {
          swiper?.destroy?.(
            getBooleanValueByInput(
              getStandardisedOptionByAttrs(
                knode,
                ComponentPropNames.DeleteInstanceOnDestroy
              )
            ),
            getBooleanValueByInput(
              getStandardisedOptionByAttrs(
                knode,
                ComponentPropNames.CleanupStylesOnDestroy
              )
            )
          )
        }
      }
    }
  }
}
