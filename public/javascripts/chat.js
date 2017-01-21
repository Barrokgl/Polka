$('document').ready(function(){
    createWS().then((sc) => {
        $('.chat-btn').on('click', function() {
            var msg = $('.chat-input').val();
            sc.send(JSON.stringify({msg:msg}));
            $('.chat-input').val('');
        });
        sc.onmessage = function(event) {
            var msg = JSON.parse(event.data);
            console.log(event);
            $('.chat-window').append(`<p>${msg.msg}</p>`);
        }
    }).catch((err) => console.log(err));


});

function createWS() {
   return new Promise((resolve, reject) => {
       ///window.socket = new WebSocket('wss://go-chatter.herokuapp.com/ws');
       window.socket = new WebSocket('ws://localhost:8080/ws');
       socket.onerror = function(error) {
           reject(error);
       };
       socket.onclose = function(event) {
           if (!event.wasClean) {
               console.log('Обрыв соединения: ', event.code, event.reason);
           }
       };
       socket.onopen = function() {
           console.log('Connection is opened');
           //test conn
           // socket.send(JSON.stringify({msg:'test message'}));
           resolve(socket);
       };
       socket.onmessage = function(event) {
           console.log('Data incoming: ', event.data)
       };
       window.onbeforeunload = function() {
           socket.onclose = function () {}; // disable onclose handler first
           socket.close()
       };
   });
}