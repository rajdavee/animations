import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { load } from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Categories mapping based on folder name patterns
const categoryMappings = {
    '3D': '3d',
    'Text': 'text',
    'Interactive': 'interaction',
    'Animation': 'animation',
    'Transition': 'transition',
    'Effect': 'effect'
};

function scanAnimations(rootDir) {
    const animations = [];
    const folders = readdirSync(rootDir, { withFileTypes: true });

    folders
        .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
        .forEach(folder => {
            const folderPath = join(rootDir, folder.name);
            const indexPath = join(folderPath, 'index.html');

            if (existsSync(indexPath)) {
                try {
                    const htmlContent = readFileSync(indexPath, 'utf-8');
                    const $ = load(htmlContent);
                    
                    const title = $('title').text() || folder.name;
                    const category = Object.entries(categoryMappings)
                        .find(([key]) => folder.name.includes(key))?.[1] || 'other';
                    const description = folder.name
                        .replace(/([A-Z])/g, ' $1')
                        .trim()
                        .replace(/^\w/, c => c.toUpperCase());

                    animations.push({
                        id: folder.name.toLowerCase().replace(/\s+/g, '-'),
                        title,
                        description,
                        category,
                        path: `${folder.name}/index.html`,
                        githubPath: folder.name // Keep original folder name for GitHub URL
                    });
                } catch (err) {
                    console.error(`Error processing ${folder.name}:`, err);
                }
            }
        });

    return animations;
}

function generateAnimationsFile(animations) {
    const content = `// This file is auto-generated. Do not edit manually.
const animations = ${JSON.stringify(animations, null, 2)};
export default animations;`;

    writeFileSync(join(__dirname, 'animations.js'), content);
}

function updateMainJS() {
    const mainJsPath = join(__dirname, 'main.js');
    let mainContent = readFileSync(mainJsPath, 'utf-8');
    
    mainContent = mainContent.replace(
        /const animations = \[[\s\S]*?\];/,
        `import animations from './animations.js';`
    );
    
    writeFileSync(mainJsPath, mainContent);
}

// Run the scanner
const animations = scanAnimations(__dirname);
generateAnimationsFile(animations);
updateMainJS();

console.log(`Found ${animations.length} animations`);
