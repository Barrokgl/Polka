$(document).ready(function () {
        // Устанавливаем обработчик потери фокуса для всех полей ввода текста
        $('input[name="bookname"], input[name="author"],input[name="genre"], textarea[name="text"]').unbind().blur( function(){

            var id = $(this).attr('name');
            var val = $(this).val();

            switch(id)
            {
                case 'bookname':
                    var rv_name = /[a-zA-Zа-яА-Я]+/;
                    if(val.length > 1 && val != '' && rv_name.test(val))
                    {
                        $(this).addClass('not_error');
                    }
                    else
                    {
                        $(this).removeClass('not_error').addClass('error');
                        $(this).next('.error-box').html('поле "Название" обязательно для заполнения, поле должно содержать только русские или латинские буквы')
                            .css('color','red')
                            .animate({'paddingLeft':'10px'},400)
                            .animate({'paddingLeft':'5px'},400);
                    }
                    break;

                case 'author':
                    var rv_author = /[a-zA-Zа-яА-Я]+/;
                    if(val != '' && rv_author.test(val))
                    {
                        $(this).addClass('not_error');
                    }
                    else
                    {
                        $(this).removeClass('not_error').addClass('error');
                        $(this).next('.error-box').html('поле автор обязательно для заполнения')
                            .css('color','red')
                            .animate({'paddingLeft':'10px'},400)
                            .animate({'paddingLeft':'5px'},400);
                    }
                    break;

                case 'genre':
                    var rv_genre = /[a-zA-Zа-яА-Я]+/;
                    if(val != '' && rv_genre.test(val))
                    {
                        $(this).addClass('not_error');
                    }
                    else
                    {
                        $(this).removeClass('not_error').addClass('error');
                        $(this).next('.error-box').html('поле "Жанр" обязательно для заполнения')
                            .css('color','red')
                            .animate({'paddingLeft':'10px'},400)
                            .animate({'paddingLeft':'5px'},400);
                    }
                    break;


                case 'text':
                    if(val != '' && val.length < 5000)
                    {
                        $(this).addClass('not_error');
                    }
                    else
                    {
                        $(this).removeClass('not_error').addClass('error');
                        $(this).next('.error-box').html('поле "Описание книги" обязательно для заполнения')
                            .css('color','red')
                            .animate({'paddingLeft':'10px'},400)
                            .animate({'paddingLeft':'5px'},400);
                    }
                    break;

            }

        });
        $('#send').click(function () {
            if($('.not_error').length == 4) {
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
                });
            } else {
                return false;
            }

        });

});


