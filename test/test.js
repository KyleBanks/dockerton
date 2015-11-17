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

/**
 * Will be populated by the first test case.
 *
 * @type {Dockerton}
 */
var Dockerton = null;

/**
 * Convenience function to return a new Dockerton instance.
 *
 * @returns {Dockerton}
 */
function _new() {
    return new Dockerton();
}

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
        var d = new Dockerton();

        expect(d).to.be.a('object');
        d._commands.should.be.a('array');
        d._commands.length.should.equal(0);

        done();
    });

    /**
     * from
     */
    it('FROM: works without a tag', function(done) {
        var d = _new();
        d.from('sample');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('FROM sample');

        done();
    });

    it ('FROM: works with a null tag', function(done) {
        var d = _new();
        d.from('sample', null);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('FROM sample');

        done();
    });

    it('FROM: works with an empty tag', function(done) {
        var d = _new();
        d.from('sample', '');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('FROM sample');

        done();
    });

    it('FROM: works with a valid tag', function(done) {
        var d = _new();
        d.from('sample', '1.2.3');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('FROM sample:1.2.3');

        done();
    });

    it('FROM: can be chained', function(done) {
        var d = _new()
            .from('sample1', '1.2.3')
            .from('sample2', '3.2.1');

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('FROM sample1:1.2.3');
        d._commands[1].should.equal('FROM sample2:3.2.1');

        done();
    });

    /**
     * maintainer
     */
    it('MAINTAINER: adds a valid maintainer', function(done) {
        var d = _new();
        d.maintainer('Kyle');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('MAINTAINER Kyle');

        done();
    });

    it('MAINTAINER: can be chained', function(done) {
        var d = _new()
            .maintainer('author1')
            .maintainer('author2');

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('MAINTAINER author1');
        d._commands[1].should.equal('MAINTAINER author2');

        done();
    });

    /**
     * run
     */
    it('RUN: adds a simple command', function(done) {
        var d = _new();
        d.run('cd test');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('RUN cd test');

        done();
    });

    it('RUN: adds a single command in an array', function(done) {
        var d = _new();
        d.run(['cd test']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('RUN ["cd test"]');

        done();
    });

    it('RUN: adds multiple commands in an array', function(done) {
        var d = _new();
        d.run(['cd test', 'echo hey']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('RUN ["cd test", "echo hey"]');

        done();
    });

    it('RUN: escapes quotes in a command', function(done) {
        var d = _new();
        d.run(['cd test', 'echo "hey"']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('RUN ["cd test", "echo \\"hey\\""]');

        done();
    });

    it('RUN: can be chained', function(done) {
        var d = _new()
            .run('cd test')
            .run(['echo "hey"', 'echo "howdy"']);

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('RUN cd test');
        d._commands[1].should.equal('RUN ["echo \\"hey\\"", "echo \\"howdy\\""]');

        done();
    });

    /**
     * cmd
     */
    it('CMD: adds a simple command', function(done) {
        var d = _new();
        d.cmd('npm start');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('CMD npm start');

        done();
    });

    it('CMD: adds a single command in an array', function(done) {
        var d = _new();
        d.cmd(['npm start']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('CMD ["npm start"]');

        done();
    });

    it('CMD: adds multiple commands in an array', function(done) {
        var d = _new();
        d.cmd(['cd test', 'npm start']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('CMD ["cd test", "npm start"]');

        done();
    });

    it('CMD: escapes quotes in a command', function(done) {
        var d = _new();
        d.cmd(['cd test', 'echo "hey"']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('CMD ["cd test", "echo \\"hey\\""]');

        done();
    });

    it('CMD: can be chained', function(done) {
        var d = _new()
            .cmd('cd test')
            .cmd(['echo "hey"', 'echo "howdy"']);

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('CMD cd test');
        d._commands[1].should.equal('CMD ["echo \\"hey\\"", "echo \\"howdy\\""]');

        done();
    });

    /**
     * label
     */
    it('LABEL: adds a simple label', function(done) {
        var d = _new()
            .label('key', 'value');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal("LABEL \"key\"=\"value\"");

        done();
    });

    it('LABEL: adds a single label in a map', function(done) {
        var d = _new()
            .label({
                key: "value"
            });

        d._commands.length.should.equal(1);
        d._commands[0].should.equal("LABEL \"key\"=\"value\"");

        done();
    });

    it('LABEL: adds multiple labels', function(done) {
        var d = _new()
            .label({
                key: 'value',
                key2: 'value2'
            });

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('LABEL "key"="value" \\\n\t"key2"="value2"');

        done();
    });

    it('LABEL: escapes quotes in a label', function(done) {
        var d = _new()
            .label({
                'keyWith"': 'valueWith"'
            });

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('LABEL "keyWith\\""="valueWith\\""');

        done();
    });

    it('LABEL: can be chained', function(done) {
        var d = _new()
            .label({
                l1: "v1"
            })
            .label({
                l2: "v2"
            });

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('LABEL "l1"="v1"');
        d._commands[1].should.equal('LABEL "l2"="v2"');

        done();
    });

    /**
     * expose
     */
    it('EXPOSE: adds a single port', function(done) {
        var d = _new();
        d.expose(80);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('EXPOSE 80');

        done();
    });

    it('EXPOSE: adds an array of ports of length 1', function(done) {
        var d = _new();
        d.expose([80]);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('EXPOSE 80');

        done();
    });

    it('EXPOSE: adds an array of ports of length > 1', function(done) {
        var d = _new();
        d.expose([80, 81, 82]);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('EXPOSE 80 81 82');

        done();
    });

    it('EXPOSE: can be chained', function(done) {
        var d = _new()
            .expose(80)
            .expose(81);

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('EXPOSE 80');
        d._commands[1].should.equal('EXPOSE 81');

        done();
    });
});