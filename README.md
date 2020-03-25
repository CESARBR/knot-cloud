# KNoT Cloud

KNoT Cloud is a cloud computing solution that enables operating on IoT devices
by providing a minimum messaging and management infrastructure. It includes device and authentication management services as well as APIs for sending commands to the things and collect data from their sensors. Please, check out the [official documentation](https://knot-devel.cesar.org.br/doc/cloud/cloud-introduction.html) for more information.

Currently, the KNoT Cloud is built over [Meshblu](https://meshblu.readme.io/) services which were demonstrated to have a low performance when running on some constrained environment such as the Fog Computing layer. For that reason, it is being rebuild with faster management services and messaging mechanisms that facilitate the evolution and its usage in several environments (some of these service are part of [Mainflux](https://mainflux.readthedocs.io/) platform). In this documentation, the actual version is still referred to as `cloud` and the solution that is under development is referred to as `core`.

## Installation and usage

Stacks for development and production environments are provided in order to assist the user's needs. The development stack must be used if one needs to modify any of the components of the stack. A command line tool will download the source for each component and plug it into the containers, which all have _hot reload_ enabled. The production stack must be used in all other cases.

### Download

The provided stacks and CLI contained in this repository aren't yet published in any package manager, hence it is necessary that you clone the repository or download the `.zip` containing all the files.

```bash
git clone https://github.com/CESARBR/knot-cloud.git
```

The following instructions always assume you are in the directory created after cloning the repository. If you downloaded the `.zip`, navigate to the appropriate folder.

### Development only preparation

If you intend to use the development stack, a command line tool that downloads and configures the stack is required.

#### Build and install CLI tool

The tool is built and installed as follows:

```bash
npm install
npm run build
npm link
```

Depending on npm configurations, it might be necessary to run `npm link` with super user privileges.

```bash
sudo npm link
```

### Choose the stack

#### Development

The development stack must be created using the tool described in the previous section. Firstly, inform which `stack` you want to create: `cloud` or `core` (defaults to `cloud`). Lastly, Choose a `<path>` where the stack should be created (defaults to the current directory) and then run:

```bash
knot-cloud init [stack] [path]
```

The source code and stack template files will be created under `<path>/stack`.

#### Production

In the moment, the `cloud` stack is the only with production support. Its comes in two flavours: all-in-one and multinode. The former will deploy all the services on a single machine while the latter will deploy them in multiple nodes (at least two). The files for the two flavours are available at `stacks/knot-cloud/prod`.

### Initialize Swarm mode

In your deployment machine, initialize Docker Swarm mode:

```bash
docker swarm init
```

In case you are deploying to multiple nodes, all the nodes must be connected to the same swarm. In this case, run the command above in the machine that must be the swarm manager and run `docker swarm join` in all other nodes, as instructed by the execution of `docker swarm init` in the manager machine. Check the [Docker Swarm](https://docs.docker.com/engine/swarm/) documentation for more on how to setup your cluster.

### Deploying stack

After this point, follow the specific instructions to configure and deploy the created stack:

- [Steps for deploying the cloud services](./stacks/knot-cloud/README.md)
- [Steps for deploying the core services](./stacks/knot-cloud-core/README.md)

### Tear Down

If you want to stop your stack from running or even leave the Docker Swarm mode, execute the commands below:

`docker stack rm <knot-cloud|knot-cloud-stack>`

and

`docker swarm leave`