const $=(s,e=document)=>e.querySelector(s),h=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),uid=()=>Math.random().toString(36).slice(2,9);
const CH="ACM,ISLE,PMA,IEEE,CSI,IETE,IEI,SAE,IET,S4DS".split(','),
CL="FOSS,Robotics,GraphiX,Cypher,Aero,Brain Stormer's,Wall Magazine,Foxcodes Campus,Metamorph,Pegasus,Code Cooks,Technofuel,Art Glimpse,CoDE Club (AIML),CoDE Club (AIDS),PIXINSIGHT,App Club,Rotaract Club ENTC,Mars Club".split(','),
DEPTS=["Computer","IT","E&TC","Mechanical","Electrical","Electronics & Computer","MCA","MBA","AI&DS","AI&ML"],
DM={ACM:"Computer",CSI:"Computer","App Club":"Computer",Aero:"Mechanical",SAE:"Mechanical",IEEE:"E&TC",IETE:"E&TC","Rotaract Club ENTC":"E&TC","CoDE Club (AIML)":"AI&ML","CoDE Club (AIDS)":"AI&DS"};
const seed=()=>({clubs:[...CH.map(n=>[n+' Student Chapter','Chapter',n]),...CL.map(n=>[n,'Club',n])].map(([name,type,k],i)=>({id:'c'+i,name,type,dept:DM[k]||'All',about:'Sample description. Club members can edit this from their workspace.'})),
users:[],me:null,reqs:[],regs:[],
anns:[{id:'a1',cid:'c10',title:'Welcome to MCOE Pulse (sample announcement)',date:'2026-10-01'}],
events:[{id:'e1',cid:'c0',title:'Intro to Git and GitHub (sample)',date:'2026-10-20',venue:'Venue to be announced',cap:60},{id:'e2',cid:'c11',title:'Robotics workshop (sample)',date:'2026-10-27',venue:'Venue to be announced',cap:30},{id:'e3',cid:'c26',title:'App building bootcamp (sample)',date:'2026-11-03',venue:'Venue to be announced',cap:50}]});
let D;try{D=JSON.parse(localStorage.pulse)}catch(e){}D=D||seed();
const save=()=>localStorage.pulse=JSON.stringify(D),me=()=>D.users.find(u=>u.id==D.me),cn=id=>D.clubs.find(c=>c.id==id)?.name||'',left=e=>e.cap-D.regs.filter(r=>r.eid==e.id).length,own=c=>!!me()?.clubs?.includes(c);
const need=r=>{const u=me();if(!u||(r&&u.role!=r)){location='login.html';return}return u};
const toast=t=>{const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.append(d);setTimeout(()=>d.remove(),2600)};
const evCard=(e,act)=>{const u=me(),r=u&&D.regs.find(r=>r.eid==e.id&&r.uid==u.id),l=left(e);return `<article class=card><small>${h(cn(e.cid))}</small><h3>${h(e.title)}</h3><p>${h(e.date)}, ${h(e.venue)}</p><p class=mut>${l} of ${e.cap} seats left</p>${act?(r?`<button class=ghost data-a=unreg data-i=${e.id}>Cancel registration</button>`:`<button data-a=reg data-i=${e.id} ${l<1?'disabled':''}>${l<1?'Full':'Register'}</button>`):''}</article>`};
const clubCard=c=>{const u=me(),rq=u&&D.reqs.find(r=>r.cid==c.id&&r.uid==u.id);const b=own(c.id)?'<span class=tag>Your club</span>':rq?`<span class=tag>${{ok:'Joined',no:'Declined',wait:'Request sent'}[rq.st]}</span>`:`<button data-a=join data-i=${c.id}>Request to join</button>`;return `<article class=card><span class=tag>${c.type}</span><h3>${h(c.name)}</h3><p>${h(c.about)}</p><p class=mut>${c.dept=='All'?'Open to all departments':h(c.dept)}</p>${b}</article>`};
const P={
home(){$('#m').innerHTML=`<section class=hero><h1>Every MCOE club, chapter and event in one place.</h1><p>Be more than a student. Find your community, register for events and keep up with announcements.</p><form id=q class=search><input name=q placeholder="Search clubs and chapters, for example Robotics" aria-label="Search clubs"><button>Search</button></form></section>
<section class=stats>${[[D.clubs.length,'chapters and clubs'],[D.events.length,'upcoming events'],[D.users.length,'registered users']].map(([n,l])=>`<div><b>${n}</b><span>${l}</span></div>`).join('')}</section>
<h2>Upcoming events</h2><div class=grid>${D.events.slice(0,3).map(e=>evCard(e)).join('')}</div>
<h2>Announcements</h2><div class=list>${D.anns.slice(0,4).map(a=>`<p><b>${h(a.title)}</b><br><span class=mut>${h(cn(a.cid))}, ${h(a.date)}</span></p>`).join('')}</div>`},
clubs(){const p=new URLSearchParams(location.search),q=(p.get('q')||'').toLowerCase(),t=p.get('t')||'',d=p.get('d')||'';
const L=D.clubs.filter(c=>c.name.toLowerCase().includes(q)&&(!t||c.type==t)&&(!d||c.dept==d||c.dept=='All'));
$('#m').innerHTML=`<h1>Chapters and clubs</h1><form class=filters><input name=q value="${h(q)}" placeholder="Search by name" aria-label=Search><select name=t aria-label=Type><option value="">All types<option ${t=='Chapter'?'selected':''}>Chapter<option ${t=='Club'?'selected':''}>Club</select><select name=d aria-label=Department><option value="">All departments${DEPTS.map(x=>`<option ${d==x?'selected':''}>${h(x)}`).join('')}</select><button>Filter</button></form><div class=grid>${L.map(clubCard).join('')||'<p>No matches. Try a shorter search or clear the filters.</p>'}</div>`},
events(){$('#m').innerHTML=`<h1>Events and programs</h1><div class=grid>${[...D.events].sort((a,b)=>a.date<b.date?-1:1).map(e=>evCard(e,1)).join('')||'<p>No events yet.</p>'}</div>`},
login(){$('#m').innerHTML=`<div class=auth><h1>Log in</h1><form id=login><label>Email<input name=email type=email required></label><label>Password<input name=pw type=password required></label><button>Log in</button></form>
<h2>New here? Create an account</h2><form id=signup><label>Name<input name=name required></label><label>Email<input name=email type=email required></label><label>Password (6 or more characters)<input name=pw type=password minlength=6 required></label><label>I am a<select name=role id=role><option value=student>Student<option value=member>Club member</select></label><label id=cl hidden>My club<select name=club>${D.clubs.map(c=>`<option value=${c.id}>${h(c.name)}`).join('')}</select></label><button>Create account</button></form></div>`;
$('#role').onchange=e=>$('#cl').hidden=e.target.value!='member'},
student(){const u=need();if(!u)return;const R=D.reqs.filter(r=>r.uid==u.id),regs=D.regs.filter(r=>r.uid==u.id);
$('#m').innerHTML=`<h1>Hi, ${h(u.name)}</h1><h2>My clubs</h2><div class=list>${[...(u.clubs||[]).map(c=>[c,'Member']),...R.map(r=>[r.cid,{ok:'Joined',no:'Declined',wait:'Request pending'}[r.st]])].map(([c,s])=>`<p><b>${h(cn(c))}</b> <span class=tag>${s}</span></p>`).join('')||'<p>You have not joined a club yet. <a href=clubs.html>Browse clubs</a></p>'}</div>
<h2>My registrations</h2><div class=grid>${regs.map(r=>{const e=D.events.find(x=>x.id==r.eid);return e?`<article class=card><small>${h(cn(e.cid))}</small><h3>${h(e.title)}</h3><p>${h(e.date)}</p><p class=ticket>Ticket ${r.id.toUpperCase()}</p><button class=ghost data-a=unreg data-i=${e.id}>Cancel registration</button></article>`:''}).join('')||'<p>No registrations yet. <a href=events.html>See events</a></p>'}</div>`},
workspace(){const u=need('member');if(!u)return;const cs=u.clubs;let cid=sessionStorage.cid;if(!cs.includes(cid))cid=cs[0];sessionStorage.cid=cid;const c=D.clubs.find(x=>x.id==cid),ev=D.events.filter(e=>e.cid==cid),rq=D.reqs.filter(r=>r.cid==cid&&r.st=='wait');
$('#m').innerHTML=`<h1>${h(c.name)} workspace</h1>${cs.length>1?`<select id=sw aria-label="Switch club">${cs.map(x=>`<option value=${x} ${x==cid?'selected':''}>${h(cn(x))}`).join('')}</select>`:''}
<div class=cols><section><h2>Club profile</h2><form id=about><label>About<textarea name=about rows=4>${h(c.about)}</textarea></label><button>Save profile</button></form>
<h2>Post an announcement</h2><form id=anf><label>Title<input name=title required></label><button>Publish announcement</button></form></section>
<section><h2>Create an event</h2><form id=evf><label>Title<input name=title required></label><label>Date<input name=date type=date required></label><label>Venue<input name=venue required></label><label>Seats<input name=cap type=number min=1 value=50 required></label><button>Create event</button></form></section></div>
<h2>Join requests</h2><div class=list>${rq.map(r=>`<p><b>${h(D.users.find(x=>x.id==r.uid)?.name)}</b> <button data-a=ok data-i=${r.uid}>Accept</button> <button class=ghost data-a=no data-i=${r.uid}>Decline</button></p>`).join('')||'<p>No pending requests.</p>'}</div>
<h2>Your events</h2><div class=list>${ev.map(e=>`<p><b>${h(e.title)}</b>, ${h(e.date)}: ${e.cap-left(e)} of ${e.cap} seats taken <button class=ghost data-a=csv data-i=${e.id}>Download list (CSV)</button> <button class=ghost data-a=del data-i=${e.id}>Delete</button></p>`).join('')||'<p>No events yet. Create your first one above.</p>'}</div>`}
};
const dec=(i,s)=>{if(!own(sessionStorage.cid))return;const r=D.reqs.find(r=>r.uid==i&&r.cid==sessionStorage.cid&&r.st=='wait');if(r){r.st=s;toast(s=='ok'?'Request accepted':'Request declined')}};
const A={
join(i){if(!need())return;D.reqs.push({uid:D.me,cid:i,st:'wait'});toast('Request sent')},
reg(i){if(!need())return;const e=D.events.find(x=>x.id==i);if(left(e)<1)return;D.regs.push({id:uid(),uid:D.me,eid:i});toast('Registered')},
unreg(i){D.regs=D.regs.filter(r=>!(r.eid==i&&r.uid==D.me));toast('Registration cancelled')},
ok(i){dec(i,'ok')},no(i){dec(i,'no')},
del(i){const e=D.events.find(x=>x.id==i);if(!e||!own(e.cid))return;D.events=D.events.filter(x=>x!=e);D.regs=D.regs.filter(r=>r.eid!=i);toast('Event deleted')},
csv(i){const e=D.events.find(x=>x.id==i);if(!e||!own(e.cid))return 1;const rows=[['Name','Email','Ticket'],...D.regs.filter(r=>r.eid==i).map(r=>{const s=D.users.find(x=>x.id==r.uid);return[s.name,s.email,r.id.toUpperCase()]})],a=document.createElement('a');a.href=URL.createObjectURL(new Blob([rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n')],{type:'text/csv'}));a.download='registrations.csv';a.click();return 1},
out(){D.me=null;save();location='index.html';return 1}
};
const go=u=>location=u.role=='member'?'workspace.html':'student.html',done=t=>{save();toast(t);P.workspace()},cid=()=>sessionStorage.cid,pg=document.body.dataset.p;
const F={
q(f){location='clubs.html?q='+encodeURIComponent(f.get('q'))},
login(f){const u=D.users.find(x=>x.email==f.get('email').toLowerCase()&&x.pw==btoa(f.get('pw')));if(!u)return toast('Email or password is incorrect');D.me=u.id;save();go(u)},
signup(f){const em=f.get('email').toLowerCase();if(D.users.some(x=>x.email==em))return toast('That email already has an account. Log in instead.');const role=f.get('role'),u={id:uid(),name:f.get('name'),email:em,pw:btoa(f.get('pw')),role,clubs:role=='member'?[f.get('club')]:[]};D.users.push(u);D.me=u.id;save();go(u)},
about(f){if(!own(cid()))return;D.clubs.find(c=>c.id==cid()).about=f.get('about');done('Profile saved')},
anf(f){if(!own(cid()))return;D.anns.unshift({id:uid(),cid:cid(),title:f.get('title'),date:new Date().toISOString().slice(0,10)});done('Announcement published')},
evf(f){if(!own(cid()))return;D.events.push({id:uid(),cid:cid(),title:f.get('title'),date:f.get('date'),venue:f.get('venue'),cap:Math.max(1,+f.get('cap'))});done('Event created')}
};
document.addEventListener('submit',e=>{const f=e.target;if(F[f.id]){e.preventDefault();F[f.id](new FormData(f))}});
document.addEventListener('change',e=>{if(e.target.id=='sw'){sessionStorage.cid=e.target.value;P.workspace()}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;e.preventDefault();if(A[b.dataset.a](b.dataset.i)!==1){save();P[pg]()}});
const u=me();$('#nav').innerHTML=`<a class=logo href=index.html><b>MCOE</b>Pulse</a><nav><a href=clubs.html>Clubs</a><a href=events.html>Events</a>${u?`${u.role=='member'?'<a href=workspace.html>Workspace</a>':''}<a href=student.html>My space</a><a href=# data-a=out>Log out</a>`:'<a class=btn href=login.html>Log in</a>'}</nav>`;
P[pg]();
