const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await rfs.createStream(() => {
            fsPromises.appendFile(path.join(__dirname, '..', 'logs',
                logFileName), logItem);
        },{
            interval: '1d', // rotate daily
        });
        //await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logger, logEvents };
const fs = require('fs')
const morgan = require('morgan');
const path = require('path');
const FileStreamRotator = require('file-stream-rotator')
// creating a rotable write stream (in the append mode)
const lDirectory = path.join(__dirname + '/log')
// ensuring the log directory exists
fs.existsSync(lDirectory) || fs.mkdirSync(lDirectory)

const rotatingLogStream = FileStreamRotator.getStream({
    filename:  lDirectory + '/access-%DATE%.log',
    frequency: "daily",
    date_format: "YYYY-MM-DD",
    size: "100M",
    max_logs: "10",
    audit_file: "/tmp/audit.json",
    extension: ".log",
    create_symlink: true,
    symlink_name: "tail-current.log",
    verbose: false
})

rotatingLogStream.on('rotate',function(oldFile,newFile){
    //do something with old file like compression or delete older than X days.
})

// morgan.token('id', function getId(req) {
//     return req.id
// })
// morgan.token('host', function(req, res) {
//     return req.hostname;
// });

export default function(app) {
    app.use(morgan('combined', {stream: rotatingLogStream, format: "default"}));
}
// Use new stream in express
