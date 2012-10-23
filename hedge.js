var crypto = require('crypto')


module.exports = function (opts) {
  // TODO handle encrypted passwords
  //var encrypt = function (str) {return str}
  //if (opts.encryption) {
  //  encrypt = crypto.createHash(opts.encryption)
  //}
  return function hedge (req, res, next) {
    var base64str, pair
    if (req.headers.authorization &&
        req.headers.authorization.substr(0, 5) == 'Basic') {
      base64str = req.headers.authorization.split(' ')[1]
      pair = Buffer(base64str, 'base64').toString().split(':')
      if (opts.pairs[pair[0]] === pair[1]) return next()
    }
    res.writeHead(401, {'WWW-Authenticate': 'Basic realm="'+opts.realm+'"'})
    res.end()
  }
}
