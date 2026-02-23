/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: 'enb-indexer',
      cwd: __dirname,
      script: 'node_modules/ponder/dist/esm/bin/ponder.js',
      args: 'start',
      interpreter: 'node',
      env: { NODE_ENV: 'production' },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};
