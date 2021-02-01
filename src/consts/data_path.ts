import * as path from 'path';

// serverRoootDirectory（<=>clientRootDirectory）の可能性
const rootDirectory = path.join(__dirname, "../..")

export const PROGECT_DATA_PATH = path.join(rootDirectory, "data/progect_data.json");