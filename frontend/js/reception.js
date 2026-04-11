// ══ DATA ═══════════════════════════════════════════
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
let calYear=2026,calMonth=2,selDay=27;

const CAL_EVENTS={
  3:['sky','pine'],5:['sky'],8:['pine','rust'],10:['sky'],
  12:['plum'],14:['sky','pine'],17:['sky'],18:['amber'],
  20:['sky','pine','plum'],22:['sky'],24:['sky','pine'],
  26:['sky','pine','rust','plum','amber'],27:['sky'],28:['pine'],31:['sky']
};

const DAY_SLOTS={
  27:[
    {time:'08:00',patient:'Agnes W. Kimani',type:'Diabetic clinic follow-up',doc:'Dr. Omondi',dur:'30 min',status:'done',cls:'type-followup'},
    {time:'08:30',patient:'James Otieno',type:'Post-op review',doc:'Dr. Njoroge',dur:'45 min',status:'done',cls:'type-procedure'},
    {time:'09:00',patient:'Mary Mwangi',type:'ANC — 28 weeks',doc:'Dr. Waweru',dur:'30 min',status:'done',cls:'type-anc'},
    {time:'09:30',patient:'Peter Kamau',type:'General OPD',doc:'Dr. Omondi',dur:'30 min',status:'pending',cls:'type-consult'},
    {time:'10:00',patient:'Grace Akinyi',type:'Hypertension f/up',doc:'Dr. Achieng',dur:'30 min',status:'pending',cls:'type-followup'},
    {time:'10:30',patient:'Walk-in — Emergency',type:'Triage assessment',doc:'Dr. Njoroge',dur:'—',status:'urgent',cls:'type-emergency'},
    {time:'11:00',patient:'Samuel Korir',type:'Lab results review',doc:'Dr. Omondi',dur:'20 min',status:'pending',cls:'type-consult'},
    {time:'11:30',patient:'Faith Wambua',type:'Vaccination (HPV)',doc:'Dr. Waweru',dur:'15 min',status:'pending',cls:'type-consult'},
  ]
};

const QUEUE_OPD=[
  {num:'A-043',name:'Peter Kamau',age:'45M',type:'General OPD',wait:'8 min',urgent:false},
  {num:'A-044',name:'Faith Wambua',age:'22F',type:'Vaccination',wait:'22 min',urgent:false},
  {num:'A-045',name:'Hassan Omar',age:'55M',type:'General OPD',wait:'36 min',urgent:false},
  {num:'A-046',name:'Esther Njeri',age:'31F',type:'Follow-up',wait:'48 min',urgent:false},
  {num:'A-047',name:'John Mwenda',age:'28M',type:'General OPD',wait:'52 min',urgent:false},
  {num:'A-048',name:'Susan Kamau',age:'67F',type:'Review',wait:'1 hr 5 min',urgent:false},
];
const QUEUE_SPEC=[
  {num:'B-018',name:'Ruth Chepkemoi',age:'47F',type:'Cardiology',wait:'15 min',urgent:false},
  {num:'B-019',name:'David Ndirangu',age:'38M',type:'Orthopaedics',wait:'40 min',urgent:false},
  {num:'B-020',name:'Alice Wafula',age:'52F',type:'Endocrinology',wait:'55 min',urgent:false},
  {num:'B-021',name:'Mark Ochieng',age:'44M',type:'Dermatology',wait:'1 hr 10 min',urgent:false},
];
const QUEUE_EMERG=[
  {num:'E-007',name:'Unknown — RTA',age:'—',type:'Road traffic accident',wait:'2 min',urgent:true},
  {num:'E-008',name:'Brian Mutua',age:'8M',type:'High fever — child',wait:'5 min',urgent:true},
];

const CHECKED_IN=[
  {initials:'AK',bg:'rgba(26,60,122,0.12)',fg:'var(--cobalt)',name:'Agnes W. Kimani',id:'PRG-2026-0047',since:'08:12',dept:'Diabetic Clinic',status:'In consultation'},
  {initials:'JO',bg:'rgba(106,16,48,0.1)',fg:'var(--burgundy)',name:'James Otieno',id:'PRG-2026-0103',since:'08:35',dept:'Surgery ward',status:'Post-op observation'},
  {initials:'MM',bg:'rgba(58,96,64,0.1)',fg:'var(--sage)',name:'Mary Mwangi',id:'PRG-2026-0211',since:'09:02',dept:'ANC Clinic',status:'In consultation'},
  {initials:'GA',bg:'rgba(26,88,96,0.1)',fg:'var(--teal)',name:'Grace Akinyi',id:'PRG-2026-0312',since:'09:48',dept:'General OPD',status:'Waiting for doctor'},
  {initials:'PK',bg:'rgba(122,80,16,0.12)',fg:'var(--ochre)',name:'Peter Kamau',id:'PRG-2026-0089',since:'10:05',dept:'General OPD',status:'Waiting for doctor'},
];
const CHECKOUT_READY=[
  {initials:'RC',bg:'rgba(26,60,122,0.1)',fg:'var(--cobalt)',name:'Ruth Chepkemoi',id:'PRG-2026-0067',since:'07:30',dept:'Physiotherapy'},
  {initials:'DN',bg:'rgba(122,40,24,0.1)',fg:'var(--rust)',name:'David Ndirangu',id:'PRG-2026-0445',since:'08:00',dept:'Orthopaedics'},
  {initials:'HO',bg:'rgba(58,96,64,0.1)',fg:'var(--sage)',name:'Hassan Omar',id:'PRG-2026-0391',since:'08:20',dept:'Lab collection'},
];

const INS_HISTORY=[
  {initials:'SK',bg:'rgba(106,16,48,0.1)',fg:'var(--burgundy)',name:'Samuel Korir',provider:'Britam',amount:'KES 12,400',status:'Approved',ok:true},
  {initials:'GA',bg:'rgba(26,88,96,0.1)',fg:'var(--teal)',name:'Grace Akinyi',provider:'NHIF',amount:'KES 4,800',status:'Approved',ok:true},
  {initials:'MM',bg:'rgba(58,96,64,0.1)',fg:'var(--sage)',name:'Mary Mwangi',provider:'AAR Health',amount:'KES 8,200',status:'Approved',ok:true},
  {initials:'PK',bg:'rgba(122,80,16,0.1)',fg:'var(--ochre)',name:'Peter Kamau',provider:'Self-pay',amount:'KES 1,500',status:'Self-pay',ok:null},
  {initials:'DN',bg:'rgba(122,40,24,0.08)',fg:'var(--rust)',name:'David Ndirangu',provider:'CIC Insurance',amount:'KES 6,200',status:'Approved',ok:true},
];

// ══ NAVIGATION ══════════════════════════════════════
const PANEL_META={
  appointments:{title:'Appointment Calendar',action:'Book Appointment',actionFn:'openBookingModal()'},
  queue:{title:'Queue Management',action:'Call Next',actionFn:'callNext()'},
  checkin:{title:'Check-in / Check-out',action:'New Walk-in',actionFn:'fillCheckinSearch(\"Walk-in\")'},
  insurance:{title:'Insurance Verification',action:'Batch Verify',actionFn:'toast(\"Batch verification started\",\"shield\")'},
};

function show(panel){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.sb-item').forEach(i=>i.classList.remove('on'));
  document.getElementById('panel-'+panel).classList.add('on');
  document.querySelectorAll('.sb-item').forEach(i=>{
    if(i.getAttribute('onclick')&&i.getAttribute('onclick').includes("'"+panel+"'"))i.classList.add('on');
  });
  const m=PANEL_META[panel];
  document.getElementById('topTitle').textContent=m.title;
  document.getElementById('topAction').textContent=m.action;
  document.getElementById('topAction').setAttribute('onclick',m.actionFn);
}

// ══ CALENDAR ════════════════════════════════════════
function renderCal(){
  document.getElementById('calLabel').textContent=MONTHS[calMonth]+' '+calYear;
  const DOWS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let h=DOWS.map(d=>`<div class="cal-dow">${d}</div>`).join('');
  const firstDay=new Date(calYear,calMonth,1).getDay();
  const daysInMonth=new Date(calYear,calMonth+1,0).getDate();
  const prevDays=new Date(calYear,calMonth,0).getDate();
  for(let i=0;i<firstDay;i++){
    h+=`<div class="cal-cell other"><div class="cal-day-num">${prevDays-firstDay+i+1}</div></div>`;
  }
  for(let d=1;d<=daysInMonth;d++){
    const isToday=d===27&&calMonth===2&&calYear===2026;
    const isSel=d===selDay&&calMonth===2&&calYear===2026;
    const evs=(CAL_EVENTS[d]||[]).slice(0,3).map(c=>`<div class="cal-event cal-ev-${c}">${c==='sky'?'OPD':c==='pine'?'Follow':c==='rust'?'Emrg':c==='plum'?'Spec':'ANC'}</div>`).join('');
    h+=`<div class="cal-cell${isSel?' selected':isToday?' today':''}" onclick="selectCalDay(${d})">
      <div class="cal-day-num">${d}</div>${evs}
    </div>`;
  }
  document.getElementById('calGrid').innerHTML=h;
  renderDaySlots(selDay);
}
function changeMonth(d){calMonth+=d;if(calMonth>11){calMonth=0;calYear++;}if(calMonth<0){calMonth=11;calYear--;}renderCal();}
function selectCalDay(d){selDay=d;document.getElementById('dayDetailTitle').textContent=`${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date(calYear,calMonth,d).getDay()]}, ${d} ${MONTHS[calMonth]}`;renderCal();}
function renderDaySlots(d){
  const slots=DAY_SLOTS[d]||[];
  const cont=document.getElementById('daySlots');
  if(!slots.length){cont.innerHTML=`<div class="slot-empty">No appointments scheduled</div>`;return;}
  document.getElementById('dayDetailCount').textContent=slots.length+' appointments scheduled';
  cont.innerHTML=slots.map(s=>{
    const sb=s.status==='done'?'<span class="bdg bdg-sage no-dot" style="font-size:9px">Done</span>':
      s.status==='urgent'?'<span class="bdg bdg-rust no-dot" style="font-size:9px">Urgent</span>':
      '<span class="bdg bdg-ochre no-dot" style="font-size:9px">Pending</span>';
    return `<div class="appt-slot ${s.cls}">
      <div class="slot-time">${s.time}</div>
      <div class="slot-div"></div>
      <div class="slot-info">
        <div class="slot-pt">${s.patient}</div>
        <div class="slot-type">${s.type}</div>
        <div class="slot-doc">${s.doc} · ${s.dur}</div>
      </div>
      <div class="slot-acts">
        ${sb}
        <button class="btn btn-ghost btn-xs" style="margin-top:4px" onclick="toast('Opening patient record','user')">View</button>
      </div>
    </div>`;
  }).join('');
}

// ══ QUEUE ════════════════════════════════════════════
function renderQueue(){
  const stats=[
    {n:14,l:'In queue',c:'var(--cobalt)'},
    {n:3,l:'Called',c:'var(--ochre)'},
    {n:11,l:'Seen today',c:'var(--sage)'},
    {n:2,l:'Emergency',c:'var(--rust)'},
    {n:'~28',l:'Avg wait (min)',c:'var(--ink-mid)'},
  ];
  document.getElementById('queueStats').innerHTML=stats.map(s=>`<div class="qs"><div class="qs-n" style="color:${s.c}">${s.n}</div><div class="qs-l">${s.l}</div></div>`).join('');
  document.getElementById('queueOPD').innerHTML=renderQueueList(QUEUE_OPD);
  document.getElementById('queueSpec').innerHTML=renderQueueList(QUEUE_SPEC);
  document.getElementById('queueEmerg').innerHTML=renderQueueList(QUEUE_EMERG);
}
function renderQueueList(list){
  return list.map(q=>`<div class="q-item${q.urgent?' urgent':''}">
    <div class="q-num">${q.num}</div>
    <div class="q-div"></div>
    <div class="q-info"><div class="q-name">${q.name}</div><div class="q-meta">${q.age} · ${q.type}</div></div>
    <div class="q-wait"><strong>${q.wait}</strong>waiting</div>
    <div class="q-acts">
      <button class="ra" onclick="callPatient('${q.num}','${q.name}')" title="Call">
        <svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
      </button>
      <button class="ra" onclick="toast('Opening record for ${q.name}','user')">
        <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
    </div>
  </div>`).join('');
}
let queueNum=42;
function callNext(){
  queueNum++;
  const n=QUEUE_OPD[0];
  if(n){document.getElementById('nowServing').textContent='A-0'+queueNum;document.getElementById('nowName').textContent=n.name;}
  toast('Called A-0'+queueNum+(n?' · '+n.name:'')+'  — Room 3','speaker');
}
function callPatient(num,name){
  document.getElementById('nowServing').textContent=num;
  document.getElementById('nowName').textContent=name;
  toast('Calling '+num+' · '+name+' — Room 3','speaker');
}

// ══ CHECK-IN ══════════════════════════════════════════
function searchCheckin(val){
  if(val.length>2)setTimeout(()=>{document.getElementById('checkinResult').style.display='block';},200);
  else document.getElementById('checkinResult').style.display='none';
}
function fillCheckinSearch(val){document.getElementById('checkinSearch').value=val;searchCheckin(val);}
function checkIn(){
  document.getElementById('checkinResult').style.display='none';
  document.getElementById('checkinSearch').value='';
  document.getElementById('checkinCount').textContent='12 patients currently in facility';
  toast('Agnes Kimani checked in — Queue A-049','check');
}
function renderCheckedIn(){
  document.getElementById('checkedInList').innerHTML=CHECKED_IN.map(p=>
    `<div class="checkout-item">
      <div class="co-av" style="background:${p.bg};color:${p.fg}">${p.initials}</div>
      <div class="co-info"><div class="co-name">${p.name}</div><div class="co-meta">${p.dept} · ${p.status}</div></div>
      <div style="text-align:right">
        <div class="co-time">${p.since}</div>
        <button class="btn btn-ghost btn-xs" style="margin-top:3px;font-size:9px" onclick="toast('${p.name} checked out','check')">Check out</button>
      </div>
    </div>`).join('');
  document.getElementById('checkoutList').innerHTML=CHECKOUT_READY.map(p=>
    `<div class="checkout-item">
      <div class="co-av" style="background:${p.bg};color:${p.fg}">${p.initials}</div>
      <div class="co-info"><div class="co-name">${p.name}</div><div class="co-meta">${p.dept} · Checked in ${p.since}</div></div>
      <button class="btn btn-brass btn-xs" onclick="toast('${p.name} checked out — bill generated','check')">Check out</button>
    </div>`).join('');
}

// ══ INSURANCE ════════════════════════════════════════
function updateInsResult(){}
function verifyInsurance(){
  const prov=document.getElementById('insProvider').value;
  const pol=document.getElementById('insPolicyNum').value.trim();
  if(!prov){toast('Please select an insurance provider','alert');return;}
  document.getElementById('insResult').style.display='block';
  const names={cic:'CIC Insurance',aar:'AAR Health',jubilee:'Jubilee Insurance',nhif:'NHIF',britam:'Britam',apa:'APA Insurance'};
  document.getElementById('insProviderName').textContent=names[prov]||prov;
  document.getElementById('insPolicyDisplay').textContent=pol||'N/A';
  const valid=pol.length>3;
  const card=document.getElementById('insResultCard');
  const head=document.getElementById('insResultHead');
  const icon=document.getElementById('insCheckIcon');
  const statusTxt=document.getElementById('insStatusText');
  if(valid){
    card.className='ins-result valid-result';
    head.className='ins-result-head valid';
    icon.className='ins-check-icon valid';
    icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    statusTxt.textContent='✓ Cover verified and active';statusTxt.style.color='var(--sage)';
    document.getElementById('insExpiry').textContent='31 Dec 2026';
    document.getElementById('insProgFill').style.width='17%';
    document.getElementById('insProgFill').style.background='linear-gradient(90deg,var(--sage),#4a9060)';
    document.getElementById('insUsedLabel').textContent='KES 86,400 of KES 500,000';
    document.getElementById('insRemaining').textContent='KES 413,600 remaining';
  } else {
    card.className='ins-result invalid-result';
    head.className='ins-result-head invalid';
    icon.className='ins-check-icon invalid';
    icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    statusTxt.textContent='✗ Policy not found or inactive';statusTxt.style.color='var(--rust)';
  }
  toast(valid?'Cover verified — '+names[prov]:'Policy not found — check details','shield');
}
function renderInsHistory(){
  document.getElementById('insHistory').innerHTML=INS_HISTORY.map(h=>{
    const iconPath=h.ok===true?'<polyline points="20 6 9 17 4 12"/>':h.ok===false?'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>':'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>';
    const bg=h.ok===true?'linear-gradient(160deg,#4a8060,var(--sage))':h.ok===false?'linear-gradient(160deg,#a04030,var(--rust))':'linear-gradient(160deg,#a07030,var(--ochre))';
    return `<div class="ins-hist-item">
      <div class="ih-icon" style="background:${bg}">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">${iconPath}</svg>
      </div>
      <div class="ih-info">
        <div class="ih-title">${h.name}</div>
        <div class="ih-meta">${h.provider}</div>
      </div>
      <div>
        <div class="ih-amount">${h.amount}</div>
        <div class="ih-status"><span class="bdg ${h.ok===true?'bdg-sage':h.ok===false?'bdg-rust':'bdg-gray'} no-dot" style="font-size:9px">${h.status}</span></div>
      </div>
    </div>`;
  }).join('');
}

// ══ MODAL ════════════════════════════════════════════
function openBookingModal(){document.getElementById('bookingModal').classList.add('show')}
function closeModal(){document.getElementById('bookingModal').classList.remove('show')}
function bookAppointment(){closeModal();toast('Appointment booked — SMS reminder scheduled','check');renderCal();}
document.getElementById('bookingModal').addEventListener('click',function(e){if(e.target===this)closeModal()});

// ══ TOAST ════════════════════════════════════════════
let toastTimer;
function toast(msg,icon){
  const t=document.getElementById('toast');
  const icons={
    check:'<polyline points="20 6 9 17 4 12"/>',
    alert:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    user:'<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    speaker:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/>',
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  };
  document.getElementById('toastIcon').innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${icons[icon]||icons.check}</svg>`;
  document.getElementById('toastMsg').textContent=msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),3200);
}

// ══ DARK MODE (aged parchment toggle) ═══════════════
let dark=false;
function toggleDark(){
  dark=!dark;
  document.body.toggleAttribute('data-dark',dark);
  if(dark){
    document.documentElement.style.setProperty('--marble-white','#1a1410');
    document.documentElement.style.setProperty('--marble-light','#201a14');
    document.documentElement.style.setProperty('--marble-cream','#28200c');
    document.documentElement.style.setProperty('--marble-warm','#30280a');
    document.documentElement.style.setProperty('--marble-mid','#40341a');
    document.documentElement.style.setProperty('--marble-deep','#504028');
    document.documentElement.style.setProperty('--marble-shadow','#60503a');
    document.documentElement.style.setProperty('--ink','#e8d8b0');
    document.documentElement.style.setProperty('--ink-mid','#c8b090');
    document.documentElement.style.setProperty('--ink-light','#a89070');
    document.documentElement.style.setProperty('--ink-dim','#887050');
    document.documentElement.style.setProperty('--ink-faint','#685038');
    document.getElementById('themeIcon').innerHTML='<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
  } else {
    ['--marble-white','--marble-light','--marble-cream','--marble-warm','--marble-mid','--marble-deep','--marble-shadow','--ink','--ink-mid','--ink-light','--ink-dim','--ink-faint'].forEach(v=>document.documentElement.style.removeProperty(v));
    document.getElementById('themeIcon').innerHTML='<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
  }
}

// ══ SEARCH ════════════════════════════════════════════
function globalSearch(v){if(v.length>2)toast('Searching for "'+v+'"…','user');}

// ══ LIVE CLOCK ════════════════════════════════════════
function tick(){
  const now=new Date();
  document.getElementById('liveClock').textContent=[now.getHours(),now.getMinutes(),now.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':');
}
setInterval(tick,1000);tick();

// ══ INIT ══════════════════════════════════════════════
renderCal();
renderQueue();
renderCheckedIn();
renderInsHistory();
