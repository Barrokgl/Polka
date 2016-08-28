$(document).ready(function () {
    $('#data').validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {
            alert('Форма заполнена не правильно')
        } else {
            e.preventDefault();
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
            })
        }
    });
});

