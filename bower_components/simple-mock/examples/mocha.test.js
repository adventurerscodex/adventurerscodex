'use strict'
/*global describe beforeEach afterEach it*/
var assert = require('assert')
var simple = require('../index')
var AClass = require('./support/moduleA').AClass

describe('moduleA', function () {
  afterEach(function () {
    simple.restore()
  })

  describe('an instance of AClass', function () {
    var myAClass
    var config

    beforeEach(function () {
      config = {
        someValue: Infinity
      }

      myAClass = new AClass(config)
    })

    describe('callingYou()', function () {

      beforeEach(function () {
        simple.mock(myAClass, 'callingMeSync')
        simple.mock(myAClass, 'callingMeAsync')
      })

      it('can return if callingMeSync', function (done) {
        myAClass.callingMeSync.returnWith(true)

        myAClass.callingYou(1000, function (err, value) {
          if (err) return done(err)

          assert.equal(value, 1000)
          done()
        })
      })

      it('will return errors from callingMeAsync', function (done) {
        var mockError = new Error()

        myAClass.callingMeSync.returnWith(false)
        myAClass.callingMeAsync.callbackWith(mockError)

        myAClass.callingYou(1000, function (err, value) {
          assert.equal(myAClass.callingMeSync.callCount, 1)

          assert.equal(myAClass.callingMeAsync.callCount, 1)
          assert.equal(myAClass.callingMeAsync.lastCall.arg, 2000)
          assert.equal(err, mockError)

          done()
        })
      })

      it('will return if callingMeAsync', function (done) {

        myAClass.callingMeSync.returnWith(false)
        myAClass.callingMeAsync.callbackWith(null, true)

        myAClass.callingYou(1000, function (err, value) {
          if (err) return done(err)

          assert.equal(myAClass.callingMeSync.callCount, 1)

          assert.equal(myAClass.callingMeAsync.callCount, 1)
          assert.equal(myAClass.callingMeAsync.lastCall.arg, 2000)
          assert.equal(value, 2000)

          done()
        })
      })

      it('will return random number if neither callingMeSync or callingMeAsync', function (done) {

        myAClass.callingMeSync.returnWith(false)
        myAClass.callingMeAsync.callbackWith(null, false)

        simple.mock(Math, 'random').returnWith(0.5)

        myAClass.callingYou(1000, function (err, value) {
          if (err) return done(err)

          assert.equal(myAClass.callingMeSync.callCount, 1)

          assert.equal(myAClass.callingMeAsync.callCount, 1)
          assert.equal(myAClass.callingMeAsync.lastCall.arg, 2000)
          assert.equal(value, 0.5)

          done()
        })
      })
    })

    describe('callingMeSync()', function () {

      it('can return false', function () {
        simple.mock(config, 'someValue', 500)

        var returned = myAClass.callingMeSync(501)

        assert.equal(returned, false)
      })

      it('can return true', function () {
        simple.mock(config, 'someValue', 501)

        var returned = myAClass.callingMeSync(500)

        assert.equal(returned, true)
      })
    })

    describe('callingMeASync()', function () {

      it('can return false', function () {
        simple.mock(config, 'someValue', 500)

        var cb = simple.mock()

        myAClass.callingMeAsync(501, cb)

        setImmediate(function () {
          assert.equal(cb.callCount, 1)
          assert.equal(cb.lastCall.args[0], null)
          assert.equal(cb.lastCall.args[1], false)
        })
      })

      it('can return true', function () {
        simple.mock(config, 'someValue', 501)

        var cb = simple.mock()

        myAClass.callingMeAsync(500, cb)

        setImmediate(function () {
          assert.equal(cb.callCount, 1)
          assert.equal(cb.lastCall.args[0], null)
          assert.equal(cb.lastCall.args[1], true)
        })
      })
    })
  })
})
