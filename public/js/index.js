$(function() {
   $('#add-link').submit(function(e) {
      var data = $(this).serializeArray();
      $.post('/', data);
      $('input').val('');
      return false;
   });
});
