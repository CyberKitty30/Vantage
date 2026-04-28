const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Asus/Downloads/Vantage-1/script.js', 'utf8').split('\n');
lines.forEach((line, i) => {
    if (line.includes('let mapInitialized') || line.includes('let googleMap') || line.includes('let evmReady')) {
        console.log(i + 1, line);
    }
});
