/**
 * runImage.test.js
 *
 * Tests the `runImage` function.
 *
 * Created by kylewbanks on 15-11-19.
 */
'use strict';

/**
 * @imports
 */
var test = require('../test');

var chai = require('chai');
chai.should();
var expect = chai.expect;

var child_process = require('child_process');

/**
 * @private
 */
describe('.runImage()', function() {

    it('successfully runs a simple image', function(done) {
        var d = test.newInstance()
            .from('hello-world');

        d.dockerfile()
            .then(function() {
                return d.buildImage();
            })
            .then(function() {
                return d.runImage();
            })
            .then(done.bind(done, null))
            .catch(done);
    });

    it('by default, directs output to `console.log`', function(done) {
        this.timeout(60000);

        var consoleLogCalled = false;
        var consoleLog = console.log;

        var d = test.newInstance()
            .from('docker/whalesay');

        d.dockerfile()
            .then(function() {
                return d.buildImage();
            })
            .then(function() {
                console.log = function(data) {
                    expect(data).to.be.a('string');
                    consoleLogCalled = true;
                };

                return d.runImage();
            })
            .then(function() {
                console.log = consoleLog;

                expect(consoleLogCalled).to.equal(true);
                done();
            })
            .catch(done);
    });

    it('allows custom stdout listeners', function(done) {
        this.timeout(60000);

        var d = test.newInstance()
            .from('hello-world');

        var stdoutCalled = false;
        d.dockerfile()
            .then(function() {
                return d.buildImage();
            })
            .then(function() {
                return d.runImage({
                    stdout: function(data) {
                        expect(data).to.be.a('string');
                        stdoutCalled = true;
                    }
                });
            })
            .then(function() {
                expect(stdoutCalled).to.equal(true);

                done();
            })
            .catch(done);
    });

    it('by default, directs error output to `console.error`', function(done) {
        this.timeout(60000);

        var consoleErrorCalled = false;
        var consoleError = console.error;

        var d = test.newInstance()
            .from('scratch')
            .cmd('echo "scratch doesnt have echo"');

        d.dockerfile()
            .then(function() {
                return d.buildImage();
            })
            .then(function() {
                console.error = function(data) {
                    expect(data).to.be.a('string');
                    consoleErrorCalled = true;
                };

                return d.runImage();
            })
            .then(function() {
                done(new Error(".then() should not have been called!"));
            })
            .catch(function() {
                console.error = consoleError;
                expect(consoleErrorCalled).to.equal(true);

                done();
            });
    });

    it('allows custom stderr listeners', function(done) {
        this.timeout(60000);

        var d = test.newInstance()
            .from('scratch')
            .cmd('echo "scratch doesnt have echo"');

        var stderrCalled = false;
        d.dockerfile()
            .then(function() {
                return d.buildImage();
            })
            .then(function() {
                return d.runImage({
                    stderr: function(data) {
                        expect(data).to.be.a('string');
                        stderrCalled = true;
                    }
                });
            })
            .then(function() {
                done(new Error(".then() should not have been called!"));
            })
            .catch(function() {
                expect(stderrCalled).to.equal(true);

                done();
            });
    });
});