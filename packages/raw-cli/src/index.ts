#!/usr/bin/env node

/**
 * RAW CLI - Scaffold new RAW projects
 */

import { mkdir, writeFile, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createProject(projectName: string) {
  const projectPath = join(process.cwd(), projectName);
  
  try {
    // Create project directory
    await mkdir(projectPath, { recursive: true });
    
    // Create package.json
    const packageJson = {
      name: projectName,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        raw: "^1.0.0"
      },
      devDependencies: {
        vite: "^5.0.0"
      }
    };
    
    await writeFile(
      join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 100%;
    }
    
    h1 {
      color: #333;
      margin-bottom: 30px;
      font-size: 2em;
    }
    
    .display {
      font-size: 2em;
      text-align: center;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 20px;
      color: #667eea;
      font-weight: bold;
    }
    
    .controls {
      display: flex;
      gap: 10px;
    }
    
    button {
      flex: 1;
      padding: 12px 24px;
      font-size: 1em;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      font-weight: 600;
    }
    
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    button:active {
      transform: translateY(0);
    }
    
    button:first-child {
      background: #667eea;
      color: white;
    }
    
    button.danger {
      background: #e74c3c;
      color: white;
    }
  </style>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>`;
    
    await writeFile(
      join(projectPath, 'index.html'),
      indexHtml
    );
    
    // Create src directory
    await mkdir(join(projectPath, 'src'), { recursive: true });
    
    // Create main.ts
    const mainTs = `import { state, html, mount } from 'raw';

// 1. ATOMIC STATE
const count = state(0);

// 2. LOGIC
const increment = () => count.val++;
const reset = () => count.val = 0;

// 3. COMPONENT
const App = () => html\`
  <div class="container">
    <h1>Raw Speed</h1>
    
    <div class="display">
      Current count: \${count}
    </div>

    <div class="controls">
      <button onclick="\${increment}">Accelerate</button>
      <button onclick="\${reset}" class="danger">Stop</button>
    </div>
  </div>
\`;

// 4. MOUNT
mount(App, document.getElementById('app')!);`;
    
    await writeFile(
      join(projectPath, 'src/main.ts'),
      mainTs
    );
    
    // Create vite.config.ts
    const viteConfig = `import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  }
});`;
    
    await writeFile(
      join(projectPath, 'vite.config.ts'),
      viteConfig
    );
    
    // Create README.md
    const readme = `# ${projectName}

A RAW project - Zero Virtual DOM. Zero Hydration. 100% Browser Power.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Learn More

Visit [RAW](https://github.com/makalin/RAW) to learn more about the framework.`;
    
    await writeFile(
      join(projectPath, 'README.md'),
      readme
    );
    
    // Create .gitignore
    const gitignore = `# Dependencies
node_modules/
dist/

# Environment
.env
.env.local

# Editor
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Logs
*.log`;
    
    await writeFile(
      join(projectPath, '.gitignore'),
      gitignore
    );
    
    console.log(`\n✅ Created RAW project: ${projectName}`);
    console.log(`\n📁 Location: ${projectPath}`);
    console.log(`\n🚀 Next steps:`);
    console.log(`   cd ${projectName}`);
    console.log(`   npm install`);
    console.log(`   npm run dev\n`);
    
  } catch (error: any) {
    console.error(`❌ Error creating project: ${error.message}`);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === 'new' && args[1]) {
  createProject(args[1]);
} else {
  console.log(`
RAW CLI - The Naked Performance Engine

Usage:
  raw-cli new <project-name>

Example:
  raw-cli new my-app
`);
  process.exit(0);
}

