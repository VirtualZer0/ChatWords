import GenWorker from "worker-loader!../workers/gen.worker.ts";

const genWorker = new GenWorker();

export default genWorker;