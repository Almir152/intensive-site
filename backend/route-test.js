const { pathToRegexp } = require('path-to-regexp');
const fs = require('fs');

const checkFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const routePattern = /(?:app\.|route\.)(get|post|put|delete|all)\(['"`]([^'"`]+)/g;
  
  let match;
  while ((match = routePattern.exec(content)) !== null) {
    const [, method, path] = match;
    try {
      pathToRegexp(path);
    } catch (e) {
      console.error(`Invalid route in ${filePath}: ${method.toUpperCase()} ${path}`);
      console.error(`Error: ${e.message}`);
    }
  }
};

// Проверьте все файлы с маршрутами
['./server.js'].forEach(checkFile);
