// eslint-disable-next-line @typescript-eslint/no-require-imports
const appModule = require('../dist/app.cjs');

module.exports = appModule.default || appModule;
