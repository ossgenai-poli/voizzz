import {readFile,mkdir,copyFile} from 'node:fs/promises';
import {Script} from 'node:vm';
const script=await readFile(new URL('app.js',import.meta.url),'utf8');
new Script(script,{filename:'app.js'});
const out=new URL('../dist/',import.meta.url);
await mkdir(out,{recursive:true});
for(const file of ['index.html','app.js'])await copyFile(new URL(file,import.meta.url),new URL(file,out));
console.log('Static prototype built. No calls, integrations, or deployment.');

