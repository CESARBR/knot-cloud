# KNoT Cloud

KNoT Cloud is a cloud computing solution that enables operating on IoT devices
by providing a minimum messaging and management infrastructure. It includes device and authentication management services as well as APIs for sending commands to the things and collect data from their sensors. Also, the KNoT Cloud uses some services from the [Mainflux](https://mainflux.readthedocs.io/) platform, which is a lightweight platform for running IoT cloud computing on the edge. Please, check out the [official documentation](https://knot-devel.cesar.org.br/doc/cloud/cloud-introduction.html) for more information.

## Installation and usage

Stacks for development and production environments are provided in order to assist the user's needs. The development stack must be used if one needs to modify any of the components of the stack. A command line tool will download the source for each component and plug it into the containers, which all have _hot reload_ enabled. The production stack must be used in all other cases.

### Development only preparation

If you intend to use the development stack, a command line tool that downloads and configures the stack is required.

#### Install CLI tool

```bash
npm install -g @cesarbr/knot-cloud
```

### Choose the stack

#### Development

The development stack must be created using the tool described in the previous section. Choose a `<path>` where the stack should be created (defaults to the current directory) and then run:

> **_NOTE:_** The following command assumes you don't have a workspace with the repositories and clone them. To disable this, run it with the `--no-clone` flag.

```bash
knot-cloud init [path]
```

The source code and stack template files will be created under `<path>/stack`.

#### Production

There are two production deployment strategies: all-in-one and multinode. The former will deploy all the services on a single machine while the latter will deploy them in multiple nodes (at least two). The files for the two flavours are available at `stacks/cloud/prod`. The file `multi-node.yml` can be added to the deploy command if you want to enable the multinode strategy.

### Initialize Swarm mode

In your deployment machine, initialize Docker Swarm mode:

```bash
docker swarm init
```

In case you are deploying to multiple nodes, all the nodes must be connected to the same swarm. In this case, run the command above in the machine that must be the swarm manager and run `docker swarm join` in all other nodes, as instructed by the execution of `docker swarm init` in the manager machine. Check the [Docker Swarm](https://docs.docker.com/engine/swarm/) documentation for more on how to setup your cluster.

### Deploying stack

After this point, follow the specific instructions to configure and deploy the created stack:

- [Steps for deploying the cloud services](./stacks/cloud/README.md)

### Tear Down

If you want to stop your stack from running or even leave the Docker Swarm mode, execute the commands below:

`docker stack rm knot-cloud`

and

`docker swarm leave`
