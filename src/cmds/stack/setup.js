/* eslint-disable no-console */
import gitClone from 'git-clone';
import fs from 'fs-extra';
import path from 'path';
import yargs from 'yargs';

const KNOT_CLOUD_REPOSITORIES = [
  'CESARBR/knot-cloud-ui',
  'CESARBR/knot-cloud-protocol-adapter-websocket',
  'CESARBR/knot-cloud-authenticator',
  'CESARBR/knot-cloud-storage',
  'CESARBR/knot-cloud-bootstrap',
];

const KNOT_CLOUD_CORE_REPOSITORIES = [
  'CESARBR/knot-babeltower',
  'CESARBR/knot-cloud-storage',
  'CESARBR/knot-fog-connector',
];

const KNOT_ERR_FILE = 'knot.err';
const KNOT_ERR_DIR = path.join(process.env.HOME, '.knot', 'logs');
const KNOT_ERR_PATH = path.join(KNOT_ERR_DIR, KNOT_ERR_FILE);

const logFileMessageRepository = `
        This is mostly caused when the repository is already installed
        on the destination directory or if there is a connection problem.
        Check ${KNOT_ERR_PATH} for more details about the issue\n`;

const logFileMessageCopyStack = `
        This is mostly associated with write permissions on the destination
        directory, check ${KNOT_ERR_PATH} for details on the issue.\n`;

function handleError(err, msg, logFileMessage) {
  console.error(msg, logFileMessage);
  fs.ensureDirSync(KNOT_ERR_DIR);
  fs.writeFileSync(KNOT_ERR_PATH, `${msg}\n`, { flag: 'a', encoding: 'utf-8' });
  fs.writeFileSync(KNOT_ERR_PATH, `${err.stack}\n`, { flag: 'a', encoding: 'utf-8' });
}

const cpDevDir = (basePath, version) => {
  const stackDir = path.join(basePath, 'stack');

  try {
    if (fs.existsSync(stackDir)) {
      fs.removeSync(stackDir);
    }
    fs.ensureDirSync(stackDir);
    fs.copySync(`${__dirname}/../../stacks/${version}/dev`, stackDir);
    if (version === 'core') {
      fs.copySync(`${__dirname}/../../stacks/${version}/base`, stackDir);
      fs.copyFileSync(`${__dirname}/../../stacks/${version}/addons/connector.dev.yml`, `${stackDir}/connector.yml`);
    }
    console.log('Created development stack files');
  } catch (err) {
    const msg = '[Error]:\n\tAn error occurred while copying the development stack files.';
    handleError(err, msg, logFileMessageCopyStack);
  }
};

const cloneRepositories = (initPath, repositories) => {
  repositories.forEach((fullRepo) => {
    const [repo, branch] = fullRepo.split(':');
    const repoName = repo.split('/')[1];
    const repoPath = path.join(initPath, repoName);
    console.log(`Cloning: ${repoName}`);
    gitClone(
      `http://github.com/${repo}`,
      repoPath,
      { checkout: branch },
      (err) => {
        if (err) {
          const msg = `[Error]:\n\tAn error occured while cloning repository ${repoName}`;
          handleError(err, msg, logFileMessageRepository);
          return;
        }
        console.log(`Cloned: ${repoName}`);
      },
    );
  });
};

const initStack = (args) => {
  const initPath = args.path || '';
  const version = args.cloudVersion || 'cloud';

  if (fs.existsSync(KNOT_ERR_PATH)) {
    fs.unlinkSync(KNOT_ERR_PATH);
  }

  if (version === 'cloud') {
    cloneRepositories(initPath, KNOT_CLOUD_REPOSITORIES);
  } else if (version === 'core') {
    cloneRepositories(initPath, KNOT_CLOUD_CORE_REPOSITORIES);
  } else {
    console.log('Invalid cloud version selected. Please type \'cloud\' or \'core\'');
    return;
  }

  cpDevDir(initPath, version);
};

yargs // eslint-disable-line import/no-extraneous-dependencies
  .command({
    command: 'init [cloudVersion] [path]',
    desc: 'Initialize [cloudVersion] stack at [path]',
    handler: (args) => {
      initStack(args);
    },
  });

export default initStack;
