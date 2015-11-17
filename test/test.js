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
var chai = require('chai');
chai.should();
var expect = chai.expect;

/**
 * @private
 */
describe('dockerton', function() {

    var dockerton = null;

    it('imports correctly', function(done) {
        dockerton = require('../index');
        expect(dockerton).to.be.a('function');

        done();
    });

});