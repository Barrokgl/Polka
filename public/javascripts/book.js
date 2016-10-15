$('document').ready(function () {
    $('#addToPolka').on('click', addBook);
    $('#removeFromPolka').on('click', removeBook);
    function addBook() {
        // send request
        $.post('/add_to_polka', {
            property: 'books',
            value: $('.bookid').text()
        },{}, 'text').done(function () {
            $('#addToPolka').replaceWith("<input id='removeFromPolka'>");
            $('#removeFromPolka').attr('type', 'button')
                .val('Стоит на полке')
                .addClass('top-margin')
                .addClass('btn')
                .addClass('btn-success')
                .on('click', removeBook);
        }).fail(function () {
            $('#addToPolka').removeClass('btn-default')
                .addClass('top-margin')
                .addClass('btn-warning')
                .val('Произошла ошибка');
        });
    }
    function removeBook() {
         $.post('/remove_book', {
             property: 'books',
             value: $('.bookid').text()
         }, {}, 'text').done(function () {
             $('#removeFromPolka').replaceWith("<input id='addToPolka'>");
             $('#addToPolka').attr('type', 'button')
                 .val('Добавить на полку')
                 .addClass('top-margin')
                 .addClass('btn')
                 .addClass('btn-default')
                 .on('click', addBook);
         }).fail(function () {
             $('#removeFromPolka').removeClass('btn-default')
                 .addClass('top-margin')
                 .addClass('btn-warning')
                 .val('Произошла ошибка');
         })
     }
});
