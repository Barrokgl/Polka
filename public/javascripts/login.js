$(document).ready(function () {
    var url = '/registration';
    //select to login
    $('[name="enter"]').click(function () {
        $('[name="username"]').hide().attr('type', 'hidden');
        $("#logform").validator('update');
        $("#send").text('Войти');
        url = '/login';
    });
    //select to registration
    $('[name="registration"]').click(function () {
        $('[name="username"]').show().attr('type', 'text');
        $("#logform").validator('update');
        $("#send").text('Зарегистрироваться');
        url = '/registration';
    });
    //send form

    $("#logform").validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {
            alert('Форма заполнена не правильно')
        } else {
            e.preventDefault();
            var login = $("[name='login']").val();
            var username = $("[name='username']").val();
            var password = $("[name='password']").val();

            //send to server
            $.post(url, {login: login, username: username, password: password},
                function (data, textStatus, jqXHR) {
                    alert(data.answer);
                    if (data.done) {
                        window.location = '/';
                    }
                })
        }
    });
});

