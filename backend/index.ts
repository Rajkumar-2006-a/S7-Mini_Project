import app from './app';

const DEFAULT_PORT = Number(process.env.PORT) || 4100;

function startServer(portToTry = DEFAULT_PORT) {
  const server = app.listen(portToTry, '0.0.0.0', () => {
    console.log(`[MedTrack API] Running on http://0.0.0.0:${portToTry}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`[MedTrack API] Port ${portToTry} is busy; retrying on ${portToTry + 1}`);
      startServer(portToTry + 1);
      return;
    }

    console.error('[MedTrack API] Failed to start server:', error);
    process.exit(1);
  });
}

startServer();
