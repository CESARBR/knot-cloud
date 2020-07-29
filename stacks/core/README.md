# knot-cloud-core

### Configure DNS

This stack uses [Traefik](https://traefik.io) as a reverse proxy for the services and requires that you configure your DNS server to point, at least, the **api** and **storage** subdomains to the machine where the stack is being deployed, so that it can route the requests to the appropriated service. It is possible to configure it to route by path or port, but instructions for that won't be provided here for brevity.

If you don't have a domain or can't configure the main DNS server, you can configure a test domain in your machine before proceeding. Either setup a local DNS server, e.g. [bind9](https://wiki.debian.org/Bind9), or alternatively update your hosts file to include the following addresses:

```
127.0.0.1   api.fog
127.0.0.1   storage.fog
```

On Windows, the hosts file is usually located under `c:\Windows\System32\Drivers\etc\hosts`. On Unix systems, it is commonly found at `/etc/hosts`. Regardless of you operating system, administrator or super user privileges will be required.

### Deploy

The `core` stack uses multiple compose files to setup the services and reach the desired state. Common definitions to both development and production settings are grouped in the `base` directory and specific ones are grouped in the `dev` and `prod` directories. For example, when configuring `traefik` as service's load balancer, you can deploy its development definition to avoid exposing services without need. Also, it can be necessary to deploy the services into multiple machines, which could be done by using the `multi-node` definitions.

#### Development

When the stack is copied to a specified workspace through the CLI `init` operation, the following command must be executed to deploy the services:

```bash
docker stack deploy --compose-file base.yml --compose-file dev.yml --compose-file traefik.yml knot-cloud-core
```

This stack will be deployed with the basic services, which are related to the thing, user and messaging capabilities. In order to run it as the KNoT Fog instance, read the following instructions:

1. Create a new user account in the **KNoT Cloud** and save the output:

   ```bash
   knot-cloud create-user <email> <password> --server api.knot.cloud --protocol https
   ```

1. Create a new user account in the **KNoT Fog** and save the output:

   ```bash
   knot-cloud create-user <email> <password> --server api.fog --protocol http
   ```

1. Update the connector configuration in .`/env.d/knot-connector.env`:

   - Add the **cloud** user's token to the `CLOUD_SETTINGS` variable object by changing the `token` property.
   - Add the **fog** user's token to the `FOG_USER_TOKEN` variable.

1. Deploy connector to the `knot-cloud-core` stack:

   ```bash
   docker stack deploy --compose-file connector.yml knot-cloud-core
   ```

1. Enter connector directory and install its dependencies:

   ```bash
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
docker stack deploy --compose-file prod/traefik.yml --compose-file base/base.yml knot-cloud-core
```

> **_NOTE:_** The file passed to the `--compose-file` flag must be one located at the `prod` directory so that the composed stack file can find the env files (`env.d`).

### Addons

Additional configuration can be done by using some definition files located at `addons` directory. The available ones are described below:

- EBS (`ebs.yml`): creates a bind between services volume and AWS [EBS](https://aws.amazon.com/pt/ebs/) volumes.
- TLS (`tls.yml`): enables `storage` and `babeltower` to receive HTTPS requests.
- Connector (`connector.yml` and `connector.dev.yml`): adds the [knot-fog-connector](https://github.com/CESARBR/knot-fog-connector) service to the stack.

Example:

```bash
docker stack deploy --compose-file prod/traefik.yml --compose-file base/base.yml --compose-file addons/connector.yml knot-cloud-core
```

The addons can be deployed separetely if the stack is already running:

```bash
docker stack deploy --compose-file addons/connector.yml knot-cloud-core
```

### Verify

Check if all the services are running and have exactly one replica:

```bash
docker stack services knot-cloud-core
```

And verifying that every service has one replica.
