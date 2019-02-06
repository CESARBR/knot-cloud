# knot-cloud

KNoT Cloud Docker stack.

## Stage 1

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
- `./env.d/meshblu-core-dispatcher.env`
- `./env.d/meshblu-core-worker-webhook.env`

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
curl http://localhost/healthcheck
```

#### Execute

Once the services are started, run the bootstrap process:

```
curl -X POST http://localhost/bootstrap
```

Save the output for the next steps.

#### Tear down

List the stack services:

```
docker stack services knot-cloud
```

Remove the bootstrap service (get the name from the list above):

```
docker services rm <bootstrap-service-name>
```

### Configure

Get the authenticator's UUID and token from the bootstrap output and set `AUTHENTICATOR_UUID` and `AUTHENTICATOR_TOKEN` variables in `./env.d/knot-cloud-authenticator.env`.

Set `MAILGUN_DOMAIN` and `MAILGUN_API_KEY` with the your [Mailgun](https://mailgun.com)'s account domain and API key.

Set `RESET_SENDER_ADDRESS` with the e-mail address that will send the reset password e-mails.

If this stack is being deployed on an accessible domain, replaced `RESET_URI` with **http://&lt;your-domain&gt;/reset**. This is the reset password address that is going to be sent by e-mail.

### Deploy

Deploy the stage 2 services

```
docker stack deploy -c stage-2.yml knot-cloud
```
