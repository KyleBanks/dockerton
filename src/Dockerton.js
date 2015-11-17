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


}

/**
 * @public
 */
module.exports = Dockerton;