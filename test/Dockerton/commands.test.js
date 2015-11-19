/**
 * commands.test.js
 *
 * Tests the handling of the Dockerfile commands such as `FROM` or `EXPOSE`.
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

/**
 * @private
 */
describe('Commands', function() {
    /**
     * from
     */
    it('FROM: works without a tag', function(done) {
        var d = test.newInstance();
        d.from('sample');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('FROM sample');

        done();
    });

    it ('FROM: works with a null tag', function(done) {
        var d = test.newInstance();
        d.from('sample', null);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('FROM sample');

        done();
    });

    it('FROM: works with an empty tag', function(done) {
        var d = test.newInstance();
        d.from('sample', '');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('FROM sample');

        done();
    });

    it('FROM: works with a valid tag', function(done) {
        var d = test.newInstance();
        d.from('sample', '1.2.3');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('FROM sample:1.2.3');

        done();
    });

    it('FROM: can be chained', function(done) {
        var d = test.newInstance()
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
        var d = test.newInstance();
        d.maintainer('Kyle');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('MAINTAINER Kyle');

        done();
    });

    it('MAINTAINER: can be chained', function(done) {
        var d = test.newInstance()
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
        var d = test.newInstance();
        d.run('cd test');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('RUN cd test');

        done();
    });

    it('RUN: adds a single command in an array', function(done) {
        var d = test.newInstance();
        d.run(['cd test']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('RUN ["cd test"]');

        done();
    });

    it('RUN: adds multiple commands in an array', function(done) {
        var d = test.newInstance();
        d.run(['cd test', 'echo hey']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('RUN ["cd test", "echo hey"]');

        done();
    });

    it('RUN: escapes quotes in a command', function(done) {
        var d = test.newInstance();
        d.run(['cd test', 'echo "hey"']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('RUN ["cd test", "echo \\"hey\\""]');

        done();
    });

    it('RUN: can be chained', function(done) {
        var d = test.newInstance()
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
        var d = test.newInstance();
        d.cmd('npm start');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('CMD npm start');

        done();
    });

    it('CMD: adds a single command in an array', function(done) {
        var d = test.newInstance();
        d.cmd(['npm start']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('CMD ["npm start"]');

        done();
    });

    it('CMD: adds multiple commands in an array', function(done) {
        var d = test.newInstance();
        d.cmd(['cd test', 'npm start']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('CMD ["cd test", "npm start"]');

        done();
    });

    it('CMD: escapes quotes in a command', function(done) {
        var d = test.newInstance();
        d.cmd(['cd test', 'echo "hey"']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('CMD ["cd test", "echo \\"hey\\""]');

        done();
    });

    it('CMD: can be chained', function(done) {
        var d = test.newInstance()
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
        var d = test.newInstance()
            .label('key', 'value');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal("LABEL \"key\"=\"value\"");

        done();
    });

    it('LABEL: adds a single label in a map', function(done) {
        var d = test.newInstance()
            .label({
                key: "value"
            });

        d._commands.length.should.equal(1);
        d._commands[0].should.equal("LABEL \"key\"=\"value\"");

        done();
    });

    it('LABEL: adds multiple labels', function(done) {
        var d = test.newInstance()
            .label({
                key: 'value',
                key2: 'value2'
            });

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('LABEL "key"="value" \\\n\t"key2"="value2"');

        done();
    });

    it('LABEL: escapes quotes in a label', function(done) {
        var d = test.newInstance()
            .label({
                'keyWith"': 'valueWith"'
            });

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('LABEL "keyWith\\""="valueWith\\""');

        done();
    });

    it('LABEL: can be chained', function(done) {
        var d = test.newInstance()
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
        var d = test.newInstance();
        d.expose(80);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('EXPOSE 80');

        done();
    });

    it('EXPOSE: adds an array of ports of length 1', function(done) {
        var d = test.newInstance();
        d.expose([80]);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('EXPOSE 80');

        done();
    });

    it('EXPOSE: adds an array of ports of length > 1', function(done) {
        var d = test.newInstance();
        d.expose([80, 81, 82]);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('EXPOSE 80 81 82');

        done();
    });

    it('EXPOSE: can be chained', function(done) {
        var d = test.newInstance()
            .expose(80)
            .expose(81);

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('EXPOSE 80');
        d._commands[1].should.equal('EXPOSE 81');

        done();
    });

    /**
     * env
     */
    it('ENV: adds a simple ENV variable', function(done) {
        var d = test.newInstance()
            .env('key', 'value');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal("ENV key value");

        done();
    });

    it('ENV: adds a single ENV variable in a map', function(done) {
        var d = test.newInstance()
            .env({
                key: "value"
            });

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('ENV key="value"');

        done();
    });

    it('ENV: adds multiple ENV variables', function(done) {
        var d = test.newInstance()
            .env({
                key: 'value',
                key2: 'value2'
            });

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('ENV key="value" \\\n\tkey2="value2"');

        done();
    });

    it('ENV: escapes quotes in an ENV variable', function(done) {
        var d = test.newInstance()
            .env({
                key: 'valueWith"' // Note: keys with quotes in them are not supported
            });

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('ENV key="valueWith\\""');

        done();
    });

    it('ENV: can be chained', function(done) {
        var d = test.newInstance()
            .env({
                l1: "v1"
            })
            .env({
                l2: "v2"
            });

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('ENV l1="v1"');
        d._commands[1].should.equal('ENV l2="v2"');

        done();
    });

    /**
     * add
     */
    it('ADD: adds a single file', function(done) {
        var d = test.newInstance()
            .add('src', 'dest');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal("ADD src dest");

        done();
    });

    it('ADD: adds a single file in an array', function(done) {
        var d = test.newInstance()
            .add(['src'], 'dest');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('ADD ["src", "dest"]');

        done();
    });

    it('ADD: adds multiple files in an array', function(done) {
        var d = test.newInstance()
            .add(['src1', 'src2'], 'dest');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('ADD ["src1", "src2", "dest"]');

        done();
    });

    it('ADD: can be chained', function(done) {
        var d = test.newInstance()
            .add(['src1', 'src2'], 'dest1')
            .add(['src3', 'src4'], 'dest2');

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('ADD ["src1", "src2", "dest1"]');
        d._commands[1].should.equal('ADD ["src3", "src4", "dest2"]');

        done();
    });

    /**
     * copy
     */
    it('COPY: copies a single file', function(done) {
        var d = test.newInstance()
            .copy('src', 'dest');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal("COPY src dest");

        done();
    });

    it('COPY: adds a single file in an array', function(done) {
        var d = test.newInstance()
            .copy(['src'], 'dest');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('COPY ["src", "dest"]');

        done();
    });

    it('COPY: adds multiple files in an array', function(done) {
        var d = test.newInstance()
            .copy(['src1', 'src2'], 'dest');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('COPY ["src1", "src2", "dest"]');

        done();
    });

    it('COPY: can be chained', function(done) {
        var d = test.newInstance()
            .copy(['src1', 'src2'], 'dest1')
            .copy(['src3', 'src4'], 'dest2');

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('COPY ["src1", "src2", "dest1"]');
        d._commands[1].should.equal('COPY ["src3", "src4", "dest2"]');

        done();
    });

    /**
     * entrypoint
     */
    it('ENTRYPOINT: adds a simple entrypoint', function(done) {
        var d = test.newInstance();
        d.entrypoint('top -b');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('ENTRYPOINT top -b');

        done();
    });

    it('ENTRYPOINT: adds a single entrypoint in an array', function(done) {
        var d = test.newInstance();
        d.entrypoint(['top']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('ENTRYPOINT ["top"]');

        done();
    });

    it('ENTRYPOINT: adds multiple entrypoints in an array', function(done) {
        var d = test.newInstance();
        d.entrypoint(['top', '-b']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('ENTRYPOINT ["top", "-b"]');

        done();
    });

    it('ENTRYPOINT: escapes quotes in an entrypoint', function(done) {
        var d = test.newInstance();
        d.entrypoint(['top', 'withQuote"']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('ENTRYPOINT ["top", "withQuote\\""]');

        done();
    });

    it('ENTRYPOINT: can be chained', function(done) {
        var d = test.newInstance()
            .entrypoint('top -b')
            .entrypoint(['top', '-b']);

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('ENTRYPOINT top -b');
        d._commands[1].should.equal('ENTRYPOINT ["top", "-b"]');

        done();
    });

    /**
     * volume
     */
    it('VOLUME: adds a simple volume', function(done) {
        var d = test.newInstance();
        d.volume('/vol1');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('VOLUME /vol1');

        done();
    });

    it('VOLUME: adds a single volume in an array', function(done) {
        var d = test.newInstance();
        d.volume(['/vol1']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('VOLUME ["/vol1"]');

        done();
    });

    it('VOLUME: adds multiple volumes in an array', function(done) {
        var d = test.newInstance();
        d.volume(['/vol1', '/vol2']);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('VOLUME ["/vol1", "/vol2"]');

        done();
    });

    it('VOLUME: can be chained', function(done) {
        var d = test.newInstance()
            .volume('/vol1')
            .volume(['/vol2', '/vol3']);

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('VOLUME /vol1');
        d._commands[1].should.equal('VOLUME ["/vol2", "/vol3"]');

        done();
    });

    /**
     * user
     */
    it('USER: adds a valid user', function(done) {
        var d = test.newInstance();
        d.user('kyle');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('USER kyle');

        done();
    });

    it('USER: can be chained', function(done) {
        var d = test.newInstance()
            .user('user1')
            .user('user2');

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('USER user1');
        d._commands[1].should.equal('USER user2');

        done();
    });

    /**
     * workdir
     */
    it('WORKDIR: adds a valid working directory', function(done) {
        var d = test.newInstance();
        d.workdir('dir');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('WORKDIR dir');

        done();
    });

    it('WORKDIR: can be chained', function(done) {
        var d = test.newInstance()
            .workdir('dir1')
            .workdir('/dir2/');

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('WORKDIR dir1');
        d._commands[1].should.equal('WORKDIR /dir2/');

        done();
    });

    /**
     * arg
     */
    it('ARG: adds a simple ARG variable', function(done) {
        var d = test.newInstance()
            .arg('myArg');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal("ARG myArg");

        done();
    });

    it('ARG: adds an ARG variable with a default value', function(done) {
        var d = test.newInstance()
            .arg('myArg', 'myVal');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal('ARG myArg=myVal');

        done();
    });

    it('ARG: can be chained', function(done) {
        var d = test.newInstance()
            .arg('arg1')
            .arg('arg2', 'val2');

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('ARG arg1');
        d._commands[1].should.equal('ARG arg2=val2');

        done();
    });

    /**
     * onbuild
     */
    it('ONBUILD: adds a simple ONBUILD command', function(done) {
        var d = test.newInstance()
            .onbuild('ADD /src /dest');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal("ONBUILD ADD /src /dest");

        done();
    });

    it('ONBUILD: can be chained', function(done) {
        var d = test.newInstance()
            .onbuild('cmd1')
            .onbuild('cmd2');

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('ONBUILD cmd1');
        d._commands[1].should.equal('ONBUILD cmd2');

        done();
    });

    /**
     * stopsignal
     */
    it('STOPSIGNAL: adds a simple signal (String)', function(done) {
        var d = test.newInstance()
            .stopsignal('sig1');

        d._commands.length.should.equal(1);
        d._commands[0].should.equal("STOPSIGNAL sig1");

        done();
    });

    it('STOPSIGNAL: adds a simple signal (Number)', function(done) {
        var d = test.newInstance()
            .stopsignal(1);

        d._commands.length.should.equal(1);
        d._commands[0].should.equal("STOPSIGNAL 1");

        done();
    });

    it('STOPSIGNAL: can be chained', function(done) {
        var d = test.newInstance()
            .stopsignal(1)
            .stopsignal('sig2');

        d._commands.length.should.equal(2);
        d._commands[0].should.equal('STOPSIGNAL 1');
        d._commands[1].should.equal('STOPSIGNAL sig2');

        done();
    });
});