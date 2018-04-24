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
  .readdirSync(dir, { cwd: process.cwd() })
  .filter(f => !f.includes('tblur') && /(jpe?g|png)/.test(f))

if (files.length === 0) {
  console.log('ERROR: No files found. Try globbing, for ex: ./static/*.jpg')
} else {
  files.map(f => {
    const input = [...new Set(path.resolve(process.cwd(), f).split(path.sep))].join(path.sep)
    const { name } = path.parse(input)
    const output = input.replace(name, `${name}-tblur`)

    try {
      fs.lstatSync(output)
    } catch (e) {
      console.log(`Creating sample of ${name}`)

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
