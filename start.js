/**
 * This file is used to start the application in environments that may not support
 * the same cross-platform commands as Replit. It allows running the app consistently
 * across Windows, Mac, and Linux.
 */

const { spawn } = require('child_process');
const os = require('os');

// Determine command based on OS
const isWindows = os.platform() === 'win32';
const command = isWindows ? 'npm.cmd' : 'npm';

// Start the application
console.log('Starting application...');
const child = spawn(command, ['run', 'dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

child.on('close', (code) => {
  console.log(`Application process exited with code ${code}`);
});