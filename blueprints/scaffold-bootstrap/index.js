/*jshint node:true*/
module.exports = {
  description: ''

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  afterInstall: function() {
    console.info('asd');
    return this.addAddonsToProject([
      {name: 'bootstrap', target: '3.0.0'}
    ]);
  }
};
