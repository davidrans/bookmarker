define(['jquery', 'socketio'],
function($, io) {

$(function() {
   var socket = io();

   hookUpPostEvents($('.post'));

   socket.on('post saved', function(postid) {
      $.get('/post/' + postid, function(postHTML) {
         var post = $(postHTML).insertAfter($('.category-filter'));
         hookUpPostEvents(post);
      });
   });

   socket.on('comment saved', function(ids) {
      var postid = ids[0];
      var comment_id = ids[1];

      var post = $('[data-postid="' + postid + '"]');

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

   $('.category-filter').change(function(ev) {
      var category = $(this).find('option:selected').text();

      if (category.toUpperCase() === 'ALL') {
         window.location.replace('/');
      } else {
         window.location.replace('/category/' + category);
      }
   });

   function hookUpPostEvents(posts) {
      posts.find('.comments-link').click(function() {
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

});
