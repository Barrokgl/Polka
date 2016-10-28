var nodemon = require('nodemon');
var log = require('./libs/logs')(module);
var config = require('./config');
var forever = require('forever-monitor');

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
        var child = new (forever.Monitor)('./bin/www', {
            max: 5,
            silent: false,
            args: []
        });

        child.on('exit', function () {
            console.log('your-filename.js has exited after 3 restarts');
        });

        child.on('restart', function() {
            console.error('Forever restarting script for ' + child.times + ' time');
        });

        child.on('exit:code', function(code) {
            console.error('Forever detected script exited with code ' + code);
        });
        child.start();
    }
}

startApplication();
