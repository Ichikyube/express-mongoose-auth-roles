var respTime = require('response-time')
var StatsD = require('node-statsd')
var statistics = new StatsD()
app.use(respTime())
app.use(respTime(function (req, res, time) {
  var stat = (req.method + req.url).toLowerCase()
    .replace(/\//g, '_')
  statistics.timing(stat, time)
}))

statistics.socket.on('error', function (err) {
  console.error(err.stack)
})