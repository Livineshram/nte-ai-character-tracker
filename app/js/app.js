// NTE Bond Optimizer — application logic
const THRESHOLDS = [0, 500, 1500, 3500, 7000, 12000, 19000, 28000, 40000, 56000];
const MAX_AFFECTION = 56000;
const MAX_LEVEL = 10;
const DEFAULT_GIFTS_PER_DAY = 3;
const STORAGE_KEY = 'nteBondV1';

const defaultState = { character:'chaos', goal:'balanced', bond:{lv:8,inside:611,fons:0}, giftsPerDay:3, owned:{}, selected:{} };
let state = loadState();
let currentCharacterId = state.character;
let giftFilter = 'all';
let giftSearch = '';

const $ = id => document.getElementById(id);
const money = n => Number(n || 0).toLocaleString();
const clamp = (v,min,max) => Math.max(min,Math.min(max,v));

function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')||{};
    return {...defaultState,...saved,bond:{...defaultState.bond,...(saved.bond||{})},owned:saved.owned||{},selected:saved.selected||{},giftsPerDay:clamp(Number(saved.giftsPerDay)||3,1,3)};
  }catch(e){return {...defaultState,owned:{},selected:{},bond:{...defaultState.bond}};}
}
function saveState(){try{state.character=currentCharacterId;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));updateLastSavedIndicator();}catch(e){showToast('Could not save data','error');}}
function getCurrentCharacter(){return getCharacter(currentCharacterId)||NTE_CHARACTERS[0];}
function getCurrentGifts(){return getBondGifts(currentCharacterId)||[];}
function giftKey(name){return `${currentCharacterId}|${name}`;}
function getOwned(g){return clamp(Number(state.owned[giftKey(g.name)])||0,0,999);}
function isSelected(g){return state.selected[giftKey(g.name)]!==false;}
function calculateTotalAffinity(){const lv=clamp(Number(state.bond.lv)||1,1,MAX_LEVEL);return Math.min(MAX_AFFECTION,(THRESHOLDS[lv-1]||0)+Math.max(0,Number(state.bond.inside)||0));}
function getLevelProgress(){const total=calculateTotalAffinity(),level=clamp(Number(state.bond.lv)||1,1,MAX_LEVEL),current=THRESHOLDS[level-1]||0,next=THRESHOLDS[level]||MAX_AFFECTION;return{level,total,remaining:Math.max(0,MAX_AFFECTION-total),progressInLevel:Math.max(0,total-current),levelRequirement:Math.max(1,next-current)};}

function renderCharacterSelector(){
  const grid=$('characters');if(!grid)return;
  const q=($('search')?.value||'').trim().toLowerCase();
  const list=NTE_CHARACTERS.filter(c=>c.name.toLowerCase().includes(q)||c.faction.toLowerCase().includes(q));
  grid.innerHTML=list.length?list.map(c=>`<button class="char-card ${c.id===currentCharacterId?'active':''}" data-character="${c.id}" title="${c.name} — ${c.faction}"><div class="fallback">${c.icon}</div><div class="char-info"><b>${c.name}</b><small>${c.faction}</small>${getBondGifts(c.id).length?'':'<span class="badge warning">No gift data</span>'}</div></button>`).join(''):'<div class="muted">No characters found.</div>';
  grid.querySelectorAll('[data-character]').forEach(b=>b.onclick=()=>{currentCharacterId=b.dataset.character;saveState();renderAll();});
}
function renderProfile(){
  const c=getCurrentCharacter(),p=getLevelProgress(),pct=Math.round(p.total/MAX_AFFECTION*100);
  if($('charName'))$('charName').textContent=c.name;if($('giftTitle'))$('giftTitle').textContent=`${c.name}'s Bond Gifts`;if($('heroName'))$('heroName').textContent=c.name.toUpperCase();
  if($('charMeta'))$('charMeta').innerHTML=`<span class="meta">${c.icon} ${c.faction}</span><span class="meta">❤️ Bond Lv.${p.level}</span>`;
  if($('bond'))$('bond').textContent=`Lv.${p.level}`;if($('total'))$('total').textContent=money(p.total);if($('need'))$('need').textContent=money(p.remaining);if($('fonsText'))$('fonsText').textContent=state.bond.fons?money(state.bond.fons):'—';if($('pct'))$('pct').textContent=`${pct}%`;
  if($('ring')){$('ring').style.setProperty('--pct',`${pct}%`);$('ring').setAttribute('aria-valuenow',pct);}
  if($('levelProgress'))$('levelProgress').innerHTML=`<div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100,p.progressInLevel/p.levelRequirement*100)}%"></div></div><small>${money(p.progressInLevel)} / ${money(p.levelRequirement)} AP to next level</small>`;
  if($('lv'))$('lv').value=p.level;if($('inside'))$('inside').value=state.bond.inside;if($('fons'))$('fons').value=state.bond.fons||'';if($('daily'))$('daily').value=state.giftsPerDay;
}
function getGiftIcon(g){const n=g.name.toLowerCase();if(n.includes('letter'))return'💌';if(n.includes('cinema'))return'🎟️';if(n.includes('kokoro'))return'🏍️';if(n.includes('asahi'))return'⚔️';if(n.includes('crime')||n.includes('book'))return'📕';if(g.affection>=1200)return'⭐';if(g.affection>=400)return'💎';if(g.affection>=200)return'🎁';if(/food|snack|bread|steak|fruity/.test(n))return'🍽️';return'🎀';}

function ensureGiftTools(){
  const grid=$('giftGrid');if(!grid||grid.dataset.toolsReady)return;grid.dataset.toolsReady='1';
  const bar=document.createElement('div');bar.id='giftTools';bar.className='gift-tools';bar.innerHTML=`<input id="giftSearch" class="gift-search" placeholder="🔎 Search gifts or locations…"><div class="gift-filters"><button class="gift-filter active" data-filter="all">All</button><button class="gift-filter" data-filter="shop">🛒 Shop</button><button class="gift-filter" data-filter="owned">🎒 Owned</button><button class="gift-filter" data-filter="free">🎁 Free</button><button class="gift-filter" data-filter="selected">✓ Selected</button></div>`;
  grid.parentNode.insertBefore(bar,grid);$('giftSearch').value=giftSearch;$('giftSearch').oninput=e=>{giftSearch=e.target.value.toLowerCase().trim();renderGiftList();};
  bar.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{giftFilter=b.dataset.filter;bar.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderGiftList();});
}
function renderGiftList(){
  const grid=$('giftGrid');if(!grid)return;ensureGiftTools();const all=getCurrentGifts();
  const list=all.filter(g=>{const text=!giftSearch||g.name.toLowerCase().includes(giftSearch)||g.location.toLowerCase().includes(giftSearch);const f=giftFilter==='all'||(giftFilter==='shop'&&g.availability==='shop')||(giftFilter==='owned'&&getOwned(g)>0)||(giftFilter==='free'&&['free','event','story'].includes(g.availability))||(giftFilter==='selected'&&isSelected(g));return text&&f;});
  if(!all.length){grid.innerHTML='<div class="empty-state"><div class="empty-icon">🔍</div><h3>No gift data yet</h3><p class="muted">This character has not been fully audited.</p></div>';return;}
  if(!list.length){grid.innerHTML='<div class="empty-state"><div class="empty-icon">🫥</div><h3>No matching gifts</h3><p class="muted">Try another filter or clear the search.</p></div>';return;}
  grid.innerHTML=list.map(g=>{const selected=isSelected(g),owned=getOwned(g),key=encodeURIComponent(g.name),price=g.price==null?'No Fons price':`${money(g.price)} Fons`,icon=({'shop':'🛒','gacha':'🎰','free':'🎁','paid':'💳','event':'📅','story':'📖','unknown':'❓'})[g.availability]||'📦';return `<article class="gift-card ${selected?'selected':''}"><div class="gift-header"><div class="gift-icon">${getGiftIcon(g)}</div><div class="gift-badges"><span class="badge affection">❤️ ${money(g.affection)} AP</span><span class="badge price">${price}</span><span class="badge availability">${icon} ${g.availability}</span></div></div><h3 class="gift-name">${g.name}</h3><div class="gift-location">📍 ${g.location}</div>${g.unlimited?'<span class="badge unlimited">∞ Unlimited</span>':''}<div class="gift-actions"><button class="btn-select ${selected?'on':''}" data-action="select" data-name="${key}" aria-pressed="${selected}">${selected?'✓ Selected':'Select'}</button><div class="owned-control"><button class="btn-minus" data-action="minus" data-name="${key}">−</button><input class="owned-input" data-action="owned" data-name="${key}" value="${owned}" type="number" min="0" max="999"><button class="btn-plus" data-action="plus" data-name="${key}">+</button></div></div></article>`;}).join('');
  grid.onclick=handleGiftAction;grid.onchange=handleGiftChange;
}
function handleGiftAction(e){const b=e.target.closest('[data-action]');if(!b)return;const name=decodeURIComponent(b.dataset.name),key=giftKey(name),a=b.dataset.action;if(a==='select')state.selected[key]=state.selected[key]===false;else if(a==='minus')state.owned[key]=clamp((state.owned[key]||0)-1,0,999);else if(a==='plus')state.owned[key]=clamp((state.owned[key]||0)+1,0,999);else return;saveState();renderGiftList();calculateRoute();}
function handleGiftChange(e){const input=e.target.closest('[data-action="owned"]');if(!input)return;state.owned[giftKey(decodeURIComponent(input.dataset.name))]=clamp(Number(input.value)||0,0,999);saveState();calculateRoute();}

// Finds the cheapest mixed-gift route while accounting for owned stock and overshoot.
function optimizeByCost(gifts,remaining){
  const maxAp=remaining+Math.max(...gifts.map(g=>g.affection));const INF=Infinity;const dp=new Float64Array(maxAp+1);dp.fill(INF);dp[0]=0;const prev=Array(maxAp+1).fill(null);
  // Bounded zero-cost inventory.
  for(const g of gifts){for(let n=getOwned(g);n>0;n--){for(let ap=maxAp;ap>=g.affection;ap--){if(dp[ap-g.affection]<dp[ap]){dp[ap]=dp[ap-g.affection];prev[ap]={g,owned:true,from:ap-g.affection};}}}}
  // Unbounded purchasable gifts.
  for(let ap=0;ap<=maxAp;ap++){if(dp[ap]===INF)continue;for(const g of gifts){if(g.price==null)continue;const next=ap+g.affection;if(next<=maxAp&&dp[ap]+g.price<dp[next]){dp[next]=dp[ap]+g.price;prev[next]={g,owned:false,from:ap};}}}
  let best=-1;for(let ap=remaining;ap<=maxAp;ap++)if(dp[ap]<INF&&(best<0||dp[ap]<dp[best]))best=ap;if(best<0)return null;
  const map=new Map();let cur=best;while(cur>0&&prev[cur]){const p=prev[cur],k=p.g.name,item=map.get(k)||{gift:p.g,count:0,owned:0,buy:0};item.count++;p.owned?item.owned++:item.buy++;map.set(k,item);cur=p.from;}
  return{plan:[...map.values()],left:Math.max(0,best-remaining),totalCost:dp[best]};
}
function chooseRoute(){
  const remaining=getLevelProgress().remaining,gifts=getCurrentGifts().filter(isSelected);if(!gifts.length)return{plan:[],remaining,left:remaining,totalCost:0};
  if(state.goal==='cheap'||state.goal==='balanced'){const exact=optimizeByCost(gifts,remaining);if(exact)return{...exact,remaining};}
  let sorted=[...gifts];if(state.goal==='fast')sorted.sort((a,b)=>b.affection-a.affection);else if(state.goal==='inventory')sorted.sort((a,b)=>getOwned(b)-getOwned(a)||b.affection-a.affection);else if(state.goal==='easy')sorted.sort((a,b)=>(a.availability==='shop'?0:1)-(b.availability==='shop'?0:1)||b.affection-a.affection);else sorted.sort((a,b)=>b.affection-a.affection);
  let left=remaining,plan=[];for(const g of sorted){if(left<=0)break;const owned=getOwned(g),needed=Math.ceil(left/g.affection),use=Math.min(owned,needed),buy=g.price!=null?needed-use:0;if(use+buy>0){plan.push({gift:g,count:use+buy,owned:use,buy});left=Math.max(0,left-(use+buy)*g.affection);}}
  return{plan,remaining,left,totalCost:plan.reduce((s,x)=>s+x.buy*(x.gift.price||0),0)};
}
function calculateRoute(){
  const r=chooseRoute(),totalAP=r.plan.reduce((s,x)=>s+x.count*x.gift.affection,0),gifts=r.plan.reduce((s,x)=>s+x.count,0),days=Math.ceil(gifts/state.giftsPerDay);
  if($('plan'))$('plan').innerHTML=r.plan.length?r.plan.map(x=>`<div class="plan-row"><div class="plan-icon">${getGiftIcon(x.gift)}</div><div class="plan-details"><b>${x.gift.name}</b><div class="muted">${x.count} × ${money(x.gift.affection)} AP · 📍 ${x.gift.location}</div>${x.owned?`<div class="muted">🎒 Using ${x.owned} owned</div>`:''}</div><b class="plan-cost">${x.buy?money(x.buy*(x.gift.price||0)):'Owned / free'}</b></div>`).join(''):'<div class="muted">Select at least one gift.</div>';
  const goals={cheap:'💰 Cheapest',fast:'⚡ Fastest',inventory:'🎒 Inventory first',easy:'📍 Easiest',balanced:'⚖ Balanced'};
  if($('summary'))$('summary').innerHTML=`<div class="summary-header"><div class="muted">Strategy</div><div class="big">${goals[state.goal]}</div></div><div class="summary-stats"><p><span class="green">❤️ ${money(totalAP)} AP planned</span></p><p>💰 <b>${money(r.totalCost)}</b> Fons</p><p>🎁 <b>${gifts}</b> gifts</p><p>⏱️ <b>${days}</b> day${days===1?'':'s'} at ${state.giftsPerDay}/day</p></div>${r.left>0?`<p class="warning">⚠️ ${money(r.left)} AP still missing</p>`:'<p class="success">✅ Route reaches Lv.10</p>'}`;
  if($('dailyButton'))$('dailyButton').disabled=!r.plan.length;
  const quick=$('giftQuickSummary');if(quick)quick.textContent=`${getCurrentGifts().filter(isSelected).length} selected · ${getCurrentGifts().reduce((s,g)=>s+getOwned(g),0)} owned · ${getCurrentGifts().length} available`;
}
function renderDailyPlan(){const r=chooseRoute(),panel=$('dailyPanel'),daysEl=$('days');if(!panel||!daysEl)return;const list=r.plan.flatMap(x=>Array(x.count).fill(x.gift)),days=[];for(let i=0;i<list.length;i+=state.giftsPerDay)days.push(list.slice(i,i+state.giftsPerDay));daysEl.innerHTML=days.length?days.map((items,i)=>`<div class="day-card"><h4>Day ${i+1}</h4>${items.map(g=>`<div class="day-gift"><span>${getGiftIcon(g)}</span><span>${g.name}</span><span class="muted">${money(g.affection)} AP</span></div>`).join('')}</div>`).join(''):'<div class="muted">No route planned.</div>';panel.classList.remove('hidden');panel.scrollIntoView({behavior:'smooth',block:'start'});}
function showToast(message,type='info'){const t=document.createElement('div');t.className=`toast toast-${type}`;t.textContent=message;document.body.appendChild(t);requestAnimationFrame(()=>t.classList.add('show'));setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),250)},2600);}
function updateLastSavedIndicator(){const el=$('lastSaved');if(el)el.textContent=`Saved ${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`;}
function debounce(fn,wait){let timer;return(...args)=>{clearTimeout(timer);timer=setTimeout(()=>fn(...args),wait);};}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`nte-bond-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);showToast('Backup downloaded','success');}
function setupEventListeners(){
  const search=$('search');if(search)search.addEventListener('input',debounce(renderCharacterSelector,180));
  ['lv','inside','fons'].forEach(id=>{const input=$(id);if(input)input.addEventListener('input',()=>{state.bond.lv=clamp(Number($('lv')?.value)||1,1,10);state.bond.inside=Math.max(0,Number($('inside')?.value)||0);state.bond.fons=Math.max(0,Number($('fons')?.value)||0);saveState();renderProfile();calculateRoute();});});
  document.querySelectorAll('.goal').forEach(b=>b.onclick=()=>{state.goal=b.dataset.goal;document.querySelectorAll('.goal').forEach(x=>x.classList.toggle('active',x===b));saveState();calculateRoute();});
  document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{state.bond.lv=Number(b.dataset.level);state.bond.inside=0;saveState();renderProfile();calculateRoute();});
  const daily=$('daily');if(daily)daily.onchange=()=>{state.giftsPerDay=clamp(Number(daily.value)||3,1,3);saveState();calculateRoute();};
  const actions={all:()=>{getCurrentGifts().forEach(g=>state.selected[giftKey(g.name)]=true);saveState();renderGiftList();calculateRoute();showToast('All gifts selected','success')},none:()=>{getCurrentGifts().forEach(g=>state.selected[giftKey(g.name)]=false);saveState();renderGiftList();calculateRoute();showToast('All gifts deselected')},daily:renderDailyPlan,reset:()=>{if(confirm('Reset this Bond tracker?')){localStorage.removeItem(STORAGE_KEY);location.reload();}},export:exportData,save:()=>{saveState();showToast('Saved','success')}};
  Object.entries(actions).forEach(([id,fn])=>{const b=$(id);if(b)b.onclick=fn;});
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();saveState();showToast('Saved','success');}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='e'){e.preventDefault();exportData();}});
}
function renderAll(){renderCharacterSelector();renderProfile();renderGiftList();calculateRoute();updateLastSavedIndicator();}
function initializeApp(){if($('lv'))$('lv').value=state.bond.lv;if($('inside'))$('inside').value=state.bond.inside;if($('fons'))$('fons').value=state.bond.fons||'';if($('daily'))$('daily').value=state.giftsPerDay;document.querySelectorAll('.goal').forEach(b=>b.classList.toggle('active',b.dataset.goal===state.goal));setupEventListeners();renderAll();}
document.addEventListener('DOMContentLoaded',initializeApp);