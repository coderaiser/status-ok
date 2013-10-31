(function(){
    'use strict';
    
    var http        = require('http'),
        express     = require('express'),
        mime        = require('mime'),
        fs          = require('fs'),
        
        PORT        = 4321,
        OK          = 200,
        MOVED       = [301, 302],
        dir         = './img/',
        app         = express(),
        SVG         = 'svg',
        DIR         = SVG + '/',
        EXT         = '.' + SVG,
        OK_IMG      = DIR + 'ok'    + EXT,
        ERROR_IMG   = DIR + 'error' + EXT,
        MOVED_IMG   = DIR + 'moved' + EXT,
        TYPE        = mime.lookup(OK_IMG);
    
    http.createServer(app).listen(PORT);
    
    console.log('server: ' + PORT);
   
    app.get('/*', function(request, response) {
        var host = 'http://' + request.params[0];
        
        if (host)
            http.get(host, function(res) {
                var status = res.statusCode;
                //response.send(res.statusCode);
                console.log(status);
                response.contentType(TYPE);
                
                if (status === OK)
                    send(response, OK_IMG);
                else if(status === MOVED[0] || status === MOVED[1])
                    send(response, MOVED_IMG);
                else
                    send(response, ERROR_IMG);
            }).on('ERROR_IMG', function(e) {
                //response.send(e);
                response.contentType(TYPE);
                send(response, ERROR_IMG);
            });
        else
            response.send('/:host');
    });
    
    function send(res, name, callback) {
        var read   = fs.createReadStream(name),
            ERROR_IMG   = function (ERROR_IMG) {
                res.send(ERROR_IMG);
            },
            success = function () {
                if (typeof callback === 'function')
                    callback(name);
            };
        
        res.on('ERROR_IMG', ERROR_IMG);
        read.on('ERROR_IMG', ERROR_IMG);
        read.on('open', function() {
            read.pipe(res);
            read.on('end', success);
        });
    }
})();