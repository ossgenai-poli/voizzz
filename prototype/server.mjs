import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const port=Number(process.env.PORT || 4317);
const files=new Map([
 ['/', ['index.html','text/html; charset=utf-8']],
 ['/index.html', ['index.html','text/html; charset=utf-8']],
 ['/app.js', ['app.js','text/javascript; charset=utf-8']]
]);
export const server=http.createServer(async(req,res)=>{
 let pathname;
 try { pathname=new URL(req.url,'http://127.0.0.1').pathname; }
 catch { res.writeHead(400);res.end('Invalid request path');return; }
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 const file=files.get(pathname);
 if(!file){res.writeHead(404);res.end('Not found');return;}
 try{
  const data=await readFile(new URL(file[0],import.meta.url));
  res.writeHead(200,{'Content-Type':file[1],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'none'; img-src 'self' data:; frame-ancestors 'self'; base-uri 'none'; form-action 'none'"});
  res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(500);res.end('Prototype file unavailable');}
});
if(process.argv[1]===fileURLToPath(import.meta.url)){
 server.on('error',err=>{console.error(`Preview could not start: ${err.message}`);process.exitCode=1;});
 server.listen(port,'127.0.0.1',()=>console.log(`voizzz prototype: http://127.0.0.1:${server.address().port}/`));
}

