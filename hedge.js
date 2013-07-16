var parser = require('basic-auth-parser')

var pairs = getPairs(process.env.PAIRS || 'user:pass user2:pass2 user3:pass3')

module.exports = function hedge (opts) {
  var opts = opts || {};
  var realm = opts.realm || 'Luxembourg'
  var validate = opts.validate || envValidate

  var needAuth = function (res) {
    res.writeHead(401, {'WWW-Authenticate': 'Basic realm="'+realm+'"'})
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

function getPairs (pairStr) {
  var p = {}
  pairStr.split(/\s+/).forEach(function (pair) {
    var userPass = pair.split(':')
    p[userPass[0]] = userPass[1]
  })
  return p
}

function envValidate (username, password, cb) {
  if (pairs[username] === password) return cb()
  cb(new Error('No match'))
}
