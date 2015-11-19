/**
 * buildImage.test.js
 *
 * Tests the `buildImage` function.
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
describe('.buildImage()', function() {
    
    it('builds a basic image', function(done) {
        this.timeout(60000);

        var d = test.newInstance()
            .from('docker/whalesay');

        d.dockerfile()
            .then(function() {
                return d.buildImage();
            })
            .then(function(details) {
                expect(details).to.be.a('object');
                expect(details.Id).to.be.a('string');
                expect(details.Id.length).to.be.at.least(1);

                done();
            })
            .catch(done);
    });

    it('by default, directs output to `console.log`', function(done) {
        this.timeout(60000);

        var consoleLogCalled = false;
        var consoleLog = console.log;
        console.log = function(data) {
            expect(data).to.be.a('string');
            consoleLogCalled = true;
        };

        var d = test.newInstance()
            .from('docker/whalesay');

        d.dockerfile()
            .then(function() {
                return d.buildImage();
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
            .from('docker/whalesay');

        var stdoutCalled = false;
        d.dockerfile()
            .then(function() {
                return d.buildImage({
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
        console.error = function(data) {
            expect(data).to.be.a('string');
            consoleErrorCalled = true;
        };

        var d = test.newInstance()
            .from('not-a-real-image');

        d.dockerfile()
            .then(function() {
                return d.buildImage();
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
            .from('not-a-real-image');

        var stderrCalled = false;
        d.dockerfile()
            .then(function() {
                return d.buildImage({
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

    it('supports a custom `dir`', function(done) {
        this.timeout(60000);

        var dir = './test/tmp/',
            path = dir + 'Dockerfile',
            timestamp = new Date().getTime(),
            uniqueCmd = 'echo ' + timestamp,
            foundDockerfile = false;

        var d = test.newInstance()
            .from('scratch')
            .cmd(uniqueCmd);

        d.dockerfile({
            path: path
        }).then(function() {
            return d.buildImage({
                dir: dir,
                stdout: function(data) {
                    // Ensure it finds the unique command,
                    // this is an indication that the correct directory/Dockerfile was used
                    if (data.indexOf(uniqueCmd) >= 0) {
                        foundDockerfile = true;
                    }
                }
            });
        }).then(function() {
            foundDockerfile.should.equal(true);
            done();
        }).catch(done);
    });

    it('supports custom `args` values', function(done) {
        this.timeout(60000);

        var dir = './test/tmp/',
            filename = 'Dockerfile' + new Date().getTime(),
            path = dir + filename,
            uniqueCmd = 'echo ' + filename,
            foundDockerfile = false;

        var d = test.newInstance()
            .from('scratch')
            .cmd(uniqueCmd);

        d.dockerfile({
            path: path
        }).then(function(contents) {
            console.log(contents);

            return d.buildImage({
                dir: dir,
                args: {
                    '-f': path
                },
                stdout: function(data) {
                    console.log("BEGIN: " + data + ": " + data.indexOf(uniqueCmd) + ":" + uniqueCmd);

                    if (data.indexOf(uniqueCmd) >= 0) {
                        foundDockerfile = true;
                    }
                }
            });
        }).then(function() {
            foundDockerfile.should.equal(true);
            done();
        }).catch(done);
    });

    it('uses the `tag` provided to the constructor', function(done) {
        this.timeout(60000);

        var tag = 'test-tag' + new Date().getTime();

        var d = test.newInstance(tag)
            .from('scratch')
            .cmd('echo "hello world"');

        d.dockerfile()
            .then(function() {
                return d.buildImage();
            })
            .then(function() {
                // Search for the docker image with the specified tag
                var found = false;

                var child = child_process.exec('docker images | grep ' + tag);
                child.stdout.on('data', function(data) {
                    if (data.indexOf(tag) >= 0) {
                        found = true;
                    }
                });
                child.on('close', function() {
                    found.should.equal(true);
                    done();
                });
            }).catch(done);
    });

    it('uses an existing dockerfile if the tag matches', function(done) {
        var tag = 'old-dockerfile-test-' + new Date().getTime(),
            uniqueCommand = 'echo ' + tag;

        var d1 = test.newInstance(tag)
            .from('scratch')
            .cmd(uniqueCommand);

        d1.dockerfile()
            .then(function() {
                var foundDockerfile = false;

                // Use the same tag, but don't generate a new dockerfile
                var d = test.newInstance(tag);

                d.buildImage({
                    stdout: function(data) {
                        if (data.indexOf(uniqueCommand) >= 0) {
                            foundDockerfile = true;
                        }
                    }
                }).then(function() {
                    expect(foundDockerfile).to.equal(true);
                    done();
                }).catch(done);
            })
            .catch(done);
    });

});