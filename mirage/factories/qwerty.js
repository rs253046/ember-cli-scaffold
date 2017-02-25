import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
	qwerty(i) {
		return 'Qwerty' + i
	},
  class(i) {return "test" + i}

});
