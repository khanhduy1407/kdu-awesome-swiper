import Kdu, { KNode, CreateElement } from 'kdu'
import { CoreNames, DEFAULT_CLASSES, ComponentPropNames } from './constants'

export default Kdu.extend({
  name: CoreNames.SwiperSlideComponent,
  computed: {
    slideClass(): string {
      return (this.$parent as any)?.swiperOptions?.slideClass || DEFAULT_CLASSES.slideClass
    }
  },
  methods: {
    update() {
      const parent = this.$parent as any
      if (parent[ComponentPropNames.AutoUpdate]) {
        parent?.swiperInstance?.update()
      }
    }
  },
  mounted() {
    this.update()
  },
  updated() {
    this.update()
  },
  render(createElement: CreateElement): KNode {
    return createElement(
      'div',
      {
        class: this.slideClass
      },
      this.$slots.default
    )
  }
})
