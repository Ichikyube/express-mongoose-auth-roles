// creating an api router
var api = createApiRouter()
// mounting the api before the csrf is appended to our app stack
application.use('/api', api)
// adding the csrf, after the “/api” has been mounted

application.post('/process', pForm, function (req, res) {
    res.send('csrf was required for getting here')
})

function createApiRouter() {
    var router = new express.Router()
    router.post('/getProfile', function (req, res) {
        res.send(' there is no csrf here to get')
    })
    return router
}

app.post('/profile', uploadfile.single('avatar'), function (req, res, next) {
    // req.file is our `avatar` file
    // req.body is for holding the text fields, if any are available
})

app.post('/profile', function (req, res) {
    uploadfile(req, res, function (error) {
        if (error) {
            // An error has occurred when uploading
            return
        }
        // Everything was okay
    })
})

app.post('/photos/upload', uploadfile.array('photos', 12), function (req, res,
    next) {
    // req.files is an array of `photos` for files
    // req.body will contain the text fields, if there were any
})
var cUpload = uploadfile.fields([{
    name: 'avatar',
    maxCount: 1
}, {
    name: 'gallery',
    maxCount: 8
}])

app.get('/form', csrfProtection, function (req, res) {
    // passing the csrfToken to our view
    res.render('send', {
        csrfToken: req.csrfToken()
    })
})

app.post('/process', pForm, csrfProtection, function (req, res) {
    res.send('The data is now being processed')
})

app.post('/cool-profile', cUpload, function (req, res, next) {
    // req.files is our object (String -> Array) where fieldname is our key, and the value is an array of the files
    //
    // example
    // req.files['avatar'][0] -> File
    // req.files['gallery'] -> Array
    //
    // req.body which contains the text fields, if any were available
})

app.post('/profile', uploadfile.array(), function (req, res, next) {
    // req.body has our text fields
})