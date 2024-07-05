'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import worker, { WorkerHandler } from './lib/worker';

interface CmdOptions {
  env: 'production' | 'development';
  debug: boolean;
}

const cmd = yargs(hideBin(process.argv))
  .option('env', {
    choices: ['production', 'development'],
    demandOption: true,
    type: 'string'
  })
  .option('debug', {
    default: false,
    type: 'boolean'
  })
  .help('help')
  .argv as CmdOptions;

const hnd: WorkerHandler = worker(cmd);

let shutdown = 0;
process.on('SIGINT', () => {
  if (shutdown) {
    return;
  }
  shutdown = 1;

  if (!hnd.active) {
    return;
  }
  console.log('BKW', process.title, 'shutting down');
  hnd.stop(() => {
    process.exit();
  });
});

export = hnd;
