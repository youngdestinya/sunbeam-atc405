import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const demo = process.env.DEMO_MODE === 'true' || (process.env.NODE_ENV !== 'production' && process.env.DEMO_MODE !== 'false');
if (!demo && (!process.env.FIELD_PASSWORD || !process.env.REVIEW_PASSWORD || [process.env.FIELD_PASSWORD, process.env.REVIEW_PASSWORD].some(p => p.length < 16 || p.startsWith('replace-')))) throw Error('Set distinct FIELD_PASSWORD and REVIEW_PASSWORD of at least 16 characters.');
if (!demo && process.env.FIELD_PASSWORD === process.env.REVIEW_PASSWORD) throw Error('Role passwords must be distinct.');
const origin = process.env.APP_ORIGIN || `http://localhost:${port}`;
const secure = process.env.SECURE_COOKIE === 'true' || origin.startsWith('https:');
const dataDir = process.env.DATA_DIR || path.join(root, 'data');
mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, 'sunbeam.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS visits(id TEXT PRIMARY KEY, feeder INTEGER, zone TEXT, issue TEXT, evidence TEXT, priority TEXT, status TEXT); CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY AUTOINCREMENT, visit TEXT, actor TEXT, finding TEXT, note TEXT, created TEXT); CREATE TABLE IF NOT EXISTS appeals(id INTEGER PRIMARY KEY AUTOINCREMENT, customer TEXT, actor TEXT, reason TEXT, status TEXT, decision TEXT, created TEXT); CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT, actor TEXT, action TEXT, target TEXT, created TEXT);`);
if (!db.prepare('SELECT count(*) AS n FROM visits').get().n) {
  const insert = db.prepare('INSERT INTO visits VALUES(?,?,?,?,?,?,?)');
  [['SB-101',1,'Abeokuta Central','Mapping mismatch','Meter and account feeder codes disagree.','High','To visit'],['SB-102',1,'Abeokuta Central','Consumption anomaly','Recorded consumption fell 42% against the previous period.','High','To visit'],['SB-103',1,'Abeokuta Central','Estimated bill query','No reading exists; billing evidence requires review.','Review','To visit'],['SB-104',1,'Abeokuta Central','Meter inspection','Repeated zero readings; verify supply before attributing loss.','Medium','To visit'],['SB-105',1,'Abeokuta Central','Account verification','Check the recorded meter reference against field evidence.','Medium','To visit'],['SB-106',1,'Abeokuta Central','Delayed reading','Late telemetry; do not infer tampering from missing data.','Review','To visit'],['SB-208',2,'Other assignment','Mapping mismatch','Restricted fixture for authorization tests.','High','To visit']].forEach(r => insert.run(...r));
}
const users = new Map([['field', { role:'field', name:'Field revenue officer', password:process.env.FIELD_PASSWORD || 'SunbeamField!2026' }],['reviewer',{role:'reviewer',name:'Billing dispute officer',password:process.env.REVIEW_PASSWORD || 'SunbeamReview!2026'}]].map(([id,u]) => { const salt=randomBytes(16); return [id,{...u,password:undefined,salt,hash:scryptSync(u.password,salt,32)}]; }));
const sessions = new Map(), attempts = new Map();
const now = () => new Date().toISOString();
const audit = (actor, action, target) => db.prepare('INSERT INTO audit(actor,action,target,created) VALUES(?,?,?,?)').run(actor,action,target,now());
function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));}
async function body(req){let s='';for await(const chunk of req){s+=chunk;if(s.length>12000)throw Error('Request too large');}return JSON.parse(s||'{}');}
function session(req){const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('sunbeam='))?.slice(8);const s=sessions.get(token);if(s && s.expires>Date.now())return {...s,token};sessions.delete(token);return null;}
const cookie=(token,age=28800)=>`sunbeam=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${secure?'; Secure':''}`;
const clean=(x,max=1000)=>typeof x==='string'?x.trim().slice(0,max):'';
const safeUser=s=>({id:s.id,role:s.role,name:s.name,feeder:1});
const trend=[{day:'26 Oct',supplied:36,billed:28},{day:'27 Oct',supplied:38,billed:29},{day:'28 Oct',supplied:35,billed:27},{day:'29 Oct',supplied:41,billed:31},{day:'30 Oct',supplied:39,billed:29},{day:'31 Oct',supplied:43,billed:33},{day:'01 Nov',supplied:40,billed:30}];
http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  try {
    const url=new URL(req.url,origin), p=url.pathname, method=req.method;
    if(p==='/healthz')return json(res,200,{status:'ok',database:db.prepare('SELECT 1 AS n').get().n===1});
    if(p==='/api/config' && method==='GET')return json(res,200,{demo,student:'AGL202607071',D:1});
    if(p.startsWith('/api/') && !['GET','HEAD'].includes(method)){
      if(req.headers.origin!==origin)return json(res,403,{error:'Request origin is not allowed.'});
      if(!(req.headers['content-type']||'').startsWith('application/json'))return json(res,415,{error:'JSON is required.'});
    }
    if(p==='/api/login' && method==='POST'){
      const key=req.socket.remoteAddress, a=attempts.get(key);
      if(a && a.until>Date.now() && a.n>=10)return json(res,429,{error:'Too many attempts. Try again in 15 minutes.'});
      const b=await body(req), id=clean(b.username,30), u=users.get(id); const candidate=scryptSync(clean(b.password,256),u?.salt||Buffer.alloc(16),32);
      if(!u || !timingSafeEqual(candidate,u.hash)){const entry=a?.until>Date.now()?a:{n:0,until:Date.now()+900000};entry.n++;attempts.set(key,entry);return json(res,401,{error:'Username or password is incorrect.'});}
      attempts.delete(key); const token=randomBytes(32).toString('hex');sessions.set(token,{id,role:u.role,name:u.name,expires:Date.now()+28800000});res.setHeader('Set-Cookie',cookie(token));audit(id,'sign-in','session');return json(res,200,{user:safeUser({id,...u})});
    }
    if(p.startsWith('/api/')){
      const s=session(req);if(!s)return json(res,401,{error:'Sign in to continue.'});
      if(p==='/api/logout' && method==='POST'){sessions.delete(s.token);res.setHeader('Set-Cookie',cookie('',0));return json(res,200,{ok:true});}
      if(p==='/api/state' && method==='GET')return json(res,200,{user:safeUser(s),snapshot:'2026-11-01T09:15:00+01:00',visits:db.prepare('SELECT * FROM visits WHERE feeder=1 ORDER BY id').all(),reports:db.prepare('SELECT r.* FROM reports r JOIN visits v ON v.id=r.visit WHERE v.feeder=1 ORDER BY r.id DESC').all(),appeals:db.prepare('SELECT * FROM appeals WHERE actor=? OR ?=\'reviewer\' ORDER BY id DESC').all(s.id,s.role),trend,outages:[{id:'EVT-001',feeder:1,eventAt:'2026-11-01T08:59:00+01:00',receivedAt:'2026-11-01T09:03:00+01:00',alertAt:'2026-11-01T09:04:00+01:00',status:'Awaiting controller verification',meters:8}],demo:true});
      const visitMatch=p.match(/^\/api\/visits\/([A-Z0-9-]+)\/report$/);
      if(visitMatch && method==='POST'){
        if(s.role!=='field')return json(res,403,{error:'Only the field officer can record visits.'});
        const v=db.prepare('SELECT * FROM visits WHERE id=? AND feeder=1').get(visitMatch[1]);if(!v)return json(res,404,{error:'Visit not found in your assigned feeder.'});
        const b=await body(req), note=clean(b.note), finding=clean(b.finding,80);if(note.length<10 || !['Mapping corrected','Inspection completed','No access','Escalate for review'].includes(finding))return json(res,400,{error:'Choose a finding and enter at least 10 characters of evidence.'});
        db.exec('BEGIN');try{db.prepare('INSERT INTO reports(visit,actor,finding,note,created) VALUES(?,?,?,?,?)').run(v.id,s.id,finding,note,now());db.prepare('UPDATE visits SET status=? WHERE id=?').run(finding==='No access'?'Revisit required':finding==='Escalate for review'?'Under review':'Completed',v.id);audit(s.id,'visit-report',v.id);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}return json(res,201,{ok:true});
      }
      if(p==='/api/appeals' && method==='POST'){
        if(s.role!=='field')return json(res,403,{error:'Only field officers submit customer appeals here.'});
        const b=await body(req), customer=clean(b.customer,30), reason=clean(b.reason);if(!db.prepare('SELECT id FROM visits WHERE id=? AND feeder=1').get(customer))return json(res,403,{error:'Customer is outside your assignment.'});if(reason.length<10)return json(res,400,{error:'Explain the appeal in at least 10 characters.'});
        const r=db.prepare('INSERT INTO appeals(customer,actor,reason,status,decision,created) VALUES(?,?,?,?,?,?)').run(customer,s.id,reason,'Pending human review','',now());audit(s.id,'appeal-created',String(r.lastInsertRowid));return json(res,201,{ok:true});
      }
      const appealMatch=p.match(/^\/api\/appeals\/(\d+)\/review$/);
      if(appealMatch && method==='POST'){
        if(s.role!=='reviewer')return json(res,403,{error:'A billing dispute officer must review this appeal.'});const b=await body(req), decision=clean(b.decision);if(decision.length<10)return json(res,400,{error:'Record a reasoned decision of at least 10 characters.'});if(!['Correction requested','More evidence required'].includes(b.status))return json(res,400,{error:'Select a supported review outcome.'});
        const a=db.prepare('SELECT * FROM appeals WHERE id=?').get(appealMatch[1]);if(!a)return json(res,404,{error:'Appeal not found.'});if(a.status!=='Pending human review')return json(res,409,{error:'This appeal has already been reviewed.'});db.prepare('UPDATE appeals SET status=?,decision=? WHERE id=?').run(b.status,decision,a.id);audit(s.id,'appeal-reviewed',String(a.id));return json(res,200,{ok:true});
      }
      if(p==='/api/audit' && method==='GET'){if(s.role!=='reviewer')return json(res,403,{error:'Reviewer access required.'});return json(res,200,db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT 100').all());}
      if(p==='/api/assistant' && method==='POST'){
        const b=await body(req), q=clean(b.question,300).toLowerCase();let answer='I can explain assigned feeders, outage timing, billing reviews, privacy and this deployment. This is a bounded help assistant, not a generative model.';
        if(/disconnect|punish|steal|thief|guilty/.test(q))answer='I cannot label a customer guilty or authorize disconnection. Record evidence and refer the case to a human billing dispute officer. Customers must have a route to challenge the decision.';
        else if(/bill|appeal|estimate/.test(q))answer='Estimated bills have no meter reading. Verify the applicable cap and its evidence with the billing team. Open a customer appeal for human review. No numeric regulatory cap is configured in this demonstration.';
        else if(/outage|minute/.test(q))answer='The synthetic example shows event 08:59, receipt 09:03 and alert 09:04 WAT: five minutes from event to alert. Bursty or late telemetry must remain uncertain; this snapshot does not demonstrate a live 15-minute service guarantee.';
        else if(/privacy|data|africa/.test(q))answer='The identity re-identification key stays on controlled infrastructure in Abeokuta. Pseudonymized readings remain personal data. A documented transfer assessment and appropriate safeguards are needed before a South African data-lake transfer.';
        else if(/feeder|visit|loss/.test(q))answer='Your assignment is feeder 1, selected by student digit D=1. Prioritize verifiable mapping and consumption evidence. A high loss signal is a review priority, not proof of tampering. No trained prediction model is included in Task 1.';
        else if(/deploy|docker|dokku/.test(q))answer='This application runs as one Node.js process with SQLite on a persistent volume. Use Dockerfile for a container deployment and Procfile for a Dokku Node buildpack deployment. Read README.md and docs/DEPLOYMENT.md for commands.';
        return json(res,200,{answer,source:'Sunbeam Task 1 architecture and responsible-use policy'});
      }
      return json(res,404,{error:'Endpoint not found.'});
    }
    if(method!=='GET' && method!=='HEAD')return json(res,405,{error:'Method not allowed.'});
    const files={'/':'index.html','/app.js':'app.js','/styles.css':'styles.css','/luxury.css':'luxury.css','/login-premium.css':'login-premium.css','/fonts/alegreya-sans-400.ttf':'fonts/alegreya-sans-400.ttf','/fonts/alegreya-sans-500.ttf':'fonts/alegreya-sans-500.ttf','/fonts/alegreya-sans-700.ttf':'fonts/alegreya-sans-700.ttf','/fonts/OFL.txt':'fonts/OFL.txt'};
    const file=files[p];if(!file || !existsSync(path.join(root,'public',file)))return json(res,404,{error:'Not found.'});
    const mime=file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':file.endsWith('.ttf')?'font/ttf':file.endsWith('.txt')?'text/plain':'text/html';res.writeHead(200,{'Content-Type':mime+'; charset=utf-8','Cache-Control':'no-cache'});res.end(method==='HEAD'?undefined:readFileSync(path.join(root,'public',file)));
  } catch(e){json(res,e instanceof SyntaxError || e.message==='Request too large'?400:500,{error:e instanceof SyntaxError?'Invalid JSON.':e.message==='Request too large'?e.message:'The request could not be completed. Try again.'});}
}).listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`Sunbeam ready at ${origin} | demo credentials ${demo?'enabled':'disabled'} | bind ${process.env.HOST||'127.0.0.1'}`));
