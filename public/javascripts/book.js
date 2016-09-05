$('document').ready(function () {
        var clicks = 0;
        $('#addToPolka').click(function () {
            // on second click will redirect to profile
            if (click != 0) {
                    window.location = '/profile';
            }
            var url = '/book/:'+$('.bookname').text();
            // send request
            $.post(url, {
                bookid: $('.bookid').text()
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
        });
});
