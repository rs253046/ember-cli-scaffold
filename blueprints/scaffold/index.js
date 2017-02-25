// index.js
var stringUtils = require('../../lib/utilities/string');
var EOL = require('os').EOL;
var fs = require('fs-extra');
var path = require('path');
module.exports = {
  description: 'Generates an crud',
  locals: function(options) {
    var modelAttrs = [];
    var displayAttrs = [];
    var inputAttrs = [];
    var newObjectAttrs = [];
    var mirageFactory = [];
    var entityOptions = options.entity.options;
    for(name in entityOptions) {
      var type = entityOptions[name] || '';
      var dasherizedName = stringUtils.dasherize(name);
      var camelizedName = stringUtils.camelize(name);
      var dasherizedType = stringUtils.dasherize(type);
      modelAttrs.push(camelizedName + ': ' + dsAttr(dasherizedName, dasherizedType));
      newObjectAttrs.push(camelizedName + ': ' + newObject(dasherizedType));

      inputAttrs.push(inputString(camelizedName, dasherizedType));
      displayAttrs.push('<div class="crud-attr">' + display(camelizedName, dasherizedType) + '</div>');
      mirageFactory.push(getMirageFactory(camelizedName, dasherizedType));
    }
    modelAttrs = modelAttrs.join(',' + EOL + '  ');
    mirageFactory = mirageFactory.join(',' + EOL + '  ');
    displayAttrs = displayAttrs.join('' + EOL + '  ');
    newObjectAttrs = newObjectAttrs.join(',' + EOL + '    ');
    inputAttrs = inputAttrs.join('' + EOL + '  ');
    return {
      modelAttrs:modelAttrs,
      displayAttrs:displayAttrs,
      newObjectAttrs:newObjectAttrs,
      inputAttrs:inputAttrs,
      mirageFactory:mirageFactory
    };
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

  beforeInstall: function(options) {},
  afterInstall: function(options) {
    updateRouter (
      options.entity.name,
      {
        root: options.project.root
      },
      options.dummy
    );
    updateMirageConfig (
      options.entity.name,
      {
        root: options.project.root
      },
      options.dummy
    );
    updateMirageDbServer (
      options.entity.name,
      {
        root: options.project.root
      },
      options.dummy
    );
  },
  beforeUninstall: function(options) {},
  afterUninstall: function(options) {}

};

function dsAttr(name, type) {
  switch (type) {
  case 'array':
  case 'boolean':
  case 'date':
  case 'number':
  case 'string':
    return "DS.attr('" + type + "')";
  default:
    return 'DS.attr()';
  }
}

function getMirageFactory(name, type) {
  switch (type) {
  case 'boolean':
    return name +': false';
  case 'number':
    return name +'(i) {return i}'
  case 'string':
    return name + '(i) {return "test" + i}';
  default:
    return '';
  }
}

function inputField(name, type) {
  switch (type) {
  case 'boolean':
    return "{{input type='checkbox' checked=model." + name + "}}"; 
  default:
    return "{{input value=model." + name + " class='form-control'}}";
  }
}

function newObject(type) {
  switch (type) {
  case 'boolean':
    return false;
  default:
    return '""';
  }
}

function display(name, type) {
  return name + ": {{model." + name + "}}";
}

function updateRouter(name, options, dummy) {
  var routerPath = path.join(options.root, 'app', 'router.js');
  if (dummy) {
    routerPath = path.join(options.root, 'tests/dummy/app', 'router.js');
  }
  var oldContent = fs.readFileSync(routerPath, 'utf-8');
  var plural = name + 's';

  if(oldContent.indexOf(`this.route(\'${plural}\', function(){
    this.route('new');  
    this.route(\'${name}\', {path: \'/:${name}_id\'}, function(){
      this.route('show');
      this.route('edit');
    });
  });`) != -1) {
    return;
  }

  var newContent = oldContent.replace('Router.map(function() {',
   `Router.map(function() {
  this.route(\'${plural}\', function(){
    this.route('new');  
    this.route(\'${name}\', {path: \'/:${name}_id\'}, function(){
      this.route('show');
      this.route('edit');
    });
  });${EOL}`
  );
  
  fs.writeFileSync(routerPath, newContent);
}

function updateMirageConfig(name, options, dummy) {
  var miragePath = path.join(options.root, 'mirage' , 'config.js');
  if (dummy) {
    miragePath = path.join(options.root, 'tests/dummy/app', 'router.js');
  }

  fs.ensureFileSync(miragePath);
  var oldContent = fs.readFileSync(miragePath, 'utf-8');

  if (!oldContent) {
    var defaultConfig = defaultMirageConfig();
    fs.writeFileSync(miragePath, defaultConfig);
    updateMirageDbSerializer(options.root);
    updateApplicationConfig(options.root);
  }
  oldContent = fs.readFileSync(miragePath, 'utf-8');
  var plural = name + 's';
  if(oldContent.indexOf(`'${plural}',`) != -1) {
    return;
  }
   var newContent = oldContent.replace('let pathLists = [',
   `let pathLists = [
    '${plural}',`
  );
  fs.writeFileSync(miragePath, newContent);
}

function updateApplicationConfig(pathRoot) { 
  var applicationConfigPath = path.join(pathRoot, 'config', 'environment.js');
  var oldContent = fs.readFileSync(applicationConfigPath, 'utf-8');

  var defaultApplicationConfig = 
`if (environment === 'development') {
    ENV['ember-cli-mirage'] = {
      enabled: true
    }`

   var newContent = oldContent.replace(`if (environment === 'development') {`,
     defaultApplicationConfig
  );
  fs.writeFileSync(applicationConfigPath, newContent);

}

function defaultMirageConfig () {
  var config = 
`export default function() {
  //this.urlPrefix = 'https://localhost:3000/';
  //this.namespace = 'api/v1/';

  let pathLists = [
  ];

  // rest services for different generators
  pathLists.forEach((item) => {
    restServices(this, item);
  });

}

function restServices(self, path) {
  self.post(path);
  self.get(path);
  self.get(path + '/:id');
  self.put(path + '/:id');
  self.patch(path + '/:id');
  self.del(path + '/:id');
}
  `
  return config;
}

function updateMirageDbServer(name, options, dummy) {
  var miragePath = path.join(options.root, 'mirage' , 'scenarios', 'default.js');
  
  if (dummy) {
    miragePath = path.join(options.root, 'tests/dummy/app', 'router.js');
  }

  fs.ensureFileSync(miragePath);

  var oldContent = fs.readFileSync(miragePath, 'utf-8');

  if (!oldContent) {

    var defaultConfig = defaultMirageDbServer();

    fs.writeFileSync(miragePath, defaultConfig);
  }
  oldContent = fs.readFileSync(miragePath, 'utf-8');

  var plural = name + 's';
  if(oldContent.indexOf(`'${name}',`) != -1) {
    return;
  }  
  var newContent = oldContent.replace('let pathLists = [',
   `let pathLists = [
    '${name}',`
  );
   fs.writeFileSync(miragePath, newContent);
}

function inputString(camelizedName, dasherizedType) {
  const inputHtml =
  `
              <div class="form-group row">
                <div class="col-md-4">
                  <label class="control-label" for="signupName">${camelizedName}</label>
                </div>
                <div class="col-md-6">
                  ${inputField(camelizedName, dasherizedType)}
                </div>
              </div>`
  return inputHtml;
}

function defaultMirageDbServer () {
  var config = 
`export default function( server ) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.

    Make sure to define a factory for each model you want to create.
  */

  // server.createList('crud', 10);
  // server.createList('classic', 10);
  let pathLists = [

  ];

  
  pathLists.forEach((item) => {
   seedDatabase(server, item, 10);
  })
 
}

function seedDatabase(server, path, count) {
  server.createList(path, count);
}
  `
  return config;
}


function updateMirageDbSerializer(rootpath) {
    var mirageDbSerializerPath = path.join(rootpath, 'mirage' , 'serializers', 'application.js');
    var defaultSerializer = 
`import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
});`
    fs.outputFileSync(mirageDbSerializerPath, defaultSerializer)
}


