$(function() {
   var socket = io();

   socket.on('link saved', function(link) {
      console.log(link);
   });

   socket.on('comment saved', function(ids) {
      var link_id = ids[0];
      var comment_id = ids[1];

      var form = $('[data-linkid="' + link_id + '"] .comment-form');

      $.get('/comment/' + comment_id, function(commentHTML) {
         $(commentHTML).insertBefore(form);
      });
   });

   $('.post-banner').click(function() {
      $(this).hide();
      $('.post-form').show();
   });

   $('.comments-link').click(function() {
      $(this).parent().siblings('.comments').toggle();
   });

   $('.post-form').submit(function(e) {
      var data = $(this).serializeArray();
      $.post('/post', data);
      $(this).hide();
      $('.post-banner').show();
      e.preventDefault();
   });

   $('.comment-form').submit(function(e) {
      var data = $(this).serializeArray();
      $.post('/comment', data);
      $(this).find('textarea').val('');
      e.preventDefault();
   });

   /*$('#privacy').change(function(e) {
      if ($(this).val() === 'private') {
         $('#user-search').show();
      } else {
         $('#user-search').hide();
      }
   });

   $('#user-search input').autocomplete({
      delay: 200,   
      source: function(req, res) {
         if (!req.term) {
            res([]);
         }

         $.get('/users/search/' + req.term, function(users) {
            var emails = users.map(function(user) {
               return user.email;
            });

            res(emails);
         });
      },
      select: function(ev, ui) {
         appendToUserList(ui.item.value);
         $('#user-search input').val('');
         ev.preventDefault();
      }
   });

   function appendToUserList(email) {
      var userList = $('#user-list');
      var listItem = $('<li>').text(email);
      userList.append(listItem);
   }*/
});
