/**
 * debug.js
 *
 * Basic debug logger that uses an environment variable to either log or suppress output to stdout.
 *
 * Created by kylewbanks on 15-11-18.
 */
'use strict';

/**
 * Outputs to `console.log` if the `DEBUG_DOCKERTON` environment variable is set.
 *
 * @public
 */
module.exports = function() {
    if (process.env.DEBUG_DOCKERTON) {
        console.log.apply(console, arguments);
    }
};
