import Ember from 'ember';

export default Ember.Controller.extend({
	newQwerty: {
    class: ""
    //put attribute here
	},
	actions: {
		save() {
			var qwerty = this.store.createRecord('qwerty', this.newQwerty);
			qwerty.save().then((response) => {
				this.transitionToRoute('qwertys.qwerty.show', response);
			});
		}
	}
});