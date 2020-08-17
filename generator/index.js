const fs = require('fs');
const path = require('path');

module.exports = (api, options, rootOptions) => {
  const {
    moduleName,
    storeRootDir,
    mainJsDir
  } = options;
  const templatesRoot = './templates';
  const moduleDirPath = path.join(storeRootDir, moduleName);
  const storeRootPath = path.join(storeRootDir, 'index.js');
  const mainJsPath = path.join(mainJsDir, 'main.js');

  // Abort if module already exists
  if (fs.existsSync(moduleDirPath)) {
    console.warn(`Module ${moduleName} exists`)
    return;
  }

  const files = {};

  // Store root
  if (!fs.existsSync(storeRootPath)) {
    files[storeRootPath] = `${templatesRoot}/index.js`;
  }

  // Modules templates
  ['index', 'actions', 'mutations', 'getters', 'ethersConnect'].forEach(template => {
    const fileName = `${template}.js`;
    const filePath = path.join(moduleDirPath, fileName);
    files[filePath] = `${templatesRoot}/module/${fileName}`;
  });

  api.extendPackage({
    dependencies: {
      vuex: '^3.5.1',
      ethers: '^5.0.8'
    }
  });

  api.render(files);

  api.postProcessFiles(files => {
    // Edit store's root module
    const storeRoot = files[storeRootPath];

    if (storeRoot) {
      const lines = storeRoot.split(/\r?\n/g).reverse();

      // Add import line
      const lastImportIndex = lines.findIndex(line => line.match(/^import/));
      if (lastImportIndex !== -1) {
        lines[lastImportIndex] += `\nimport ${moduleName} from './${moduleName}'`;
      }

      // Add module line
      lines.reverse()
      const modulesStartIndex = lines.findIndex(line => line.match(/modules: *{/));
      if (modulesStartIndex !== -1) {
        const spaces = lines[modulesStartIndex].indexOf('modules');
        const modulesEndIndex = lines.findIndex((line, index) => index >= modulesStartIndex && line.match(/}/));
        if (modulesEndIndex !== -1) {
          if (modulesEndIndex === modulesStartIndex) {
            const closingBraceIndex = lines[modulesStartIndex].indexOf('}');
            const start = lines[modulesStartIndex].substr(0, closingBraceIndex);
            const end = lines[modulesStartIndex].substr(closingBraceIndex);
            lines[modulesEndIndex] = `${start}\n${Array(spaces + 3).join(' ')}${moduleName}\n${Array(spaces + 1).join(' ')}${end}`;
          } else {
            lines[modulesEndIndex] = `${Array(spaces + 3).join(' ')}${moduleName}\n${lines[modulesEndIndex]}`;
            if (modulesEndIndex - modulesStartIndex > 1) {
              lines[modulesEndIndex - 1] += ',';
            }
          }
        }
      }
      files[storeRootPath] = lines.join('\n');
    }
  })


  api.onCreateComplete(() => {
    // augment main.js to init ethers store
    let contentMain = fs.readFileSync(mainJsPath, { encoding: 'utf-8' })
    const linesMain = contentMain.split(/\r?\n/g)
    linesMain.push('\n// Initialize ethers store')
    linesMain.push(`store.dispatch('ethers/init')\n`)
    contentMain = linesMain.join('\n')
    fs.writeFileSync(mainJsPath, contentMain, { encoding: 'utf-8' })
  })
}
