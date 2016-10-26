$(document).ready(function () {
    $('input').click(function () {
        $('#send').popover('hide');
    });
    var url = '/registration';
    //select to login
    $('[name="enter"]').click(function () {
        $('[name="username"]').hide().attr('type', 'hidden');
        $('.checkbox').show();
        $("#logform").validator('update');
        $("#send").text('Войти');
        url = '/login';
    });
    //select to registration
    $('[name="registration"]').click(function () {
        $('[name="username"]').show().attr('type', 'text');
        $('.checkbox').hide();
        $("#logform").validator('update');
        $("#send").text('Зарегистрироваться');
        url = '/registration';
    });
    //send form
    $('#send').click(function () {
        $('#logform').submit();
    });
    $("#logform").validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {

        } else {
            e.preventDefault();
            var remember = $('[name="checkbox"]').prop("checked");
            //send to server
            $.post(url, {
                login: $("[name='login']").val(),
                username: $("[name='username']").val(),
                password: $("[name='password']").val(),
                remember: remember ? remember : undefined
            },{},'text').done(function () {
                window.location = '/';
            }).fail(function (data) {
                $('#send').attr('data-content', data.responseText).popover('show');
            });
        }
    });
});


