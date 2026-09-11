/**
 * Live API Inspector — Electron main process.
 *
 * Responsibilities:
 *  1. Locate the bundled backend and frontend.
 *  2. Spawn both as child processes.
 *  3. Wait for the frontend port to become reachable.
 *  4. Load it in a BrowserWindow.
 *  5. Kill child processes on quit.
 */

const { app, BrowserWindow, dialog, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

// ─── Configuration ───────────────────────────────────────────
const BACKEND_PORT = 4000;
const FRONTEND_PORT = 3000;
const FRONTEND_URL = `http://localhost:${FRONTEND_PORT}`;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

// ─── State ───────────────────────────────────────────────────
let mainWindow = null;
let backendProcess = null;
let frontendProcess = null;
let isQuitting = false;

// ─── Path resolution ─────────────────────────────────────────
/**
 * In development, the app runs from electron/ and accesses ../../backend and ../../frontend.
 * In production, electron-builder copies resources into process.resourcesPath.
 */
function resolveRoot() {
  if (app.isPackaged) {
    return process.resourcesPath;
  }
  return path.join(__dirname, '..');
}

function backendEntry(root) {
  // Compiled NestJS entry point
  return path.join(root, 'backend', 'dist', 'main.js');
}

function backendCwd(root) {
  return path.join(root, 'backend');
}

function frontendCwd(root) {
  return path.join(root, 'frontend');
}

function nextBin(root) {
  // Run Next.js CLI directly to avoid relying on global installs
  return path.join(root, 'frontend', 'node_modules', 'next', 'dist', 'bin', 'next');
}

// ─── Process spawning ────────────────────────────────────────
function spawnBackend(root) {
  const entry = backendEntry(root);
  const cwd = backendCwd(root);

  backendProcess = spawn(process.execPath, [entry], {
    cwd,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(BACKEND_PORT),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  backendProcess.stdout.on('data', (d) => process.stdout.write(`[backend] ${d}`));
  backendProcess.stderr.on('data', (d) => process.stderr.write(`[backend] ${d}`));
  backendProcess.on('exit', (code) => {
    if (!isQuitting) {
      console.error(`[backend] exited with code ${code}`);
    }
  });
}

function spawnFrontend(root) {
  const cwd = frontendCwd(root);
  const bin = nextBin(root);

  frontendProcess = spawn(process.execPath, [bin, 'start', '-p', String(FRONTEND_PORT)], {
    cwd,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(FRONTEND_PORT),
      NEXT_PUBLIC_API_URL: BACKEND_URL,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  frontendProcess.stdout.on('data', (d) => process.stdout.write(`[frontend] ${d}`));
  frontendProcess.stderr.on('data', (d) => process.stderr.write(`[frontend] ${d}`));
  frontendProcess.on('exit', (code) => {
    if (!isQuitting) {
      console.error(`[frontend] exited with code ${code}`);
    }
  });
}

// ─── Readiness check ─────────────────────────────────────────
function waitForUrl(url, timeoutMs = 60000, intervalMs = 500) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`));
        } else {
          setTimeout(attempt, intervalMs);
        }
      });
      req.setTimeout(2000, () => {
        req.destroy();
      });
    };
    attempt();
  });
}

// ─── Window creation ─────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0a0a0a',
    title: 'Live API Inspector',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadURL(FRONTEND_URL);

  // Open external links in the OS browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── Shutdown ────────────────────────────────────────────────
function killProcesses() {
  isQuitting = true;
  for (const proc of [frontendProcess, backendProcess]) {
    if (proc && !proc.killed) {
      try {
        proc.kill();
      } catch (_) {
        // ignore
      }
    }
  }
}

// ─── Safety: disable GPU for old Intel drivers ──────────────
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');

// ─── App lifecycle ───────────────────────────────────────────
app.whenReady().then(async () => {
  const root = resolveRoot();

  try {
    spawnBackend(root);
    spawnFrontend(root);

    await waitForUrl(FRONTEND_URL, 90000);
    createWindow();
  } catch (err) {
    dialog.showErrorBox(
      'Live API Inspector failed to start',
      String(err && err.message ? err.message : err),
    );
    app.quit();
    return;
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  killProcesses();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  killProcesses();
});

process.on('exit', killProcesses);
process.on('SIGINT', () => {
  killProcesses();
  process.exit(0);
});
