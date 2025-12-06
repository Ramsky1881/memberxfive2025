require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = path.join(__dirname, '../js');
const tempDir = path.join(__dirname, '../temp_js');

// 1. Copy js/ to temp_js/
console.log('Creating temp_js directory...');
if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir);

console.log('Copying JS files...');
// Simple copy function since shx isn't available in node script directly easily without import
// We can use shell command or fs.cpSync (Node 16.7+)
try {
    // Using cp -r command via execSync for simplicity and cross-platform (mostly, assuming linux/mac env or git bash)
    // But to be safe with cross-platform in node, let's use fs.
    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
        const srcFile = path.join(sourceDir, file);
        const destFile = path.join(tempDir, file);
        if (fs.lstatSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
        }
        // If there are subdirectories, we would need recursive copy, but structure seems flat for now.
    });
} catch (e) {
    console.error('Error copying files:', e);
    process.exit(1);
}

// 2. Inject Token
console.log('Injecting GitHub Token...');
const adminJsPath = path.join(tempDir, 'admin.js');
if (fs.existsSync(adminJsPath)) {
    let content = fs.readFileSync(adminJsPath, 'utf8');
    const token = process.env.GITHUB_TOKEN || '';

    if (!token) {
        console.warn('WARNING: GITHUB_TOKEN is not set in environment variables!');
    }

    content = content.replace('__GITHUB_TOKEN__', token);
    fs.writeFileSync(adminJsPath, content, 'utf8');
    console.log('Token injected into temp_js/admin.js');
} else {
    console.error('Error: admin.js not found in temp directory');
    process.exit(1);
}
