const THRESHOLDS=[0,500,1500,3500,7000,12000,19000,28000,40000,56000];
const state=JSON.parse(localStorage.getItem('nteBondV1')||'null')||{character:'chaos',goal:'balanced',bond:{lv:8,inside:611,fons:0},owned:{},selected:{}};
const $=id=>document.getElementById(id);
const money=n=>Number(n).toLocaleString();
let current=getCharacter(state.character).id;

function save(){state.character=current;localStorage.setItem('nteBondV1',JSON.stringify(state));}
function giftKey(g){return current+'|'+g.name;}
function currentGifts(){return getBondGifts(current);}
function totalAffinity(){const lv=Math.max(1,Math.min(10,Number(state.bond.lv)||1));return Math.min(56000,(THRESHOLDS[lv-1]||0)+Math.max(0,Number(state.bond.inside)||0));}
function renderCharacters(){
 const q=($('search').value||'').toLowerCase();
 $('characters').innerHTML=NTE_CHARACTERS.filter(c=>c.name.toLowerCase().includes(q)).map(c=>`<button class="char-card ${c.id===current?'active':''}" data-character="${c.id}"><div class="fallback">${c.icon}</div><div class="char-info"><b>${c.name}</b><small>${c.faction}</small></div></button>`).join('');
 document.querySelectorAll('[data-character]').forEach(b=>b.onclick=()=>{current=b.dataset.character;save();renderAll()});
}
function renderProfile(){
 const c=getCharacter(current);const total=totalAffinity();const pct=total/56000*100;
 $('charName').textContent=c.name;$('giftTitle').textContent=c.name;$('heroName').textContent=c.name.toUpperCase();
 $('charMeta').innerHTML=`<span class="meta">${c.icon} ${c.faction}</span><span class="meta">❤️ Bond</span>`;
 $('bond').textContent='Lv.'+state.bond.lv;$('total').textContent=money(total);$('need').textContent=money(Math.max(0,56000-total));$('fonsText').textContent=state.bond.fons?money(state.bond.fons):'—';$('pct').textContent=Math.round(pct)+'%';$('ring').style.setProperty('--pct',pct+'%');
}
function giftIcon(g){if(g.name.includes('Letter'))return'💌';if(g.name.includes('Cinema'))return'🎟️';if(g.affection>=1200)return'⭐';if(g.name.includes('Kokoro'))return'🏍️';if(g.affection>=400)return'💎';if(g.affection>=200)return'🎁';return'🍽️';}
function renderGifts(){
 const gifts=currentGifts();
 if(!gifts.length){$('giftGrid').innerHTML='<div class="muted">This character has not been audited yet. We are deliberately leaving missing data blank rather than inventing gift values.</div>';return;}
 $('giftGrid').innerHTML=gifts.map(g=>{const k=giftKey(g),owned=Number(state.owned[k]||0),selected=state.selected[k]!==false;return `<article class="gift ${selected?'selected':''}"><div class="gift-icon">${giftIcon(g)}</div><h3>${g.name}</h3><span class="tag">❤️ ${money(g.affection)} AP</span><span class="tag">${g.price==null?'No Fons price':money(g.price)+' Fons'}</span><span class="tag">${g.availability}</span><div class="loc">📍 ${g.location}</div><div class="gift-actions"><button class="select ${selected?'on':''}" data-select="${encodeURIComponent(g.name)}">${selected?'✓ Selected':'Select'}</button><div class="owned"><button data-minus="${encodeURIComponent(g.name)}">−</button><input data-owned="${encodeURIComponent(g.name)}" value="${owned}" type="number" min="0"><button data-plus="${encodeURIComponent(g.name)}">+</button></div></div></article>`}).join('');
 document.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>{const name=decodeURIComponent(b.dataset.select);const k=current+'|'+name;state.selected[k]=state.selected[k]===false;save();renderGifts();calculate()});
 document.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>changeOwned(decodeURIComponent(b.dataset.minus),-1));
 document.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>changeOwned(decodeURIComponent(b.dataset.plus),1));
 document.querySelectorAll('[data-owned]').forEach(i=>i.onchange=()=>{state.owned[current+'|'+decodeURIComponent(i.dataset.owned)]=Math.max(0,Number(i.value)||0);save();calculate()});
}
function changeOwned(name,delta){const k=current+'|'+name;state.owned[k]=Math.max(0,(state.owned[k]||0)+delta);save();renderGifts();calculate();}
function chooseRoute(){
 const remain=Math.max(0,56000-totalAffinity());const gifts=currentGifts().filter(g=>state.selected[giftKey(g)]!==false);
 if(!gifts.length)return {plan:[],remain};
 let sorted=[...gifts];
 if(state.goal==='fast')sorted.sort((a,b)=>b.affection-a.affection);
 else if(state.goal==='inventory')sorted.sort((a,b)=>(state.owned[giftKey(b)]||0)-(state.owned[giftKey(a)]||0));
 else if(state.goal==='easy')sorted.sort((a,b)=>(a.availability==='shop'?0:1)-(b.availability==='shop'?0:1));
 else sorted.sort((a,b)=>{const ae=a.price==null?Infinity:a.price/a.affection;const be=b.price==null?Infinity:b.price/b.affection;return ae-be});
 let left=remain,plan=[];
 for(const g of sorted){if(left<=0)break;const owned=Math.max(0,state.owned[giftKey(g)]||0);let count=Math.min(owned,Math.ceil(left/g.affection));let buy=0;if(count===0 && g.price==null && g.availability!=='free' && g.availability!=='event')continue;if(count<Math.ceil(left/g.affection) && g.price!=null)buy=Math.ceil(left/g.affection)-count;const totalCount=count+buy;if(totalCount){plan.push({g,count:totalCount,owned:count,buy});left=Math.max(0,left-totalCount*g.affection)}}
 return {plan,remain,left};
}
function calculate(){
 const r=chooseRoute();const totalAP=r.plan.reduce((s,x)=>s+x.count*x.g.affection,0);const cost=r.plan.reduce((s,x)=>s+x.buy*(x.g.price||0),0);const gifts=r.plan.reduce((s,x)=>s+x.count,0);const days=Math.ceil(gifts/3);
 $('plan').innerHTML=r.plan.length?r.plan.map(x=>`<div class="plan-row"><div class="plan-ico">${giftIcon(x.g)}</div><div><b>${x.g.name}</b><div class="muted">${x.count} × ${money(x.g.affection)} AP · 📍 ${x.g.location}</div></div><b>${x.buy?money(x.buy*(x.g.price||0)):'Owned / free'}</b></div>`).join(''):'<div class="muted">Select gifts to build a route.</div>';
 $('summary').innerHTML=`<div class="muted">Goal</div><div class="big">${state.goal==='cheap'?'💰 Cheapest':state.goal==='fast'?'⚡ Fastest':state.goal==='inventory'?'🎒 Inventory first':state.goal==='easy'?'📍 Easiest':'⚖ Balanced'}</div><p><span class="green">❤️ ${money(totalAP)} AP planned</span></p><p>💰 <b>${money(cost)}</b> Fons</p><p>🎁 <b>${gifts}</b> gifts</p><p>⏱️ <b>${days}</b> day${days===1?'':'s'} at 3/day</p>${r.left>0?`<p style="color:#fb7185">⚠️ ${money(r.left)} AP still missing</p>`:''}`;
}
function renderAll(){renderCharacters();renderProfile();renderGifts();calculate();}
function wire(){
 $('search').oninput=renderCharacters;$('lv').value=state.bond.lv;$('inside').value=state.bond.inside;$('fons').value=state.bond.fons||'';
 ['lv','inside','fons'].forEach(id=>$(id).oninput=()=>{state.bond.lv=Math.max(1,Math.min(10,Number($('lv').value)||1));state.bond.inside=Math.max(0,Number($('inside').value)||0);state.bond.fons=Math.max(0,Number($('fons').value)||0);save();renderProfile();calculate()});
 document.querySelectorAll('.goal').forEach(b=>b.onclick=()=>{state.goal=b.dataset.goal;document.querySelectorAll('.goal').forEach(x=>x.classList.remove('active'));b.classList.add('active');save();calculate()});
 $('all').onclick=()=>{currentGifts().forEach(g=>state.selected[giftKey(g)]=true);save();renderGifts();calculate()};
 $('reset').onclick=()=>{if(confirm('Reset Bond data?')){localStorage.removeItem('nteBondV1');location.reload()}};
 $('export').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='nte-bond-backup.json';a.click()};
 $('save').onclick=()=>{save();alert('Saved in this browser ✓')};
 $('daily').onclick=()=>{const r=chooseRoute();$('dailyPanel').classList.toggle('hidden');const items=r.plan.flatMap(x=>Array(x.count).fill(x.g));const days=[];for(let i=0;i<items.length;i+=3)days.push(items.slice(i,i+3));$('days').innerHTML=days.map((d,i)=>`<div class="day"><b>Day ${i+1}</b>${d.map(g=>`<div>🎁 ${g.name}</div>`).join('')}</div>`).join('')||'<div class="muted">No route yet.</div>'};
}
wire();renderAll();
