const { BABEL_ENV, NODE_ENV } = process.env
const modules = BABEL_ENV === 'cjs' || NODE_ENV === 'test' ? 'commonjs' : false
const loose = true

module.exports = {
  presets: [['env', { loose, modules }], 'react', 'flow'],
  plugins: [
    'transform-object-rest-spread',

    [
      'styled-components',
      {
        ssr: true,
        displayName: true,
        preprocess: false
      }
    ],

    modules === 'commonjs' && 'add-module-exports'
  ].filter(Boolean)
}
