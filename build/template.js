"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pug_1 = require("pug");
var node_sass_1 = require("node-sass");
var juice_1 = require("juice");
var path_1 = require("path");
var TEMPLATE_PATH = "./templates/";
var TemplateController = (function () {
    function TemplateController() {
    }
    TemplateController.render = function (template, param) {
        var tPath = path_1.resolve(TEMPLATE_PATH + template);
        var sPath = tPath + "/style.sass";
        var pPath = tPath + "/index.pug";
        var cssBuffer = node_sass_1.default.renderSync({ file: sPath });
        var style = cssBuffer.css.toString();
        var options = Object.assign(param, { style: style });
        var html = pug_1.default.renderFile(pPath, options);
        return juice_1.default(html);
    };
    return TemplateController;
}());
exports.default = TemplateController;
//# sourceMappingURL=template.js.map