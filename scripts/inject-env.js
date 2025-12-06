require('dotenv').config();
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../js');
const tempDir = path.join(__dirname, '../temp_js');

// 1. Copy js/ to temp_js/
console.log('Creating temp_js directory...');
if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir);

console.log('Copying JS files...');
try {
    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
        const srcFile = path.join(sourceDir, file);
        const destFile = path.join(tempDir, file);
        if (fs.lstatSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
        }
    });
} catch (e) {
    console.error('Error copying files:', e);
    process.exit(1);
}

// 2. Secret Injection - REMOVED
// We no longer inject secrets into the client-side code.
// The placeholders (__ADMIN_USERNAME__, __GITHUB_TOKEN__, etc.) will remain in the source
// but the new frontend logic won't use them (or will ignore them), or we should ensure
// the source file doesn't have them anymore.
//
// Actually, since I'm updating js/admin.js in the next step to NOT use these placeholders,
// this script just needs to copy files.
//
// However, if I leave the placeholders in js/admin.js until the next step, the build might fail
// if I was relying on this script to clean them up.
// But the plan is to update js/admin.js right after this.
// So this script is now just a "prepare for obfuscation" script.

console.log('Skipping secret injection (handled by Backend Functions now).');
console.log('Ready for obfuscation.');
