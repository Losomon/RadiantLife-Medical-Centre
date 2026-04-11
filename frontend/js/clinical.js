
// ══ DATA ══════════════════════════════════════════
const WORKLIST_PTS=[
  {initials:'AK',bg:'#1a3870',name:'Agnes W. Kimani',id:'PRG-2026-0047',age:'34F',type:'Diabetic clinic f/up',wait:'8 min',urgent:false,status:'done'},
  {initials:'JO',bg:'#4a1870',name:'James Otieno',id:'PRG-2026-0103',age:'52M',type:'Post-op review',wait:'22 min',urgent:false,status:'done'},
  {initials:'MM',bg:'#1a5c2e',name:'Mary Mwangi',id:'PRG-2026-0211',age:'28F',type:'ANC 28 weeks',wait:'35 min',urgent:false,status:'pending'},
  {initials:'PK',bg:'#7a4c08',name:'Peter Kamau',id:'PRG-2026-0089',age:'45M',type:'General OPD',wait:'22 min',urgent:false,status:'pending'},
  {initials:'GA',bg:'#0e4a50',name:'Grace Akinyi',id:'PRG-2026-0312',age:'61F',type:'Hypertension f/up',wait:'36 min',urgent:false,status:'pending'},
  {initials:'BM',bg:'#7a1c10',name:'Brian Mutua',id:'PRG-2026-0587',age:'8M',type:'High fever — urgent',wait:'2 min',urgent:true,status:'pending'},
];
const ALL_APTS=[
  {name:'Agnes W. Kimani',time:'08:00',type:'Diabetic clinic',status:'done'},
  {name:'James Otieno',time:'08:30',type:'Post-op review',status:'done'},
  {name:'Mary Mwangi',time:'09:00',type:'ANC visit',status:'done'},
  {name:'Peter Kamau',time:'09:30',type:'General OPD',status:'pending'},
  {name:'Grace Akinyi',time:'10:00',type:'Hypertension f/up',status:'pending'},
  {name:'Brian Mutua',time:'10:30',type:'Emergency — high fever',status:'urgent'},
  {name:'Samuel Korir',time:'11:00',type:'Lab results',status:'pending'},
  {name:'Faith Wambua',time:'11:30',type:'Vaccination',status:'pending'},
];
const RX_DATA=[
  {drug:'Metformin',dose:'500mg',sig:'BD (twice daily)',dur:'Ongoing',status:'active',notes:'Take with meals'},
  {drug:'Amlodipine',dose:'5mg',sig:'OD (once daily)',dur:'Ongoing',status:'active',notes:'Morning dose'},
  {drug:'Lisinopril',dose:'10mg',sig:'OD (once daily)',dur:'Ongoing',status:'active',notes:'Monitor BP weekly'},
  {drug:'Azithromycin',dose:'500mg',sig:'OD × 5 days',dur:'5 days',status:'new',notes:'Substitute for Penicillin (allergic)'},
  {drug:'Salbutamol inhaler',dose:'100mcg/puff',sig:'PRN — 2 puffs',dur:'PRN',status:'new',notes:'Use when needed for wheeze'},
];
const ALL_RX=[
  {pt:'Agnes Kimani',drug:'Azithromycin',dose:'500mg OD',dur:'5 days',status:'dispensed'},
  {pt:'James Otieno',drug:'Morphine',dose:'5mg Q6H',dur:'3 days',status:'dispensed'},
  {pt:'Mary Mwangi',drug:'Ferrous sulphate',dose:'200mg BD',dur:'30 days',status:'pending'},
  {pt:'Brian Mutua',drug:'Ceftriaxone',dose:'1g BD',dur:'5 days',status:'dispensed'},
  {pt:'Grace Akinyi',drug:'Hydrochlorothiazide',dose:'12.5mg OD',dur:'30 days',status:'pending'},
];
const LABS={
  blood:['Full Blood Count (FBC)','Haemoglobin (Hb)','White Cell Count (WCC)','Platelet count','ESR','Malaria RDT'],
  chem:['Blood glucose (RBS)','HbA1c','Urea & Electrolytes','Creatinine','Liver function tests (LFTs)','Lipid profile','Thyroid function (TFTs)'],
  micro:['Blood culture & sensitivity','Urine culture','Sputum AFB (TB)','HIV rapid test','Hepatitis B surface antigen','H. pylori stool antigen'],
  radio:['Chest X-ray (CXR)','Abdominal ultrasound','Pelvic ultrasound','Echocardiogram','CT scan — head','X-ray — extremity'],
};
const VITALS_FIELDS=[
  {id:'bp',label:'Blood pressure',placeholder1:'120',placeholder2:'80',unit:'mmHg',prev:'138/88',split:true},
  {id:'rbs',label:'Blood sugar (RBS)',placeholder:'11.2',unit:'mmol/L',prev:'11.2',fill:72},
  {id:'temp',label:'Temperature',placeholder:'37.4',unit:'°C',prev:'37.4',fill:55},
  {id:'pulse',label:'Pulse rate',placeholder:'82',unit:'bpm',prev:'82',fill:60},
  {id:'spo2',label:'SpO₂',placeholder:'97',unit:'%',prev:'97',fill:90},
  {id:'weight',label:'Weight',placeholder:'72',unit:'kg',prev:'72 kg',fill:65},
];
const WARD_BEDS=[
  {num:'B-01',name:'Agnes K.',cls:'occupied'},{num:'B-02',name:'',cls:'empty'},
  {num:'B-03',name:'James O.',cls:'occupied'},{num:'B-04',name:'Ruth C.',cls:'occupied'},
  {num:'B-05',name:'',cls:'empty'},{num:'B-06',name:'Reserved',cls:'reserved'},
  {num:'B-07',name:'Faith W.',cls:'occupied'},{num:'B-08',name:'',cls:'empty'},
  {num:'B-09',name:'Brian M.',cls:'critical'},{num:'B-10',name:'Hassan O.',cls:'occupied'},
  {num:'B-11',name:'Samuel K.',cls:'occupied'},{num:'B-12',name:'',cls:'empty'},
];
const TASKS=[
  {task:'Record vitals — Agnes Kimani',meta:'Bed 1 · Due 08:00',pri:'#7a4c08',done:true},
  {task:'Administer Morphine 5mg IV — James Otieno',meta:'Bed 3 · Due 08:05',pri:'#7a1c10',done:true},
  {task:'Wound dressing — James Otieno post-op',meta:'Bed 3 · Due 09:00',pri:'#7a4c08',done:true},
  {task:'Record vitals — Brian Mutua',meta:'Bed 9 · Due 08:30',pri:'#7a1c10',done:false},
  {task:'Administer Ceftriaxone 1g IV — Brian Mutua',meta:'Bed 9 · Due 10:00',pri:'#7a1c10',done:false},
  {task:'Blood glucose check — Agnes Kimani',meta:'Bed 1 · Due 10:00',pri:'#7a4c08',done:false},
  {task:'Discharge summary — Ruth Chepkemoi',meta:'Bed 4 · Due 11:00',pri:'#1a5c2e',done:false},
  {task:'TPR chart — all ward patients',meta:'Ward A · Due 12:00',pri:'#1a3870',done:false},
];
const MED_ADMIN=[
  {time:'10:00',drug:'Azithromycin',dose:'500mg oral',pt:'Agnes Kimani',status:'due'},
  {time:'10:00',drug:'Metformin',dose:'500mg oral',pt:'Agnes Kimani',status:'due'},
  {time:'10:00',drug:'Ceftriaxone',dose:'1g IV',pt:'Brian Mutua',status:'due'},
  {time:'10:30',drug:'Furosemide',dose:'40mg oral',pt:'Ruth Chepkemoi',status:'upcoming'},
  {time:'12:00',drug:'Insulin glargine',dose:'10 units SC',pt:'Agnes Kimani',status:'upcoming'},
  {time:'14:00',drug:'Morphine',dose:'5mg IV',pt:'James Otieno',status:'upcoming'},
];
const RIGHTS=[
  {label:'Right patient',done:true},{label:'Right drug',done:true},
  {label:'Right dose',done:true},{label:'Right route',done:false},{label:'Right time',done:false},
];
let labSelected=new Set();
let visitStart=Date.now();

// ══ RENDERS ═══════════════════════════════════════
function renderWorklist(){
  document.getElementById('ptQueue').innerHTML=WORKLIST_PTS.filter(p=>p.status!=='done').map(p=>`
    <div class="pq-item${p.urgent?' urgent':''}" onclick="show('consult')">
      <div class="pq-av" style="background:${p.bg}22;color:${p.bg};border-color:${p.bg}44">${p.initials}</div>
      <div style="flex:1;min-width:0">
        <div class="pq-name">${p.name}</div>
        <div class="pq-meta">${p.age} · ${p.type}</div>
        <div class="pq-tags">${p.urgent?'<span class="bdg b-cr" style="font-size:9px">Urgent</span>':'<span class="bdg b-sl" style="font-size:9px">Pending</span>'}</div>
      </div>
      <div class="pq-wait">Waiting<br><strong>${p.wait}</strong></div>
    </div>`).join('');
  document.getElementById('wlTable').innerHTML=ALL_APTS.map(a=>{
    const sb=a.status==='done'?'<span class="bdg b-em">Done</span>':a.status==='urgent'?'<span class="bdg b-cr">Urgent</span>':'<span class="bdg b-go">Pending</span>';
    return `<tr onclick="show('consult')">
      <td><div class="td-pt"><div class="av" style="background:var(--cobalt-l);color:var(--cobalt)"><span style="font-family:'EB Garamond',serif;font-size:11px;font-weight:700">${a.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span></div><div><div class="av-nm">${a.name}</div></div></div></td>
      <td style="font-family:'DM Mono',monospace;font-weight:600;font-size:12px">${a.time}</td>
      <td>${a.type}</td><td>${sb}</td>
      <td><div style="display:flex;gap:4px">
        <button class="ra" onclick="event.stopPropagation();show('consult')"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></button>
        <button class="ra"><svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></button>
      </div></td>
    </tr>`;
  }).join('');
}

function wlFilter(el,type){
  document.querySelectorAll('#wlFilters .bdg').forEach(b=>{b.style.background='';b.style.color=''});
  el.style.background='var(--cobalt-l)';el.style.color='var(--cobalt)';
  toast('Filtered by: '+type,'check');
}

function renderRx(){
  document.getElementById('rxList').innerHTML=RX_DATA.map(r=>`
    <div class="rx-item" style="border-left-color:${r.status==='new'?'var(--cobalt)':'var(--sage)'}">
      <div class="rx-icon" style="${r.status==='new'?'background:var(--cobalt-l);border-color:rgba(26,56,112,0.2)':''}">
        <svg viewBox="0 0 24 24"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="${r.status==='new'?'var(--cobalt)':'var(--sage)'}" fill="none" stroke-width="2"/></svg>
      </div>
      <div style="flex:1">
        <div class="rx-drug">${r.drug} <span style="font-size:11px;font-weight:400;color:var(--ink-dim)">${r.dose}</span></div>
        <div class="rx-dose">${r.sig}</div>
        <div class="rx-notes">${r.notes} · ${r.dur}</div>
      </div>
      <div class="rx-acts">
        <span class="bdg ${r.status==='new'?'b-oc':'b-em'} nd" style="font-size:9px">${r.status==='new'?'New':'Active'}</span>
        <button class="ra" style="margin-top:4px" onclick="toast('${r.drug} removed','check')" title="Remove"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></button>
      </div>
    </div>`).join('');
  document.getElementById('rxTable').innerHTML=ALL_RX.map(r=>`
    <tr>
      <td>${r.pt}</td><td style="font-weight:600;color:var(--ink)">${r.drug}</td>
      <td style="font-family:'DM Mono',monospace;font-size:11.5px">${r.dose}</td><td>${r.dur}</td>
      <td><span class="bdg ${r.status==='dispensed'?'b-em':'b-go'} nd">${r.status}</span></td>
      <td><button class="ra" onclick="toast('Printing for ${r.pt}','doc')"><svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></button></td>
    </tr>`).join('');
}

function renderLabs(cat='blood'){
  document.getElementById('labTests').innerHTML=LABS[cat].map((t,i)=>`
    <div class="lab-test${labSelected.has(t)?' on':''}" onclick="toggleLab(this,'${t}')">
      <div class="lab-test-check"></div>
      <div class="lab-test-name">${t}</div>
      <div class="lab-test-price">KES ${(800+i*200).toLocaleString()}</div>
    </div>`).join('');
}

function setLabCat(el,cat){
  document.querySelectorAll('.lab-cat').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');renderLabs(cat);
}

function toggleLab(el,t){
  el.classList.toggle('on');
  labSelected.has(t)?labSelected.delete(t):labSelected.add(t);
  document.getElementById('labCount').textContent=labSelected.size;
}

function renderVitals(){
  document.getElementById('vitalsEntry').innerHTML=VITALS_FIELDS.map(v=>`
    <div class="ve-card">
      <div class="ve-label">${v.label}</div>
      ${v.split
        ?`<div class="ve-input-row"><input class="ve-input" placeholder="${v.placeholder1}" style="width:56px" type="number"><span style="color:var(--ink-dim);font-size:18px;padding:0 2px">/</span><input class="ve-input" placeholder="${v.placeholder2}" style="width:56px" type="number"><span class="ve-unit">${v.unit}</span></div>`
        :`<div class="ve-input-row"><input class="ve-input" placeholder="${v.placeholder||''}" type="number" style="max-width:78px"><span class="ve-unit">${v.unit}</span></div>`
      }
      <div class="ve-hist">Prev: <strong>${v.prev}</strong></div>
      ${v.fill!==undefined?`<div class="trend-bar"><div class="trend-fill" style="width:${v.fill}%;background:${v.fill>85?'var(--sage)':v.fill>60?'var(--ochre)':'var(--rust)'}"></div></div>`:''}
    </div>`).join('');
}

function renderWard(){
  document.getElementById('wardBeds').innerHTML=WARD_BEDS.map(b=>`
    <div class="bed ${b.cls}" onclick="toast('Bed ${b.num}${b.name?' — '+b.name:''}','user')">
      <div class="bed-num">${b.num}</div>
      <div class="bed-name">${b.name||'Available'}</div>
      <div class="bed-status">${b.cls}</div>
    </div>`).join('');
  document.getElementById('taskList').innerHTML=TASKS.map((t,i)=>`
    <div class="task-item${t.done?' done':''}" onclick="toggleTask(this,${i})">
      <div class="task-pri" style="background:${t.pri}"></div>
      <div class="task-check"></div>
      <div style="flex:1"><div class="task-name">${t.task}</div><div class="task-meta">${t.meta}</div></div>
    </div>`).join('');
}

function toggleTask(el,i){
  el.classList.toggle('done');
  const done=document.querySelectorAll('.task-item.done').length;
  const total=document.querySelectorAll('.task-item').length;
  document.getElementById('pendingTasks').textContent=(total-done)+' pending';
  toast(TASKS[i].task+(el.classList.contains('done')?' — completed':' — pending'),'check');
}

function renderMedAdmin(){
  document.getElementById('medAdminList').innerHTML=MED_ADMIN.map(m=>`
    <div class="ma-item">
      <div class="ma-time">${m.time}</div>
      <div style="flex:1">
        <div class="ma-drug">${m.drug}<span style="font-size:11px;font-weight:400;color:var(--ink-dim);margin-left:6px;font-style:italic">${m.dose}</span></div>
        <div class="ma-dose">${m.pt}</div>
      </div>
      <span class="bdg ${m.status==='due'?'b-cr':'b-sl'} nd" style="font-size:9px">${m.status==='due'?'Due now':'Upcoming'}</span>
      ${m.status==='due'?`<button class="btn btn-green btn-xs" style="margin-left:6px" onclick="toast('${m.drug} logged for ${m.pt}','check');this.parentElement.querySelector('.bdg').textContent='Given';this.parentElement.querySelector('.bdg').className='bdg b-em nd';this.remove()">Give</button>`:''}
    </div>`).join('');
  document.getElementById('rightsCheck').innerHTML=RIGHTS.map((r,i)=>`
    <div class="task-item${r.done?' done':''}">
      <div class="task-check"></div>
      <div class="task-name">${r.label}</div>
    </div>`).join('');
}

// ══ SOAP ══════════════════════════════════════════
function switchSoap(el,key){
  document.querySelectorAll('.soap-tab').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.soap-content').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  document.getElementById('soap-'+key).classList.add('on');
}

function addDx(){
  const inp=document.getElementById('dxInput');
  const v=inp.value.trim();if(!v)return;
  const tag=document.createElement('span');
  tag.className='dx-tag';
  tag.style.cssText='background:var(--cobalt-l);color:var(--cobalt);border-color:rgba(26,56,112,0.3)';
  tag.innerHTML=v+' <span class="dx-rm" onclick="this.parentElement.remove()">×</span>';
  document.getElementById('dxList').appendChild(tag);inp.value='';
}

// ══ MODALS ════════════════════════════════════════
function openRxModal(){document.getElementById('rxModal').classList.add('show')}
function openLabModal(){
  document.getElementById('labModalTests').innerHTML=Object.values(LABS).flat().slice(0,12).map(t=>`
    <label style="display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:2px;border:1px solid var(--pap-shadow);cursor:pointer;font-size:12px;transition:all .18s;background:linear-gradient(160deg,var(--pap-warm),var(--pap-light));box-shadow:var(--sh-sft)">
      <input type="checkbox" style="accent-color:var(--cobalt)"> ${t}
    </label>`).join('');
  document.getElementById('labModal').classList.add('show');
}
function closeModal(id){document.getElementById(id).classList.remove('show')}
document.querySelectorAll('.ov').forEach(o=>o.addEventListener('click',function(e){if(e.target===this)this.classList.remove('show')}));

function addPrescription(){
  const drug=document.getElementById('rxDrug').value.trim();
  if(!drug){toast('Please enter a drug name','alert');return;}
  closeModal('rxModal');toast(drug+' added to prescription','check');
}
function submitLabOrder(){
  if(labSelected.size===0){toast('No tests selected','alert');return;}
  closeModal('labModal');
  toast(labSelected.size+' lab test(s) ordered','check');
  document.getElementById('labDot').textContent=parseInt(document.getElementById('labDot').textContent)+labSelected.size;
  labSelected.clear();document.getElementById('labCount').textContent='0';renderLabs();
}

// ══ HELPERS ═══════════════════════════════════════
function setSig(el){document.querySelectorAll('#sigGrid .sig-opt').forEach(s=>s.classList.remove('on'));el.classList.add('on')}
function setTriage(el){document.querySelectorAll('#triageOpts .sig-opt').forEach(s=>s.classList.remove('on'));el.classList.add('on')}
function saveConsult(){toast('Consultation saved — invoice generated','check')}
function saveVitals(){toast('Vitals recorded and saved to patient chart','check')}

// ══ NAVIGATION ════════════════════════════════════
const TITLES={worklist:'Clinical Worklist',consult:'Consultation',prescriptions:'Prescriptions',labs:'Lab Requests',vitals:'Vitals Recording',ward:'Ward & Tasks',medadmin:'Medication Administration'};
function show(p){
  document.querySelectorAll('.panel').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.si').forEach(x=>x.classList.remove('on'));
  document.getElementById('panel-'+p).classList.add('on');
  document.getElementById('topTitle').textContent=TITLES[p]||p;
  document.querySelectorAll('.si').forEach(x=>{if((x.getAttribute('onclick')||'').includes("'"+p+"'"))x.classList.add('on')});
}
function switchRole(role,el){
  document.querySelectorAll('.rp').forEach(r=>r.classList.remove('on'));el.classList.add('on');
  if(role==='nurse'){show('vitals');toast('Switched to nurse view','check');}
  else{show('worklist');toast('Switched to doctor view','check');}
}

// ══ SIDEBAR ═══════════════════════════════════════
let sbExp=false;
function toggleSb(){
  sbExp=!sbExp;
  document.getElementById('sidebar').classList.toggle('exp',sbExp);
  document.getElementById('sbIcon').innerHTML=sbExp?'<polyline points="15 18 9 12 15 6"/>':'<polyline points="9 18 15 12 9 6"/>';
}

// ══ DARK MODE ═════════════════════════════════════
let dark=false;
function toggleDark(){
  dark=!dark;
  if(dark){
    document.documentElement.style.setProperty('--pap-light','#1e1a12');
    document.documentElement.style.setProperty('--pap','#18140e');
    document.documentElement.style.setProperty('--pap-warm','#28220c');
    document.documentElement.style.setProperty('--pap-deep','#38300c');
    document.documentElement.style.setProperty('--pap-shadow','#504010');
    document.documentElement.style.setProperty('--ink','#e0d0a0');
    document.documentElement.style.setProperty('--ink-mid','#c0a870');
    document.documentElement.style.setProperty('--ink-light','#a08850');
    document.documentElement.style.setProperty('--ink-dim','#807040');
    document.documentElement.style.setProperty('--ink-faint','#604820');
    document.getElementById('themeIcon').innerHTML='<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
  } else {
    ['--pap-light','--pap','--pap-warm','--pap-deep','--pap-shadow','--ink','--ink-mid','--ink-light','--ink-dim','--ink-faint'].forEach(v=>document.documentElement.style.removeProperty(v));
    document.getElementById('themeIcon').innerHTML='<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
  }
}

// ══ CLOCK ═════════════════════════════════════════
setInterval(()=>{
  const n=new Date();
  document.getElementById('liveClock').textContent=[n.getHours(),n.getMinutes(),n.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':');
  const elapsed=Math.floor((Date.now()-visitStart)/1000);
  const m=Math.floor(elapsed/60),s=elapsed%60;
  const el=document.getElementById('visitTimer');
  if(el)el.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
},1000);

// ══ TOAST ═════════════════════════════════════════
let toastTm;
function toast(msg,icon){
  const icons={check:'<polyline points="20 6 9 17 4 12"/>',alert:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>',user:'<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',doc:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>'};
  document.getElementById('toastIcon').innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${icons[icon]||icons.check}</svg>`;
  document.getElementById('toastMsg').textContent=msg;
  document.getElementById('toast').classList.add('show');
  clearTimeout(toastTm);
  toastTm=setTimeout(()=>document.getElementById('toast').classList.remove('show'),3200);
}

// ══ BOOT ══════════════════════════════════════════
renderWorklist();renderRx();renderLabs();renderVitals();renderWard();renderMedAdmin();
