import * as fs from 'fs';

fs.copyFile('./src/config/config.devnet.ts', './src/config/index.ts', (err) => {
  if (err) throw err;
  console.log('File was copied to destination');
});
