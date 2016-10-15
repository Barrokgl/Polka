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
            //upload new book info
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
                $('#send').attr('data-content', data).popover('show');
                $('div.popover').addClass('popover-success').removeClass('popover-error');
            }).fail(function (data) {
                $('#send').attr('data-content', data).popover('show');
                $('div.popover').addClass('popover-error').removeClass('popover-success');
            });
        }
    });
});