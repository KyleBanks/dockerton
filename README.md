# Dockerton

## Commands

### FROM

See [FROM documentation](http://docs.docker.com/engine/reference/builder/#from) for more details.

*The FROM instruction sets the Base Image for subsequent instructions. As such, a valid Dockerfile must have FROM as its first instruction.*

##### Usage

```node
dockerton.from(image, tag);
```

- **image**: The base image to build off of
- **tag** *(Optional)*: The version of the image to use
 
##### Examples
```node
new Dockerton()
    .from('whalesay') // -> FROM whalesay
    .from('whalesay', 'latest') // -> FROM whalesay:latest
    .from('whalesay', '1.4.8') // -> FROM whalesay:1.4.8
```

### MAINTAINER

See [MAINTAINER documentation](http://docs.docker.com/engine/reference/builder/#maintainer) for more details.

*The MAINTAINER instruction allows you to set the Author field of the generated images.*

##### Usage

```node
dockerton.maintainer(author);
```

- **author**: The name of the author to display
 
##### Examples
```node
new Dockerton()
    .maintainer('Kyle Banks') // -> MAINTAINER Kyle Banks
```

### RUN

See [RUN documentation](http://docs.docker.com/engine/reference/builder/#run) for more details.

*The RUN instruction will execute any commands in a new layer on top of the current image and commit the results. The resulting committed image will be used for the next step in the Dockerfile.*

##### Usage
```node
dockerton.run(commands);
```

- **commands**: Either a `String` or `Array` of commands to be RUN.
   - If the `commands` argument provided is a String, it will be used in `RUN <command>` format.
   - If the `commands` argument provided is an Array, it will be using in `RUN ["command1", "command2", ...]` format.
   
##### Examples
```node
new Dockerton()
   .run('echo hey') // -> RUN echo hey
   .run(['cd examples', 'node whalesay.js']) // -> RUN ["cd examples", "node whalesay.js"] 
```

### CMD

See [CMD documentation](http://docs.docker.com/engine/reference/builder/#cmd) for more details.

*The main purpose of a CMD is to provide defaults for an executing container. These defaults can include an executable, or they can omit the executable, in which case you must specify an ENTRYPOINT instruction as well.*

##### Usage
```node
dockerton.cmd(commands);
```

- **commands**: Either a `String` or `Array` of commands to be used with CMD.
    - If the `commands` argument provided is a String, it will be used in `CMD <command>` format.
    - If the `commands` argument provided is an Array, it will be using in `CMD ["command1", "command2", ...]` format.
    
##### Examples
```node
new Dockerton()
    .cmd('echo hey') // -> CMD echo hey
    .cmd(['cd examples', 'node whalesay.js']) // -> CMD ["cd examples", "node whalesay.js"] 
```

### LABEL

See [LABEL documentation](http://docs.docker.com/engine/reference/builder/#label) for more details.

*The LABEL instruction adds metadata to an image. A LABEL is a key-value pair. To include spaces within a LABEL value, use quotes and backslashes as you would in command-line parsing.*

##### Usage
```node
dockerton.label(key, value)
         .label(map);
```

`label` supports two usages, either by providing a key and value or a map containing key-value pairs.

- **key**: A single key String.
- **value**: *(Optional)*: A single value String, required only if the first argument is a String.
- **map**: An object containing any number of key-value pairs. All keys and values are treated as strings and added to the LABEL.

##### Examples
```node
new Dockerton()
    .label("env", "prod") // -> LABEL "env"="prod"
    .label({ env: "prod", country: "CA" }) // -> LABEL "env"="prod" \
                                                       "country"="CA"
```

### EXPOSE

See [EXPOSE documentation](http://docs.docker.com/engine/reference/builder/#expose) for more details.

*The EXPOSE instruction informs Docker that the container listens on the specified network ports at runtime.*

##### Usage
```node
dockerton.expose(ports);
```

- **ports**: Either Number or Array of Numbers to be exposed.
    - If the `ports` argument provided is a Number, a single port will be exposed like so: `EXPOSE port`.
    - If the `ports` argument provided is an Array, multiple ports will be exposed like so: `EXPOSE port1 port2 ... portN`.
    
##### Examples
```node
new Dockerton()
    .expose(80) // -> EXPOSE 80
    .expose([80, 8080]) // -> EXPOSE 80 8080
```

### ENV

See [ENV documentation](http://docs.docker.com/engine/reference/builder/#env) for more details.

*The ENV instruction sets the environment variable <key> to the value <value>. This value will be in the environment of all "descendant" Dockerfile commands and can be replaced inline in many as well.*

##### Usage
```node
dockerton.env(key, value)
         .env(map);
```

`env` supports two usages, either by providing a key and value or a map containing key-value pairs.

- **key**: A single key String.
- **value** *(Optional)*: A single value String, required only if the first argument is a String.
- **map**: An object containing any number of key-value pairs. All keys and values are treated as strings and added to the ENV.

##### Examples
```node
new Dockerton()
    .env("env", "prod") // -> ENV env prod
    .env({ env: "prod", country: "CA" }) // -> ENV env="prod" \
                                                   country="CA"
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