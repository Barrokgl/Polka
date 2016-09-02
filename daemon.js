var nodemon = require('nodemon');
var log = require('./libs/logs')(module);
var config = require('./config');

nodemon(config.get('nodemon'));

nodemon.on('start', function () {
    log.info('Polka has started, on port: '+config.get('port'));
}).on('quit', function () {
    log.notice('Polka has quited');
}).on('restart', function (file) {
    log.notice('Polka restarted due to: ', file ? file : 'command rs');
});
