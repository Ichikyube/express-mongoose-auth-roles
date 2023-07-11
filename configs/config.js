var consolidate = require('consolidate');

app.configure('development', function () {
    app.set('title', ' Basic Monolith ');
    app.set('default language', 'en');
    // view engine setup
    app.engine('html', consolidate.pug);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'html');
    app.set('dbUri', 'mongodb://localhost:27017/db');
    app.disable('etag');
    app.disable('x-powered-by');
});
app.configure('stage', 'production', function () {
    app.set('dbUri', process.env.MONGOHQ_URL);
});


const yaml = require('js-yaml');
const fs = require('fs');

let config = {};
try {
    config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    console.log(config);
} catch (e) {
    console.log(e);
}
