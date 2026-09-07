const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const http=require('node:http');
const path=require('node:path');

test('preview serves only prototype assets, not repository or credentials',async t=>{
 const {server}=await import('../server.mjs');
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const base=`http://127.0.0.1:${server.address().port}`;
 const page=await fetch(base+'/');assert.equal(page.status,200);
 assert.match(page.headers.get('content-security-policy'),/connect-src 'none'/);
 assert.equal((await fetch(base+'/app.js')).status,200);
 for(const p of ['/.git/config','/README.md','/.env','/server.mjs','/../package.json']){
  assert.equal((await fetch(base+p)).status,404,p);
 }
 assert.equal((await fetch(base+'/',{method:'POST',body:'anything'})).status,405);
});
test('malformed request returns 400 and preview stays alive',async t=>{
 const child=spawn(process.execPath,['prototype/server.mjs'],{cwd:path.join(__dirname,'../..'),env:{...process.env,PORT:'0'},stdio:['ignore','pipe','pipe']});
 t.after(()=>child.kill());child.stderr.resume();
 const port=await new Promise((resolve,reject)=>{
  child.once('error',reject);child.stdout.once('data',data=>{const m=data.toString().match(/:(\d+)\//);m?resolve(Number(m[1])):reject(new Error('No preview URL'));});
 });
 const status=await new Promise(resolve=>{
  const req=http.get({hostname:'127.0.0.1',port,path:'//['},res=>{res.resume();resolve(res.statusCode);});
  req.on('error',()=>resolve(0));req.setTimeout(2000,()=>{req.destroy();resolve(0);});
 });
 assert.equal(status,400);
 assert.equal((await fetch(`http://127.0.0.1:${port}/`)).status,200);
});

