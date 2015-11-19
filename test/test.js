/**
 * test.js
 *
 * Main testing entry-point.
 *
 * Created by kylewbanks on 15-11-17.
 */
'use strict';

/**
 * @imports
 */
var chai = require('chai'),
    fs = require('fs');

chai.should();
var expect = chai.expect;

/**
 * @private
 */
// Enable debugging of Dockerton
process.env.DEBUG_DOCKERTON = true;

// Logical ordering of test cases
var TEST_ORDER = [
    './Dockerton/commands.test',
    './Dockerton/dockerfile.test',
    './Dockerton/buildImage.test',
    './Dockerton/runImage.test'
];

/**
 * Will be populated by the first test case.
 *
 * @type {Dockerton}
 */
var Dockerton = null;

describe('Dockerton', function() {

    /**
     * require
     */
    it('require: loads correctly', function(done) {
        Dockerton = require('../index');

        expect(Dockerton).to.be.a('function');

        done();
    });

    /**
     * constructor
     */
    it('constructor: initializes properly', function(done) {
        var d = new Dockerton('test');

        expect(d).to.be.a('object');
        d.tag.should.equal('test');
        d._commands.should.be.a('array');
        d._commands.length.should.equal(0);
        expect(d._dockerfile).to.equal(null);

        done();
    });

});

/**
 * @public
 */
module.exports = {

    /**
     * Convenience function to return a new Dockerton instance.
     *
     * @params [tag] {String}
     * @returns {Dockerton}
     */
    newInstance: function(tag) {
        return new Dockerton(tag || 'dockerton-test-' + new Date().getTime());
    }

};

/**
 * @private
 */

// `require` test cases in the order specified above
TEST_ORDER.forEach(function(test) {
    require(test);
});
