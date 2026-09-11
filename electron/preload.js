/**
 * Preload script — runs in the renderer before the page loads.
 * Keep this minimal. Only expose what the UI genuinely needs.
 */

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  platform: process.platform,
  isDesktop: true,
  version: process.versions.electron,
});
