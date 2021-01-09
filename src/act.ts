import { Root } from './models/root';

let root = Root.findBy('/rootPath');
console.log(root);

let newRoot = Root.create('/newRootPath');
console.log(newRoot);
