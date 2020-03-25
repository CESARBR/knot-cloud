# knot-cloud-core

### Configure DNS

This stack uses [Traefik](https://traefik.io) as a reverse proxy for the services and requires that you configure your DNS server to point, at least, the **things**, **users** and **bt** subdomains to the machine where the stack is being deployed, so that it can route the requests to the appropriated service. It is possible to configure it to route by path or port, but instructions for that won't be provided here for brevity.

If you don't have a domain or can't configure the main DNS server, you can configure a test domain in your machine before proceeding. Either setup a local DNS server, e.g. [bind9](https://wiki.debian.org/Bind9), or alternatively update your hosts file to include the following addresses:

```
127.0.0.1   things
127.0.0.1   users
127.0.0.1   bt
```

On Windows, the hosts file is usually located under `c:\Windows\System32\Drivers\etc\hosts`. On Unix systems, it is commonly found at `/etc/hosts`. Regardless of you operating system, administrator or super user privileges will be required.

### Deploy: stage 1

Stage 1 contains the core services. The next sections provide the instructions to configure and deploy them. Whenever a configuration file is mentioned, it refers to a file found at `stack/env.d`.

#### Deploy

Deploy the stage 1 services:

```bash
docker stack deploy -c stage-1.yml knot-cloud-core
```

#### Verify

Check if all the services are running and have exactly one replica:

```bash
docker stack services knot-cloud-core
```

And verifying that every service has one replica.
