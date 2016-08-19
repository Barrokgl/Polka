$(document).ready(function () {
    $('#send').click(function () {
        var formData = new FormData($('form#data')[0]);
        $.ajax({
           url: '/addbook',
            type: 'POST',
            data: formData,
            success: function (response) {
                alert(response.answer)
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });
});