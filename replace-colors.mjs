import fs from 'fs';
import path from 'path';

// Utiliza um caminho relativo usando o diretório de execução atual
const srcDir = path.join(process.cwd(), 'src');

// Map of Hex codes to SASS variables
const colorMap = {
  // Brand
  '#0ea5e9': '$primary',
  '#38bdf8': '$primary-light',
  '#007bff': '$primary',
  '#2563eb': '$primary',

  // Backgrounds
  '#f0f9ff': '$bg-page',
  '#ffffff': '$bg-card',
  '#f1f5f9': '$bg-subtle',
  '#f8fafc': '$bg-hover',
  '#f9fafb': '$bg-hover',

  // Texts
  '#0f172a': '$text-primary',
  '#1a202c': '$text-primary',
  '#111827': '$text-primary',
  '#1e293b': '$text-primary',
  '#334155': '$text-primary',
  '#2d3748': '$text-primary',
  '#475569': '$text-secondary',
  '#6b7280': '$text-secondary',
  '#4a5568': '$text-secondary',
  '#64748b': '$text-secondary',
  '#718096': '$text-secondary',
  '#94a3b8': '$text-muted',
  '#a0aec0': '$text-muted',
  '#cbd5e1': '$text-muted',

  // Borders
  '#e2e8f0': '$border-default',
  '#e5e7eb': '$border-default',
  '#edf2f7': '$border-default',

  // Status Success
  '#f0fdf4': '$color-success-bg',
  '#ecfdf5': '$color-success-bg',
  '#dcfce7': '$color-success-border',
  '#166534': '$color-success-text',
  '#22c55e': '$color-success-badge',
  '#10b981': '$color-success-badge',

  // Status Info
  '#eff6ff': '$color-info-bg',
  '#bee3f8': '$color-info-bg',
  '#3b82f6': '$color-info-text',
  '#2b6cb0': '$color-info-text',
  '#2c5282': '$color-info-text',
  '#90cdf4': '$color-info-border', // Assuming logic

  // Status Warning
  '#fff7ed': '$color-warning-bg',
  '#fefcbf': '$color-warning-border',
  '#f59e0b': '$color-warning-text',
  '#744210': '$color-warning-dark',

  // Status Danger
  '#feb2b2': '$color-danger-bg',
  '#742a2a': '$color-danger-text',
  '#ef4444': '$color-danger-badge',
  '#c53030': '$color-danger-badge',

  // Accent
  '#f5f3ff': '$color-accent-bg',
  '#8b5cf6': '$color-accent-text',
};

// Exclude these files because they are already refactored or system
const excludedFiles = [
  '_variables.scss',
  'main.scss',
  'Sidebar.scss',
  'index.css',
  'StepSwitcher.scss',
];

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      traverseDirectory(fullPath);
    } else if (stat.isFile() && fullPath.endsWith('.scss')) {
      const fileName = path.basename(fullPath);
      if (excludedFiles.includes(fileName)) continue;

      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Ensure @import is at the top if we use variables
      let usesVariables = false;

      // Replace colors
      for (const [hex, sassVar] of Object.entries(colorMap)) {
        const regex = new RegExp(hex, 'gi');
        if (regex.test(content)) {
          content = content.replace(regex, sassVar);
          modified = true;
          usesVariables = true;
        }
      }

      if (modified) {
        // Calculate relative path to variables
        if (!content.includes('@import') && !content.includes('variables')) {
          const depth = fullPath.replace(srcDir, '').split(path.sep).length - 2;
          const prefix = depth > 0 ? '../'.repeat(depth) : './';
          content = `@import '${prefix}styles/variables';\n\n` + content;
        }

        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

traverseDirectory(srcDir);
console.log('Done!');
