import { spawn } from 'node:child_process';
import net from 'node:net';

async function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      const tester = net.createServer();
      tester.unref();

      tester.on('error', (error) => {
        const code = error && typeof error === 'object' && 'code' in error ? error.code : null;
        if (code === 'EADDRINUSE') {
          tryPort(port + 1);
          return;
        }
        reject(error);
      });

      tester.listen(port, '0.0.0.0', () => {
        const address = tester.address();
        const selectedPort = typeof address === 'object' && address ? address.port : port;
        tester.close(() => resolve(selectedPort));
      });
    };

    tryPort(startPort);
  });
}

const port = await findAvailablePort(Number(process.env.PORT) || 4100);
process.env.PORT = String(port);
process.env.VITE_API_URL = `http://localhost:${port}`;
console.log(`[dev] Using API port ${port}`);

const commands = [
  ['node_modules/vite/bin/vite.js', ['--config', 'frontend/vite.config.ts', 'frontend']],
  ['node_modules/tsx/dist/cli.mjs', ['watch', 'backend/index.ts']],
];

let stopping = false;
const processes = commands.map(([script, args]) =>
  spawn(process.execPath, [script, ...args], {
    stdio: 'inherit',
    env: { ...process.env },
  })
);

function stopAll() {
  if (stopping) return;
  stopping = true;
  for (const child of processes) child.kill();
}

for (const child of processes) {
  child.on('error', (error) => {
    console.error(error);
    process.exitCode = 1;
    stopAll();
  });
  child.on('exit', (code) => {
    if (!stopping) {
      process.exitCode = code ?? 1;
      stopAll();
    }
  });
}

process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);