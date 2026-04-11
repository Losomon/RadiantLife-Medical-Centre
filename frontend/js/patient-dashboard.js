
const patients=[{id:'PRG-2026-0047',name:'Agnes W. Kimani',age:'34F',bg:'B+',last:'20 Mar 2026',ins:'CIC Insurance',status:'active',color:'#2a5a9a',lc:'#0e1e38',i:'AK'},{id:'PRG-2026-0103',name:'James Otieno',age:'52M',bg:'O+',last:'18 Mar 2026',ins:'AAR Health',status:'admitted',color:'#4a1a7a',lc:'#200c38',i:'JO'},{id:'PRG-2026-0211',name:'Mary Njeri Mwangi',age:'28F',bg:'A+',last:'15 Mar 2026',ins:'Self-pay',status:'active',color:'#1a5c2e',lc:'#0a2014',i:'MN'},{id:'PRG-2026-0089',name:'Peter Kamau',age:'45M',bg:'AB-',last:'12 Mar 2026',ins:'Jubilee Ins.',status:'pending',color:'#7a5010',lc:'#2a1a04',i:'PK'},{id:'PRG-2026-0312',name:'Grace Akinyi',age:'61F',bg:'O-',last:'10 Mar 2026',ins:'NHIF',status:'active',color:'#0e4a52',lc:'#061820',i:'GA'},{id:'PRG-2026-0445',name:'David Ndirangu',age:'38M',bg:'A-',last:'8 Mar 2026',ins:'CIC Insurance',status:'active',color:'#7a1c1c',lc:'#300808',i:'DN'},{id:'PRG-2026-0178',name:'Faith Wambua',age:'22F',bg:'B-',last:'5 Mar 2026',ins:'AAR Health',status:'active',color:'#4a1a7a',lc:'#200c38',i:'FW'},{id:'PRG-2026-0502',name:'Samuel Korir',age:'33M',bg:'O+',last:'3 Mar 2026',ins:'Britam',status:'pending',color:'#7a5010',lc:'#2a1a04',i:'SK'},{id:'PRG-2026-0067',name:'Ruth Chepkemoi',age:'47F',bg:'A+',last:'1 Mar 2026',ins:'NHIF',status:'admitted',color:'#2a5a9a',lc:'#0e1e38',i:'RC'},{id:'PRG-2026-0391',name:'Hassan Omar',age:'55M',bg:'B+',last:'28 Feb 2026',ins:'Self-pay',status:'active',color:'#1a5c2e',lc:'#0a2014',i:'HO'}];
const appts=[{time:'08:00',patient:'Agnes Kimani',type:'Diabetic clinic',doc:'Dr. Omondi',status:'done',cls:'type-checkup'},{time:'08:30',patient:'James Otieno',type:'Post-op review',doc:'Dr. Njoroge',status:'done',cls:'type-procedure'},{time:'09:00',patient:'Mary Mwangi',type:'ANC visit',doc:'Dr. Waweru',status:'done',cls:'type-followup'},{time:'09:30',patient:'Peter Kamau',type:'General OPD',doc:'Dr. Omondi',status:'pending',cls:'type-checkup'},{time:'10:00',patient:'Grace Akinyi',type:'Hypertension f/up',doc:'Dr. Achieng',status:'pending',cls:'type-followup'},{time:'10:30',patient:'Walk-in — Emergency',type:'Emergency triage',doc:'Dr. Njoroge',status:'pending',cls:'type-emergency'},{time:'11:00',patient:'Samuel Korir',type:'Lab results review',doc:'Dr. Omondi',status:'pending',cls:'type-checkup'},{time:'11:30',patient:'Faith Wambua',type:'Vaccination',doc:'Dr. Waweru',status:'pending',cls:'type-procedure'}];
const upcoming=[{name:'Ruth Chepkemoi',date:'27 Mar · 09:00',type:'Physiotherapy'},{name:'Hassan Omar',date:'27 Mar · 10:30',type:'Blood test'},{name:'David Ndirangu',date:'28 Mar · 08:00',type:'Surgery prep'},{name:'Agnes Kimani',date:'3 Apr · 09:30',type:'HbA1c follow-up'}];
const invs=[{inv:'INV-2026-0341',patient:'Agnes Kimani',service:'OPD + Lab tests',amount:'KES 8,200',cover:'KES 6,000',pays:'KES 2,200',status:'paid'},{inv:'INV-2026-0340',patient:'James Otieno',service:'Surgery + Ward (3d)',amount:'KES 42,000',cover:'KES 35,000',pays:'KES 7,000',status:'insurance'},{inv:'INV-2026-0339',patient:'Mary Mwangi',service:'ANC package',amount:'KES 3,500',cover:'KES 3,500',pays:'KES 0',status:'paid'},{inv:'INV-2026-0338',patient:'Peter Kamau',service:'Consultation',amount:'KES 1,500',cover:'—',pays:'KES 1,500',status:'pending'},{inv:'INV-2026-0337',patient:'Grace Akinyi',service:'Hypertension drugs',amount:'KES 4,800',cover:'KES 4,800',pays:'KES 0',status:'paid'},{inv:'INV-2026-0336',patient:'David Ndirangu',service:'X-ray + Consult',amount:'KES 6,200',cover:'KES 5,500',pays:'KES 700',status:'paid'},{inv:'INV-2026-0335',patient:'Faith Wambua',service:'Vaccination',amount:'KES 2,400',cover:'—',pays:'KES 2,400',status:'pending'}];

function renderPatients(list){
  document.getElementById('patientTbody').innerHTML=list.map(p=>{
    const sb=p.status==='active'?'<span class="badge badge-green">Active</span>':p.status==='admitted'?'<span class="badge badge-purple">Admitted</span>':'<span class="badge badge-amber">Pending</span>';
    return`<tr onclick="openRecord()"><td><div class="pt-name-cell"><div class="pt-avatar" style="background:radial-gradient(circle at 40% 35%,${p.color} 0%,${p.lc} 100%);color:${p.color};filter:brightness(1.6)">${p.i}</div><div><div class="pt-name">${p.name}</div><div class="pt-id">${p.id}</div></div></div></td><td>${p.age}</td><td style="font-family:'Courier Prime',monospace;font-weight:700;color:var(--paper)">${p.bg}</td><td style="font-family:'Courier Prime',monospace;font-size:12px">${p.last}</td><td>${p.ins}</td><td>${sb}</td><td><button class="action-btn" onclick="event.stopPropagation();openRecord()" title="View"><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button><button class="action-btn" onclick="event.stopPropagation();showTab('appointments')" title="Book"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></button><button class="action-btn" onclick="event.stopPropagation();showTab('billing')" title="Bill"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></button></td></tr>`;
  }).join('');
}
function filterPatients(q){renderPatients(patients.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())||p.id.toLowerCase().includes(q.toLowerCase())))}
function setFilter(el,type){document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));el.classList.add('active');renderPatients(type==='all'?patients:patients.filter(p=>p.status===type))}
function openRecord(){showTab('record')}

function renderAppts(){
  document.getElementById('apptList').innerHTML=appts.map(a=>{
    const sb=a.status==='done'?'<span class="badge badge-green" style="font-size:10px">Done</span>':'<span class="badge badge-amber" style="font-size:10px">Pending</span>';
    return`<div class="appt-item ${a.cls}"><div class="appt-time">${a.time}</div><div class="appt-divider"></div><div class="appt-info"><div class="appt-pt">${a.patient}</div><div class="appt-type">${a.type}</div></div><div style="text-align:right;flex-shrink:0">${sb}<div class="appt-doc" style="margin-top:3px">${a.doc}</div></div></div>`;
  }).join('');
  document.getElementById('upcomingList').innerHTML=upcoming.map(u=>`<div class="mini-item"><div class="mini-name">${u.name}</div><div class="mini-meta">${u.date}</div><div class="mini-badge"><span class="badge badge-blue" style="font-size:10px">${u.type}</span></div></div>`).join('');
}

let calDate=new Date(2026,2,1);
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const hasAppt=[3,5,8,10,12,15,18,20,22,24,26,28];
function renderCal(){
  document.getElementById('calMonth').textContent=MONTHS[calDate.getMonth()]+' '+calDate.getFullYear();
  const g=document.getElementById('calGrid');
  let h=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="cal-dow">${d}</div>`).join('');
  const first=new Date(calDate.getFullYear(),calDate.getMonth(),1).getDay();
  const total=new Date(calDate.getFullYear(),calDate.getMonth()+1,0).getDate();
  for(let i=0;i<first;i++){const p=new Date(calDate.getFullYear(),calDate.getMonth(),-first+i+1).getDate();h+=`<div class="cal-cell other-month"><div class="cal-day">${p}</div></div>`}
  for(let d=1;d<=total;d++){const isSel=d===26&&calDate.getMonth()===2;const dots=hasAppt.includes(d)?`<div class="cal-dots"><div class="cal-dot" style="background:#3a7acc"></div>${hasAppt.indexOf(d)%3===0?'<div class="cal-dot" style="background:#9a3a3a"></div>':''}</div>`:'';h+=`<div class="cal-cell${isSel?' selected':''}" onclick="selDay(this)"><div class="cal-day">${d}</div>${dots}</div>`}
  g.innerHTML=h;
}
function changeMonth(d){calDate.setMonth(calDate.getMonth()+d);renderCal()}
function selDay(el){document.querySelectorAll('.cal-cell').forEach(c=>c.classList.remove('selected'));el.classList.add('selected')}

function renderBilling(){
  document.getElementById('billingTbody').innerHTML=invs.map(inv=>{
    const sb=inv.status==='paid'?'<span class="badge badge-green">Paid</span>':inv.status==='insurance'?'<span class="badge badge-blue">Insurance</span>':'<span class="badge badge-amber">Pending</span>';
    return`<tr><td style="font-family:'Courier Prime',monospace;font-size:11px;color:var(--ink-faint);font-weight:700">${inv.inv}</td><td style="font-size:13px;font-weight:500;color:var(--paper)">${inv.patient}</td><td style="color:rgba(245,238,216,.6)">${inv.service}</td><td style="font-family:'Courier Prime',monospace;font-weight:600;color:var(--paper)">${inv.amount}</td><td style="font-family:'Courier Prime',monospace;color:#4a9e5e">${inv.cover}</td><td style="font-family:'Courier Prime',monospace;font-weight:600;color:var(--paper)">${inv.pays}</td><td>${sb}</td><td><button class="action-btn"><svg viewBox="0 0 24 24" width="11" height="11" stroke="rgba(245,238,216,.5)" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></td></tr>`;
  }).join('');
}

function showTab(tab){['patients','record','appointments','billing'].forEach(t=>{document.getElementById('panel-'+t).classList.remove('active');document.getElementById('tab-'+t).classList.remove('active')});document.getElementById('panel-'+tab).classList.add('active');document.getElementById('tab-'+tab).classList.add('active')}
function switchRecTab(el,tab){document.querySelectorAll('.rec-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');['visits','vitals','conditions','labs'].forEach(t=>{const e=document.getElementById('rt-'+t);if(e)e.style.display=t===tab?'block':'none'})}
function bf(el){el.closest('.filter-row').querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));el.classList.add('active')}

renderPatients(patients);renderAppts();renderCal();renderBilling();
