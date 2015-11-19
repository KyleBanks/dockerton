/**
 * dockerfile.test.js
 *
 * Tests the `dockerfile` function.
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

var fs = require('fs');

/**
 * @private
 */
describe('.dockerfile()', function() {
    
    it('constructs an empty Dockerfile', function(done) {
        var d = test.newInstance();

        d.dockerfile()
            .then(function(contents) {
                expect(contents).to.be.a('string');
                expect(contents.length).to.equal(0);
                expect(d._dockerfile).to.be.a('string');
                expect(d._dockerfile.length).to.equal(0);
                expect(fs.readFileSync('Dockerfile', 'utf8').length).to.equal(0);

                done();
            })
            .catch(done);
    });

    it('constructs a Dockerfile with a single command', function(done) {
        var d = test.newInstance()
            .from("test");

        d.dockerfile()
            .then(function(contents) {
                var expected = "FROM test";

                expect(contents).to.equal(expected);
                expect(d._dockerfile).to.equal(expected);
                expect(fs.readFileSync('Dockerfile', 'utf8')).to.equal(expected);

                done();
            })
            .catch(done);
    });

    it('constructs a Dockerfile with multiple commands', function(done) {
        var d = test.newInstance()
            .from("test")
            .maintainer("kyle")
            .cmd('echo TEST');

        d.dockerfile()
            .then(function(contents) {
                var expected = 'FROM test\nMAINTAINER kyle\nCMD echo TEST';

                expect(contents).to.equal(expected);
                expect(d._dockerfile).to.equal(expected);
                expect(fs.readFileSync('Dockerfile', 'utf8')).to.equal(expected);

                done();
            })
            .catch(done);
    });

    it('allows a custom path', function(done) {
        var d = test.newInstance()
            .from("test");

        var path = './test/tmp/Dockerfile-path-test_' + new Date().getTime();
        d.dockerfile({
            path: path
        }).then(function(contents) {
            var expected = "FROM test";

            expect(contents).to.equal(expected);
            expect(d._dockerfile).to.equal(expected);
            expect(fs.readFileSync(path, 'utf8')).to.equal(expected);

            done();
        }).catch(done);
    });
});