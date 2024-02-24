module.exports = {
  apps: [{
    name: 'Kayakons - frontend',
    script: 'npm run serve',
    time: true,
  }, {
    name: 'Kayakons - api',
    script: 'npm run api-watch',
    time: true,
  },{
    name: 'Kayakons - Caddy',
    script: 'npm run caddy',
    watch: ['caddy/*'],
    watch_delay: 1000,
    time: true,
  },{
    name: `Kayakons - Maildev`,
    script: `npm run maildev`,
    time: true,
  }],
}