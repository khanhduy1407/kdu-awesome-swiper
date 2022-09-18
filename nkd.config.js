module.exports = [
  {
    entry: 'src/exporter.ts',
    fileName: 'exporter',
    targets: ['umd', 'esm'],
    minimize: false,
    external: ['kdu'],
    globals: {
      kdu: 'Kdu'
    },
    typescript: {
      tsconfigOverride: {
        compilerOptions: {
          declaration: false
        }
      }
    }
  },
  {
    entry: 'src/index.ts',
    targets: ['umd', 'esm'],
    minimize: false,
    external: [
      'swiper',
      'kdu',
    ],
    globals: {
      swiper: 'Swiper',
      kdu: 'Kdu',
    }
  }
]
