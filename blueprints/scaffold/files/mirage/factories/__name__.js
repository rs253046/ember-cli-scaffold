import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
	<%= camelizedModuleName %>(i) {
		return '<%= classifiedModuleName %>' + i
	},
  <%=mirageFactory%>

});
