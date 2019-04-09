'use strict';

const pug = require('pug'),
  path = require('path'),
  get = require('lodash.get'),
  pugMultipleBasedirsPlugin = require("pug-multiple-basedirs-plugin");

class Renderer {
  constructor(options) {
    const templateBaseDirs = get(options, 'html.templateBaseDirs', []);
    templateBaseDirs.push(path.resolve(__dirname, 'templates'));
    this.plugin = pugMultipleBasedirsPlugin(({
      paths: templateBaseDirs
    }));
    this.templateCache = {};
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
