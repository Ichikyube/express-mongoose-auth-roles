app.use(compression({ filter: compress }))

function compress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    // responses having this header request should not be compressed.
    return false
  }
  // fallback to standard filter function
  return compression.filter(req, res)
}