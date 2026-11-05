const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
let tok=localStorage.tok||'',me=null,adm='',stop=()=>{},poll=0,room='',rmsgs=[],last,draft=[],tool='🧱';
const PAD=['Snake','Runner','Flappy','Invaders','Breakout','Pong','Catch','custom'],TOOLS=['🧱','🏠','🚗','🌳','⭐','👾','🏁','🙂','🧽'],V={};
const api=async(p,b,a)=>{const h={'Content-Type':'application/json'};if(tok)h.Authorization='Bearer '+tok;if(a)h['x-admin']=adm;
 let r,j;try{r=await fetch('/api/'+p,{method:b?'POST':'GET',headers:h,body:b?JSON.stringify(b):undefined});j=await r.json()}catch{throw new Error('Kan de server niet bereiken. Draait server.js?')}if(!r.ok)throw new Error(j.error||'Fout');return j};
const toast=m=>{const t=$('#t');t.textContent=m;t.style.opacity=1;setTimeout(()=>t.style.opacity=0,3500)};
const act=f=>async(...a)=>{try{await f(...a)}catch(e){toast(e.message)}};
const set=h=>$('#main').innerHTML=h,nm=u=>esc(u.name)+(u.premium?' ⭐':'');
const nav=v=>{stop();stop=()=>{};clearInterval(poll);V[v]()};
async function refresh(){try{me=tok?await api('me'):null}catch{me=null;tok=localStorage.tok=''}
 $('#user').innerHTML=me?`${nm(me)} · 🪙${me.coins} <button onclick="logout()">Uit</button>`:`<button onclick="nav('login')">Inloggen</button>`}
const logout=()=>{tok=localStorage.tok='';room='';refresh().then(()=>nav('home'))};

V.home=async()=>{const gs=await api('games').catch(()=>[]);
 set(`<h2>Spellen</h2><div class="grid">${Object.keys(G).filter(k=>k!='custom').map(k=>`<div class="card" onclick="play('${k}')"><b>${ICON[k]}</b>${k}</div>`).join('')}</div><h2>Door spelers gemaakt</h2><div class="grid">${gs.map(g=>`<div class="card" onclick="playC('${g.id}')"><b>🧩</b>${esc(g.name)}<small>door ${esc(g.owner)}</small></div>`).join('')||'<p>Nog geen spellen. Maak de eerste!</p>'}</div>`)};
function play(k,o,label,bk){clearInterval(poll);stop();last=()=>play(k,o,label,bk);
 set(`<h2>${esc(label||k)}</h2><canvas id="c" width="480" height="360"></canvas><p id="res">Pijltjes/WASD, spatie, of muis/tik.</p><button onclick="last()">Opnieuw</button><button onclick="nav('${bk||'home'}')">Terug</button>${PAD.includes(k)&&matchMedia('(pointer:coarse)').matches?`<div id="pad">${[['arrowleft','◀'],['arrowup','▲'],['arrowdown','▼'],['arrowright','▶'],[' ','⏺']].map(([q,l])=>`<button data-k="${q}">${l}</button>`).join('')}</div>`:''}`);
 document.querySelectorAll('#pad button').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();K[b.dataset.k]=1};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>K[b.dataset.k]=0});
 const c=$('#c');stop=G[k](c,c.getContext('2d'),(sc,won)=>{$('#res').innerHTML=`${won?'🏆 Gewonnen!':'💀 Game over'} Score: ${sc}`;
  if(me){api('played',{id:label||k}).catch(()=>{});if(room)api('room',{action:'score',code:room,score:sc}).catch(()=>{})}},o)||(()=>{})}
const playC=act(async id=>{const g=await api('games/'+id);play('custom',g.objs,g.name)});

V.login=()=>set(`<h2>Inloggen</h2><input id="le" placeholder="E-mail"><input id="lp" type="password" placeholder="Wachtwoord"><input id="lc" placeholder="Inlogcode (eerste keer)"><button onclick="doLogin()">Inloggen</button>
<h2>Account maken</h2><input id="re" placeholder="E-mail"><input id="rn" placeholder="Naam"><input id="rp" type="password" placeholder="Wachtwoord"><button onclick="doReg()">Account maken</button><div id="info"></div>`);
const doLogin=act(async()=>{const r=await api('login',{email:$('#le').value,password:$('#lp').value,code:$('#lc').value});tok=localStorage.tok=r.token;await refresh();nav('home')});
const doReg=act(async()=>{const e=$('#re').value.trim(),n=$('#rn').value.trim();await api('register',{email:e,name:n,password:$('#rp').value});
 const body=encodeURIComponent(`Hoi! Ik wil een inlogcode voor GameHub.\nE-mail: ${e}\nNaam: ${n}`);
 $('#info').innerHTML=`<p>✅ Account gemaakt! Stuur nu een e-mail voor je inlogcode: <a style="color:#8af" href="mailto:rainslideryoutube@gmail.com?subject=Inlogcode&body=${body}">E-mail versturen</a>. Vul de code die je terugkrijgt hierboven in bij Inloggen.</p>`});

V.taken=async()=>{if(!me)return nav('login');await refresh();
 set(`<h2>🪙 Taken (${me.coins} munten)</h2>${me.tasks.map(t=>`<div class="row">${t.t} (+${t.r}) <button ${t.done||!t.ok?'disabled':''} onclick="claim('${t.id}')">${t.done?'Klaar':t.ok?'Claim':'Nog niet'}</button></div>`).join('')}<div class="row">Publiceer een game: +100 (max 5 per dag)</div><p>Premium kost 500 munten.</p>`)};
const claim=act(async id=>{await api('task',{id});await refresh();V.taken()});

let dr=(c,x)=>{BG(x,'#9de');x.strokeStyle='#0002';for(let i=0;i<=24;i++){x.beginPath();x.moveTo(i*20,0);x.lineTo(i*20,360);x.stroke()}for(let j=0;j<=18;j++){x.beginPath();x.moveTo(0,j*20);x.lineTo(480,j*20);x.stroke()}draft.forEach(o=>T(x,o.t,o.x*20+10,o.y*20+16,18,'center'))};
V.maak=()=>{if(!me)return nav('login');let dn=0;
 set(`<h2>➕ Game maken</h2><p>Kies een tool en klik of sleep op het veld. 🙂 start · ⭐ munt · 👾🚗 gevaar · 🏁 finish (verplicht) · 🧱 muur · 🏠🌳 decor · 🧽 gum</p><div>${TOOLS.map(e=>`<button onclick="tool='${e}'">${e}</button>`).join('')}</div><canvas id="c" width="480" height="360"></canvas><br><input id="gn" placeholder="Naam van je game"><button id="tst">▶ Test</button><button id="pub">Publiceer</button>`);
 const c=$('#c'),x=c.getContext('2d');dr(c,x);
 const put=e=>{const[X,Y]=px(c,e).map(v=>v/20|0);draft=draft.filter(o=>!(o.x==X&&o.y==Y)&&!(tool=='🙂'&&o.t=='🙂'));if(tool!='🧽')draft.push({t:tool,x:X,y:Y});dr(c,x)};
 c.onpointerdown=e=>{dn=1;put(e)};c.onpointermove=e=>dn&&put(e);c.onpointerup=c.onpointerleave=()=>dn=0;
 $('#tst').onclick=()=>play('custom',draft,$('#gn').value||'Test','maak');
 $('#pub').onclick=act(async()=>{const r=await api('games',{name:$('#gn').value,objs:draft});toast(`Gepubliceerd! +${r.reward} munten 🪙`);draft=[];await refresh();nav('home')})};

V.premium=async()=>{if(!me)return nav('login');await refresh();
 if(!me.premium)return set(`<h2>⭐ Premium</h2><p>Kost 500 🪙 (jij hebt ${me.coins}). Verdien munten met taken en eigen games.</p><ul><li>Naam veranderen</li><li>Vrienden toevoegen (alleen premium-vrienden)</li><li>Samen spelen met join code</li><li>Chatten</li><li>⭐ naast je naam</li></ul><button onclick="buy()">Koop Premium</button>`);
 set(`<h2>⭐ Premium</h2><h3>Naam</h3><input id="nn" value="${esc(me.name)}"><button onclick="ren()">Opslaan</button>
<h3>Vrienden</h3><div>${me.friends.map(esc).join(', ')||'nog geen'}</div><input id="fn" placeholder="Naam van premium-vriend"><button onclick="addf()">Toevoegen</button>
<h3>Uitnodigingen</h3>${me.invites.map(i=>`<div class="row">${esc(i.from)} nodigt je uit <button onclick="joinR('${i.code}')">Join ${i.code}</button></div>`).join('')||'geen'}
<h3>Samen spelen</h3><select id="rg">${Object.keys(G).filter(k=>k!='custom').map(k=>`<option>${k}</option>`).join('')}</select><button onclick="mkR()">Maak kamer</button><br><input id="jc" placeholder="Join code" size="6"><button onclick="joinR($('#jc').value)">Join</button><div id="room"></div>`);
 if(room)showRoom()};
const buy=act(async()=>{await api('premium',{});toast('Welkom bij Premium ⭐');V.premium()});
const ren=act(async()=>{await api('rename',{name:$('#nn').value});V.premium()});
const addf=act(async()=>{await api('friend',{name:$('#fn').value});V.premium()});
const mkR=act(async()=>{room=(await api('room',{action:'create',game:$('#rg').value})).code;showRoom()});
const joinR=act(async c=>{c=c.toUpperCase().trim();await api('room',{action:'join',code:c});room=c;showRoom()});
const say=act(async()=>{const t=$('#cm').value;$('#cm').value='';if(t)await api('room',{action:'msg',code:room,text:t})});
const inv=act(async()=>{await api('room',{action:'invite',code:room,name:$('#iv').value});toast('Uitnodiging verstuurd')});
function showRoom(){rmsgs=[];$('#room').innerHTML=`<h3>Kamer ${room}</h3><div id="rm"></div><div id="chat" class="row" style="max-height:160px;overflow:auto"></div><input id="cm" placeholder="Chat..."><button onclick="say()">Stuur</button><br><input id="iv" placeholder="Vriend uitnodigen"><button onclick="inv()">Uitnodigen</button>`;
 clearInterval(poll);const f=async()=>{try{const r=await api(`room?code=${room}&since=${rmsgs.length}`);rmsgs.push(...r.msgs);
  $('#rm').innerHTML=`Spel: <button onclick="play('${r.game}')">▶ ${esc(r.game)}</button> (je score telt mee)<br>`+r.members.map(m=>`${esc(m.name)} ⭐ — ${m.score}`).join('<br>');
  $('#chat').innerHTML=rmsgs.map(m=>`<div>${esc(m.n)} ⭐: ${esc(m.t)}</div>`).join('')}catch{clearInterval(poll)}};f();poll=setInterval(f,1500)}

const admin=act(async()=>{const c=prompt('Admincode:');if(!c)return;adm=c;await showAdmin()});
const showAdmin=async()=>{const us=await api('admin/users',0,1),gs=await api('games');stop();clearInterval(poll);
 set(`<h2>🛠 Admin</h2><h3>Accounts</h3>${us.map(u=>`<div class="row">${esc(u.name)} · ${esc(u.email)} · ${u.active?'actief':'wacht op code'} ${u.premium?'⭐':''} 🪙${u.coins} <button data-e="${esc(u.email)}" onclick="mkCode(this.dataset.e)">Code maken</button><button data-e="${esc(u.email)}" onclick="delU(this.dataset.e)">Verwijder</button></div>`).join('')}<h3>Games</h3>${gs.map(g=>`<div class="row">${esc(g.name)} (${esc(g.owner)}) <button onclick="delG('${g.id}')">Verwijder</button></div>`).join('')||'geen'}`)};
const mkCode=act(async e=>{const r=await api('admin/code',{email:e},1);prompt(`Inlogcode voor ${e} — mail deze naar de speler:`,r.code)});
const delU=act(async e=>{if(confirm('Account verwijderen?')){await api('admin/deluser',{email:e},1);showAdmin()}});
const delG=act(async id=>{if(confirm('Game verwijderen?')){await api('admin/delgame',{id},1);showAdmin()}});
if(location.protocol==='file:')set('<h2>⚠️ Zo werkt het niet</h2><p>Je hebt index.html direct geopend. Start eerst de server (<b>start.bat</b> op Windows, <b>start.sh</b> op Mac/Linux, of Docker) en ga dan naar <b>http://localhost:3000</b> in je browser.</p>');else refresh().then(()=>nav('home'));
