$(document).ready(function () {
    $('#addToSubscriptions').on('click', addSubscription);
    $('#removeFromSubscriptions').on('click', removeSubscription);
    function addSubscription() {
        $.post('/add_subscription', {
            _id: $('.userid').text()
        },{}, 'text').done(function () {
            $('#addToSubscriptions').replaceWith("<input id='removeFromSubscriptions'>");
            $('#removeFromSubscriptions').attr('type', 'button')
                .val('Подписаны')
                .addClass('top-margin')
                .addClass('btn')
                .addClass('btn-success')
                .on('click', removeSubscription);
        }).fail(function () {
            $('#addToSubscriptions').removeClass('btn-default')
                .addClass('top-margin')
                .addClass('btn-warning')
                .val('Произошла ошибка');
        });
    }
    function removeSubscription() {
        $.post('/remove_subscription', {
            _id: $('.userid').text()
        }, {}, 'text').done(function () {
            $('#removeFromSubscriptions').replaceWith("<input id='addToSubscriptions'>");
            $('#addToSubscriptions').attr('type', 'button')
                .val('Подписаться')
                .addClass('top-margin')
                .addClass('btn')
                .addClass('btn-default')
                .on('click', addSubscription);
        }).fail(function () {
            $('#removeFromSubscriptions').removeClass('btn-default')
                .addClass('top-margin')
                .addClass('btn-warning')
                .val('Произошла ошибка');
        })
    }
});