$(document).ready(function () {
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
          .done(function () {
             alert('horay!');
          })
          .fail(function () {
             alert(':(');
          })
   });
   
   
   // upload new profile
   $('#send').click(function () {
      $.post('/edit_profile', {
         username: $('#username').val(),
         lastname: $('#lastname').val(),
         firstname: $('#firstname').val(),
         patronymic: $('#patronymic').val(),
         usersex: $('#sex').val(),
         // birthdate: $('#date').getDate(),
         birthdate: pickadate.getDate(),
         country: $('#country').val(),
         interests: $('#interests').val(),
         about: $('#about').val()
      },{},'text').done(function (data) {
         alert('yes');
      }).fail(function () {
         alert('no');
      })
   })
});