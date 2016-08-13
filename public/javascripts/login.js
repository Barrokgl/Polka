$("#send").click(function () {
    //get values from form fields
    var login = $("[name='login']").val(), username = $("[name='username']").val(), password = $("[name='password']").val();
    var data = 'login='+login+'&'+'username='+username+'&'+'password='+password;
    //send to server
    $.ajax({
        url: '/registration',
        type: "POST",
        data: data,
        beforeSend: function () {
            alert('Отправлено')
        },
        success: function(response){
            alert(response.answer);
        }
    });
});