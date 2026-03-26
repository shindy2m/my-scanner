const path = require('path');

// EXPO_PUBLIC_* musí být v process.env v době bundlování (Metro); pak je Babel nahradí konstantami.
// Načteme nejdřív .env z kořene monorepa, pak mobile/.env (ten přepíše stejné klíče).
const rootEnv = path.resolve(__dirname, '..', '.env');
const mobileEnv = path.resolve(__dirname, '.env');
require('dotenv').config({ path: rootEnv });
require('dotenv').config({ path: mobileEnv, override: true });

/** @type {import('@expo/config').ExpoConfig} */
module.exports = require('./app.json');
