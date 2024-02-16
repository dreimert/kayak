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
    name: 'Caddy',
    script: 'npm run caddy',
    watch: ['caddy/*'],
    watch_delay: 1000,
    time: true,
  },{
    name: `Maildev`,
    script: `npm run maildev`,
    time: true,
  }],
}