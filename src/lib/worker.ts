import path from "path";

export interface WorkerHandler {
    active: boolean;
    stop(callback: () => void): void;
}

interface CmdOptions {
    env: 'production' | 'development';
    debug: boolean;
    serviceRoot?: string;
}
const worker = (cmd: CmdOptions): WorkerHandler => {
    const env = cmd.env
    const debug = cmd.debug
    const serviceRoot = cmd.serviceRoot || (require.main ? path.dirname(require.main.filename) : __dirname)
    const conf = {}
    // const conf = _.merge(
    //     {},
    //     getJSONConf(env, null, `${serviceRoot}/config/config.json`)
    // )
    const workerFile = path.join(serviceRoot, '/workers/worker.js')

    const ctx = {
        root: serviceRoot,
        env: env,
        worker: workerFile
    }

    const HandlerClass = require(workerFile)
    const hnd = new HandlerClass(conf, ctx)

    return hnd
};
export default worker;
