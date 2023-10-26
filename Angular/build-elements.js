const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
    const files = [
        './dist/StoreReports/runtime-es2015.js',
        './dist/StoreReports/polyfills-es2015.js',
        './dist/StoreReports/main-es2015.js'
    ];
    await fs.ensureDir('elements');
    await concat(files, 'elements/storereports-element.js');
    await fs.copyFile('./dist/StoreReports/styles.css', 'elements/storereports-element.css')

    await fs.copy('./dist/StoreReports/assets/config', 'elements/assets/config');
    // await fs.copy('./dist/StoreReports/assets/elements', 'elements/assets/elements');
    await fs.copy('./dist/StoreReports/assets/fonts', 'elements/assets/fonts');
    await fs.copy('./dist/StoreReports/assets/images', 'elements/assets/images');
    await fs.copy('./dist/StoreReports/assets/icons', 'elements/assets/icons');
    await fs.copy('./dist/StoreReports/assets/js', 'elements/assets/js');
    await fs.copy('./dist/StoreReports/assets/styles', 'elements/assets/styles');
    await fs.copyFile('./dist/StoreReports/assets/properties.json', 'elements/assets/properties.json');
    
})()