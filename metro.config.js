const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add avif to the list of recognised image asset extensions
config.resolver.assetExts.push('avif');

module.exports = config;
