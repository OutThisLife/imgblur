import path from 'path'

import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import flow from 'rollup-plugin-flow'
import flowCopySource from 'flow-copy-source'
import uglify from 'rollup-plugin-uglify'
import ignore from 'rollup-plugin-ignore'

const { dependencies } = require('./package.json')
const { BABEL_ENV, NODE_ENV } = process.env
const modules = BABEL_ENV === 'cjs' || NODE_ENV === 'test' ? 'commonjs' : false
const loose = true

// --

const baseConfig = {
  external: ['react', 'react-dom', 'styled-components'].concat(Object.keys(dependencies)),
  plugins: [
    flow({ pretty: true }),
    json(),
    commonjs({
      include: ['node_modules/**'],
      ignoreGlobal: false
    }),
    nodeResolve({
      main: true,
      browser: true,
      jsnext: true,
      extensions: ['.mjs', '.js', '.json', '.jsx', '.ts'],
      modulesOnly: true
    }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['env', { loose, modules }], 'react', 'flow'],
      plugins: [
        'external-helpers',
        'react-require',
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
    }),
    replace({ __DEV__: JSON.stringify(false) })
  ]
}

const build = (input, name, output) => {
  const dir = path.dirname(path.dirname(input))

  const base = {
    ...baseConfig,
    input,
    output: {
      name,
      exports: 'named',
      sourcemap: true,
      interop: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        styled: 'styled-components'
      }
    }
  }

  // UMD
  const umdConfig = {
    ...base,
    output: {
      ...base.output,
      file: `${output}.js`,
      format: 'umd'
    },
    plugins: base.plugins.concat(
      replace({
        __SERVER__: JSON.stringify(false)
      })
    )
  }

  const devUmd = {
    ...umdConfig,
    plugins: umdConfig.plugins.concat(
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    )
  }

  const prodUmd = {
    ...umdConfig,
    output: {
      ...umdConfig.output,
      file: `${output}.min.js`
    },
    plugins: umdConfig.plugins.concat([
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),

      uglify({ sourceMap: true })
    ])
  }

  // SSR & browser
  const serverConfig = {
    ...base,
    output: [
      {
        ...base.output,
        file: `${output}.es.js`,
        format: 'es'
      },
      {
        ...base.output,
        file: `${output}.cjs.js`,
        format: 'cjs',
        exports: 'named'
      }
    ],
    plugins: base.plugins.concat(
      replace({
        __SERVER__: JSON.stringify(true)
      })
    )
  }

  const browserConfig = {
    ...base,
    output: [
      {
        ...base.output,
        file: `${output}.browser.es.js`,
        format: 'es'
      },
      {
        ...base.output,
        file: `${output}.browser.cjs.js`,
        format: 'cjs'
      }
    ],
    plugins: base.plugins.concat(
      replace({
        __SERVER__: JSON.stringify(false)
      }),
      ignore(['stream'])
    )
  }

  try {
    flowCopySource([path.resolve(dir, 'src')], path.resolve(dir, 'dist'), {
      verbose: true
    })
  } catch (e) {
    console.log('FLOW ERROR:', e)
  }

  return [devUmd, prodUmd, serverConfig, browserConfig]
}

// --

export default build('./src/index.js', 'imgblur', './dist/index')
