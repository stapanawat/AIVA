const fs = require('fs');
const content = fs.readFileSync('src/pages/SuperAdmin.jsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('fetch') || line.includes('useEffect')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
