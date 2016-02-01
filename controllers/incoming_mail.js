var Post = require('../models').Post;
var User = require('../models').User;

module.exports = function(mailin, io) {
   /* Event emitted after a message was received and parsed. */
   mailin.on('message', function (connection, data, content) {
      var email = data.from[0].address;
      var url = data.text.trim();
      var title = data.subject || url;

      if (!url || !email) {
         return;
      }

      var user = User.findOne({
         where: {email: email}
      }).done(function(user) {
         if (!user) {
            return;
         }

         Post.create({
            url: url,
            title: title,
            userid: user.userid
         }).done(function(post) {
            io.emit('post saved', post.postid);
         });
      });
   });
};
