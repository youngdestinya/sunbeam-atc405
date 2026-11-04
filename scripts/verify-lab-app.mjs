import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const origin=process.argv[2];
if(!/^http:\/\/localhost:808[12]$/.test(origin||''))throw Error('This checker is restricted to the two local Sunbeam lab ports.');
const name=origin.endsWith('8081')?'docker':'dokku';
const write=process.argv.includes('--write');
const persisted=process.argv.includes('--expect-persisted');
const note=`${name} deployment verification: synthetic meter checked; no customer identity recorded.`;
const checks=[];
function check(label,condition){assert.ok(condition,label);checks.push(label);console.log('PASS',label);}
async function request(p,{method='GET',cookie,data}={}){return fetch(origin+p,{method,headers:{...(cookie?{cookie}:{}),...(method==='POST'?{'Content-Type':'application/json',Origin:origin}:{})},body:data?JSON.stringify(data):undefined});}
async function login(username,password){const r=await request('/api/login',{method:'POST',data:{username,password}});check(`${username} can sign in`,r.ok);return r.headers.get('set-cookie').split(';')[0];}
check('health and database', (await request('/healthz')).ok);
check('anonymous data denied',(await request('/api/state')).status===401);
const field=await login('field','SunbeamField!2026');
let state=await (await request('/api/state',{cookie:field})).json();
check('assigned feeder restriction',state.visits.length===6 && state.visits.every(v=>v.feeder===1));
check('field cannot read audit',(await request('/api/audit',{cookie:field})).status===403);
if(write){check('save synthetic evidence',(await request('/api/visits/SB-106/report',{method:'POST',cookie:field,data:{finding:'No access',note}})).status===201);check('submit synthetic appeal',(await request('/api/appeals',{method:'POST',cookie:field,data:{customer:'SB-103',reason:`${name} verification appeal: request applicable cap evidence.`}})).status===201);}
const reviewer=await login('reviewer','SunbeamReview!2026');
let reviewState=await(await request('/api/state',{cookie:reviewer})).json();
if(write){const appeal=reviewState.appeals.find(a=>a.reason===`${name} verification appeal: request applicable cap evidence.`&&a.status==='Pending human review');assert.ok(appeal);check('separate human review',(await request(`/api/appeals/${appeal.id}/review`,{method:'POST',cookie:reviewer,data:{status:'More evidence required',decision:`${name} verification: obtain cap and supporting billing evidence before further action.`}})).ok);}
if(persisted){check('visit evidence survived restart',state.reports.some(r=>r.note===note));check('review survived restart',reviewState.appeals.some(a=>a.reason===`${name} verification appeal: request applicable cap evidence.`&&a.status==='More evidence required'));}
await request('/api/logout',{method:'POST',cookie:field,data:{}});await request('/api/logout',{method:'POST',cookie:reviewer,data:{}});
writeFileSync(`docs/lab-evidence/${name}-${persisted?'persistence':'application'}-check.json`,JSON.stringify({origin,verifiedUtc:new Date().toISOString(),checks},null,2));
