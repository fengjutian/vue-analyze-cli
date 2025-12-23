"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseAST = traverseAST;
var compiler_dom_1 = require("@vue/compiler-dom");
function traverseAST(node, info) {
    var _a, _b;
    if (!node)
        return;
    // 处理插值表达式 {{ xxx }}
    if (node.type === compiler_dom_1.NodeTypes.INTERPOLATION) {
        info.interpolations.push(node.content.content.trim());
    }
    // 处理元素节点
    if (node.type === compiler_dom_1.NodeTypes.ELEMENT) {
        // 记录组件标签（大写开头）
        if (/^[A-Z]/.test(node.tag)) {
            info.components.push(node.tag);
        }
        // 遍历属性
        if (node.props) {
            node.props.forEach(function (prop) {
                if (prop.type === compiler_dom_1.NodeTypes.DIRECTIVE) {
                    switch (prop.name) {
                        case 'for':
                            if (prop.exp) {
                                info.vFors.push(prop.exp.content.trim());
                            }
                            break;
                        case 'if':
                            if (prop.exp) {
                                info.vIfs.push(prop.exp.content.trim());
                            }
                            break;
                        case 'else-if':
                            if (prop.exp) {
                                info.vElseIfs.push(prop.exp.content.trim());
                            }
                            break;
                        case 'else':
                            info.vElses += 1;
                            break;
                        case 'bind':
                            if (prop.arg) {
                                info.vBinds.push(prop.arg.content.trim());
                            }
                            break;
                        case 'on':
                            if (prop.arg) {
                                info.vOns.push(prop.arg.content.trim());
                            }
                            break;
                        case 'model':
                            if (prop.exp) {
                                info.vModels.push(prop.exp.content.trim());
                            }
                            break;
                        default:
                            // 处理自定义指令
                            info.customDirectives.push(prop.name);
                    }
                }
                else if (prop.type === compiler_dom_1.NodeTypes.ATTRIBUTE && prop.name === 'v-model') {
                    // 处理不带参数的v-model
                    info.vModels.push('');
                }
            });
        }
        // 处理slot名称
        if (node.tag === 'slot') {
            var nameProp = (_a = node.props) === null || _a === void 0 ? void 0 : _a.find(function (p) {
                return p.type === compiler_dom_1.NodeTypes.ATTRIBUTE && p.name === 'name';
            });
            if (nameProp) {
                info.slots.push(((_b = nameProp.value) === null || _b === void 0 ? void 0 : _b.content) || 'default');
            }
            else {
                info.slots.push('default');
            }
        }
    }
    // 递归处理子节点
    if (node.children) {
        node.children.forEach(function (child) { return traverseAST(child, info); });
    }
}
