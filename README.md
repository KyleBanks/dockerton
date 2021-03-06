# Dockerton

Dockerton wraps the core functionality of Docker into an easy-to-use Node.js library. With Dockerton, you can generate Dockerfiles, build images, and run containers using a simple and intuitive JavaScript interface.

<!--- [Installation](#installation)-->
<!--- [Usage](#usage)-->
<!--- [Commands](#commands)-->
<!--    - [dockerfile](#dockerfile)-->
<!--    - [buildImage](#buildimage)-->
<!--    - [runContainer](#runcontainer)-->
<!--    - [Docker Commands](#docker-commands)-->
<!--        - [FROM](#from)-->
<!--        - [MAINTAINER](#maintainer)-->
<!--        - [RUN](#run)-->
<!--        - [CMD](#cmd)-->
<!--        - [LABEL](#label)-->
<!--        - [EXPOSE](#expose)-->
<!--        - [ENV](#env)-->
<!--        - [ADD](#add)-->
<!--        - [COPY](#copy)-->
<!--        - [ENTRYPOINT](#entrypoint)-->
<!--        - [VOLUME](#volume)-->
<!--        - [USER](#user)-->
<!--        - [ARG](#arg)-->
<!--        - [ONBUILD](#onbuild)-->
<!--        - [STOPSIGNAL](#stopsignal)-->
<!--- [License](#license)-->

## Installation

Dockerton is available via [npm](https://www.npmjs.com/package/dockerton):

```
npm install dockerton
```

## Usage

Dockerton is used by constructing an instance of the `Dockerton` class, and issuing `Dockerfile` style commands.

```node
var Dockerton = require('dockerton');

var docker = new Dockerton('dockerton-example')
    .from('scratch', 'latest')
    .copy('hello', '/')
    .cmd(['/hello']);
```

After issuing your commands, you can then generate a Dockerfile, build a docker image, and/or run a container.

```node
// Generate the Dockerfile
docker.dockerfile(options) 
    .then(function(contents) {
        console.log(contents); // -> Raw contents of the Dockerfile
    });
    
// Build an image
docker.buildImage(options) 
    .then(function(details) {
        console.log(details.Id); // -> Unique ID of the newly built image
    });

// Run the container
docker.runContainer(options)
    .then(function() {
        // Container process finished
    });

// Or chain them all together as needed
docker.dockerfile(options)
    .then(function(contents) {
        return docker.buildImage(options);
    })
    .then(function(imageDetails) {
        return docker.runContainer(options);
    });
```

## Examples

The [examples directory](./examples) contains a number of examples of varying complexity. Each can be executed by issuing the following command:

```
cd examples/
node <example name>.js
```

## Commands

### Constructor

Instantiates a new Dockerton instance which can be used to generate a dockerfile, build an image, or run a container.
 
- **tag** `{String}`: The tag/name of the docker image to be built/run. Equivalent to the `-t` argument of `docker build`. For example, `docker/whalesay`.

### dockerfile

Generates the Dockerfile contents from the commands that have been issued.

Resolves: `{String}` Dockerfile contents.

- **options** *(Optional)*:
    - **options.path** `{String}`: Path to the generated Dockerfile. Defaults to `./Dockerfile`.

### buildImage

Builds the Docker image using the generated Dockerfile, and returns the full image data.
 
Resolves: `{Object}` Full image details, as seen via `docker inspect`.

- **options** *(Optional)*: 
    - **options.dir** `{String}`: Path to the directory to be used for building the docker image. Defaults to `.`.
    
    - **options.args** `{Object}`: A map of arguments to be provided to the `docker build` command. The map should be provided in the format of `{ 'flag': 'value' }`. For example `{ '-f': 'Filename' }` to specify a custom Dockerfile name.
    
    - **options.stdout** `{function(String)}`: Executed each time stdout is generated from the subprocess. Defaults to `console.log`.
    - **options.stderr** `{function(String)}`: Executed each time stderr is generated from the subprocess. Defaults to `console.error`.

### runContainer

- **options** *(Optional)*: 
    - **options.args** `{Object}`: A map of arguments to be provided to the `docker run` command. The map should be provided in the format of `{ 'flag': 'value' }`. For example `{ '-f': 'Filename' }` to specify a custom Dockerfile name.
    
    - **options.stdout** `{function(String)}`: Executed each time stdout is generated from the subprocess. Defaults to `console.log`.
    - **options.stderr** `{function(String)}`: Executed each time stderr is generated from the subprocess. Defaults to `console.error`.
    
### Docker Commands

#### FROM

See [FROM documentation](http://docs.docker.com/engine/reference/builder/#from) for more details.

*The FROM instruction sets the Base Image for subsequent instructions. As such, a valid Dockerfile must have FROM as its first instruction.*

##### Usage

```node
dockerton.from(image, tag);
```

- **image** `{String}`: The base image to build off of
- **tag**  `{String}` *(Optional)*: The version of the image to use
 
##### Examples
```node
new Dockerton()
    .from('whalesay') // -> FROM whalesay
    .from('whalesay', 'latest') // -> FROM whalesay:latest
    .from('whalesay', '1.4.8') // -> FROM whalesay:1.4.8
```

#### MAINTAINER

See [MAINTAINER documentation](http://docs.docker.com/engine/reference/builder/#maintainer) for more details.

*The MAINTAINER instruction allows you to set the Author field of the generated images.*

##### Usage

```node
dockerton.maintainer(author);
```

- **author** `{String}`: The name of the author to display
 
##### Examples
```node
new Dockerton()
    .maintainer('Kyle Banks') // -> MAINTAINER Kyle Banks
```

#### RUN

See [RUN documentation](http://docs.docker.com/engine/reference/builder/#run) for more details.

*The RUN instruction will execute any commands in a new layer on top of the current image and commit the results. The resulting committed image will be used for the next step in the Dockerfile.*

##### Usage
```node
dockerton.run(commands);
```

- **commands** `{String || Array}`: Either a `String` or `Array` of commands to be RUN.
   - If the `commands` argument provided is a String, it will be used in `RUN <command>` format.
   - If the `commands` argument provided is an Array, it will be using in `RUN ["command1", "command2", ...]` format.
   
##### Examples
```node
new Dockerton()
   .run('echo hey') // -> RUN echo hey
   .run(['cd examples', 'node whalesay.js']) // -> RUN ["cd examples", "node whalesay.js"] 
```

#### CMD

See [CMD documentation](http://docs.docker.com/engine/reference/builder/#cmd) for more details.

*The main purpose of a CMD is to provide defaults for an executing container. These defaults can include an executable, or they can omit the executable, in which case you must specify an ENTRYPOINT instruction as well.*

##### Usage
```node
dockerton.cmd(commands);
```

- **commands** `{String || Array}`: Either a `String` or `Array` of commands to be used with CMD.
    - If the `commands` argument provided is a String, it will be used in `CMD <command>` format.
    - If the `commands` argument provided is an Array, it will be using in `CMD ["command1", "command2", ...]` format.
    
##### Examples
```node
new Dockerton()
    .cmd('echo hey') // -> CMD echo hey
    .cmd(['cd examples', 'node whalesay.js']) // -> CMD ["cd examples", "node whalesay.js"] 
```

#### LABEL

See [LABEL documentation](http://docs.docker.com/engine/reference/builder/#label) for more details.

*The LABEL instruction adds metadata to an image. A LABEL is a key-value pair. To include spaces within a LABEL value, use quotes and backslashes as you would in command-line parsing.*

##### Usage
```node
dockerton.label(key, value)
         .label(map);
```

`label` supports two usages, either by providing a key and value or a map containing key-value pairs.

- **key** `{String}`: A single key String.
- **value**: *(Optional)* `{String}`: A single value String, required only if the first argument is a String.
- **map** `{Object}`: An object containing any number of key-value pairs. All keys and values are treated as strings and added to the LABEL.

##### Examples
```node
new Dockerton()
    .label("env", "prod") // -> LABEL "env"="prod"
    .label({ env: "prod", country: "CA" }) // -> LABEL "env"="prod" \
                                                       "country"="CA"
```

#### EXPOSE

See [EXPOSE documentation](http://docs.docker.com/engine/reference/builder/#expose) for more details.

*The EXPOSE instruction informs Docker that the container listens on the specified network ports at runtime.*

##### Usage
```node
dockerton.expose(ports);
```

- **ports** `{Number || Array}`: Either Number or Array of Numbers to be exposed.
    - If the `ports` argument provided is a Number, a single port will be exposed like so: `EXPOSE port`.
    - If the `ports` argument provided is an Array, multiple ports will be exposed like so: `EXPOSE port1 port2 ... portN`.
    
##### Examples
```node
new Dockerton()
    .expose(80) // -> EXPOSE 80
    .expose([80, 8080]) // -> EXPOSE 80 8080
```

#### ENV

See [ENV documentation](http://docs.docker.com/engine/reference/builder/#env) for more details.

*The ENV instruction sets the environment variable <key> to the value <value>. This value will be in the environment of all "descendant" Dockerfile commands and can be replaced inline in many as well.*

##### Usage
```node
dockerton.env(key, value)
         .env(map);
```

`env` supports two usages, either by providing a key and value or a map containing key-value pairs.

- **key** `{String}`: A single key String.
- **value** *(Optional)* `{String}`: A single value String, required only if the first argument is a String.
- **map** `{Object}`: An object containing any number of key-value pairs. All keys and values are treated as strings and added to the ENV.

##### Examples
```node
new Dockerton()
    .env("env", "prod") // -> ENV env prod
    .env({ env: "prod", country: "CA" }) // -> ENV env="prod" \
                                                   country="CA"
```

#### ADD

See [ADD documentation](http://docs.docker.com/engine/reference/builder/#add) for more details.

*The ADD instruction copies new files, directories or remote file URLs from <src> and adds them to the filesystem of the container at the path <dest>.*

##### Usage
```node
dockerton.add(sources, destination);
```

- **sources** `{String || Array}`: Either a `String` or `Array` of source files/directories to be added.
   - If the `sources` argument provided is a String, it will be used in `ADD src dest` format.
   - If the `sources` argument provided is an Array, it will be used in `ADD ["src1", "src2", ... "dest"]` format.
- **destination** `{String}`: The destination to which the sources will be added.
   
##### Examples
```node
new Dockerton()
   .add('source/', 'dest/') // -> ADD source/ dest/
   .add(['index.html', 'app.js'], 'dest/') // -> ADD ["index.html", "app.js", "dest/"] 
```

#### COPY

See [COPY](http://docs.docker.com/engine/reference/builder/#copy) for more details.

*The COPY instruction copies new files or directories from <src> and adds them to the filesystem of the container at the path <dest>.*

##### Usage
```node
dockerton.copy(sources, destination);
```

- **sources** `{String || Array}`: Either a `String` or `Array` of source files/directories to be copied.
   - If the `sources` argument provided is a String, it will be used in `COPY src dest` format.
   - If the `sources` argument provided is an Array, it will be used in `COPY ["src1", "src2", ... "dest"]` format.
- **destination** `{String}`: The destination to which the sources will be copied.
   
##### Examples
```node
new Dockerton()
   .copy('source/', 'dest/') // -> COPY source/ dest/
   .copy(['index.html', 'app.js'], 'dest/') // -> COPY ["index.html", "app.js", "dest/"] 
```

#### ENTRYPOINT

See [ENTRYPOINT documentation](http://docs.docker.com/engine/reference/builder/#entrypoint) for more details.

*An ENTRYPOINT allows you to configure a container that will run as an executable.*

##### Usage
```node
dockerton.entrypoint(commands);
```

- **commands** `{String || Array}`: Either a `String` or `Array` of commands to be used as the ENTRYPOINT.
   - If the `commands` argument provided is a String, it will be used in `ENTRYPOINT <command>` format.
   - If the `commands` argument provided is an Array, it will be using in `ENTRYPOINT ["command1", "command2", ...]` format.
   
##### Examples
```node
new Dockerton()
   .entrypoint('top -b') // -> ENTRYPOINT top -b
   .entrypoint(['top', '-b']) // -> ENTRYPOINT ["top", "-b"] 
```

#### VOLUME

See [VOLUME documentation](http://docs.docker.com/engine/reference/builder/#volume) for more details.

*The VOLUME instruction creates a mount point with the specified name and marks it as holding externally mounted volumes from native host or other containers.*

##### Usage
```node
dockerton.volume(volumes);
```

- **volumes** `{String || Array}`: Either a `String` or `Array` of commands to be used as the VOLUME.
   - If the `volumes` argument provided is a String, it will be used in `VOLUME <volume>` format.
   - If the `volumes` argument provided is an Array, it will be using in `VOLUME ["/vol1", "/vol2", ...]` format.
   
##### Examples
```node
new Dockerton()
   .volume('/vol1') // -> VOLUME /vol1
   .volume(['/vol2', '/vol3']) // -> VOLUME ["/vol2", "/vol3"] 
```

#### USER

See [USER documentation](http://docs.docker.com/engine/reference/builder/#user) for more details.

*The USER instruction sets the user name or UID to use when running the image and for any RUN, CMD and ENTRYPOINT instructions that follow it in the Dockerfile.*

##### Usage

```node
dockerton.user(user);
```

- **user** `{String}`: The name or UID of the user to use.
 
##### Examples
```node
new Dockerton()
    .user('kyle') // -> USER kyle
```

#### ARG

See [ARG documentation](http://docs.docker.com/engine/reference/builder/#arg) for more details.

*The ARG instruction defines a variable that users can pass at build-time to the builder with the docker build command using the --build-arg <varname>=<value> flag. If a user specifies a build argument that was not defined in the Dockerfile, the build outputs an error.*

##### Usage

```node
dockerton.arg(arg, default);
```

- **arg** `{String}`: The name of the ARG.
- **default** *(Optional)* `{String}`: The default value of the ARG.
 
##### Examples
```node
new Dockerton()
    .arg('myArg') // -> ARG myArg
    .arg('anotherArg', 'withDefault') // -> ARG anotherArg=withDefault
```

#### ONBUILD

See [ONBUILD documentation](http://docs.docker.com/engine/reference/builder/#onbuild) for more details.

*The ONBUILD instruction adds to the image a trigger instruction to be executed at a later time, when the image is used as the base for another build.*

##### Usage

```node
dockerton.onbuild(command);
```

- **command** `{String}`: The command to run with ONBUILD.
 
##### Examples
```node
new Dockerton()
    .onbuild('ADD src/ dest/') // -> ONBUILD ADD src/ dest/
```

#### STOPSIGNAL

See [STOPSIGNAL documentation](http://docs.docker.com/engine/reference/builder/#stopsignal) for more details.

*The STOPSIGNAL instruction sets the system call signal that will be sent to the container to exit.*

##### Usage

```node
dockerton.stopsignal(signal);
```

- **signal** `{String || Number}`: The signal to stop.
 
##### Examples
```node
new Dockerton()
    .stopsignal(1) // -> STOPSIGNAL 1
    .stopsignal('sig1') // -> STOPSIGNAL sig1
```

## Tests

You can run the tests by executing the following command in the root of the repository:

```
npm test
```

Alternatively, you can invoke [mocha](https://mochajs.org/) directly with your own arguments:

```
mocha --recursive
```

## License
```
The MIT License (MIT)

Copyright (c) 2015 Kyle Banks.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
