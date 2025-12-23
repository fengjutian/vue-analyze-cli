import fs from 'fs-extra';
import * as glob from 'glob';
import { parse as parseSFC } from '@vue/compiler-sfc';
import { baseParse } from '@vue/compiler-dom';
import { traverseAST } from './traverseAST.js';
export function analyzeVueFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const { descriptor } = parseSFC(code);
    const info = {
        file: filePath,
        interpolations: [],
        vFors: [],
        vIfs: [],
        vElseIfs: [],
        vElses: 0,
        vBinds: [],
        vOns: [],
        vModels: [],
        components: [],
        slots: [],
        customDirectives: []
    };
    if (descriptor.template?.content) {
        const ast = baseParse(descriptor.template.content);
        traverseAST(ast, info);
    }
    return info;
}
export function analyzeProject(projectPath) {
    const files = glob.sync('**/*.vue', { cwd: projectPath, absolute: true, ignore: 'node_modules/**' });
    return files.map(analyzeVueFile);
}
//# sourceMappingURL=analyzer.js.map