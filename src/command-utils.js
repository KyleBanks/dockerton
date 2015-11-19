/**
 * command-utils.js
 * 
 * Helper functions for constructing commands.
 * 
 * Created by kylewbanks on 15-11-17.
 */
'use strict';

/**
 * @import
 */
var util = require('util');

/**
 * @public
 */
module.exports = {

    /**
     * Escapes a String for use with Dockerfile commands.
     *
     * @param input {String}
     * @returns {String}
     */
    escapeString: function(input) {
        if (input) {
            input = input.replace(/"/g, "\\\"");
        }

        return input;
    },

    /**
     * Escapes an Array of Strings for use with Dockerfile commands.
     *
     * @param input {Array}
     * @returns {Array}
     */
    escapeStringArray: function(input) {
        for (var i = 0; i < input.length; i++) {
            input[i] = module.exports.escapeString(input[i]);
        }

        return input;
    },

    /**
     * Constructs a command that requires either a String or an Array.
     *
     * @param cmd {String} The name of the command, for example "RUN"
     * @param array {String || Array} The string/array to be used in conjunction with the command.
     * @returns {String}
     */
    constructStringOrArrayCommand: function(cmd, array) {
        if (array instanceof Array) {
            array = module.exports.escapeStringArray(array);

            return util.format('%s ["%s"]', cmd, array.join('", "'));
        } else {
            var string = array;
            string = module.exports.escapeString(string);

            return util.format('%s %s', cmd, string);
        }
    },

    /**
     * Constructs a simple command that takes only a basic string value.
     *
     * @param cmd {String} The name of the command, for example "MAINTAINER".
     * @param value {String} The value to be used in conjunction with the command.
     * @returns {String}
     */
    constructSimpleCommand: function(cmd, value) {
        return util.format("%s %s", cmd, value);
    },

    /**
     * Constructs command-line arguments from an object containing arg=value pairs, for example:
     *
     * {
     *   '-t': "tag"
     * }
     *
     * @param map {Object}
     * @returns {Array}
     */
    constructArgsFromMap: function(map) {
        var args = [];

        // Iterate each argument and append both the flag and the value to the `args` variable.
        Object.keys(map.args).forEach(function(key) {
            args.push(key);
            args.push(map.args[key]);
        });

        return args;
    }

};
