$(document).ready(function () {
    $('.form-group').click(function () {
        $('#send').popover('hide');
    });
    $('#send').click(function () {
        $('#data').submit();
    });
    $('#data').validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {

        } else {
            e.preventDefault();
            var formData = new FormData($('form#data')[0]);
            var formatedText = $('[name="text"]').val().replace(/\r+|\n+|\r\n+/g, "<br />");
            formData.set('text', formatedText);
            $.ajax({
                url: '/addbook',
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false,
                dataType: 'text',
                processData: false
            }).done(function (data) {
                console.log(data);
                $('#send').attr('data-content', data).popover('show');
                $('div.popover').addClass('popover-success').removeClass('popover-error');
            }).fail(function (data) {
                $('#send').attr('data-content', data).popover('show');
                $('div.popover').addClass('popover-error').removeClass('popover-success');
            })
        }
    });
});
