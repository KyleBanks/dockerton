# Dockerton

## Commands

### FROM

See [FROM documentation](http://docs.docker.com/engine/reference/builder/#from) for more details.

*The FROM instruction sets the Base Image for subsequent instructions. As such, a valid Dockerfile must have FROM as its first instruction.*

#### Usage

```node
dockerton.from(image, tag);
```

- **image**: The base image to build off of
- **tag** *(Optional)*: The version of the image to use
 
#### Examples
```node
new Dockerton()
    .from('whalesay') // -> FROM whalesay
    .from('whalesay', 'latest') // -> FROM whalesay:latest
    .from('whalesay', '1.4.8') // -> FROM whalesay:1.4.8
```

### MAINTAINER

See [MAINTAINER documentation](http://docs.docker.com/engine/reference/builder/#maintainer) for more details.

*The MAINTAINER instruction allows you to set the Author field of the generated images.*

#### Usage

```node
dockerton.maintainer(author);
```

- **author**: The name of the author to display
 
#### Examples
```node
new Dockerton()
    .maintainer('Kyle Banks') // -> MAINTAINER Kyle Banks
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