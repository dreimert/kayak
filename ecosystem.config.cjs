module.exports = {
  apps: [{
    name: 'Kayakons - frontend',
    script: 'dist/kayak-date/server/server.mjs',
    listen_timeout: 10000,
    autorestart: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    time: true
  }, {
    name: 'Kayakons - api',
    script: './api/dist/index.js',
    interpreter_args: '--env-file=.env',
    autorestart: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    time: true
  }],
}
