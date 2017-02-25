import DS from 'ember-data';

export default DS.Model.extend({
	qwerty: DS.attr('string'),
	class: DS.attr('string'),
	toS: Ember.computed.alias('name')
});