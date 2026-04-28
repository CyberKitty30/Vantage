const fs = require('fs');
try {
    const code = fs.readFileSync('c:/Users/Asus/Downloads/Vantage-1/script.js', 'utf8');
    new Function(code);
    console.log("Syntax OK");
} catch (e) {
    console.error("SYNTAX ERROR:", e);
}
