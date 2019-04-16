'use strict';

const pug = require('pug'),
  path = require('path'),
  pugMultipleBasedirsPlugin = require("pug-multiple-basedirs-plugin");

class Renderer {
  constructor() {
    this.baseDirs = [path.resolve(__dirname, 'templates')];
    this.plugin = pugMultipleBasedirsPlugin({ paths: this.baseDirs });
    this.templateCache = {};
  }

  addBaseDir(dir) {
    this.baseDirs.push(dir);
  }

  getTemplate(templateName) {
    if (!templateName.endsWith('.pug')) templateName = templateName + '.pug';

    const template = this.templateCache[templateName];
    if (template) {
      return template;
    }

    const filename = this.plugin.resolve('/' + templateName);
    const renderedTemplate = pug.compileFile(filename, {
      plugins: [this.plugin],
    });

    this.templateCache[templateName] = renderedTemplate;
    return renderedTemplate;
  }

  renderTemplate(templateName, locals) {
    return this.getTemplate(templateName)(locals);
  }

  addTemplate(templateName, templateString) {
    const compiledTemplate = pug.compile(templateString, {
      plugins: [this.plugin],
    });
    this.templateCache[templateName + '.pug'] = compiledTemplate;
  }
}

module.exports = Renderer;
