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
    this.from = function(image, tag) {
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
     */
    this.run = function(commands) {
        if (commands instanceof Array) {
            self._commands.push(util.format('RUN ["%s"]', commands.join("\", \"")));
        } else {
            self._commands.push(util.format('RUN %s', commands));
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
     */
    this.cmd = function(commands) {
        if (commands instanceof Array) {
            self._commands.push(util.format('CMD ["%s"]', commands.join("\", \"")));
        } else {
            self._commands.push(util.format('CMD %s', commands));
        }

        return self;
    };
}

/**
 * @public
 */
module.exports = Dockerton;