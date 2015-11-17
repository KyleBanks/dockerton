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
     * Sets the base image for subsequent instructions.
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
     * Adds a RUN command to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#run
     *
     * If the `commands` argument provided is a String, it will be used in `RUN <command>` format, otherwise
     * if it's an Array, it will be using in `RUN ["command1", "command2", ...]` format.
     *
     * @param commands {Array || String}
     *
     * @return {Dockerton}
     */
    self.run = function(commands) {
        if (commands instanceof Array) {
            commands = _escapeStringArray(commands);

            self._commands.push(util.format('RUN ["%s"]', commands.join("\", \"")));
        } else {
            var command = commands;
            command = _escapeString(command);

            self._commands.push(util.format('RUN %s', command));
        }

        return self;
    };

    /**
     * Adds a CMD command to the Dockerfile.
     *
     * See http://docs.docker.com/engine/reference/builder/#cmd
     *
     * If the `commands` argument provided is a String, it will be used in `CMD <command>` format, otherwise
     * if it's an Array, it will be using in `CMD ["command1", "command2", ...]` format.
     *
     * @param commands {Array || String}
     *
     * @return {Dockerton}
     */
    self.cmd = function(commands) {
        if (commands instanceof Array) {
            commands = _escapeStringArray(commands);

            self._commands.push(util.format('CMD ["%s"]', commands.join("\", \"")));
        } else {
            var command = commands;
            command = _escapeString(command);

            self._commands.push(util.format('CMD %s', command));
        }

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
     * @param key {String}
     * @param value {String}
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
}

/**
 * @public
 */
module.exports = Dockerton;