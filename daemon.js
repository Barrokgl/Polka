var nodemon = require('nodemon');
var log = require('./libs/logs')(module);
var config = require('./config');
var fork = require('child_process').fork;


function startApplication() {
    if (process.env.NODE_ENV == 'development') {
        nodemon(config.get('nodemon'));

        nodemon.on('start', function () {
            log.info('Polka has started, on port: '+config.get('port'));
        }).on('quit', function () {
            log.notice('Polka has quited');
        }).on('restart', function (file) {
            log.notice('Polka restarted due to: ', file ? file : 'command rs');
        });
    } else {
        var demon = fork('./bin/www', {
            silent: false
        });
        log.info('Application has started, listening on port: '+config.get('port'));
        demon.on('error', function (err) {
            log.error('error incoming: '+err);
            startApplication();
        });
        demon.on('exit', function (code, signal) {
            log.warning('app exit with code: '+code+' signal: ' +signal);
            demon.kill();
        });
        demon.on('message', function (message) {
            log.info(message);
        });
    }
}

startApplication();
