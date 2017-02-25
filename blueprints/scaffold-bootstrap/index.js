/*jshint node:true*/
var fs = require('fs-extra');
var path = require('path');
module.exports = {
  description: '',

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  afterInstall: function(options) {
    return this.addBowerPackagesToProject([
      {name: 'bootstrap', target: '3.0.0'}
    ]).then(() => {
      this.includeDependencies(options.project.root);
    });
  },

  normalizeEntityName: function(entityName) {
    // Normalize and validate entity name here.
    return entityName;
  },

  fileMapTokens: function(options) {
    
    // Return custom tokens to be replaced in your files
    return {
      __token__: function(options){
        // logic to determine value goes here
        return 'value';
      }
    }
  },
  includeDependencies(root) {
    var dependenciesPath = path.join(root, 'ember-cli-build.js');

    var oldContent = fs.readFileSync(dependenciesPath, 'utf-8');

    var newContent = oldContent.replace(
`module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });`,
`module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });
  app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/bootstrap/dist/css/bootstrap-theme.css');
  app.import('bower_components/bootstrap/dist/js/bootstrap.js');
  `
    );
    fs.writeFileSync(dependenciesPath, newContent);
  }
};
