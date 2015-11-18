/**
 * Dockerton.js
 *
 * Main Dockerton class, the primary use of the library's clients.
 *
 * Created by kylewbanks on 15-11-17.
 */
'use strict';

/**
 * @imports
 */
var util = require('util'),
    child_process = require('child_process'),
    fs = require('fs');

var Promise = require('bluebird');

var command_utils = require('./command-utils');

/**
 * Dockerton Constructor
 *
 * @constructor
 */
function Dockerton() {
    var self = this;

    /**
     * Contains each command, in sequence, to be used in the generated
     * Dockerfile.
     *
     * @type {Array}
     */
    self._commands = [];

    /**
     * Contains the generated Dockerfile contents.
     *
     * @type {String}
     */
    self._dockerfile = null;

    /**
     * Generates the Dockerfile contents from the commands that have been issued, and returns a promise.
     *
     * When successfully resolved, the contents of the Dockerfile will be returned as a String.
     *
     * @param [options] {Object}
     * @param [options.outputFile] {Object} Path to the desired output file. Defaults to './Dockerfile'
     *
     * @returns {bluebird}
     */
    self.dockerfile = function(options) {
        return new Promise(function(resolve, reject) {
            // Default options to an empty object
            options = options || {};

            // Generate the contents
            self._dockerfile = self._commands.join("\n");

            // Write the file
            fs.writeFile(options.outputFile || './Dockerfile', self._dockerfile, 'utf8', function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(self._dockerfile);
                }
            });
        });
    };

    /**
     * Builds the Docker image using the generated Dockerfile.
     *
     * @param [options] {Object}
     * @param [options.stdout] {function(String)} Executed each time stdout is generated from the subprocess. Defaults to `console.trace`.
     * @param [options.stderr] {function(String)} Executed each time stderr is generated from the subprocess. Defaults to `console.error`.
     *
     * @returns {bluebird}
     */
    self.buildImage = function(options) {
        return new Promise(function(resolve, reject) {
            // Ensure `.dockerfile` has run
            if (! self._dockerfile) {
                return self._promise.catch(new Error("Dockerfile not found. Did you forget to call .dockerfile()?"));
            }

            // Default options to an empty object
            options = options || {};

            var child = child_process.exec('docker build -t kbtest2 .');

            // Listen for child process output
            child.stdout.on('data', options.stdout || console.trace);
            child.stderr.on('data', options.stderr || console.error);

            child.on('close', function(code) {
                if (code !== 0) {
                    return reject(new Error("buildImage exited with bad code: " + code));
                }

                resolve();
            });
        });
    };

    /**
     * Adds a FROM to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#from
     *
     * @param image {String} The name of the base image to use.
     * @param [tag] {String} Optional version number.
     *
     * @return {Dockerton}
     */
    self.from = function(image, tag) {
        var command = image;
        if (tag && tag.length) {
            command = util.format("%s:%s", command, tag);
        }

        self._commands.push(
            command_utils.constructSimpleCommand("FROM", command)
        );

        return self;
    };

    /**
     * Adds a MAINTAINER to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#maintainer
     *
     * @param maintainer
     */
    self.maintainer = function(maintainer) {
        self._commands.push(
            command_utils.constructSimpleCommand("MAINTAINER", maintainer)
        );

        return self;
    };

    /**
     * Adds a RUN to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#run
     *
     * If the `commands` argument provided is a String, it will be used in `RUN <command>` format.
     * If the `commands` argument provided is an Array, it will be using in `RUN ["command1", "command2", ...]` format.
     *
     * @param commands {Array || String}
     *
     * @return {Dockerton}
     */
    self.run = function(commands) {
        self._commands.push(
            command_utils.constructStringOrArrayCommand("RUN", commands)
        );

        return self;
    };

    /**
     * Adds a CMD to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#cmd
     *
     * If the `commands` argument provided is a String, it will be used in `CMD <command>` format.
     * If the `commands` argument provided is an Array, it will be using in `CMD ["command1", "command2", ...]` format.
     *
     * @param commands {Array || String}
     *
     * @return {Dockerton}
     */
    self.cmd = function(commands) {
        self._commands.push(
            command_utils.constructStringOrArrayCommand("CMD", commands)
        );

        return self;
    };

    /**
     * Adds a LABEL to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#label
     *
     * If a key and value is passed, constructs a simple key-value pair label, otherwise if an object is passed,
     * constructs a LABEL command using the object key-value pairs as the label key-value pairs.
     *
     * For example, can be used in either form:
     *  .label(key, value)
     *  .label({
     *      key: value
     *  })
     *
     * @param key {String || Object}
     * @param [value] {String} Required only if `key` is a String
     *
     * @return {Dockerton}
     */
    self.label = function(key, value) {
        if (typeof key === 'string') {
            self._commands.push(util.format('LABEL "%s"="%s"', key, value));
        } else {
            var map = key,
                keyValuePairs = [];

            // Iterate the keys in the map, and add each as a key value pair
            Object.keys(map).forEach(function(key) {
                keyValuePairs.push(util.format('"%s"="%s"', command_utils.escapeString(key), command_utils.escapeString(map[key])));
            });

            self._commands.push(util.format('LABEL %s', keyValuePairs.join(' \\\n\t')));
        }

        return self;
    };

    /**
     * Adds an EXPOSE to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#expose
     *
     * If the `ports` argument provided is a Number, a single port will be exposed like so: `EXPOSE port`.
     * If the `ports` argument provided is an Array, multiple ports will be exposed like so: `EXPOSE port1 port2 ... portN`.
     *
     * @param ports {Array || Number}
     *
     * @return {Dockerton}
     */
    self.expose = function(ports) {
        if (ports instanceof Array) {
            self._commands.push(util.format('EXPOSE %s', ports.join(" ")));
        } else {
            self._commands.push(
                command_utils.constructSimpleCommand("EXPOSE", ports)
            );
        }

        return self;
    };

    /**
     * Adds an ENV to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#env
     *
     * If a key and value is passed, constructs a simple key-value pair ENV, otherwise if an object is passed,
     * constructs an ENV command using the object key-value pairs as the ENV key-value pairs.
     *
     * For example, can be used in either form:
     *  .env(key, value)
     *  .env({
     *      key: value
     *  })
     *
     * @param key {String || Object}
     * @param [value] {String} Required only if `key` is a String
     *
     * @return {Dockerton}
     */
    self.env = function(key, value) {
        if (typeof key === 'string') {
            self._commands.push(util.format('ENV %s %s', key, value));
        } else {
            var map = key,
                keyValuePairs = [];

            // Iterate the keys in the map, and add each as a key value pair
            Object.keys(map).forEach(function(key) {
                keyValuePairs.push(util.format('%s="%s"', key, command_utils.escapeString(map[key])));
            });

            self._commands.push(util.format('ENV %s', keyValuePairs.join(' \\\n\t')));
        }

        return self;
    };

    /**
     * Adds an ADD to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#add
     *
     * If the `sources` argument provided is a String, it will be used in `ADD src dest` format.
     * If the `sources` argument provided is an Array, it will be used in `ADD ["src1", "src2", ... "dest"]` format.
     *
     * @param sources {String || Array}
     * @param destination {String}
     *
     * @returns {Dockerton}
     */
    self.add = function(sources, destination) {
        if (sources instanceof Array) {
            self._commands.push(
                command_utils.constructStringOrArrayCommand("ADD", sources.concat(destination))
            );
        } else {
            self._commands.push(
                util.format("ADD %s %s", command_utils.escapeString(sources), command_utils.escapeString(destination))
            );
        }

        return self;
    };

    /**
     * Adds a COPY to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#copy
     *
     * If the `sources` argument provided is a String, it will be used in `COPY src dest` format.
     * If the `sources` argument provided is an Array, it will be used in `COPY ["src1", "src2", ... "dest"]` format.
     *
     * @param sources {String || Array}
     * @param destination {String}
     *
     * @returns {Dockerton}
     */
    self.copy = function(sources, destination) {
        if (sources instanceof Array) {
            self._commands.push(
                command_utils.constructStringOrArrayCommand("COPY", sources.concat(destination))
            );
        } else {
            self._commands.push(
                util.format("COPY %s %s", command_utils.escapeString(sources), command_utils.escapeString(destination))
            );
        }

        return self;
    };

    /**
     * Adds a ENTRYPOINT to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#entrypoint
     *
     * If the `commands` argument provided is a String, it will be used in `ENTRYPOINT <command>` format.
     * If the `commands` argument provided is an Array, it will be using in `ENTRYPOINT ["command1", "command2", ...]` format.
     *
     * @param commands {Array || String}
     *
     * @return {Dockerton}
     */
    self.entrypoint = function(commands) {
        self._commands.push(
            command_utils.constructStringOrArrayCommand("ENTRYPOINT", commands)
        );

        return self;
    };

    /**
     * Adds a VOLUME to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#volume
     *
     * If the `commands` argument provided is a String, it will be used in `VOLUME <vol>` format.
     * If the `commands` argument provided is an Array, it will be using in `VOLUME ["vol1", "vol2", ...]` format.
     *
     * @param volumes {Array || String}
     *
     * @return {Dockerton}
     */
    self.volume = function(volumes) {
        self._commands.push(
            command_utils.constructStringOrArrayCommand("VOLUME", volumes)
        );

        return self;
    };

    /**
     * Adds a USER to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#user
     *
     * @param user {String} The name of the user to use with the USER command.
     *
     * @return {Dockerton}
     */
    self.user = function(user) {
        self._commands.push(
            command_utils.constructSimpleCommand("USER", user)
        );

        return self;
    };

    /**
     * Adds a WORKDIR to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#workdir
     *
     * @param dir {String} The directory to use with WORKDIR.
     *
     * @return {Dockerton}
     */
    self.workdir = function(dir) {
        self._commands.push(
            command_utils.constructSimpleCommand("WORKDIR", dir)
        );

        return self;
    };

    /**
     * Adds an ARG to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#arg
     *
     * If only a key is specified, will be used in `ARG key` format.
     * If a value is specified, will be used in `ARG key=value` format.
     *
     * @param arg {String}
     * @param [defaultValue] {String} Optional default value for the argument
     *
     * @return {Dockerton}
     */
    self.arg = function(arg, defaultValue) {
        if (defaultValue !== undefined && defaultValue !== null) {
            self._commands.push(util.format("ARG %s=%s", arg, defaultValue));
        } else {
            self._commands.push(
                command_utils.constructSimpleCommand("ARG", arg)
            );
        }

        return self;
    };

    /**
     * Adds an ONBUILD to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#onbuild
     *
     * @param command {String}
     *
     * @return {Dockerton}
     */
    self.onbuild = function(command) {
        self._commands.push(
            command_utils.constructSimpleCommand("ONBUILD", command)
        );

        return self;
    };

    /**
     * Adds an STOPSIGNAL to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#stopsignal
     *
     * @param signal {Number || String}
     *
     * @return {Dockerton}
     */
    self.stopsignal = function(signal) {
        self._commands.push(
            command_utils.constructSimpleCommand("STOPSIGNAL", signal.toString())
        );

        return self;
    };
}

/**
 * @public
 */
module.exports = Dockerton;