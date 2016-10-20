$(document).ready(function () {
   $('body').click(function () {
      $('#upload').popover('hide');
   });
   var sex = $('.usersex').val();
   $('#sex').val(sex);
   var pickadate = new Pikaday({
      field: document.getElementById('date')
   });
   //console.log(pickadate.getDate());
   
   // upload new icon 
   $('#upload').click(function () {
      var formData = new FormData($('form#image')[0]);
      console.log(formData);
      $.ajax({
         url: '/upload_img',
         type: 'POST',
         data: formData,
         cache: false,
         contentType: false,
         dataType: 'text',
         processData: false
      })
          .done(function (data) {
             $('#upload').attr('data-content', data).popover('show');
             $('div.popover').addClass('popover-success').removeClass('popover-error');
          })
          .fail(function (data) {
             $('#upload').attr('data-content', data.responseText).popover('show');
             $('div.popover').addClass('popover-error').removeClass('popover-success');
          });
   });

   $('.form-group').click(function () {
      $('#send').popover('hide');
   });

   $('#send').click(function () {
      $('#data').submit();
   });
   // validate info
   $('#data').validator().on('submit', function (e) {
      if (e.isDefaultPrevented()) {

      } else {
         e.preventDefault();
         // upload new profile
         $.post('/edit_profile', {
            username: $('#username').val(),
            lastname: $('#lastname').val(),
            firstname: $('#firstname').val(),
            patronymic: $('#patronymic').val(),
            usersex: $('#sex').val(),
            birthdate: pickadate.getDate(),
            country: $('#country').val(),
            interests: $('#interests').val(),
            about: $('#about').val()
         },{},'text').done(function (data) {
            $('#send').attr('data-content', data).popover('show');
            $('div.popover').addClass('popover-success').removeClass('popover-error');
         }).fail(function () {
            $('#send').attr('data-content', data).popover('show');
            $('div.popover').addClass('popover-error').removeClass('popover-success');
         });
      }
   });
});