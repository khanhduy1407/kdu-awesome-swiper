# kdu-awesome-swiper

![kdu](https://img.shields.io/badge/MADE%20WITH-KDU-03a9f4?style=for-the-badge)
[![npm](https://img.shields.io/npm/v/kdu-awesome-swiper?color=c7343a&label=npm&style=for-the-badge)](https://www.npmjs.com/package/kdu-awesome-swiper)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)](https://github.com/khanhduy1407/kdu-awesome-swiper/blob/master/LICENSE)

[![NPM](https://nodei.co/npm/kdu-awesome-swiper.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/kdu-awesome-swiper)

**[Swiper](https://swiperjs.com)** component for Kdu.

---

### Install

``` bash
npm install swiper kdu-awesome-swiper --save

# or
yarn add swiper kdu-awesome-swiper
```

### Global Registration

``` javascript
import Kdu from 'kdu'
import KduAwesomeSwiper from 'kdu-awesome-swiper'

// import style
import 'swiper/css/swiper.css'

Kdu.use(KduAwesomeSwiper, /* { default options with global component } */)
```

### Local Registration

```javascript
import { Swiper, SwiperSlide, directive } from 'kdu-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  }
}
```

### CDN

``` html
<link rel="stylesheet" href="path/to/swiper.css"/>
<script type="text/javascript" src="path/to/swiper.js"></script>
<script type="text/javascript" src="path/to/kdu.min.js"></script>
<script type="text/javascript" src="path/to/dist/kdu-awesome-swiper.js"></script>
<script type="text/javascript">
  Kdu.use(window.KduAwesomeSwiper)
</script>
```
