module.exports = {
  apps: [{
    name: 'Kayakons - mongodb',
    script: 'mongod',
    args: '--dbpath ./db --ipv6', // activation de l'ipv6 pour contourner un bug
  }, {
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