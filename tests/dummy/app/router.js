import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('qwertys', function(){
    this.route('new');  
    this.route('qwerty', {path: '/:qwerty_id'}, function(){
      this.route('show');
      this.route('edit');
    });
  });


});

export default Router;
