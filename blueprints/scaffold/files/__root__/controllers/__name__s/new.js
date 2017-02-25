import Ember from 'ember';

export default Ember.Controller.extend({
	new<%=classifiedModuleName%>: {
    <%= newObjectAttrs %>
    //put attribute here
	},
	actions: {
		save() {
			var <%= camelizedModuleName %> = this.store.createRecord('<%= dasherizedModuleName %>', this.new<%=classifiedModuleName%>);
			<%= camelizedModuleName %>.save().then((response) => {
				this.transitionToRoute('<%= dasherizedModuleName%>s.<%= dasherizedModuleName%>.show', response);
			});
		}
	}
});