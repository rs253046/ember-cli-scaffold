import DS from 'ember-data';

export default DS.Model.extend({
	<%= camelizedModuleName %>: DS.attr('string'),
	<%=modelAttrs%>,
	toS: Ember.computed.alias('name')
});