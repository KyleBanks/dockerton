/**
 * Dockerton.js
 *
 * Main Dockerton class, the primary use of the library's clients.
 *
 * Created by kylewbanks on 15-11-17.
 */
'use strict';

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
 * Dockerton Constructor
 *
 * @constructor
 */
function Dockerton() {

    /**
     * Contains each command, in sequence, to be used in the generated
     * Dockerfile.
     *
     * @type {Array}
     */
    this._commands = [];

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

        this._commands.push("FROM " + command);

        return this;
    }
}

/**
 * @public
 */
module.exports = Dockerton;