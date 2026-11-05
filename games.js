const K={},R=n=>Math.random()*n,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),
T=(x,s,a,b,z=20,al='left')=>{x.font=z+'px sans-serif';x.textAlign=al;x.fillText(s,a,b)},
BG=(x,c='#111')=>{x.fillStyle=c;x.fillRect(0,0,480,360)};
addEventListener('keydown',e=>{K[e.key.toLowerCase()]=1;if(e.target.tagName!='INPUT'&&(e.key.startsWith('Arrow')||e.key==' '))e.preventDefault()});
addEventListener('keyup',e=>K[e.key.toLowerCase()]=0);
const loop=f=>{let on=1,t=performance.now(),id;const s=n=>{if(!on)return;if(f(Math.min(.05,(n-t)/1000))){on=0;return}t=n;id=requestAnimationFrame(s)};id=requestAnimationFrame(s);return()=>{on=0;cancelAnimationFrame(id)}};
const px=(c,e)=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*480/r.width,(e.clientY-r.top)*360/r.height]};
const G={},ICON={Snake:'🐍',Pong:'🏓',Breakout:'🧱',Flappy:'🐦',Invaders:'👾',Runner:'🏃',Memory:'🧠',TicTacToe:'❌','2048':'🔢',Catch:'🧺'};

G.Snake=(c,x,end)=>{let s=[[10,9],[9,9]],d=[1,0],nd=d,f=[15,9],sc=0,t=0;const D={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]};
 return loop(dt=>{for(const k in D)if(K[k]&&(D[k][0]+d[0]||D[k][1]+d[1]))nd=D[k];t+=dt;
  if(t>.1){t=0;d=nd;const h=[s[0][0]+d[0],s[0][1]+d[1]];if(h[0]<0||h[1]<0||h[0]>23||h[1]>17||s.some(q=>q[0]==h[0]&&q[1]==h[1])){end(sc);return 1}
   s.unshift(h);if(h[0]==f[0]&&h[1]==f[1]){sc++;f=[R(24)|0,R(18)|0]}else s.pop()}
  BG(x);x.fillStyle='#e33';x.fillRect(f[0]*20,f[1]*20,18,18);x.fillStyle='#4c4';s.forEach(q=>x.fillRect(q[0]*20,q[1]*20,18,18));x.fillStyle='#fff';T(x,'Score '+sc,8,20)})};

G.Pong=(c,x,end)=>{let p=150,a=150,ps=0,as=0,b;const rs=()=>{b={x:240,y:180,vx:(Math.random()<.5?-1:1)*240,vy:(R(2)-1)*160}};rs();
 c.onpointermove=e=>p=px(c,e)[1]-30;
 return loop(dt=>{if(K.w||K.arrowup)p-=320*dt;if(K.s||K.arrowdown)p+=320*dt;p=cl(p,0,300);a=cl(a+cl(b.y-30-a,-190*dt,190*dt),0,300);
  b.x+=b.vx*dt;b.y+=b.vy*dt;if((b.y<5&&b.vy<0)||(b.y>355&&b.vy>0))b.vy*=-1;
  if(b.x<20&&b.x>8&&b.vx<0&&b.y>p-5&&b.y<p+65){b.vx*=-1.07;b.vy+=(b.y-p-30)*5}
  if(b.x>460&&b.x<472&&b.vx>0&&b.y>a-5&&b.y<a+65)b.vx*=-1.03;
  if(b.x<0){as++;rs()}if(b.x>480){ps++;rs()}
  if(ps>=5||as>=5){end(ps*20,ps>=5);return 1}
  BG(x);x.fillStyle='#fff';x.fillRect(10,p,8,60);x.fillRect(462,a,8,60);x.fillRect(b.x-5,b.y-5,10,10);T(x,ps+' - '+as,240,30,26,'center')})};

G.Breakout=(c,x,end)=>{let p=200,b={x:240,y:300,vx:180,vy:-240},br=[],sc=0,lv=3;for(let i=0;i<8;i++)for(let j=0;j<5;j++)br.push({x:i*60+3,y:j*22+30,on:1,c:j});
 c.onpointermove=e=>p=px(c,e)[0]-40;
 return loop(dt=>{if(K.arrowleft||K.a)p-=420*dt;if(K.arrowright||K.d)p+=420*dt;p=cl(p,0,400);
  b.x+=b.vx*dt;b.y+=b.vy*dt;if((b.x<5&&b.vx<0)||(b.x>475&&b.vx>0))b.vx*=-1;if(b.y<5&&b.vy<0)b.vy*=-1;
  if(b.y>335&&b.y<350&&b.x>p&&b.x<p+80&&b.vy>0){b.vy*=-1;b.vx=(b.x-p-40)*6}
  for(const k of br)if(k.on&&b.x>k.x&&b.x<k.x+54&&b.y>k.y&&b.y<k.y+18){k.on=0;b.vy*=-1;sc+=10;break}
  if(b.y>365){lv--;b={x:240,y:300,vx:180,vy:-240};if(!lv){end(sc);return 1}}
  if(!br.some(k=>k.on)){end(sc+lv*50,1);return 1}
  BG(x);br.forEach(k=>{if(k.on){x.fillStyle=`hsl(${k.c*60},70%,55%)`;x.fillRect(k.x,k.y,54,18)}});x.fillStyle='#fff';x.fillRect(p,340,80,10);x.beginPath();x.arc(b.x,b.y,6,0,7);x.fill();T(x,'Score '+sc+'  ❤'+lv,8,20,16)})};

G.Flappy=(c,x,end)=>{let y=180,v=0,P=[],sc=0,t=0,h=0;c.onpointerdown=()=>v=-300;
 return loop(dt=>{if(K[' ']||K.arrowup||K.w){if(!h)v=-300;h=1}else h=0;v+=900*dt;y+=v*dt;t-=dt;
  if(t<=0){P.push({x:480,g:70+R(170)});t=1.6}P.forEach(q=>{q.x-=150*dt;if(!q.s&&q.x+50<100){q.s=1;sc++}});P=P.filter(q=>q.x>-60);
  if(y<0||y>360||P.some(q=>q.x<112&&q.x+50>88&&(y-12<q.g||y+12>q.g+110))){end(sc);return 1}
  BG(x,'#6cf');x.fillStyle='#2a2';P.forEach(q=>{x.fillRect(q.x,0,50,q.g);x.fillRect(q.x,q.g+110,50,360)});T(x,'🐤',100,y+10,28,'center');x.fillStyle='#000';T(x,'Score '+sc,8,24)})};

G.Invaders=(c,x,end)=>{let p=220,A=[],B=[],X=[],dr=1,sc=0,cd=0,ec=0,lv=3;for(let i=0;i<8;i++)for(let j=0;j<4;j++)A.push({x:40+i*50,y:40+j*34});
 c.onpointermove=e=>p=px(c,e)[0];c.onpointerdown=()=>{if(cd<=0){B.push({x:p,y:320});cd=.4}};
 return loop(dt=>{if(K.arrowleft||K.a)p-=250*dt;if(K.arrowright||K.d)p+=250*dt;p=cl(p,15,465);cd-=dt;if(K[' ']&&cd<=0){B.push({x:p,y:320});cd=.4}
  const sp=(30+(32-A.length)*4)*dt*dr;A.forEach(a=>a.x+=sp);if(A.some(a=>(a.x>455&&dr>0)||(a.x<25&&dr<0))){dr*=-1;A.forEach(a=>a.y+=14)}
  ec-=dt;if(ec<=0&&A.length){const a=A[R(A.length)|0];X.push({x:a.x,y:a.y});ec=.7}
  B.forEach(b=>b.y-=400*dt);X.forEach(b=>b.y+=220*dt);
  for(const b of B)for(const a of A)if(!b.d&&!a.dead&&Math.abs(a.x-b.x)<18&&Math.abs(a.y-b.y)<16){b.d=1;a.dead=1;sc+=10}
  A=A.filter(a=>!a.dead);B=B.filter(b=>!b.d&&b.y>0);
  for(const b of X)if(b.y>330&&Math.abs(b.x-p)<18){b.d=1;lv--}X=X.filter(b=>!b.d&&b.y<360);
  if(lv<=0||A.some(a=>a.y>310)){end(sc);return 1}if(!A.length){end(sc+lv*30,1);return 1}
  BG(x);x.fillStyle='#fff';T(x,'Score '+sc+'  ❤'+lv,8,20,16);T(x,'🚀',p,345,28,'center');A.forEach(a=>T(x,'👾',a.x,a.y+8,24,'center'));
  x.fillStyle='#ff0';B.forEach(b=>x.fillRect(b.x-1,b.y,3,10));x.fillStyle='#f55';X.forEach(b=>x.fillRect(b.x-1,b.y,3,10))})};

G.Runner=(c,x,end)=>{let y=0,v=0,O=[],t=1,sc=0,sp=260;const j=()=>{if(y<=0)v=520};c.onpointerdown=j;
 return loop(dt=>{if(K[' ']||K.arrowup||K.w)j();v-=1300*dt;y=Math.max(0,y+v*dt);if(y==0&&v<0)v=0;
  sc+=dt*10;sp+=dt*6;t-=dt;if(t<=0){O.push({x:480,w:18+R(14),h:25+R(30)});t=.9+R(1)*(300/sp)}
  O.forEach(o=>o.x-=sp*dt);O=O.filter(o=>o.x>-40);
  if(O.some(o=>o.x<90&&o.x+o.w>60&&y<o.h)){end(sc|0);return 1}
  BG(x,'#fed');x.fillStyle='#543';x.fillRect(0,320,480,40);x.fillStyle='#2a2';O.forEach(o=>x.fillRect(o.x,320-o.h,o.w,o.h));T(x,'🏃',75,320-y,30,'center');x.fillStyle='#000';T(x,'Score '+(sc|0),8,22)})};

G.Memory=(c,x,end)=>{const E=[...'🍎🍌🍇🍒🍉🍓🥝🍍'];let cs=[...E,...E].sort(()=>Math.random()-.5).map(e=>({e,o:0,d:0})),sel=[],lock=0,mv=0;
 c.onpointerdown=ev=>{if(lock>0)return;const[X,Y]=px(c,ev),m=cs[(Y/90|0)*4+(X/120|0)];if(!m||m.o||m.d)return;m.o=1;sel.push(m);if(sel.length==2){mv++;lock=.7}};
 return loop(dt=>{if(lock>0){lock-=dt;if(lock<=0){const[a,b]=sel;if(a.e==b.e)a.d=b.d=1;else a.o=b.o=0;sel=[];if(cs.every(q=>q.d)){end(Math.max(10,200-mv*8),1);return 1}}}
  BG(x,'#223');cs.forEach((q,k)=>{const i=k%4,j=k/4|0;x.fillStyle=q.d?'#3a3':q.o?'#fff':'#46a';x.fillRect(i*120+5,j*90+5,110,80);if(q.o||q.d)T(x,q.e,i*120+60,j*90+60,40,'center')});x.fillStyle='#fff';T(x,'Zetten '+mv,8,355,14)})};

G.TicTacToe=(c,x,end)=>{const b=Array(9).fill(''),L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],W=p=>L.some(l=>l.every(i=>b[i]==p));let my=1,w=0,done=0,res=0;
 const mm=p=>{if(W('O'))return 1;if(W('X'))return -1;if(b.every(v=>v))return 0;let s=p=='O'?-2:2;for(let i=0;i<9;i++)if(!b[i]){b[i]=p;const v=mm(p=='O'?'X':'O');b[i]='';s=p=='O'?Math.max(s,v):Math.min(s,v)}return s};
 c.onpointerdown=e=>{if(!my||done)return;const[X,Y]=px(c,e),i=Math.floor((X-60)/120),j=Math.floor(Y/120),k=j*3+i;if(i<0||i>2||j<0||j>2||b[k])return;b[k]='X';my=0;w=.5};
 return loop(dt=>{const r=W('X')?100:W('O')?0:b.every(v=>v)?40:-1;if(r>=0&&!done){done=.9;res=r}
  if(done){done-=dt;if(done<=0){end(res,res==100);return 1}}
  else if(!my){w-=dt;if(w<=0){let m,bs=-3;const em=[...b.keys()].filter(i=>!b[i]);if(Math.random()<.3)m=em[R(em.length)|0];else for(const i of em){b[i]='O';const v=mm('X');b[i]='';if(v>bs){bs=v;m=i}}b[m]='O';my=1}}
  BG(x,'#223');x.strokeStyle='#fff';x.lineWidth=3;for(let i=1;i<3;i++){x.beginPath();x.moveTo(60+i*120,0);x.lineTo(60+i*120,360);x.moveTo(60,i*120);x.lineTo(420,i*120);x.stroke()}
  b.forEach((v,k)=>{x.fillStyle=v=='X'?'#6af':'#f66';T(x,v,60+(k%3)*120+60,(k/3|0)*120+85,80,'center')});x.fillStyle='#fff';T(x,'Jij = X',8,20,16)})};

G['2048']=(c,x,end)=>{let g=Array(16).fill(0),sc=0;
 const add=()=>{const e=g.map((v,i)=>v?-1:i).filter(i=>i>=0);g[e[R(e.length)|0]]=Math.random()<.9?2:4};add();add();
 const line=a=>{a=a.filter(v=>v);for(let i=0;i<a.length-1;i++)if(a[i]==a[i+1]){a[i]*=2;sc+=a[i];a.splice(i+1,1)}while(a.length<4)a.push(0);return a};
 const mv=d=>{const o=g.join();for(let k=0;k<4;k++){const ix=[0,1,2,3].map(i=>d==0?k*4+i:d==1?k*4+3-i:d==2?i*4+k:(3-i)*4+k),r=line(ix.map(i=>g[i]));ix.forEach((i,n)=>g[i]=r[n])}return o!=g.join()};
 const draw=()=>{BG(x,'#bba');g.forEach((v,k)=>{const l=v?Math.log2(v):0;x.fillStyle=v?`hsl(${30+l*25},70%,${75-l*3}%)`:'#cdc1b4';x.fillRect(60+(k%4)*90+4,(k/4|0)*90+4,82,82);if(v){x.fillStyle='#222';T(x,v,60+(k%4)*90+45,(k/4|0)*90+55,v>999?24:32,'center')}});x.fillStyle='#222';T(x,'Score '+sc,8,22,16)};
 const key={arrowleft:0,a:0,arrowright:1,d:1,arrowup:2,w:2,arrowdown:3,s:3};
 const h=e=>{const d=key[e.key.toLowerCase()];if(d==undefined||e.target.tagName=='INPUT')return;if(mv(d))add();draw();
  const s=sc,s0=g.slice(),can=[0,1,2,3].some(q=>{const r=mv(q);g=s0.slice();return r});sc=s;if(!can){removeEventListener('keydown',h);end(sc)}};
 let sx,sy;c.onpointerdown=e=>{sx=e.clientX;sy=e.clientY};c.onpointerup=e=>{const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))>25)h({key:Math.abs(dx)>Math.abs(dy)?(dx>0?'d':'a'):(dy>0?'s':'w'),target:{}})};
 addEventListener('keydown',h);draw();return()=>removeEventListener('keydown',h)};

G.Catch=(c,x,end)=>{let p=240,I=[],t=0,sc=0,lv=3;c.onpointermove=e=>p=px(c,e)[0];
 return loop(dt=>{if(K.arrowleft||K.a)p-=380*dt;if(K.arrowright||K.d)p+=380*dt;p=cl(p,30,450);t-=dt;
  if(t<=0){I.push({x:20+R(440),y:-20,b:Math.random()<.25});t=.7-Math.min(.4,sc/400)}I.forEach(i=>i.y+=(140+sc/2)*dt);
  for(const i of I){if(i.y>320&&Math.abs(i.x-p)<40){i.d=1;if(i.b)lv--;else sc+=10}else if(i.y>360){i.d=1;if(!i.b)lv--}}
  I=I.filter(i=>!i.d);if(lv<=0){end(sc);return 1}
  BG(x,'#bdf');x.fillStyle='#000';T(x,'Score '+sc+'  ❤'+lv,8,22);T(x,'🧺',p,350,40,'center');I.forEach(i=>T(x,i.b?'💣':'🍎',i.x,i.y,28,'center'))})};

// Spellen die spelers zelf maken (bouwer)
G.custom=(c,x,end,o)=>{const st=o.find(q=>q.t=='🙂')||{x:1,y:1};let p={x:st.x*20+2,y:st.y*20+2},sc=0,tm=0;const O=o.filter(q=>q.t!='🙂').map(q=>({...q,on:1}));
 const pos=q=>({x:q.x*20+(q.t=='🚗'?Math.sin(tm*2)*40:0),y:q.y*20}),hit=(a,b)=>a.x<b.x+20&&a.x+16>b.x&&a.y<b.y+20&&a.y+16>b.y;
 return loop(dt=>{tm+=dt;const dx=(K.arrowright||K.d?1:0)-(K.arrowleft||K.a?1:0),dy=(K.arrowdown||K.s?1:0)-(K.arrowup||K.w?1:0);
  for(const[ax,ay]of[[dx*150*dt,0],[0,dy*150*dt]]){const n={x:p.x+ax,y:p.y+ay};if(n.x>=0&&n.y>=0&&n.x<=464&&n.y<=344&&!O.some(q=>q.t=='🧱'&&hit(n,pos(q))))p=n}
  for(const q of O)if(q.on&&hit(p,pos(q))){if(q.t=='⭐'){q.on=0;sc+=10}else if(q.t=='👾'||q.t=='🚗'){end(sc);return 1}else if(q.t=='🏁'){end(sc+50,1);return 1}}
  BG(x,'#9de');O.forEach(q=>{if(q.on){const a=pos(q);T(x,q.t,a.x+10,a.y+16,18,'center')}});T(x,'🙂',p.x+8,p.y+14,18,'center');x.fillStyle='#000';T(x,'⭐ '+sc,6,350,14)})};
