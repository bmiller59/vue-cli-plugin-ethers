const fs = require('fs');
const path = require('path');

module.exports = (api, options, rootOptions) => {
  const {
    moduleName,
    storeRootDir
  } = options;
  const templatesRoot = './templates';
  const moduleDirPath = path.join(storeRootDir, moduleName);
  const storeRootPath = path.join(storeRootDir, 'index.js');

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
      vuex: '^3.0.1',
      ethers: "^3.0.27",
      'es6-promisify': '^6.0.0',
      'p-timeout': '^2.0.1'
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

      const exportStartIndex = lines.findIndex(line => line.match(/export/));
      const initInsertIndex = exportStartIndex >= 0 ? exportStartIndex : lines.length
      lines.splice(initInsertIndex,0,`store.dispatch('ethers/init')\n`)

      files[storeRootPath] = lines.join('\n');
    }
  })
}
