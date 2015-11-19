/**
 * whalesay.js
 *
 * A very basic example using the `whalesay` tutorial from docker.com.
 *
 * See https://docs.docker.com/linux/step_four/
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
var dockerton = new Dockerton('dockerton-whalesay')
    .from('docker/whalesay', 'latest')
    .run('apt-get -y update && apt-get install -y fortunes')
    .cmd('/usr/games/fortune -a | cowsay');

dockerton.dockerfile()
    .then(function(contents) {
        console.log('---------------------');
        console.log('Generated Dockerfile:');
        console.log(contents);
        console.log('---------------------');

        return dockerton.buildImage();
    })
    .then(function(imageDetails) {
        console.log('---------------------');
        console.log('Image Built:');
        console.log(imageDetails);
        console.log('---------------------');

        return dockerton.runImage();
    })
    .catch(function(err) {
        throw err;
    });