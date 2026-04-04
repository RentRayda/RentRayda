module.exports = {
  apps: [
    {
      name: 'rentrayda-api',
      script: 'dist/index.js',
      cwd: '/home/deploy/apps/api',
      instances: 'max',
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: 3001 },
      max_memory_restart: '500M',
      error_file: '/var/log/pm2/api-error.log',
      out_file: '/var/log/pm2/api-out.log',
      merge_logs: true,
      watch: false,
    },
    {
      name: 'rentrayda-web',
      script: 'server.js',
      cwd: '/home/deploy/apps/web/.next/standalone',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production', PORT: 3000 },
      max_memory_restart: '400M',
      error_file: '/var/log/pm2/web-error.log',
      out_file: '/var/log/pm2/web-out.log',
    },
  ],
};
