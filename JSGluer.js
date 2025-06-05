const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);


// ------------------------------ //
// ----------- Config ----------- //

let name = args[0];

if (!name) throw {error: 'you need to specify the file name in the call argument'};

let inputScript = path.resolve(__dirname, 'src', 'dev', name + '.js');
let outputScript = path.resolve(__dirname, 'src', 'DefaultBuilds', name + 'Bundle.js');



// ------------------------------- //
// ------------ Logic ------------ //
const rePath = (from, to) => path.join(from.split(/\\|\//ig).slice(0, -1).join('/'),  to);


let stack = new Set();
let script = inputScript;


const collectImports = (file) => {
    let rowScript = fs.readFileSync(file, 'utf-8').split('\n');

    for (let i = 0; i < rowScript.length; i++) {
        let imprt = rowScript[i].trim().match(/(?<=^import.*('|"|`)).+\.*js(?=('|"|`))/i);
        console.log(rowScript[i])
        if (imprt) {
            rowScript.splice(i, 1);
            i--;
            try {
                collectImports(rePath(file, imprt[0]));
            } catch { return }
        }
    }
    stack.add(rowScript.join('\n').replaceAll('export ', ''));
}


collectImports(script);
fs.writeFileSync(outputScript, [...stack].join('\n\n\n'));