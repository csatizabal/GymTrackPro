// Configuración de Metro: expo-sqlite en web usa WebAssembly (archivo .wasm)
// y SharedArrayBuffer, que exige los encabezados COOP/COEP en el servidor de desarrollo.
// https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

config.server.enhanceMiddleware = (middleware) => (req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  return middleware(req, res, next);
};

module.exports = config;
