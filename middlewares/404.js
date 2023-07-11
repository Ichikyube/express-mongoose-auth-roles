module.exports = function pageNotFound(req, res, next) {
    var viewFilePath = '404';
    var statusCode = 404;
    var result = {
        status: statusCode
    };

    res.status(result.status);
    if (req.accepts('html')) {
        res.render(viewFilePath, {}, function(err, html) {
            if(err) {
                return res.sendFile(path.join(__dirname, 'views', '404.html'));
            }
            res.send(html);
        });
    } else if (req.accepts('json')) {
        //if in development, call next and forward 404 to error handler
        if (req.app.get('env') === 'development') next(createError(404))
        res.status(result.status).json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
};
