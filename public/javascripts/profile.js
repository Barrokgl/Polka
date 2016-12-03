$(document).ready(function () {
    function formatDate(date) {

        var dd = date.getDate();
        if (dd < 10) dd = '0' + dd;

        var mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;

        var yy = date.getFullYear() % 100;
        if (yy < 10) yy = '0' + yy;

        return dd + '.' + mm + '.' + yy;
    }
    //transform birthdate
    $('.birthdate').text(formatDate(new Date($('.birthdate').text())));

    // set statuses for books
    var books = $('div.polka');
    $.each(books, function (index, value) {
        var status = $(this).children('p.hidden.bookstatus').text();
        var selector = "option[value='"+status+"']";
        $(this).children('select').children(selector).attr('selected', 'selected');
    });

    //
    $('div.polka select').change(function () {
        var bookid = $(this).parent().children('p.bookid').text();
        var status = $(this).val();
        $.post('/set_book_status',{
            _id: bookid,
            status: status
        },{}, 'text').done(function () {

        }).fail(function () {

        });
    });
});

