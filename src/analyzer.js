"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeVueFile = analyzeVueFile;
exports.analyzeProject = analyzeProject;
var fs_extra_1 = require("fs-extra");
var glob_1 = require("glob");
var compiler_sfc_1 = require("@vue/compiler-sfc");
var compiler_dom_1 = require("@vue/compiler-dom");
var traverseAST_1 = require("./traverseAST");
function analyzeVueFile(filePath) {
    var _a;
    var code = fs_extra_1.default.readFileSync(filePath, 'utf-8');
    var descriptor = (0, compiler_sfc_1.parse)(code).descriptor;
    var info = {
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
    if ((_a = descriptor.template) === null || _a === void 0 ? void 0 : _a.content) {
        var ast = (0, compiler_dom_1.baseParse)(descriptor.template.content);
        (0, traverseAST_1.traverseAST)(ast, info);
    }
    return info;
}
function analyzeProject(projectPath) {
    var files = (0, glob_1.globSync)('**/*.vue', { cwd: projectPath, absolute: true, ignore: 'node_modules/**' });
    return files.map(analyzeVueFile);
}
