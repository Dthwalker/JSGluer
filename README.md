# JSGluer
## About
**JSGluer** is a simple JS file packer with import/export support.It does not format or obfuscate code, but simply concatenates files.
It respects import branch hierarchies and will put the deepest dependencies at the top of the final bundle.
## How to use
To run the packaging, you need to run JSGluer via console and pass arguments of `entry point file` and `final directory` of the bundle
```
node JSGluer.js ./input_file.js ./bundle_dir
```
After a successful build, there will be a new file in the target build directory, or an overwritten old one.
**Note:** JSGluer takes the source file name as a base and adds the Build prefix, like `script.js` becomes `scriptBundle.js`.
## Example
Let's say I have three scripts:
> _script-1.js_
> ```
> export const a = 1;
> ```

> _script-2.js_
> ```
> import {a} from './script-1.js';
> export const b = 2 + a;
> ```

> _index.js_
> ```
> import {a} from './script-1.js';
> import {b} from './script-1.js';
> console.log(a + b);
> ```
I will write the command
```
node JSGluer.js ./src/dev/index.js ./build
```
I will get the final file in the `build` directory as follows:
> indexBundle.js
> ```
> const a = 1;
> const b = a + 1;
> console.log(a + b);
> ```

## P.S. 
At the moment **JSGluer** only supports single-line imports, make sure that in your project the import is written in one line! Maybe I'll fix this in the future.
