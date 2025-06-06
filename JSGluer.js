const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);


// ------------------------------ //
// ----------- Config ----------- //

let [starter, bundle] = args;

if (!starter || !bundle) throw {error: 'you need to specify the file name in the call argument'};

let inputScript = path.resolve(__dirname, starter);
let outputScript = path.resolve(__dirname, bundle, path.basename(inputScript, path.extname(inputScript)) + 'Bundle.js');



// ------------------------------- //
// ------------ Logic ------------ //

let stack = new Set();
let script = inputScript;


const collectImports = (file) => {
    let rowScript = fs.readFileSync(file, 'utf-8').split('\n');

    for (let i = 0; i < rowScript.length; i++) {
        let imprt = rowScript[i].trim().match(/(?<=^import.*('|"|`)).+\.*js(?=('|"|`))/i);
        if (imprt) {
            rowScript.splice(i, 1);
            i--;
            try {
                collectImports(  path.join(path.dirname(file), imprt[0])  );
            } catch { return }
        }
    }
    stack.add(rowScript.join('\n').replaceAll(/export (default )*/g, ''));
}


collectImports(script);
fs.writeFileSync(outputScript, [...stack].join('\n\n\n'));

console.log(`\n\n\x1b[105mGluing completed successfully!\x1b[0m\nBundle file: ${outputScript}\n`);