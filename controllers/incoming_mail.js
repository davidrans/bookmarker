var Post = require('../models').Post;

module.exports = function(mailin) {
	/* Event emitted after a message was received and parsed. */
	mailin.on('message', function (connection, data, content) {
	   console.log(data);
	});
}; 
