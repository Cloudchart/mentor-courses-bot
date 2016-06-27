"use strict"

var path = require('path')

module.exports = function(shipit) {
  require('shipit-deploy')(shipit)
  require('shipit-shared')(shipit)
  require('shipit-npm')(shipit)

  const HOME_PATH = '/home/app/mentor-courses-bot'

  shipit.initConfig({

    default: {
      shared: {
        overwrite: true,
        files: [
          '.env'
        ],
      },

      bot: {
        uuid: 'mentor-courses-bot'
      }

    },

    production: {
      servers: 'app@mentor-staging.cochart.net',
      workspace: '/tmp/mentor-courses-bot-deploy',
      deployTo: HOME_PATH,
      repositoryUrl: 'git@github.com:Cloudchart/mentor-courses-bot.git',
      shallowClone: false,
    },

  })

}
