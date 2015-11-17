# dockerton


## Commands

### FROM

See [FROM documention](http://docs.docker.com/engine/reference/builder/#from) for more details.

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