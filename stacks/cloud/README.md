# knot-cloud

### Configure DNS

This stack uses [Traefik](https://traefik.io) as a reverse proxy for the services and requires that you configure your DNS server to point, at least, the **api** and **storage** subdomains to the machine where the stack is being deployed, so that it can route the requests to the appropriated service. It is possible to configure it to route by path or port, but instructions for that won't be provided here for brevity.

If you don't have a domain or can't configure the main DNS server, you can configure a test domain in your machine before proceeding. Either setup a local DNS server, e.g. [bind9](https://wiki.debian.org/Bind9), or alternatively update your hosts file to include the following addresses:

```
127.0.0.1   api.fog
127.0.0.1   storage.fog
```

On Windows, the hosts file is usually located under `c:\Windows\System32\Drivers\etc\hosts`. On Unix systems, it is commonly found at `/etc/hosts`. Regardless of you operating system, administrator or super user privileges will be required.

### Deploy

The stack uses multiple compose files to setup the services and reach the desired state. Common definitions to both development and production settings are grouped in the `base` directory and specific ones are grouped in the `dev` and `prod` directories. For example, when configuring `traefik` as service's load balancer, you can deploy its development definition to avoid exposing services without need. Also, it can be necessary to deploy the services into multiple machines, which could be done by using the `multi-node` definitions.

#### Development

After using the `init` command as described [here](../../README.md#Development), the stack files will be copied to `<path>/stack` directory (`path` is the folder specified in the `init` execution), be sure to enter there. The following files should be shown when exploring the `stack` directory

```bash
cd <path>/stack
ls
```

```text
base.yml
connector.yml
dev.yml
env.d
traefik.yml
```

```bash
docker stack deploy --compose-file base.yml --compose-file dev.yml --compose-file traefik.yml knot-cloud
```

This stack will be deployed with the basic services, which are related to the thing, user and messaging capabilities. In order to run it as the KNoT Fog instance, read the following instructions:

1. Create a new user account in the **KNoT Cloud** and save the output:

   ```bash
   knot-cloud create-user <email> <password> --server api.knot.cloud --protocol https
   ```

   ```bash
   knot-cloud create-user knot@cesar.org.br exemplo-senha --server api.knot.cloud --protocol https

   user successfully created
   {
     "token": "some-token-returned"
   }
   ```

1. Create a new user account in the **KNoT Fog** by repeating the same previous command with the options `--server api.fog` and `--protocol http` and save the output. The same e-mail and password can be used.

1. Update the connector configuration in .`/env.d/knot-connector.env`:

   - Add the **cloud** user's token to the `CLOUD_SETTINGS` variable object by changing the `token` property.
   - Add the **fog** user's token to the `FOG_USER_TOKEN` variable.

1. Deploy connector to the `knot-cloud` stack:

   ```bash
   docker stack deploy --compose-file connector.yml knot-cloud
   ```

1. Go to the connector directory, which is in the `<path>` directory, and install its dependencies:

   ```bash
   cd <path>/knot-fog-connector
   npm install
   ```

> **_NOTE:_** [Click here](#verify) and read the instructions to verify if the services are up correctly.

#### Production

Firstly, create a new secret to the authenticaton service.

```bash
openssl rand -base64 256
```

With the generated string, update the `MF_AUTHN_SECRET` environment variable in the `/env.d/mainflux-authn.env` file.

The deployment to production can be done without switching to another directory. It can be done as follows:

```bash
docker stack deploy --compose-file prod/traefik.yml --compose-file base/base.yml knot-cloud
```

> **_NOTE:_** The file passed to the `--compose-file` flag must be one located at the `prod` directory so that the composed stack file can find the env files (`env.d`).

### Addons

Additional configuration can be done by using some definition files located at `addons` directory. The available ones are described below:

- EBS (`ebs.yml`): creates a bind between services volume and AWS [EBS](https://aws.amazon.com/pt/ebs/) volumes.
- TLS (`tls.yml`): enables `storage` and `babeltower` to receive HTTPS requests.
- Connector (`connector.yml` and `connector.dev.yml`): adds the [knot-fog-connector](https://github.com/CESARBR/knot-fog-connector) service to the stack.

Example:

```bash
docker stack deploy --compose-file prod/traefik.yml --compose-file base/base.yml --compose-file addons/connector.yml knot-cloud
```

The addons can be deployed separetely if the stack is already running:

```bash
docker stack deploy --compose-file addons/connector.yml knot-cloud
```

### Verify

Check if all the services are running and have exactly one replica:

```bash
docker stack services knot-cloud
```

You should see something like this:

```text
ID                  NAME                            MODE                REPLICAS            IMAGE
24wn25ispd7c        knot-cloud_authn           replicated          1/1                 mainflux/authn:0.11.0
vp096d9fbxqe        knot-cloud_authn-db        replicated          1/1                 postgres:9.6.17-alpine
hgkdkk8ud689        knot-cloud_babeltower      replicated          1/1                 cesarbr/knot-babeltower:dev

...
```

In addition, run the following command to verify an individual service logs.

```bash
docker service logs -f <service_name>
```

Example:

```bash
docker service logs -f knot-cloud_connector
```

### Demonstration

If you have had any trouble bringing the services up and creating the user token, watch the following demonstration video:

[![asciicast](https://asciinema.org/a/rRFW94ntKJ9J36IRRWKk0Bcs5.svg)](https://asciinema.org/a/rRFW94ntKJ9J36IRRWKk0Bcs5)