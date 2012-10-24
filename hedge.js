var parser = require('basic-auth-parser')


module.exports = function (opts) {
  var realm = opts.realm || 'luxembourg'
  var validate = opts.validate || function () {}

  var needAuth = function (res) {
    res.writeHead(401, {'WWW-Authenticate': 'Basic realm="'+opts.realm+'"'})
    res.end()
  }

  return function hedge (req, res, next) {
    var parsed
    if (req.headers.authorization) {
      parsed = parser(req.headers.authorization)
      if (parsed.scheme == 'Basic') {
        return validate(parsed.username, parsed.password, function (err) {
          if (err) return needAuth(res)
          next()
        })
      }
    }
    needAuth(res)
  }
}
