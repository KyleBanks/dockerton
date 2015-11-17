/**
 * whalesay.js
 *
 * Most basic example using the `whalesay` tutorial from docker.com
 *
 * Created by kylewbanks on 15-11-17.
 */
'use strict';

/**
 * @imports
 */
var Dockerton = require('../index');

/**
 * @private
 */
var dockerton = new Dockerton()
    .from('docker/whalesay', 'latest');