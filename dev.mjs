import { spawn } from 'node:child_process';
import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';

// Clean up obsolete root /api folder so only frontend and backend folders remain
if (fs.existsSync('api')) {
  try {
    fs.rmSync('api', { recursive: true, force: true });
    console.log('[dev] Cleaned up obsolete root /api folder');
  } catch {}
}

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

function resolveBinary(subdir, binRelativePath) {
  const localPath = path.resolve(subdir, 'node_modules', binRelativePath);
  if (fs.existsSync(localPath)) {
    return localPath;
  }
  return path.resolve('node_modules', binRelativePath);
}

const port = await findAvailablePort(Number(process.env.PORT) || 4100);
process.env.PORT = String(port);
process.env.VITE_API_URL = `http://localhost:${port}`;
console.log(`[dev] Using API port ${port}`);

const viteBin = resolveBinary('frontend', path.join('vite', 'bin', 'vite.js'));
const tsxBin = resolveBinary('backend', path.join('tsx', 'dist', 'cli.mjs'));

const commands = [
  [viteBin, ['--config', 'frontend/vite.config.ts', 'frontend']],
  [tsxBin, ['watch', 'backend/index.ts']],
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
