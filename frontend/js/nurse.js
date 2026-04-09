/* =============================================
   RadiantLife Medical Centre — Nurse Station
   js/nurse.js — Dynamic Triage, Vitals, Ward
   ============================================= */

// ══════════════════════════════════════
// MOCK DATA (Sync with reception + nurse-specific)
// ══════════════════════════════════════

// Triage Queue (first 7 from reception QUEUE_OPD)
const NURSE_QUEUE = [
  {num:'A-043',name:'Peter Kamau',age:'45M',type:'General OPD',wait:'8 min',urgent:false,vitals:'BP 132/85',color:'#1a56db'},
  {num:'A-044',name:'Faith Wambua',age:'22F',type:'Vaccination',wait:'22 min',urgent:false,vitals:'Pulse 88',color:'#5b21b6'},
  {num:'A-045',name:'Hassan Omar',age:'55M',type:'General OPD',wait:'36 min',urgent:false,vitals:'Temp 37.4',color:'#065f46'},
  {num:'A-046',name:'Esther Njeri',age:'31F',type:'Follow-up',wait:'48 min',urgent:false,vitals:'SpO2 96',color:'#155e75'},
  {num:'A-047',name:'John Mwenda',age:'28M',type:'General OPD',wait:'52 min',urgent:false,vitals:'BP 128/80',color:'#92400e'},
  {num:'A-048',name:'Susan Kamau',age:'67F',type:'Review',wait:'1 hr 5 min',urgent:false,vitals:'Pulse 76',color:'#881337'},
  {num:'E-008',name:'Brian Mutua',age:'8M',type:'High fever — child',wait:'5 min',urgent:true,vitals:'Temp 39.2',color:'#ef4444'},
];

// Recent Vitals (last 5 recorded)
const RECENT_VITALS = [
  {patient:'Grace Akinyi A-042',time:'14:05',bp:'132/85',pulse:'88',temp:'37.4',spo2:'96'},
  {patient:'Peter Kamau A-043',time:'13:52',bp:'128/80',pulse:'76',temp:'36.8',spo2:'98'},
  {patient:'Faith Wambua A-044',time:'13:45',bp:'118/74',pulse:'92',temp:'37.1',spo2:'97'},
  {patient:'Brian Mutua E-008',time:'13:32',bp:'112/68',pulse:'110',temp:'39.2',spo2:'95'},
  {patient:'Hassan Omar A-045',time:'13:18',bp:'145/92',pulse:'84',temp:'37.0',spo2:'96'},
];

// Inpatients (ward bed monitoring)
const INPATIENTS = [
  {name:'James Otieno',bed:'Ward A-12',condition:'Post-op obs',lastCheck:'14:10',alert:false},
  {name:'Mary Mwangi',bed:'Ward B-05',condition:'ANC monitoring',lastCheck:'13:55',alert:false},
  {name:'Samuel Korir',bed:'Ward A-08',condition:'IV fluids',lastCheck:'14:02',alert:true},
];

// Med Admin (pending doses)
const MED_ADMIN = [
  {patient:'James Otieno',med:'Paracetamol 1g IV',dose:'08:00, 14:00',status:'Due now'},
  {patient:'Mary Mwangi',med:'Iron 200mg PO',dose:'09:00, 17:00',status:'Given'},
  {patient:'Samuel Korir',med:'Ceftriaxone 1g IV',dose:'12:00, 18:00',status:'Due 18:00'},
];

// ══════════════════════════════════════
// NAVIGATION (mirrors rec.js)
// ══════════════════════════════════════
function show(panel) {
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.sb-item').forEach(i=>i.classList.remove('on'));
  document.getElementById('panel-'+panel).classList.add('on');
  // highlight sidebar
  document.querySelectorAll('.sb-item').forEach(i=>{
    if(i.getAttribute('onclick')&&i.getAttribute('onclick').includes(`'${panel}'`)) i.classList.add('on');
  });
  document.getElementById('topTitle').textContent = 
    panel==='triage' ? 'Triage & Vitals' :
    panel==='inpatients' ? 'Inpatients' :
    panel==='meds' ? 'Medication Administration' :
    panel==='handover' ? 'Handover Notes' : 'Waiting Queue';
}

// ══════════════════════════════════════
// RENDER FUNCTIONS
// ══════════════════════════════════════
function renderTriageQueue() {
  const cont = document.getElementById('triageQueue');
  cont.innerHTML = NURSE_QUEUE.map(p => `
    <div class="triage-item ${p.urgent ? 'urgent' : ''}">
      <div class="triage-av" style="background:${p.color}22;color:${p.color}">${p.num.slice(-3)}</div>
      <div class="triage-info">
        <h4>${p.name}</h4>
        <div class="triage-meta">${p.age} • ${p.type}</div>
        <div class="triage-vitals">${p.vitals}</div>
      </div>
      <div class="triage-acts">
        <span class="bdg ${p.urgent ? 'bdg-rust' : 'bdg-amber'}">${p.wait}</span>
        <button class="btn btn-sky btn-xs" onclick="startTriage('${p.name}')">Triage Now</button>
      </div>
    </div>
  `).join('');
  document.getElementById('nurseQueueCount').textContent = NURSE_QUEUE.length;
}

function renderRecentVitals() {
  const cont = document.getElementById('recentVitals');
  cont.innerHTML = RECENT_VITALS.map(v => `
    <div style="padding:12px 0;border-bottom:1px solid var(--border);font-size:13px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-weight:500">${v.patient}</span>
        <span style="color:var(--ink3)">${v.time}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;font-size:12px;color:var(--ink2)">
        <span>BP<br><strong>${v.bp}</strong></span>
        <span>Pulse<br><strong>${v.pulse}</strong></span>
        <span>Temp<br><strong>${v.temp}</strong></span>
        <span>SpO2<br><strong>${v.spo2}</strong></span>
      </div>
    </div>
  `).join('') || '<div style="padding:24px;color:var(--ink3);text-align:center">No recent vitals</div>';
}

function renderInpatients() {
  const cont = document.getElementById('inpatientList');
  cont.innerHTML = `
    <div class="card-hd" style="padding:20px 24px 16px">
      <div class="card-title">Active Inpatients (12)</div>
    </div>
    <div class="card-bd" style="padding:0">
      ${INPATIENTS.map(p => `
        <div class="inpatient-item ${p.alert ? 'alert' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="${p.alert ? '#ef4444' : 'currentColor'}" stroke-width="2" style="width:20px;height:20px;color:var(--ink3)">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
          <div style="flex:1">
            <div style="font-weight:600;font-size:15px">${p.name}</div>
            <div style="color:var(--ink3);font-size:13px">${p.bed} • ${p.condition}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:12px;color:var(--ink3)">${p.lastCheck}</div>
            <button class="btn btn-ghost btn-xs" style="margin-top:4px">Chart</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderMedAdmin() {
  const cont = document.getElementById('medAdminList');
  cont.innerHTML = MED_ADMIN.map(m => `
    <div class="med-item">
      <div style="flex:1">
        <div style="font-weight:600">${m.patient}</div>
        <div style="font-size:13px;color:var(--ink2)">${m.med}</div>
        <div style="font-size:12px;color:var(--ink3)">${m.dose}</div>
      </div>
      <span class="bdg ${m.status === 'Given' ? 'bdg-pine' : 'bdg-amber'}">${m.status}</span>
    </div>
  `).join('') || '<div style="padding:40px;text-align:center;color:var(--ink3)">No medications pending</div>';
}

// ══════════════════════════════════════
// VITALS MODAL
// ══════════════════════════════════════
function openQuickVitalsModal() {
  document.getElementById('vitalsModal').classList.add('show');
  document.getElementById('quickPatient').focus();
}

function closeVitalsModal() {
  document.getElementById('vitalsModal').classList.remove('show');
}

function saveQuickVitals() {
  const patient = document.getElementById('quickPatient').value;
  const bp = document.getElementById('quickBP').value;
  const pulse = document.getElementById('quickPulse').value;
  const temp = document.getElementById('quickTemp').value;
  const spo2 = document.getElementById('quickSpo2').value;
  
  if (!patient || !bp || !pulse) {
    toast('Please fill patient name and vitals', 'alert');
    return;
  }

  // Add to recent vitals (simple push)
  const time = new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'});
  RECENT_VITALS.unshift({patient: `${patient} (Quick)`, time, bp, pulse, temp, spo2});
  RECENT_VITALS.splice(5, 1); // Keep last 5

  renderRecentVitals();
  closeVitalsModal();
  toast(`Vitals saved for ${patient}`, 'check');
}

// ══════════════════════════════════════
// HANDOVER & ACTIONS
// ══════════════════════════════════════
function saveHandover() {
  const notes = document.querySelector('.handover-text').value.trim();
  if (notes) {
    toast('Handover notes saved successfully', 'check');
    // Future: POST /api/nurse/handover
  } else {
    toast('Please add handover notes', 'alert');
  }
}

function startTriage(patient) {
  toast(`Starting triage for ${patient} • Move to consultation`, 'user');
  // Future: PATCH /api/queue/${patient}/triage
}

// ══════════════════════════════════════
// TOAST (compatible with rec/doctor)
// ══════════════════════════════════════
function toast(msg, icon = 'check') {
  const t = document.getElementById('toast');
  const icons = {
    check: '<polyline points="20 6 9 17 4 12"/>',
    alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  };
  document.getElementById('toastIcon').innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${icons[icon] || icons.check}</svg>`;
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ══════════════════════════════════════
// CLOCK
// ══════════════════════════════════════
function updateClock() {
  const now = new Date();
  document.getElementById('liveClock').textContent = 
    now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();

// ══════════════════════════════════════
// MODAL OVERLAY CLICK
// ══════════════════════════════════════
document.getElementById('vitalsModal').addEventListener('click', function(e) {
  if (e.target === this) closeVitalsModal();
});

// ══════════════════════════════════════
// INIT
// ══════════════════════════════════════
function initNurse() {
  renderTriageQueue();
  renderRecentVitals();
  renderInpatients();
  renderMedAdmin();
  show('triage'); // Default panel
}

window.onload = initNurse;
