#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const imagemin = require('imagemin')
const pngquant = require('imagemin-pngquant')
const mozjpeg = require('imagemin-mozjpeg')

const [, , ...args] = process.argv
const dir = args[0]
const quality = [25, 30]

require('glob-fs')({ gitignore: true })
  .readdirSync(dir)
  .filter(f => fs.lstatSync(f).isFile() && !f.includes('tblur'))
  .map(f => {
    const { name } = path.parse(f)
    const input = path.resolve(f)
    const output = path.resolve(f.replace(name, `${name}-tblur`))

    try {
      imagemin([input], null, {
        plugins: [mozjpeg({ quality }), pngquant({ quality })]
      }).then(buf => {
        sharp(Buffer.from(buf[0].data))
          .blur(100)
          .toFile(output)
      })
    } catch (e) {
      console.error('Could not process:', input)
    }
  })
