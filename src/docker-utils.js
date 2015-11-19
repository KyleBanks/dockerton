/**
 * docker-utils.js
 *
 * Docker utility functions.
 *
 * Created by kylewbanks on 15-11-18.
 */
'use strict';

/**
 * @imports
 */
var child_process = require('child_process'),
    util = require('util');

var Promise = require('bluebird');

var debug = require('./debug');

/**
 * @public
 */
module.exports = {

    /**
     * Executes a `docker inspect <image>` command and returns the first result.
     *
     * Resolves: {Object} Objects containing the full image details.+
     *
     * @param image {String}
     *
     * @returns {bluebird}
     */
    inspect: function(image) {
        return new Promise(function(resolve, reject) {
            var imageData = [];

            var imageDataCommand = util.format("docker inspect %s", image);
            debug('inspect: executing: %s', imageDataCommand);

            var imageDataChild = child_process.exec(imageDataCommand);

            imageDataChild.stdout.on('data', function(data) {
                imageData.push(data);
            });

            imageDataChild.on('close', function(code) {
                if (code !== 0) {
                    return reject(new Error("failed to inspect image, return code: " + code));
                }

                resolve(
                    JSON.parse(imageData.join(''))[0]
                );
            });
        });
    }

};