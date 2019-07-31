#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from 'yargs';

yargs // eslint-disable-line no-unused-expressions
  .commandDir('cmds/stack')
  .commandDir('cmds/cloud')
  .demandCommand()
  .strict()
  .alias('h', 'help')
  .help()
  .argv;
