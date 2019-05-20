# knot-cloud

KNoT Cloud Docker stack.

Stacks for development and production are provided in order to assist the user needs. Regardless of running in production or development, check the [local deployment considerations](#local-deployment-considerations) if it applies to your scenario.

## Local deployment considerations

This stack uses [Traefik](https://traefik.io) as a reverse proxy for the services in the stack. If you are running this stack locally, might want to configure a test domain in your machine before proceeding.

You can setup a local DNS server using [bind9](https://wiki.debian.org/Bind9) or similar. Alternatively, you can update your hosts file to include the following addresses:

```
127.0.0.1	www
127.0.0.1	ws
127.0.0.1	auth
127.0.0.1	bootstrap
```

On Windows, the hosts file is usually located under `c:\Windows\System32\Drivers\etc\hosts`. On Unix systems, it is commonly found at `/etc/hosts`. Regardless of you operating system, administrator or super user privileges will be required.

Notice that when deploying KNoT Cloud locally, most of the times the `<your-domain>` subdomains in the following sections should be disregarded. For instance, you would access your KNoT Cloud at `https://www` after deploy.

## Install KNoT Cloud

The provided stacks and CLI are contained in this repository and not yet published in any package manager. To complete this tutorial, it is necessary that you clone the repository or download the `.zip` containing all the files.

```
$ git clone https://github.com/CESARBR/knot-cloud.git
```

The following instructions always assume you are in the directory created after cloning the repository. If you downloaded the `.zip`, navigate to the appropriate folder.

If you are running in production mode, go ahead to [configure and deploy your stack](#stage-1).
For development, a command line interface (CLI) is provided to properly configure the environment necessary.

## Create development environment

The knot-cloud CLI clone all the necessary KNoT repositories and create the files used by docker stack.

### Install CLI tool

```bash
$ npm install
$ npm run build
$ npm link
```

Depending on npm configurations, it might be necessary to run `npm link` with super user privileges.

```bash
$ sudo npm link
```

### Run
Define the `<path>` where the stack should be created. Defaults to current directory.
```
knot-cloud init [path]
```

Now you can proceed to configure the necessary files to run KNoT Cloud, they will be under `<path>/stack`.

## Stage 1

If you are running in production mode, your environment variables files wil be under `stacks/prod/env.d`. For development, they are under `<path>/stack/env.d`.

### Configure

Create, if you already don't have, a private/public key pair:

```
openssl genpkey -algorithm RSA -out privateKey.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in privateKey.pem -out publicKey.pem
```

Then, convert the keys to base 64:

```
base64 < privateKey.pem
base64 < publicKey.pem
```

And generate a 16-bit random value in hexadecimal format:

```
openssl rand -hex 16
```

Finally, set `TOKEN`, `PRIVATE_KEY_BASE64` and `PUBLIC_KEY_BASE64` to the values above in:
- `meshblu-core-dispatcher.env`
- `meshblu-core-worker-webhook.env`
- `knot-cloud-storage.env`

### Deploy

Deploy the stage 1 services:

```
docker stack deploy -c stage-1.yml knot-cloud
```

## Stage 2

### Bootstrap

#### Deploy

Deploy the stage 2 bootstrap services:

```
docker stack deploy -c stage-2-bootstrap.yml knot-cloud
```

Wait until the bootstrap service is responsive, when the following command should succeed:

```
curl https://bootstrap.<your domain>/healthcheck
```

**Note:** If the HTTPS certificates are not configured locally, traefik has a default certificate that is used in such cases. To use traefik's default certificate, it is necessary to add `-k` parameter to the `curl` command otherwise the request will fail.

#### Execute

Once the services are started, run the bootstrap process:

```
curl -X POST https://bootstrap.<your domain>/bootstrap
```

Save the output for the next steps.

**Note:** If the HTTPS certificates are not configured locally, traefik has a default certificate that is used in such cases. To use traefik's default certificate, it is necessary to add `-k` parameter to the `curl` command otherwise the request will fail.

#### Tear down

List the stack services:

```
docker stack services knot-cloud
```

Remove the bootstrap service (get the name from the list above):

```
docker service rm <bootstrap-service-name>
```

### Configure

Get the authenticator's UUID and token from the bootstrap output and set `AUTHENTICATOR_UUID` and `AUTHENTICATOR_TOKEN` variables in `knot-cloud-authenticator.env`.

#### Configure mail service
KNoT Cloud supports several mail services and is built in such a modular fashion that it is rather trivial to include a new one. Deploying KNoT Cloud without a mail service is also allowed, although not recommended other than for testing purposes.
The supported mail services and related environment variables are:
- Disable mail service
    ```
    MAIL_SERVICE=NONE
    ```
- Mailgun
    ```
    MAIL_SERVICE=MAILGUN
    MAILGUN_DOMAIN=<your_mailgun_domain>
    MAILGUN_API_KEY=<you_mailgun_api_key>
    ```
    Where `MAILGUN_DOMAIN` and `MAILGUN_API_KEY` are your [Mailgun](https://mailgun.com)'s account domain and API key.
- AWS SES
    ```
    MAIL_SERVICE=AWS-SES
    AWS_REGION=<aws_user_region>
    AWS_ACCESS_KEY_ID=<aws_user_acess_key_id>
    AWS_SECRET_ACCESS_KEY=<aws_user_secret_acess_key>
    ```
    Where `AWS_REGION`, `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are your [Amazon Web Services](https://aws.amazon.com/)' account information.
    **If you are running KNoT Cloud on AWS EC2 that is using [roles to grant permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html), it is not necessary to set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. The role attached to the EC2 instance must include a policy that allows `ses:SendEmail` actions at least on the domain used to send the reset e-mail (see `RESET_SENDER_ADDRESS` below).**
    For more information on AWS SES policies, refer to their [documentation](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/control-user-access.html).

#### Configure reset address

Set `RESET_SENDER_ADDRESS` with the e-mail address that will send the reset password e-mails.
If this stack is being deployed on an accessible domain, replaced `RESET_URI` with **http://&lt;your-domain&gt;/reset**. This is the reset password address that is going to be sent by e-mail.

This is a **required** option, but you could fill using a bogus e-mail address if it will not be used or you have set the mail service to `NONE`.

### Deploy

Deploy the stage 2 services

```
docker stack deploy -c stage-2.yml knot-cloud
```
### Access

Access KNoT Cloud in your browser at `https://www.<your-domain>`.