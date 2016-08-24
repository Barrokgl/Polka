$(document).ready(function () {
    var url = '/registration';
    //select to login
    $('[name="enter"]').click(function () {
        $('[name="username"]').hide();
        $("#send").attr('value', 'Войти');
        url = '/login';
    });
    //select to registration
    $('[name="registration"]').click(function () {
        $('[name="username"]').show();
        $("#send").attr('value', 'Зарегистрироваться');
        url = '/registration';
    });
    //send form
    $("#send").click(function () {
        //get values from form fields
        var login = $("[name='login']").val();
        var username = $("[name='username']").val();
        var password = $("[name='password']").val();
        var data = {
            login: login,
            username: username,
            password: password
        };
        //send to server
        $.post(url, {data: data},
            function (data, textStatus, jqXHR) {
                alert(data.answer);
                if (data.done) {
                    window.history.back(-1)
                }
        })
    });
});
