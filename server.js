const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const PORT=process.env.PORT||3000,ADMIN=process.env.ADMIN_CODE||'gggrite5',DIR=process.env.DATA_DIR||__dirname,DB=path.join(DIR,'data.json');
fs.mkdirSync(DIR,{recursive:true});
let db={users:{},games:{},codes:{},sess:{}};try{db=JSON.parse(fs.readFileSync(DB))}catch{}db.sess=db.sess||{};
const save=()=>fs.writeFileSync(DB,JSON.stringify(db));
const hash=(p,s)=>crypto.scryptSync(p,s,32).toString('hex');
const rnd=n=>{const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return Array.from(crypto.randomBytes(n),b=>a[b%a.length]).join('')};
const sess=db.sess,rooms={},fails={},today=()=>new Date().toISOString().slice(0,10);
const day=u=>{if(u.day!==today())Object.assign(u,{day:today(),played:[],claimed:[],made:0})};
const byName=n=>Object.values(db.users).find(x=>x.name.toLowerCase()===String(n).toLowerCase());
const pub=u=>{day(u);return{email:u.email,name:u.name,coins:u.coins,premium:u.premium,
 friends:u.friends.map(e=>db.users[e]?.name).filter(Boolean),invites:u.invites,
 tasks:[{id:'daily',t:'Dagelijkse bonus',r:10,ok:true},{id:'play3',t:'Speel 3 verschillende spellen',r:30,ok:u.played.length>=3}].map(t=>({...t,done:u.claimed.includes(t.id)}))}};
const send=(r,c,o)=>{r.writeHead(c,{'Content-Type':'application/json'});r.end(JSON.stringify(o))};
const MIME={'.html':'text/html;charset=utf-8','.js':'text/javascript'};
http.createServer((q,r)=>{
 const u=new URL(q.url,'http://x');
 if(!u.pathname.startsWith('/api/')){
  const rel=path.normalize('/'+(u.pathname==='/'?'index.html':u.pathname));
  if(!['/index.html','/app.js','/games.js'].includes(rel)){r.writeHead(404,{'Content-Type':'text/plain;charset=utf-8'});return r.end('404 - pagina bestaat niet')}
  const cands=[path.join(__dirname,'public',rel),path.join(__dirname,rel)];
  const next=()=>{const f=cands.shift();if(!f){r.writeHead(404,{'Content-Type':'text/plain;charset=utf-8'});return r.end('Bestand '+rel+' niet gevonden. Zet index.html, app.js en games.js in de map "public" (of naast server.js).')}
   fs.readFile(f,(e,d)=>{if(e)return next();r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'text/plain'});r.end(d)})};
  return next()}
 let b='';q.on('data',d=>{b+=d;if(b.length>2e5)q.destroy()});
 q.on('end',()=>{let body={};try{body=JSON.parse(b||'{}')}catch{}try{route(q,r,u,body)}catch(e){console.error(e);send(r,500,{error:'Serverfout'})}})
}).on('error',e=>{console.error(e.code==='EADDRINUSE'?'Poort '+PORT+' is bezet. Sluit het andere programma of start met een andere poort, bijv. PORT=3001 node server.js':e);process.exit(1)})
.listen(PORT,()=>console.log('\n✅ GameHub draait! Open http://localhost:'+PORT+' in je browser\n'));

function route(q,r,u,b){
 const p=u.pathname.slice(5),E=(c,m)=>send(r,c,{error:m}),O=o=>send(r,200,o);
 const em=sess[(q.headers.authorization||'').slice(7)],U=em&&db.users[em];if(U)day(U);
 const need=()=>U||(E(401,'Log eerst in'),0);
 const adm=()=>{const ip=q.socket.remoteAddress;if((fails[ip]||0)>=10)return E(429,'Te veel pogingen'),0;
  if(q.headers['x-admin']===ADMIN)return 1;fails[ip]=(fails[ip]||0)+1;return E(403,'Foute admincode'),0};
 if(p==='register'){const email=String(b.email||'').trim().toLowerCase(),name=String(b.name||'').trim(),pw=String(b.password||'');
  if(!/^\S+@\S+\.\S+$/.test(email))return E(400,'Ongeldig e-mailadres');
  if(name.length<2||name.length>20)return E(400,'Naam: 2-20 tekens');
  if(pw.length<6)return E(400,'Wachtwoord: minimaal 6 tekens');
  if(db.users[email]||byName(name))return E(400,'E-mail of naam bestaat al');
  const salt=rnd(16);db.users[email]={email,name,salt,pass:hash(pw,salt),coins:0,premium:false,active:false,friends:[],invites:[],played:[],claimed:[],made:0,day:''};save();return O({ok:1})}
 if(p==='login'){const x=db.users[String(b.email||'').trim().toLowerCase()];
  if(!x||hash(String(b.password||''),x.salt)!==x.pass)return E(400,'Onjuiste gegevens');
  if(!x.active){if(!b.code||String(b.code).trim().toUpperCase()!==db.codes[x.email])return E(403,'Je hebt een inlogcode nodig. Mail rainslideryoutube@gmail.com');x.active=true;delete db.codes[x.email];save()}
  const t=rnd(32);sess[t]=x.email;save();return O({token:t})}
 if(p==='games'&&q.method==='GET')return O(Object.values(db.games).map(g=>({id:g.id,name:g.name,owner:db.users[g.owner]?.name||'?'})));
 if(p.startsWith('games/')){const g=db.games[p.slice(6)];return g?O(g):E(404,'Niet gevonden')}
 if(p.startsWith('admin/')){if(!adm())return;
  if(p==='admin/users')return O(Object.values(db.users).map(x=>({email:x.email,name:x.name,active:x.active,premium:x.premium,coins:x.coins})));
  if(p==='admin/code'){const x=db.users[b.email];if(!x)return E(404,'Onbekend');const c=rnd(6);db.codes[x.email]=c;save();return O({code:c})}
  if(p==='admin/deluser'){delete db.users[b.email];delete db.codes[b.email];for(const k in db.games)if(db.games[k].owner===b.email)delete db.games[k];for(const t in sess)if(sess[t]===b.email)delete sess[t];save();return O({ok:1})}
  if(p==='admin/delgame'){delete db.games[b.id];save();return O({ok:1})}
  return E(404,'?')}
 if(!need())return;
 if(p==='me')return O(pub(U));
 if(p==='played'){const id=String(b.id||'').slice(0,40);if(id&&!U.played.includes(id))U.played.push(id);save();return O({ok:1})}
 if(p==='task'){const T={daily:[10,true],play3:[30,U.played.length>=3]}[b.id];if(!T||!T[1]||U.claimed.includes(b.id))return E(400,'Niet beschikbaar');U.claimed.push(b.id);U.coins+=T[0];save();return O(pub(U))}
 if(p==='games'){const name=String(b.name||'').trim().slice(0,30),o=b.objs;
  if(name.length<2)return E(400,'Geef je game een naam');
  if(!Array.isArray(o)||o.length>432||!o.every(i=>'🧱🏠🚗🌳⭐👾🏁🙂'.includes(i.t)&&Number.isInteger(i.x)&&Number.isInteger(i.y)&&i.x>=0&&i.x<24&&i.y>=0&&i.y<18))return E(400,'Ongeldige game');
  if(!o.some(i=>i.t==='🏁'))return E(400,'Zet minstens één 🏁 finish');
  const id=rnd(8);db.games[id]={id,name,owner:U.email,objs:o.map(i=>({t:i.t,x:i.x,y:i.y}))};
  let reward=0;if(U.made<5){U.made++;reward=100;U.coins+=100}save();return O({id,reward})}
 if(p==='premium'){if(U.premium)return E(400,'Je hebt al premium');if(U.coins<500)return E(400,'Je hebt 500 munten nodig');U.coins-=500;U.premium=true;save();return O(pub(U))}
 if(!U.premium)return E(403,'Alleen voor premium');
 if(p==='rename'){const n=String(b.name||'').trim();if(n.length<2||n.length>20)return E(400,'Naam: 2-20 tekens');const o=byName(n);if(o&&o!==U)return E(400,'Naam bezet');U.name=n;save();return O(pub(U))}
 if(p==='friend'){const t=byName(b.name);if(!t||t===U)return E(404,'Speler niet gevonden');if(!t.premium)return E(400,'Alleen vrienden met premium');
  if(!U.friends.includes(t.email))U.friends.push(t.email);if(!t.friends.includes(U.email))t.friends.push(U.email);save();return O(pub(U))}
 if(p==='room'){
  if(q.method==='GET'){const R=rooms[u.searchParams.get('code')];if(!R||!(U.email in R.m))return E(404,'Kamer niet gevonden');
   return O({game:R.game,members:Object.entries(R.m).map(([e,s])=>({name:db.users[e]?.name||'?',score:s})),msgs:R.msgs.slice(+u.searchParams.get('since')||0)})}
  const a=b.action,c=String(b.code||'').toUpperCase(),R=rooms[c];
  if(a==='create'){const code=rnd(5);rooms[code]={game:String(b.game||'Snake').slice(0,30),m:{[U.email]:0},msgs:[]};return O({code})}
  if(!R)return E(404,'Kamer niet gevonden');
  if(a==='join'){if(!(U.email in R.m))R.m[U.email]=0;return O({ok:1})}
  if(!(U.email in R.m))return E(403,'Niet in kamer');
  if(a==='score')R.m[U.email]=Math.max(R.m[U.email],+b.score||0);
  if(a==='msg'&&R.msgs.length<1000)R.msgs.push({n:U.name,t:String(b.text||'').slice(0,200)});
  if(a==='invite'){const t=byName(b.name);if(!t||!U.friends.includes(t.email))return E(400,'Dat is geen vriend van je');if(!t.invites.some(i=>i.code===c)&&t.invites.length<20){t.invites.push({from:U.name,code:c});save()}}
  return O({ok:1})}
 E(404,'?')}
