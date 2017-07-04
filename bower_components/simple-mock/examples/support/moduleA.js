/**
 * This module is used in examples
 */
var AClass = exports.AClass = function AClass (config) {
  if (!(this instanceof AClass)) return new AClass(config)

  this.config = config
}

var prototype = AClass.prototype

prototype.callingMeAsync = function (q, cb) {
  setImmediate(cb.bind(null, null, this.config.someValue > q))
}

prototype.callingMeSync = function (q) {
  return this.config.someValue > q
}

prototype.callingYou = function (q, cb) {
  if (this.callingMeSync(q)) return cb(null, q)

  var altQ = q + 1000

  this.callingMeAsync(altQ, function (err, value) {
    if (err) return cb(err)
    if (value) return cb(null, altQ)

    cb(null, Math.random())
  })
}

