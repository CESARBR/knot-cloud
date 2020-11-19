# [4.0.0](https://github.com/CESARBR/knot-cloud/compare/v3.0.0...v4.0.0)

### Features

- Add type parameter to create token command
- Bump Mainflux services to v0.11.0
- Add update config
- Remove legacy Meshblu stack
- Add demonstration record to documentation

### Bug Fixes

- Add jaeger dependency on authn service
- Improve stack usage instructions

# [3.0.0](https://github.com/CESARBR/knot-cloud/compare/v2.1.0...v3.0.0)

### Features

- Bump @cesarbr/knot-cloud-sdk-js to v3.0.0

# [2.1.0](https://github.com/CESARBR/knot-cloud/compare/v2.0.0...v2.1.0)

### Features

- Improve KNoT Cloud core stack modularity
- Add `--no-clone` option to avoid cloning the repositories when workspace is already prepared
- Show token when user is created

# [2.0.0](https://github.com/CESARBR/knot-cloud/compare/v1.4.0...v2.0.0)

### Features

- Update CLI operations to use `@cesarbr/knot-cloud-sdk-js` with AMQP support
- Add KNoT Cloud core (Mainflux version) specification
- Update traefik version to v2.2

### Bug Fixes

- Fix `init` command when copying stack files
- Fix `init` command when path isn't passed
- Fix storage listing on wrong port
- Fix wrong webhook port configuration

# [1.4.0](https://github.com/CESARBR/knot-cloud/compare/v1.3.0...v1.4.0)

### Features

- Add CLI commands to operate on the cloud:
  - Create thing
  - Create gateway
  - List devices
  - Set data
  - Get data
  - Publish data
  - Listen data
  - Update schema
  - Create session token
  - Delete device

### Bug Fixes

- Update packages to fix vulnerability issues
- Fix traefik version in v1.7

# [1.3.0 / KNOT-v02.00](https://github.com/CESARBR/knot-cloud/compare/v1.2.0...v1.3.0)

### Features

- Provide multinode and all-in-one production stacks

### Bug Fixes

- Copy stack files when `knot-cloud init` command is executed
- Update packages to fix vulnerability issues

# [1.2.0 / KNOT-v01.04-rc03](https://github.com/CESARBR/knot-cloud/compare/v1.1.0...v1.2.0)

### Features

- Add development stack and helper tool
- Improve instructions about DNS setup

# [1.1.0](https://github.com/CESARBR/knot-cloud/compare/v1.0.0...v1.1.0)

### Features

- Add storage service
- Add support to AWS SES mail provider via [authenticator v1.3.0](https://github.com/CESARBR/knot-cloud-authenticator/releases/tag/v1.3.0)

### Bug Fixes

- Fix README layout
- Fix tear down instructions
- Fix bootstrap instructions regarding HTTPS

# [1.0.0 / KNOT-v01.04-rc02](https://github.com/CESARBR/knot-cloud/compare/bcf7bec...v1.0.0) (2019-03-12)

### Features

- Initial Docker stack YAML
- Services:
  - Meshblu core
  - WebSocket protocol adapter
  - Bootstrap
  - Authenticator
  - Configuration UI
