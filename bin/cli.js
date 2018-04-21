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

const files = require('glob-fs')({ gitignore: true })
  .readdirSync(dir)
  .filter(f => fs.lstatSync(f).isFile() && !f.includes('tblur') && /(jpe?g|png)/.test(f))

if (files.length === 0) {
  console.log('ERROR: No files found. Try globbing, for ex: ./static/*.jpg')
} else {
  files.map(f => {
    const { name } = path.parse(f)
    const input = path.resolve(f)
    const output = path.resolve(f.replace(name, `${name}-tblur`))

    try {
      fs.lstatSync(output)
    } catch (e) {
      imagemin([input], null, {
        plugins: [mozjpeg({ quality }), pngquant({ quality })]
      }).then(buf => {
        sharp(Buffer.from(buf[0].data))
          .blur(100)
          .toFile(output)
      })
    }
  })
}
