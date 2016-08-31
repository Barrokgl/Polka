$(document).ready(function () {
    $('#data').validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {
            alert('Форма заполнена не правильно')
        } else {
            e.preventDefault();
            var formData = new FormData($('form#data')[0]);
            var formatedText = $('[name="text"]').val().replace(/(\r\n|\n|\r)/gm, '');
            formData.set('text', formatedText);
            $.ajax({
                url: '/addbook',
                type: 'POST',
                data: formData,
                success: function (response) {
                    if (response.done) {
                        $('form#data')[0].reset();
                    }
                    alert(response.answer)

                },
                cache: false,
                contentType: false,
                processData: false
            })
        }
    });
});

