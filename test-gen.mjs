import fs from 'fs';
import path from 'path';

const filesToTest = [
  'src/App.tsx',
  'src/components/layout/Header/Header.tsx',
  'src/pages/HelpScreen/HelpScreen.tsx',
  'src/components/layout/Layout.tsx',
  'src/pages/NotFoundScreen/NotFoundScreen.tsx',
  'src/pages/Overview/components/OverviewMetrics/OverviewMetrics.tsx',
  'src/pages/Overview/OverviewScreen.tsx',
  'src/components/layout/PageHeader/PageHeader.tsx',
  'src/components/ProjectLayout/ProjectLayout.tsx',
  'src/pages/Overview/components/ProjectOverviewHeader/ProjectOverviewHeader.tsx',
  'src/pages/Purchases/PurchasesScreen.tsx',
  'src/pages/Purchases/components/PurchasesTabs/PurchasesTabs.tsx',
  'src/pages/Purchases/components/RequestsTab/RequestsTab.tsx',
  'src/routes/routes.tsx',
  'src/components/ui/SectionHeader/SectionHeader.tsx',
  'src/components/layout/Sidebar/Sidebar.tsx',
  'src/components/ui/StepSwitcher/StepSwitcher.tsx',
];

filesToTest.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  const testFilePath = filePath.replace('.tsx', '.test.tsx');

  if (fs.existsSync(testFilePath)) {
    console.log(`Skipping ${testFilePath}, already exists`);
    return;
  }

  const componentName = path.basename(file, '.tsx').replace('.tsx', '');

  const testContent = `import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <${componentName} />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
`;

  fs.writeFileSync(testFilePath, testContent, 'utf-8');
  console.log(`Created ${testFilePath}`);
});
