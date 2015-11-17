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
describe('Dockerton', function() {

    var Dockerton = null;

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
        var dockerton = new Dockerton();

        expect(dockerton).to.be.a('object');
        dockerton._commands.should.be.a('array');
        dockerton._commands.length.should.equal(0);

        done();
    });

    /**
     * from
     */
    it('from: works without a tag', function(done) {
        var dockerton = new Dockerton();
        dockerton.from('sample');

        dockerton._commands.length.should.equal(1);
        dockerton._commands[0].should.equal('FROM sample');

        done();
    });

    it ('from: works with a null tag', function(done) {
        var dockerton = new Dockerton();
        dockerton.from('sample', null);

        dockerton._commands.length.should.equal(1);
        dockerton._commands[0].should.equal('FROM sample');

        done();
    });

    it('from: works with an empty tag', function(done) {
        var dockerton = new Dockerton();
        dockerton.from('sample', '');

        dockerton._commands.length.should.equal(1);
        dockerton._commands[0].should.equal('FROM sample');

        done();
    });

    it('from: works with a valid tag', function(done) {
        var dockerton = new Dockerton();
        dockerton.from('sample', '1.2.3');

        dockerton._commands.length.should.equal(1);
        dockerton._commands[0].should.equal('FROM sample:1.2.3');

        done();
    });

    it('from: can be chained', function(done) {
        var dockerton = new Dockerton()
            .from('sample1', '1.2.3')
            .from('sample2', '3.2.1');

        dockerton._commands.length.should.equal(2);
        dockerton._commands[0].should.equal('FROM sample1:1.2.3');
        dockerton._commands[1].should.equal('FROM sample2:3.2.1');

        done();
    });

    /**
     * maintainer
     */
    it('maintainer: adds a valid maintainer', function(done) {
        var dockerton = new Dockerton();
        dockerton.maintainer('Kyle');

        dockerton._commands.length.should.equal(1);
        dockerton._commands[0].should.equal('MAINTAINER Kyle');

        done();
    });

    it('maintainer: can be chained', function(done) {
        var dockerton = new Dockerton()
            .maintainer('author1')
            .maintainer('author2');

        dockerton._commands.length.should.equal(2);
        dockerton._commands[0].should.equal('MAINTAINER author1');
        dockerton._commands[1].should.equal('MAINTAINER author2');

        done();
    });

});