var multer = require('multer');
// var uploadfile = multer()
var uploadfile = multer({
    dest: 'uploads/'
})
// var uploadfile = multer().single('avatar')
// var uploadfile = multer({ storage: storage })
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/file-uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fdname + '-' + Date.now())
    }
})

function fileFilter(req, file, cb) {
    // The function will call the `cb` with a boolean
    // to indicate that the file should be accepted
    // if the file is to be rejected, pass `false`, like so:
    cb(null, false)
    // for the file to be accepted, pass `true`, like so:
    cb(null, true)
    // you can pass an error since something may go wrong at some point:
    cb(new Error('I have no clue!'))
}