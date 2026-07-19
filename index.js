// Entry point for Hostinger's Node.js app hosting (hPanel expects a root
// startup file — set the "Startup file" field to "index.js" or point it at
// dist/src/main.js directly, either works).
//
// Before this runs: `npm run build` must have produced dist/. Hostinger
// runs `npm install` automatically on deploy but does NOT run the build
// step, so dist/ must be committed/uploaded as part of the deploy package.
require('./dist/src/main.js');
