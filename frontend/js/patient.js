// js/patient.js

let currentPanel = 'overview';

function show(panel) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  document.getElementById(`panel-${panel}`).classList.add('on');

  document.querySelectorAll('.sb-item').forEach(item => item.classList.remove('on'));
  const active = Array.from(document.querySelectorAll('.sb-item')).find(i => 
    i.getAttribute('onclick')?.includes(`show('${panel}')`)
  );
  if (active) active.classList.add('on');

  document.getElementById('topTitle').textContent = 
    panel === 'overview' ? 'Patient Overview' :
    panel === 'history' ? 'Visit History' :
    panel === 'notes' ? 'Clinical Notes' :
    panel === 'meds' ? 'Medications' :
    panel === 'labs' ? 'Lab & Imaging' : 'Allergies & Alerts';
}

function renderCurrentMeds() {
  const container = document.getElementById('currentMeds');
  container.innerHTML = `
    <div style="padding:8px 0">
      <div class="note-entry" style="margin:0">
        Metformin 500mg — Twice daily<br>
        <small>Started 12 Jan 2026 • Dr. Omondi</small>
      </div>
      <div class="note-entry" style="margin:12px 0 0 0">
        Lisinopril 10mg — Once daily<br>
        <small>For hypertension</small>
      </div>
    </div>
  `;
}

function renderRecentLabs() {
  const container = document.getElementById('recentLabs');
  container.innerHTML = `
    <div style="padding:12px 0">
      <div class="visit-row">
        <div>Fasting Blood Glucose — 8.2 mmol/L <span class="bdg bdg-amber">High</span></div>
        <small>Today</small>
      </div>
      <div class="visit-row">
        <div>HbA1c — 7.8%</div>
        <small>15 Mar 2026</small>
      </div>
    </div>
  `;
}

function renderVisitHistory() {
  const container = document.getElementById('visitHistory');
  container.innerHTML = `
    <div class="visit-row">
      <div><strong>20 Mar 2026</strong> — Diabetes follow-up</div>
      <span class="bdg bdg-pine">Done</span>
    </div>
    <div class="visit-row">
      <div><strong>05 Mar 2026</strong> — Hypertension review</div>
      <span class="bdg bdg-pine">Done</span>
    </div>
    <div class="visit-row">
      <div><strong>12 Feb 2026</strong> — Initial diabetic diagnosis</div>
      <span class="bdg bdg-pine">Done</span>
    </div>
  `;
}

function renderClinicalNotes() {
  const container = document.getElementById('clinicalNotes');
  container.innerHTML = `
    <div class="note-entry">
      <strong>27 Mar 2026 — Dr. Omondi</strong><br>
      Patient reports good adherence to medication. BP controlled. Continue current regimen. Next review in 4 weeks.
    </div>
  `;
}

function renderFullMedList() {
  const container = document.getElementById('fullMedList');
  container.innerHTML = `<div style="padding:20px">Full medication history would appear here (past + current).</div>`;
}

function renderLabResults() {
  const container = document.getElementById('labResults');
  container.innerHTML = `<div style="padding:20px">All lab and imaging results history.</div>`;
}

function renderAllergies() {
  const container = document.getElementById('allergiesList');
  container.innerHTML = `
    <div style="padding:16px">
      <div style="color:var(--rust);font-weight:600">Penicillin — Anaphylaxis</div>
      <div style="color:var(--rust);font-weight:600">Sulfa drugs — Severe rash</div>
      <div style="margin-top:16px;color:var(--amber)">Chronic Conditions: Type 2 DM, Hypertension</div>
    </div>
  `;
}

function openNewNoteModal() {
  document.getElementById('noteModal').style.display = 'flex';
}

function closeNoteModal() {
  document.getElementById('noteModal').style.display = 'none';
}

function saveClinicalNote() {
  closeNoteModal();
  toast("Clinical note saved successfully", "check");
}

// Toast
function toast(message, iconType = "check") {
  const toastEl = document.getElementById('toast');
  const icon = document.getElementById('toastIcon');
  const msg = document.getElementById('toastMsg');

  icon.innerHTML = iconType === "check" 
    ? `<path d="M20 6L9 17l-5-5" fill="none" stroke="#10b981" stroke-width="3"/>`
    : `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="#0ea5e9"/>`;

  msg.textContent = message;
  toastEl.style.display = 'flex';
  toastEl.style.transform = 'translate(-50%, 0)';

  setTimeout(() => {
    toastEl.style.transform = 'translate(-50%, 80px)';
    setTimeout(() => toastEl.style.display = 'none', 400);
  }, 3000);
}

function initPatientRecord() {
  renderCurrentMeds();
  renderRecentLabs();
  renderVisitHistory();
  renderClinicalNotes();
  renderFullMedList();
  renderLabResults();
  renderAllergies();
  show('overview');
}

window.onload = initPatientRecord;