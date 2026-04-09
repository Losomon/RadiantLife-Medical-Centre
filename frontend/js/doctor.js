/* =============================================
   RadiantLife Medical Centre — Doctor Portal
   js/doctor.js — Enhanced with Dynamic Data
   ============================================= */

// ══════════════════════════════════════
// DATA STRUCTURES (Mock API Data)
// ══════════════════════════════════════


let currentPanel = 'consultations';

function show(panel) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  document.getElementById(`panel-${panel}`).classList.add('on');
  
  document.querySelectorAll('.sb-item').forEach(item => item.classList.remove('on'));
  const active = Array.from(document.querySelectorAll('.sb-item')).find(i => 
    i.getAttribute('onclick')?.includes(`show('${panel}')`)
  );
  if (active) active.classList.add('on');

  currentPanel = panel;
  document.getElementById('topTitle').textContent = 
    panel === 'consultations' ? 'Today’s Consultations' :
    panel === 'prescriptions' ? 'Prescriptions' :
    panel === 'vitals' ? 'Vitals & Nursing' : 'Lab Requests';
}

function renderWaitingList() {
  const container = document.getElementById('waitingList');
  container.innerHTML = `
    <div class="waiting-item">
      <div><span class="patient-name">Grace Akinyi</span> <small>A-042</small></div>
      <button class="btn btn-sky btn-sm" onclick="startConsultation('Grace Akinyi')">Start Consultation</button>
    </div>
    <div class="waiting-item">
      <div><span class="patient-name">Peter Kamau</span> <small>A-043</small></div>
      <button class="btn btn-ghost btn-sm" onclick="startConsultation('Peter Kamau')">Start</button>
    </div>
  `;
}

function renderTodayAppointments() {
  const container = document.getElementById('todayAppointments');
  container.innerHTML = `
    <div style="padding:12px 0">
      <div class="waiting-item">
        <div>08:30 — Agnes Wanjiru Kimani <span style="color:var(--pine)">• Done</span></div>
      </div>
      <div class="waiting-item">
        <div>09:15 — Samuel Korir <span style="color:var(--amber)">• In Progress</span></div>
      </div>
    </div>
  `;
}

function addDrugRow() {
  const list = document.getElementById('drugList');
  const row = document.createElement('div');
  row.className = 'drug-row';
  row.innerHTML = `
    <input type="text" placeholder="Medication name (e.g. Amoxicillin)">
    <input type="text" placeholder="Dosage">
    <input type="text" placeholder="Frequency">
    <button class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()">Remove</button>
  `;
  list.appendChild(row);
}

function saveVitals() {
  toast("Vitals recorded successfully", "check");
}

function orderLab() {
  toast("Lab request sent to laboratory", "shield");
}

function startConsultation(patientName) {
  toast(`Starting consultation with ${patientName}`, "check");
  setTimeout(() => {
    openNewConsultModal();
  }, 800);
}

function openNewConsultModal() {
  document.getElementById('consultModal').style.display = 'flex';
}

function closeConsultModal() {
  document.getElementById('consultModal').style.display = 'none';
}

function saveConsultation() {
  closeConsultModal();
  toast("Consultation notes saved • Patient moved to pharmacy if prescribed", "check");
}

// Toast (reused from reception)
function toast(message, iconType = "check") {
  const toastEl = document.getElementById('toast');
  const icon = document.getElementById('toastIcon');
  const msg = document.getElementById('toastMsg');

  if (iconType === "check") {
    icon.innerHTML = `<path d="M20 6L9 17l-5-5" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else {
    icon.innerHTML = `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="#0ea5e9"/>`;
  }

  msg.textContent = message;
  toastEl.style.display = 'flex';
  toastEl.style.transform = 'translate(-50%, 0)';

  setTimeout(() => {
    toastEl.style.transform = 'translate(-50%, 80px)';
    setTimeout(() => toastEl.style.display = 'none', 400);
  }, 3500);
}

// Clock
function updateClock() {
  setInterval(() => {
    const now = new Date();
    document.getElementById('liveClock').textContent = 
      now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, 1000);
}

function initDoctor() {
  renderWaitingList();
  renderTodayAppointments();
  updateClock();
  show('consultations');
}

window.onload = initDoctor;
