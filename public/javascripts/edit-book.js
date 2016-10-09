$(document).ready(function () {
    // upload new bookcover
   $('#upload').click(function () {
       var formData = new FormData($('form#image')[0]);
       $.ajax({
           url: '/upload_bookcover/:'+$('.bookid').text(),
           type: 'POST',
           data: formData,
           contentType: false,
           dataType: 'text',
           processData: false
       })
           .done(function () {
               console.log('horay');
           })
           .fail(function () {
               console.log('no')
           });
   });

    //upload new book info
    $('#send').click(function () {
        $.post(':'+$('.bookid').text(), {
            bookname: $('#bookname').val(),
            author: $('#author').val(),
            genre: $('#genre').val(),
            year: $('#year').val(),
            text: $('#text').val(),
            isbn: $('#isbn').val(),
            publisher: $('#publisher').val(),
            series: $('#series').val(),
            setting: $('#setting').val(),
            additional: $('#additonal').val()
        },{},'text').done(function (data) {
            console.log('yes');
        }).fail(function () {
            console.log('no');
        });
    });
});