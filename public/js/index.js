$(function() {
   var socket = io();

   hookUpPostEvents($('.post'));

   socket.on('link saved', function(link_id) {
      $.get('/post/' + link_id, function(postHTML) {
         var post = $(postHTML).insertAfter($('.create-post'));
         hookUpPostEvents(post);
      });
   });

   socket.on('comment saved', function(ids) {
      var link_id = ids[0];
      var comment_id = ids[1];

      var post = $('[data-linkid="' + link_id + '"]');

      // Toggle comment icon on post.
      post.find('.comments-link i').removeClass('fa-comment-o')
                                   .addClass('fa-comment');

      $.get('/comment/' + comment_id, function(commentHTML) {
         var form = post.find('.comment-form');
         $(commentHTML).insertBefore(form);
      });
   });

   $('.post-banner').click(function() {
      $(this).hide();
      $('.post-form').show();
   });

   $('.post-form').submit(function(e) {
      var data = $(this).serializeArray();
      $.post('/post', data);
      $(this).hide();
      $('.post-banner').show();
      e.preventDefault();
   });

   function hookUpPostEvents(posts) {
      posts.find('.comments-link').click(function() {
         console.log(this);
         $(this).parent().siblings('.comments').toggle();
      });

      posts.find('.comment-form').submit(function(e) {
         var data = $(this).serializeArray();
         $.post('/comment', data);
         $(this).find('textarea').val('');
         e.preventDefault();
      });
   }
});
