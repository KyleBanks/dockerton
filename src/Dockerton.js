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
var util = require('util');

/**
 * @private
 */

/**
 * The String separating the image name and tag on the FROM command.
 *
 * ie. IMAGE<separator>TAG
 *
 * @type {String}
 */
var FROM_IMAGE_TAG_SEPARATOR = ":";

/**
 * "Simple commands" are the ones that only take a single string argument and have no other
 * special usage considerations.
 *
 * @type {Array}
 */
var SIMPLE_COMMANDS = [
    "MAINTAINER"
];

/**
 * Escapes a String for use with Dockerfile commands.
 *
 * @param input {String}
 * @returns {String}
 */
function _escapeString(input) {
    if (input) {
        input = input.replace(/"/g, "\\\"");
    }

    return input;
}

/**
 * Escapes an Array of Strings for use with Dockerfile commands.
 *
 * @param input {Array}
 * @returns {Array}
 */
function _escapeStringArray(input) {
    for (var i = 0; i < input.length; i++) {
        input[i] = _escapeString(input[i]);
    }

    return input;
}

/**
 * Constructs a command that requires either a String or an Array.
 *
 * @param cmd {String} The name of the command, for example "RUN"
 * @param array {String || Array} The string/array to be used in conjunction with the command.
 * @returns {String}
 */
function _constructStringOrArrayCommand(cmd, array) {
    if (array instanceof Array) {
        array = _escapeStringArray(array);

        return util.format('%s ["%s"]', cmd, array.join('", "'));
    } else {
        var string = array;
        string = _escapeString(string);

        return util.format('%s %s', cmd, string);
    }
}

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
     * Add each of the simple commands dynamically.
     */
    SIMPLE_COMMANDS.forEach(function(cmd) {
        self[cmd.toLowerCase()] = function(arg) {
            self._commands.push(util.format("%s %s", cmd, arg));

            return self;
        };
    });

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
            command = command + FROM_IMAGE_TAG_SEPARATOR + tag;
        }

        self._commands.push(util.format("FROM %s", command));

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
            _constructStringOrArrayCommand("RUN", commands)
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
            _constructStringOrArrayCommand("CMD", commands)
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
                keyValuePairs.push(util.format('"%s"="%s"', _escapeString(key), _escapeString(map[key])));
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
            self._commands.push(util.format('EXPOSE %s', ports));
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
                keyValuePairs.push(util.format('%s="%s"', key, _escapeString(map[key])));
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
                _constructStringOrArrayCommand("ADD", sources.concat(destination))
            );
        } else {
            self._commands.push(util.format("ADD %s %s", _escapeString(sources), _escapeString(destination)));
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
                _constructStringOrArrayCommand("COPY", sources.concat(destination))
            );
        } else {
            self._commands.push(util.format("COPY %s %s", _escapeString(sources), _escapeString(destination)));
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
            _constructStringOrArrayCommand("ENTRYPOINT", commands)
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
            _constructStringOrArrayCommand("VOLUME", volumes)
        );

        return self;
    };
}

/**
 * @public
 */
module.exports = Dockerton;