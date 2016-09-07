$('document').ready(function () {
        var clicks = 0;
        $('#addToPolka').click(function () {
            // on second click will redirect to profile
            if (clicks != 0) {
                window.location = '/profile';
            } else {
                // send request
                $.post('/add_to_polka', {
                    bookid: $('.bookid').text(),
                    bookname: $('.bookname').text()
                },{}, 'text').done(function () {
                    $('#addToPolka').removeClass('btn-default')
                        .addClass('btn-success')
                        .val('Стоит на полке')
                        .attr('type', 'submit');
                    clicks++;
                }).fail(function () {
                    $('#addToPolka').removeClass('btn-default')
                        .addClass('btn-warning')
                        .val('Произошла ошибка');
                });
            }
        });
});
