import ts from 'typescript'
import fs from 'fs'

export default (path: string) => {
    // let p = require.resolve(path)
        // let p = "C:\\Users\\Armin\\Desktop\\saas\\qelite\\common\\apier.ts"

        let code = fs.readFileSync(path, "utf8")
        const result = ts.transpileModule(code, {
            compilerOptions: {
                module: ts.ModuleKind.NodeNext, 
                target: ts.ScriptTarget.ES2022 
            }
        });
        const runCode = new Function('exports', 'require', result.outputText);
        const exports = {};
        runCode(exports, require);
        return exports
}