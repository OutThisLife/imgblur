const compose = require('next-compose-plugins')
const withImg = require('next-optimized-images')

const plugins = [withImg]

const config = {
  target: 'serverless',
  exportPathMap: () => ({
    '/': { page: '/' }
  })
}

module.exports = compose(plugins, config)
