/**
 * hello-world.js
 *
 * Most basic example, the traditional "Hello World".
 *
 * Created by kylewbanks on 15-11-18.
 */
'use strict';

/**
 * @imports
 */
var Dockerton = require('../index');

/**
 * @private
 */
var docker = new Dockerton('dockerton-example')
    .from('hello-world');

docker.dockerfile()
    .then(function() {
        return docker.buildImage();
    })
    .then(function() {
        return docker.runImage();
    });