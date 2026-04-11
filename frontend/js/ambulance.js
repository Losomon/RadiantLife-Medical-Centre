
// ══ DATA ══════════════════════════════════════════
const INCIDENTS=[
  {id:'INC-2026-0047',type:'Road Traffic Accident',loc:'Ngong Rd / Dagoretti Corner',priority:'CRITICAL',status:'active',unit:'AMB-01',time:'10:14',victims:3,color:'red'},
  {id:'INC-2026-0046',type:'Cardiac Arrest',loc:'Westlands — Valley Arcade',priority:'CRITICAL',status:'active',unit:'AMB-04',time:'10:08',victims:1,color:'red'},
  {id:'INC-2026-0045',type:'Assault / Trauma',loc:'River Road, CBD',priority:'HIGH',status:'active',unit:'AMB-02',time:'09:52',victims:1,color:'amber'},
  {id:'INC-2026-0044',type:'Obstetric Emergency',loc:'Eastleigh, Section 1',priority:'HIGH',status:'closed',unit:'AMB-03',time:'08:30',victims:1,color:'green'},
  {id:'INC-2026-0043',type:'Respiratory Distress',loc:'Karen — Langata Road',priority:'MEDIUM',status:'closed',unit:'AMB-01',time:'07:45',victims:1,color:'green'},
  {id:'INC-2026-0042',type:'Road Traffic Accident',loc:'Thika Superhighway — KM 12',priority:'HIGH',status:'closed',unit:'AMB-02',time:'06:20',victims:4,color:'green'},
];
const FLEET_DATA=[
  {id:'AMB-01',type:'Advanced Life Support',status:'dispatched',crew:'James Mutua, Alice Njeri',fuel:72,km:84320,lastService:'12 Mar 2026',nextService:'12 Jun 2026',icon:'🚑'},
  {id:'AMB-02',type:'Advanced Life Support',status:'available',crew:'Brian Odhiambo, Sarah Kamau',fuel:95,km:61240,lastService:'20 Mar 2026',nextService:'20 Jun 2026',icon:'🚑'},
  {id:'AMB-03',type:'Basic Life Support',status:'returning',crew:'Peter Kimani, Grace Achieng',fuel:48,km:112800,lastService:'1 Mar 2026',nextService:'1 Jun 2026',icon:'🚑'},
  {id:'AMB-04',type:'Advanced Life Support',status:'dispatched',crew:'David Ndirangu, Ruth Wanjiru',fuel:81,km:44620,lastService:'15 Mar 2026',nextService:'15 Jun 2026',icon:'🚑'},
  {id:'AMB-05',type:'Patient Transport',status:'available',crew:'Hassan Omar, Faith Mwende',fuel:100,km:28900,lastService:'22 Mar 2026',nextService:'22 Jun 2026',icon:'🚐'},
  {id:'AMB-06',type:'Basic Life Support',status:'maintenance',crew:'Unassigned',fuel:0,km:155400,lastService:'18 Feb 2026',nextService:'In service',icon:'🔧'},
];
const TIMELINE=[
  {time:'10:14',color:'red',text:'<strong>Call received</strong> — RTA reported Ngong Rd'},
  {time:'10:15',color:'amber',text:'<strong>AMB-01 dispatched</strong> — James Mutua crew'},
  {time:'10:16',color:'cyan',text:'Pre-arrival alert sent to <strong>MediCore ER</strong>'},
  {time:'10:18',color:'amber',text:'<strong>On scene</strong> — 3 patients found'},
  {time:'10:19',color:'red',text:'Morphine 5mg IV administered'},
  {time:'10:22',color:'green',text:'Patient stabilised — en route'},
  {time:'10:24',color:'cyan',text:'Pre-arrival report transmitted'},
  {time:'10:28',color:'green',text:'<strong>Arrived MediCore</strong> — handover in progress'},
];
const ALERT_FEED=[
  {time:'10:14',msg:'NEW CRITICAL — Ngong Rd RTA',color:'red'},
  {time:'10:08',msg:'CARDIAC ARREST dispatched — Westlands',color:'red'},
  {time:'09:52',msg:'ASSAULT case — CBD. AMB-02 en route',color:'amber'},
  {time:'09:30',msg:'AMB-03 returning to base post-call',color:'green'},
];

// ══ RENDERS ═══════════════════════════════════════
function renderDispatch(){
  document.getElementById('incList').innerHTML=INCIDENTS.filter(i=>i.status==='active').map((inc,i)=>`
    <div class="inc-card${i===0?' active '+inc.color+'-b':' '+inc.color+'-b'}" onclick="selectInc(${i})">
      <div class="inc-priority">
        <div class="inc-code">${inc.id}</div>
        <div class="inc-time-ago">${inc.time}</div>
      </div>
      <div class="inc-type">${inc.type}</div>
      <div class="inc-location"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> ${inc.loc}</div>
      <div class="inc-tags">
        <span class="inc-tag ${inc.priority==='CRITICAL'?'it-red':inc.priority==='HIGH'?'it-amber':'it-blue'}">${inc.priority}</span>
        <span class="inc-tag it-cyan">${inc.unit}</span>
        <span class="inc-tag it-green">${inc.victims} PT${inc.victims>1?'S':''}</span>
      </div>
      <div class="inc-unit">
        <div class="inc-unit-name">🚑 ${inc.unit} DISPATCHED</div>
        <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();showPanel('prearrival')">PAR →</button>
      </div>
    </div>`).join('');

  document.getElementById('fleetSidebarList').innerHTML=FLEET_DATA.map(f=>{
    const cls=f.status==='available'?'fi-available':f.status==='dispatched'?'fi-dispatched':f.status==='returning'?'fi-standby':'fi-maintenance';
    const bc=f.status==='available'?'fb-avail':f.status==='dispatched'?'fb-disp':f.status==='returning'?'fb-stand':'fb-maint';
    return `<div class="fleet-item">
      <div class="fleet-indicator ${cls}">${f.icon}</div>
      <div><div class="fleet-name">${f.id}</div><div class="fleet-status">${f.crew.split(',')[0]}</div></div>
      <div class="fleet-badge ${bc}">${f.status.toUpperCase()}</div>
    </div>`;
  }).join('');

  document.getElementById('alertFeed').innerHTML=ALERT_FEED.map(a=>`
    <div class="alert-item" style="border-left-color:${a.color==='red'?'var(--red)':a.color==='amber'?'var(--amb)':'var(--phos)'}">
      <div class="alert-time">${a.time}</div>
      <div class="alert-msg">${a.msg}</div>
    </div>`).join('');
}

function renderTimeline(){
  document.getElementById('incTimeline').innerHTML=TIMELINE.map(t=>`
    <div class="tl-item">
      <div class="tl-time">${t.time}</div>
      <div class="tl-dot" style="background:${t.color==='red'?'var(--red)':t.color==='amber'?'var(--amb)':t.color==='cyan'?'var(--cyn)':'var(--phos)'}"></div>
      <div class="tl-text">${t.text}</div>
    </div>`).join('');
}

function renderFleet(){
  const counts={available:0,dispatched:0,returning:0,maintenance:0};
  FLEET_DATA.forEach(f=>counts[f.status]=(counts[f.status]||0)+1);
  document.getElementById('fleetStats').innerHTML=[
    {n:FLEET_DATA.length,l:'TOTAL UNITS',c:'var(--t1)'},
    {n:counts.available||0,l:'AVAILABLE',c:'var(--phos)'},
    {n:counts.dispatched||0,l:'DISPATCHED',c:'var(--red)'},
    {n:counts.returning||0,l:'RETURNING',c:'var(--amb)'},
    {n:counts.maintenance||0,l:'IN SERVICE',c:'var(--t3)'},
  ].map(s=>`<div class="fstat"><div class="fstat-n" style="color:${s.c}">${s.n}</div><div class="fstat-l">${s.l}</div></div>`).join('');

  document.getElementById('fleetGrid').innerHTML=FLEET_DATA.map(f=>{
    const colMap={available:'var(--phos)',dispatched:'var(--red)',returning:'var(--amb)',maintenance:'var(--t3)'};
    const bc2={available:'fb-avail',dispatched:'fb-disp',returning:'fb-stand',maintenance:'fb-maint'};
    const col=colMap[f.status];
    const fuelCol=f.fuel>60?'var(--phos)':f.fuel>30?'var(--amb)':'var(--red)';
    return `<div class="fleet-card">
      <div class="fc-top">
        <div class="fc-icon" style="background:${col}15;border-color:${col}40;font-size:18px">${f.icon}</div>
        <div><div class="fc-id">${f.id}</div><div class="fc-type">${f.type}</div></div>
        <div class="fc-status-badge"><span class="fleet-badge ${bc2[f.status]}">${f.status.toUpperCase()}</span></div>
      </div>
      <div class="fc-body">
        <div class="fc-row"><span class="fc-lbl">Crew</span><span class="fc-val" style="font-size:11px">${f.crew}</span></div>
        <div class="fc-row"><span class="fc-lbl">Fuel level</span><span class="fc-val" style="color:${fuelCol}">${f.fuel}%</span></div>
        <div class="fc-row"><span class="fc-lbl">Total km</span><span class="fc-val">${f.km.toLocaleString()} km</span></div>
        <div class="fc-row"><span class="fc-lbl">Last service</span><span class="fc-val">${f.lastService}</span></div>
        <div class="fc-row"><span class="fc-lbl">Next service</span><span class="fc-val" style="color:${f.status==='maintenance'?'var(--red)':'var(--t1)'}">${f.nextService}</span></div>
      </div>
      <div class="fc-foot">
        <button class="btn btn-ghost btn-xs" onclick="toast('${f.id} tracking opened','doc')">TRACK</button>
        <button class="btn btn-ghost btn-xs" onclick="toast('${f.id} service log','doc')">SERVICE LOG</button>
        ${f.status==='available'?`<button class="btn btn-red btn-xs" onclick="toast('${f.id} dispatched','crit')">DISPATCH</button>`:''}
      </div>
    </div>`;
  }).join('');
}

function renderIncidentLog(){
  document.getElementById('incidentList').innerHTML=INCIDENTS.map((inc,i)=>`
    <div class="il-item${i===0?' sel':''}" onclick="selectIncidentLog(${i},this)">
      <div class="il-code">
        <span>${inc.id}</span>
        <span class="inc-tag ${inc.status==='active'?'it-red':'it-green'}">${inc.status.toUpperCase()}</span>
      </div>
      <div class="il-type">${inc.type}</div>
      <div class="il-loc">${inc.loc}</div>
      <div class="il-meta">
        <span class="inc-tag ${inc.priority==='CRITICAL'?'it-red':inc.priority==='HIGH'?'it-amber':'it-blue'}">${inc.priority}</span>
        <span class="inc-tag it-cyan">${inc.unit}</span>
        <span style="font-size:9px;color:var(--t3);margin-left:auto">${inc.time}</span>
      </div>
    </div>`).join('');
  renderIncidentDetail(0);
}

function renderIncidentDetail(idx){
  const inc=INCIDENTS[idx];
  document.getElementById('incidentDetail').innerHTML=`
    <div style="font-size:9px;color:var(--t3);margin-bottom:6px;letter-spacing:2px">${inc.id}</div>
    <div style="font-family:'Orbitron',monospace;font-size:16px;font-weight:700;color:var(--t1);margin-bottom:5px;text-shadow:0 0 8px rgba(0,255,136,0.3)">${inc.type}</div>
    <div style="display:flex;gap:7px;margin-bottom:18px">
      <span class="inc-tag ${inc.priority==='CRITICAL'?'it-red':inc.priority==='HIGH'?'it-amber':'it-blue'}">${inc.priority}</span>
      <span class="inc-tag ${inc.status==='active'?'it-red':'it-green'}">${inc.status.toUpperCase()}</span>
      <span class="inc-tag it-cyan">${inc.unit}</span>
    </div>
    <div class="sec-card" style="margin-bottom:13px">
      <div class="sc-head"><div class="sc-title">Incident details</div></div>
      <div class="sc-body">
        <div class="idr"><span class="idrl">LOCATION</span><span class="idrv">${inc.loc}</span></div>
        <div class="idr"><span class="idrl">TIME CALLED</span><span class="idrv">${inc.time} AM</span></div>
        <div class="idr"><span class="idrl">PATIENTS</span><span class="idrv">${inc.victims}</span></div>
        <div class="idr"><span class="idrl">UNIT ASSIGNED</span><span class="idrv">${inc.unit}</span></div>
        <div class="idr"><span class="idrl">STATUS</span><span class="idrv ${inc.status==='active'?'crit':'ok'}">${inc.status==='active'?'● ACTIVE — IN PROGRESS':'● CLOSED — COMPLETED'}</span></div>
      </div>
    </div>
    <div class="sec-card" style="margin-bottom:13px">
      <div class="sc-head"><div class="sc-title">Timeline</div></div>
      <div class="sc-body" style="padding:10px">
        ${TIMELINE.slice(0,5).map(t=>`<div class="tl-item"><div class="tl-time">${t.time}</div><div class="tl-dot" style="background:${t.color==='red'?'var(--red)':t.color==='amber'?'var(--amb)':t.color==='cyan'?'var(--cyn)':'var(--phos)'}"></div><div class="tl-text">${t.text}</div></div>`).join('')}
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:4px">
      <button class="btn btn-ghost btn-sm" onclick="toast('Report exported','doc')">EXPORT</button>
      <button class="btn btn-blue btn-sm" onclick="showPanel('handover')">VIEW HANDOVER</button>
      ${inc.status==='active'?`<button class="btn btn-green btn-sm" onclick="toast('${inc.id} CLOSED','check')">CLOSE INCIDENT</button>`:''}
    </div>`;
}

// ══ ACTIONS ═══════════════════════════════════════
function showPanel(p){
  document.querySelectorAll('.panel').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.nt').forEach(x=>x.classList.remove('on'));
  document.getElementById('panel-'+p).classList.add('on');
  const map={dispatch:0,prearrival:1,handover:2,fleet:3,incidents:4};
  document.querySelectorAll('.nt')[map[p]]?.classList.add('on');
}
function selectInc(i){
  const inc=INCIDENTS.filter(x=>x.status==='active')[i];
  document.getElementById('idbTitle').textContent=`${inc.id} · ${inc.type} — ${inc.victims} patient${inc.victims>1?'s':''}`;
  document.getElementById('idbMeta').textContent=`${inc.loc} · ${inc.unit} en route · Priority: ${inc.priority}`;
  document.querySelectorAll('.inc-card').forEach((c,idx)=>{c.classList.toggle('active',idx===i)});
}
function selectIncidentLog(i,el){
  document.querySelectorAll('.il-item').forEach(x=>x.classList.remove('sel'));
  el.classList.add('sel');renderIncidentDetail(i);
}
function dispatchUnit(){toast('AMB-02 DISPATCHED to INC-2026-0047','crit');document.getElementById('availUnits').textContent='1 UNIT AVAIL'}
function newEmergency(){document.getElementById('emergencyModal').classList.add('show')}
function closeModal(){document.getElementById('emergencyModal').classList.remove('show')}
function createIncident(){closeModal();toast('INC-2026-0048 CREATED — AMB-02 DISPATCHED','crit')}
function sendPAR(){toast('PRE-ARRIVAL REPORT TRANSMITTED — RED ALERT ACTIVATED','crit')}
function completeHandover(){toast('HANDOVER COMPLETE — PATIENT RECORD CREATED IN HMS','check')}
function toggleModal(){newEmergency()}
function filterIncidents(v){toast('Searching: '+v,'doc')}
function setIncFilter(el,f){document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('on'));el.classList.add('on')}
function selOpt(gid,el){document.querySelectorAll('#'+gid+' .trauma-opt').forEach(o=>o.classList.remove('on'));el.classList.add('on')}
function setStep(i){document.querySelectorAll('.ho-step').forEach((s,j)=>{s.classList.toggle('done',j<i);s.classList.toggle('active',j===i)})}
function sign(id,name){const el=document.getElementById(id);el.textContent='✔ SIGNED — '+name;el.classList.add('signed')}

// ══ TOAST ═════════════════════════════════════════
let tTm;
function toast(msg,type){
  const icons={check:'<polyline points="20 6 9 17 4 12"/>',crit:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/>',doc:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>'};
  const colors={check:'var(--phos)',crit:'var(--red)',info:'var(--cyn)',doc:'var(--blu)'};
  document.getElementById('toastIcon').innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="${colors[type]||colors.info}" stroke-width="2.5">${icons[type]||icons.info}</svg>`;
  document.getElementById('toastMsg').textContent=msg;
  const t=document.getElementById('toast');
  t.classList.toggle('crit-toast',type==='crit');
  t.classList.add('show');
  clearTimeout(tTm);tTm=setTimeout(()=>t.classList.remove('show'),3400);
}

// ══ CLOCK ═════════════════════════════════════════
setInterval(()=>{
  const n=new Date();
  document.getElementById('topClock').textContent=[n.getHours(),n.getMinutes(),n.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':');
},1000);

// ══ AMB ANIMATION ═════════════════════════════════
let tick=0;
setInterval(()=>{
  tick++;
  const a1=document.getElementById('amb-AMB01');
  const a4=document.getElementById('amb-AMB04');
  if(a1){a1.style.left=(58+Math.sin(tick*.04)*3)+'%';a1.style.top=(42+Math.cos(tick*.03)*2)+'%'}
  if(a4){a4.style.left=(42+Math.sin(tick*.05+1)*2)+'%';a4.style.top=(72+Math.cos(tick*.04)*1.5)+'%'}
},900);

// ══ MODAL CLOSE ON BACKDROP ═══════════════════════
document.getElementById('emergencyModal').addEventListener('click',function(e){if(e.target===this)closeModal()});

// ══ INIT ══════════════════════════════════════════
renderDispatch();renderTimeline();renderFleet();renderIncidentLog();
