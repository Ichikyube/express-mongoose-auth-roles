express-session
cookie
cors
multer
busboy and connect-busboy
formidable
multiparty and connect-multiparty
The module provides the user with the following parsers:
URL-encoded form body parser
Raw body parser
JSON body parser
Text body parser
$ npm install express-namespace
Basics
•
 var express = require('express'): include the module
•
 var app = express(): create an instance
•
 app.listen(portNumber, callback): start the Express.js server
•
 http.createServer(app).listen(portNumber, callback): start the Express.js server
•
 app.set(key, value): set a property value by the key
•
 app.get(key): get a property value by the key
113https://gum.co/NQiQ
Appendix C: Express.js 4 Cheatsheet
HTTP Verbs and Routes
•
•
•
•
•
•
•
app.get()
app.post()
app.put()
app.del()
app.all()
app.param():
app.use()
292
Request
•
 request.params: parameters middlware
•
 request.param: extract one parameter
•
 request.query: extract query string parameter
•
 request.route: return route string
•
 request.cookies: cookies, requires cookieParser
•
 request.signedCookies: signed cookies, requires cookie-parser
•
 request.body: payload, requires body-parser
Request Header Shortcuts
•
 request.get(headerKey): value for the header key
•
 request.accepts(type): checks if the type is accepted
•
 request.acceptsLanguage(language): checks language
•
 request.acceptsCharset(charset): checks charset
•
 ‘request.is(type): checks the type
•
 request.ip: IP address
•
 request.ips: IP addresses (with trust-proxy on)
•
 request.path: URL path
•
 request.host: host without port number
•
 request.fresh: checks freshness
•
 request.stale: checks staleness
•
 request.xhr: true for AJAX-y requests
•
 request.protocol: returns HTTP protocol
•
 request.secure: checks if protocol is https
•
 request.subdomains: array of subdomains
•
 request.originalUrl: original URL
1
2
1
2
3
Appendix C: Express.js 4 Cheatsheet
 293
Response
•
 response.redirect(status, url): redirect request
•
 response.send(status, data): send response
•
 response.json(status, data): send JSON and force proper headers
•
 response.sendfile(path, options, callback): send a file
•
 ‘response.render(templateName, locals, callback): render a template
•
 response.locals: pass data to template
Handlers Signatures
• function(request, response, next) {}: request handler signature
• function(error, request, response, next) {}: error handler signature
Stylus and Jade
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(require('stylus').middleware(path.join(__dirname, 'public')))
Body
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
Static
app.use(express.static(path.join(__dirname, 'public')))
Connect Middleware
$ sudo npm install <package_name> --save
• body-parser114 request payload
114https://github.com/expressjs/body-parser
Appendix C: Express.js 4 Cheatsheet
•
 compression115 gzip
•
 connect-timeout116
•
 cookie-parser117 Cookies
•
 cookie-session118 Session via Cookies store
•
 csurf119 CSRF
•
 errorhandler120 error handler
•
 express-session121 session via in-memory or other store
•
 method-override122 HTTP method override
•
 morgan123 server logs
•
 response-time124
•
 serve-favicon125 favicon
•
 serve-index126
•
 serve-static127 static content
•
 vhost128
294
Other Popular Middleware
•
 cookies129 and keygrip130: analogous to cookieParser
•
 raw-body131
•
 connect-multiparty132, connect-busboy133
•
 qs134: analogous to query
•
 st135, connect-static136 analogous to staticCache
115https://github.com/expressjs/compression
116https://github.com/expressjs/timeout
117https://github.com/expressjs/cookie-parser
118https://github.com/expressjs/cookie-session
119https://github.com/expressjs/csurf
120https://github.com/expressjs/errorhandler
121https://github.com/expressjs/session
122https://github.com/expressjs/method-override
123https://github.com/expressjs/morgan
124https://github.com/expressjs/response-time
125https://github.com/expressjs/serve-favicon
126https://github.com/expressjs/serve-index
127https://github.com/expressjs/serve-static
128https://github.com/expressjs/vhost
129https://github.com/jed/cookies
130https://github.com/jed/keygrip
131https://github.com/stream-utils/raw-body
132https://github.com/superjoe30/connect-multiparty
133https://github.com/mscdex/connect-busboy
134https://github.com/visionmedia/node-querystring
135https://github.com/isaacs/st
136https://github.com/andrewrk/connect-static
Appendix C: Express.js 4 Cheatsheet
•
 express-validator137: validation
•
 less138: LESS CSS
•
 passport139: authentication library
•
 helmet140: security headers
•
 connect-cors141: CORS
•
 connect-redis142


The 100 range
There are only two official status codes in the 100 range: 100 (Continue) and 101
(Switching Protocols). You’ll likely never deal with these yourself. If you do, check the
specification or the list on Wikipedia.
Look at that! You are already one-fifth of the way through the status codes.
6.5.3
The 200 range
Steve Losh summarized the 200 range as “here you go.” The HTTP spec defines several
status codes in the 200 range, but four of them are by far the most common.
200: OK
200 is the most common HTTP status code on the web by a long shot. HTTP calls status
code 200 OK, and that’s pretty much what it means: everything about this request and
response went through just fine. Generally, if you’re sending the whole response just
fine and there aren’t any errors or redirects (which you’ll see in the 300s section),
then you’ll send a 200 code.
201: CREATED
Code 201 is very similar to 200, but it’s for a slightly different use case. It’s common for
a request to create a resource (usually with a POST or a PUT request). This might be
creating a blog post, sending a message, or uploading a photo. If the creation suc-
ceeds and everything’s fine, you’ll want to send a 201 code. This is a bit nuanced, but
it’s typically the correct status code for the situation.
202: ACCEPTED
Just as 201 is a variant of 200, 202 is a variant of 201.
I hope I’ve beaten it into your head by now: asynchronousity is a big part of Node
and Express. Sometimes you’ll asynchronously queue a resource for creation but it
won’t be created yet.
If you’re pretty sure that the request wants to create a valid resource (perhaps
you’ve checked that the data is valid) but you haven’t created it yet, you can send a 202
status code. It effectively tells the client, Hey, you’re all good, but I haven’t made the
resource yet.
Sometimes you’ll want to send 201 codes and other times you’ll want to send 202;
it depends on the situation.
204: NO CONTENT
204 is the delete version of 201. When you create a resource, you typically send a 201
or a 202 message. When you delete something, you often don’t have anything to
respond with other than Yeah, this was deleted. That’s when you typically send a 204
code. There are a few other times when you don’t need to send any kind of response
back, but deletion is the most common use case.
Licensed to <miler.888@gmail.com>
www.it-ebooks.info
102
6.5.4
6.5.5
CHAPTER 6
 Building APIs
The 300 range
There are several status codes in the 300 range, but you’ll really only set three of
them, and they all involve redirects.
301: MOVED PERMANENTLY
HTTP status code 301 means Don’t visit this URL anymore; see another URL. 301
responses are accompanied with an HTTP header called Location, so you know where
to go next.
You’ve probably been browsing the web and have been redirected—this probably
happened because of a 301 code. This usually occurs because the page has moved.
303: SEE OTHER
HTTP status code 303 is also a redirect, but it’s a bit different. Just like code 200 is for
regular requests and 201 is for requests where a resource is created, 301 is for regular
requests and 303 is for requests where a resource is created and you want to redirect
to a new page.
307: T EMPORARY REDIRECT
There’s one last redirect status code: 307. Like the 301 code, you’ve probably been
browsing the web and been redirected because of a 307 code. They’re similar, but they
have an important distinction. 301 signals Don’t visit this URL ever again; see another
URL; 307 signals See another URL just for now. This might be used for temporary main-
tenance on a URL.
The 400 range
The 400 range is the largest, and it generally means that something about the request
was bad. In other words, the client made a mistake and it’s not the server’s fault.
There are a lot of different errors here.
401 AND 403: UNAUTHORIZED AND FORBIDDEN ERRORS
There are two different errors for failed client authentication: 401 (Unauthorized)
and 403 (Forbidden). The words unauthorized and forbidden sound pretty similar—
what’s the difference?
In short, a 401 error occurs when the user isn’t logged in. A 403 error occurs when
the user is logged in as a valid user, but they don’t have permissions to do what they’re
trying to do.
Imagine a website where you couldn’t see any of it unless you logged in. This web-
site also has an administrator panel, but not all users can administer the site. Until you
logged in, you’ll see 401 errors. Once you logged in, you’ll stop seeing 401 errors. If
you tried to visit the administrator panel as a non-admin user, you’d see 403 errors.
Send these response codes when the user isn’t authorized to do whatever they’re
doing.
Licensed to <miler.888@gmail.com>
www.it-ebooks.info
Summary
 103
404: NOT FOUND
I don’t think I have to tell you much about 404—you’ve probably run into it when
browsing the web. One thing I found a little surprising about 404 errors is that you
can visit a valid route but still get a 404 error.
For example, let’s say you want to visit a user’s page. The homepage for User #123
is at /users/123. But if you mistype and visit /users/1234 and no user exists with ID
1234, you’ll get a 404 error.
OTHER ERRORS
There are a lot of other client errors you can run into—far too many to enumerate
here. Visit the list of status codes at https://en.wikipedia.org/wiki/List_of_HTTP_
status_codes to find the right status code for you.
When in doubt about which client error code to use, send a 400 Bad Request error.
It’s a generic response to any kind of bad request. Typically, it means that the request
has malformed input—a missing parameter, for example. Although there might be a
status code that better describes the client error, 400 will do the trick.
6.5.6
6.6
The 500 range
The final range in the HTTP specification is the 500 range, and although there are sev-
eral errors in this range, the most important one is 500: Internal Server Error. Unlike
400 errors, which are the client’s fault, 500 errors are the server’s fault. They can be for
any number of reasons, from an exception to a broken connection to a database error.
Ideally, you should never be able to cause a 500 error from the client—that would
mean that your client could cause bugs in your server.
If you catch an error and it really does seem to be your fault, then you can respond
with a 500 error. Unlike the rest of the status codes where you want to be as descriptive
as possible, it’s often better to be vague and say “Internal Server Error”; that way hack-
ers can’t know where the weaknesses in your system lie. We’ll talk much more about
this in chapter 10 when we talk about security.
