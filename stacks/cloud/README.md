# knot-cloud

## TL;DR

The following demonstration video shows how to **deploy stack as a fog instance** and create an user token:

[![asciicast](https://asciinema.org/a/rRFW94ntKJ9J36IRRWKk0Bcs5.svg)](https://asciinema.org/a/rRFW94ntKJ9J36IRRWKk0Bcs5)

>_**NOTE**: Just FYI, in this video, the [Configure DNS](#configure-DNS) was skipped._

## Configure DNS

This stack uses [Traefik](https://traefik.io) as a reverse proxy for the services and requires that you configure your DNS server to point, at least, the **api** and **storage** subdomains to the machine where the stack is being deployed, so that it can route the requests to the appropriated service. It is possible to configure it to route by path or port, but instructions for that won't be provided here for brevity.

If you don't have a domain or can't configure the main DNS server, you can configure a test domain in your machine before proceeding. Either setup a local DNS server, e.g. [bind9](https://wiki.debian.org/Bind9), or alternatively update your hosts file to include the following addresses:

```
127.0.0.1   api.fog
127.0.0.1   storage.fog
```

On Windows, the hosts file is usually located under `c:\Windows\System32\Drivers\etc\hosts`. On Unix systems, it is commonly found at `/etc/hosts`. Regardless of you operating system, administrator or super user privileges will be required.

## Deploy

The stack uses multiple compose files to setup the services and reach the desired state. Common definitions to both development and production settings are grouped in the `base` directory and specific ones are grouped in the `dev` and `prod` directories. For example, when configuring `traefik` as service's load balancer, you can deploy its development definition to avoid exposing services without need. Also, it can be necessary to deploy the services into multiple machines, which could be done by using the `multi-node` definitions.

Furthermore, when deploying the stack, you have the following options:

- **(1)** Deploy stack as a **fog** instance and connecting to another, remote, _cloud_ instance;
- **(2)** Deploy stack as a **cloud** instance;
- **(3)** Deploy stack as both a **cloud** and **fog** instance.

When following the instructions from here and on, you will **(1) deploy stack as a fog instance and connecting to another, remote, _cloud_ instance** (in this guide we will use KNoT's testing instance, located in a remote cloud provider server). If you're weary, and want to check if KNoT's cloud instance is up and running before following continuing, just run the command below. If your output is the same, you may go on and follow **every** step in the [Development section](#development):

```bash
$ curl https://api.knot.cloud/healthcheck
{"status":"online"}
```

If the command above does not return the expected output, it likely means the KNoT Cloud testing instance if offline. In this case, please reach out to us in our [Slack Workspace](https://join.slack.com/t/knot-iot/shared_invite/zt-8tgbqqon-WUZ_54_A~i~zle~JBk20Kg)._

>_**Why would I deploy stack as a fog instance and connecting to another, remote, cloud instance?** A few reasons are: this is your first time using KNoT Cloud and you don't want to deploy your own cloud instance yet, you already have a fog instance and want to connect it to a remote cloud instance of your own (in this case, simply replace `api.knot.cloud` for `<your-cloud-instance-hostname>`, in the steps below), or event to test if your application works with the most recent stable KNoT Cloud version._

In case you want to **(2) deploy stack as a cloud instance**, go on to the [Development section](#development) and follow **only** the [Deploy basic services](#deploy-basic-services) and [Create a user in the fog](#create-a-user-in-the-fog) steps; however, you will need to rename every occurrence of `*.fog` to `*.cloud` (e.g.: `api.fog` to `api.cloud`).

>_**Why would I deploy stack as a cloud instance?** So that you have your own KNoT Cloud instance running! This is particularly useful because we may, at any time, bump the KNoT Cloud version (even if it's a [major version](https://semver.org/#spec-item-8)). Having your own KNoT Cloud instance running enables you to not only have a fine-grained control over KNoT Cloud version, but also to debug your application more easily (checking KNoT Cloud logs, configuration management, etc)._

At last, there are a few ways to **(3) deploy stack as both a cloud and fog instance**. For the sake of simplicity, we will:

- Follow the steps in [Deploy basic services](#deploy-basic-services) **twice**.
  - The first time, deploy using the exact command in the section.
  - The second time, you will:
    - Open `traefik.yml`;
    - Replace all occurrences of `5672` and `15672` by `5673` and `15673`, respectively (this ensures each stack will successfully deploy their RabbitMQ brokers without port conflicts);
    - Replace `knot-cloud` by `knot-cloud_fog`, in the _docker stack deploy_ command.
- Follow the instructions in [CESARBR/knot-fog-connector](https://github.com/CESARBR/knot-fog-connector) to **clone** the repository, **configure** (the `cloud` and `fog` ports to `5672` and `5673`, respectively), and **run** the connector (not to be confused with the steps in [Deploy connector](#deploy-connector), you can **skip this section**).
- Follow the steps above, in **(2) deploy stack as a cloud instance**, to create a user in the **cloud** stack.
- Finally, [create a user in the fog](#create-a-user-in-the-fog).

>_**Why would I deploy stack as a cloud instance?** If you're new to KNoT, you probably don't! This option is mostly for local end-to-end tests, deep debugging, etc._

### Development

After using the `init` command as described [here](../../README.md#Development), the stack files will be copied to `<path>/stack` directory (`path` is the folder specified in the `knot-cloud init <path>` command). Change your current working directory to that folder:

```bash
$ cd <path>/stack
$ ls
base.yml
connector.yml
dev.yml
env.d
traefik.yml
```

#### Deploy basic services

Before deploying the stack, keep in mind that, as stated in the previous section, explicitly following the commands below means this stack will be deployed (locally, in your machine) as a KNoT **fog** instance and connect to KNoT's testing **cloud** instance (remote, in a cloud provider).

To deploy the **development** stack with basic services (related to the `thing`, `user` and `messaging capabilities`) and [Traefik](https://traefik.io) reverse proxy and load balancer, use the following command:

```bash
$ docker stack deploy --compose-file base.yml --compose-file dev.yml --compose-file traefik.yml knot-cloud
```

>_**NOTE**: To verify if the services were deployed correctly, check the [Verify section](#verify)._

#### Create a user in the cloud

In order to **create a new user** account in the **cloud**, just run save the command below (make sure to save the output):

```bash
# create a new user in the cloud
$ knot-cloud create-user <email> <password> --server api.knot.cloud --protocol https
user successfully created
{
  "token": "<user-token>"
}
```

The output from the previous command is a `user token`, and it expires in eight hours. To create a token that never expires, you must create an `app token`. An app token must be created with the same `email` as before and with the `user token` (output from the previous command):

```bash
# create an app token for the recently created user
$ knot-cloud create-token <email> <user-token> app --server api.knot.cloud --protocol https
token successfully created:
<app-token>
```

#### Create a user in the fog

To **create a new user** account in the **fog**. simply repeat the previous commands with the same `email` and `password`, except that this time we will use the `--server api.fog` and `--protocol http` options (as before, make sure to save the output):

```bash
# create a new user in the fog
$ knot-cloud create-user <email> <password> --server api.fog --protocol http
user successfully created
{
  "token": "<user-token>"
}

# create an app token for the recently created user
$ knot-cloud create-token <email> <user-token> app --server api.fog --protocol http --port 80
token successfully created:
<app-token>
```

#### Deploy connector

First, update the connector configuration in .`/env.d/knot-connector.env`:

- Add the **cloud** user's token to the `CLOUD_SETTINGS` variable object by changing the `token` property.
- Add the **fog** user's token to the `FOG_USER_TOKEN` variable.

Then, deploy connector to the `knot-cloud` stack:

```bash
$ docker stack deploy --compose-file connector.yml knot-cloud
```

>_**NOTE**: To verify if the connector addon was deployed correctly, check the [Verify section](#verify)._

After you verify that the connector was deployed successfully, change you current working directory to `path/knot-fog-connector` (`path` is the folder specified in the `knot-cloud init <path>` command) and install its dependencies:

```bash
cd <path>/knot-fog-connector
npm install
```

### Production

Firstly, create a new secret to the authentication service.

```bash
openssl rand -base64 256
```

With the generated string, update the `MF_AUTHN_SECRET` environment variable in the `/env.d/mainflux-authn.env` file.

The deployment to production can be done without switching to another directory. It can be done as follows:

```bash
docker stack deploy --compose-file prod/traefik.yml --compose-file base/base.yml knot-cloud
```

>_**NOTE**: The file passed to the `--compose-file` flag must be one located at the `prod` directory so that the composed stack file can find the env files (`env.d`)._

### Addons

Additional configuration can be done by using some definition files located at `addons` directory. The available ones are described below:

- EBS (`ebs.yml`): creates a bind between services volume and AWS [EBS](https://aws.amazon.com/pt/ebs/) volumes.
- TLS (`tls.yml`): enables `storage` and `babeltower` to receive HTTPS requests.
- Connector (`connector.yml` and `connector.dev.yml`): adds the [knot-fog-connector](https://github.com/CESARBR/knot-fog-connector) service to the stack.

Example:

```bash
docker stack deploy --compose-file prod/traefik.yml --compose-file base/base.yml --compose-file addons/connector.yml knot-cloud
```

The addons can be deployed separately if the stack is already running:

```bash
docker stack deploy --compose-file addons/connector.yml knot-cloud
```

## Verify

Check if all the services are running and have exactly **one** replica (`REPLICAS` should be `1/1`):

```bash
$ docker stack services knot-cloud
ID             NAME                      MODE         REPLICAS   IMAGE                            PORTS
jpfcfoxy2ai0   knot-cloud_authn          replicated   1/1        mainflux/authn:0.11.0
2kmk91eo5ci0   knot-cloud_authn-db       replicated   1/1        postgres:9.6.17-alpine
71bc2h6wlo6d   knot-cloud_babeltower     replicated   1/1        cesarbr/knot-babeltower:dev
kh88ixwx6qfl   knot-cloud_es-redis       replicated   1/1        redis:5.0-alpine
678qbux3ypds   knot-cloud_jaeger         replicated   1/1        jaegertracing/all-in-one:1.13
izv1kubxkd50   knot-cloud_mongo          replicated   1/1        mongo:latest
opwus54g0qto   knot-cloud_rabbitmq       replicated   1/1        rabbitmq:management
stnytg2w9mow   knot-cloud_storage        replicated   1/1        cesarbr/knot-cloud-storage:dev
qdcxskqxv0me   knot-cloud_things         replicated   1/1        mainflux/things:0.11.0
ncbpfjxikeui   knot-cloud_things-db      replicated   1/1        postgres:9.6.17-alpine
l23bp63sg7t1   knot-cloud_things-redis   replicated   1/1        redis:5.0-alpine
2zkg8mdml0tq   knot-cloud_traefik        global       1/1        traefik:v2.2                     *:80->80/tcp, *:5672->5672/tcp, *:15672->15672/tcp
rriidv7spwko   knot-cloud_users          replicated   1/1        mainflux/users:0.11.0
mqpk1hy7vs31   knot-cloud_users-db       replicated   1/1        postgres:9.6.17-alpine
```

>_**NOTE**: If a service has `REPLICAS` as `0/1`, check the command below to see that service's log. If there is no log, in some cases, you might need to use `docker pull <IMAGE>` explicitly for that image (e.g.: `$ docker pull jaegertracing/all-in-one:1.13`). However, you should only pull images who name does not start with `cesarbr/` (these images are built directly from the local knot-cloud repositories cloned during the `knot-cloud init <path>` command). If this does not resolve the issue, or a `cesarbr/` image service is not being deployed correctly, please send us your logs via our [Slack Workspace](https://join.slack.com/t/knot-iot/shared_invite/zt-8tgbqqon-WUZ_54_A~i~zle~JBk20Kg)._

In addition, run the following command to verify an individual service logs.

```bash
docker service logs -f <service_name>
```

Example:

```bash
docker service logs -f knot-cloud_connector
```
