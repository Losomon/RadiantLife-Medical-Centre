// js/pharmacy.js

let currentPanel = 'pending';
let selectedRx = null;

const samplePrescriptions = [
  {
    id: "RX-240327-01",
    patient: "Grace Akinyi",
    patientId: "A-042",
    doctor: "Dr. Omondi",
    drugs: ["Amoxicillin 500mg — 1 tab TDS × 7 days", "Paracetamol 1g — PRN"],
    time: "14:35",
    status: "Pending"
  },
  {
    id: "RX-240327-02",
    patient: "Peter Kamau",
    patientId: "A-043",
    doctor: "Dr. Omondi",
    drugs: ["Metformin 500mg — BD", "Lisinopril 10mg — OD"],
    time: "14:12",
    status: "Pending"
  }
];

function show(panel) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  document.getElementById(`panel-${panel}`).classList.add('on');

  document.querySelectorAll('.sb-item').forEach(item => item.classList.remove('on'));
  const active = Array.from(document.querySelectorAll('.sb-item')).find(i => 
    i.getAttribute('onclick')?.includes(`show('${panel}')`)
  );
  if (active) active.classList.add('on');

  document.getElementById('topTitle').textContent = 
    panel === 'pending' ? 'Pending Prescriptions' :
    panel === 'inventory' ? 'Pharmacy Inventory' :
    panel === 'dispensed' ? 'Dispensed Today' : 'Stock Alerts';
}

function renderPendingList() {
  const container = document.getElementById('pendingList');
  container.innerHTML = '';

  samplePrescriptions.forEach((rx, index) => {
    const div = document.createElement('div');
    div.className = 'rx-item';
    div.innerHTML = `
      <div>
        <div class="rx-patient">${rx.patient} <small>${rx.patientId}</small></div>
        <div class="rx-drugs">${rx.drugs[0]}</div>
        <small>By ${rx.doctor} • ${rx.time}</small>
      </div>
      <button class="btn btn-sky dispense-btn" onclick="viewPrescription(${index})">Dispense</button>
    `;
    container.appendChild(div);
  });
}

function viewPrescription(index) {
  selectedRx = samplePrescriptions[index];
  
  const details = document.getElementById('currentRx');
  details.innerHTML = `
    <div style="padding:16px">
      <h3>${selectedRx.patient} (${selectedRx.patientId})</h3>
      <p style="color:var(--ink3)">Prescribed by ${selectedRx.doctor} at ${selectedRx.time}</p>
      
      <div style="margin:20px 0">
        <strong>Medications:</strong>
        <ul style="margin-top:8px;padding-left:20px">
          ${selectedRx.drugs.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>
      
      <button class="btn btn-sky" style="width:100%" onclick="openDispenseModal()">Proceed to Dispense</button>
    </div>
  `;
}

function openDispenseModal() {
  if (!selectedRx) return;
  
  const modalContent = document.getElementById('modalRxDetails');
  modalContent.innerHTML = `
    <div style="padding:10px 0">
      <strong>Patient:</strong> ${selectedRx.patient}<br>
      <strong>Prescription ID:</strong> ${selectedRx.id}<br><br>
      
      <strong>Items to dispense:</strong>
      <ul style="margin:12px 0 20px 20px">
        ${selectedRx.drugs.map(d => `<li>${d}</li>`).join('')}
      </ul>
      
      <div style="background:#f0f9ff;padding:12px;border-radius:8px">
        <label style="font-size:13px">Notes for patient (optional)</label>
        <textarea style="width:100%;height:80px;margin-top:6px" placeholder="Take with food..."></textarea>
      </div>
    </div>
  `;
  
  document.getElementById('dispenseModal').style.display = 'flex';
}

function closeDispenseModal() {
  document.getElementById('dispenseModal').style.display = 'none';
}

function confirmDispense() {
  closeDispenseModal();
  toast(`Prescription ${selectedRx.id} dispensed successfully for ${selectedRx.patient}`, "check");
  
  // Remove from pending (demo)
  setTimeout(() => {
    renderPendingList();
    document.getElementById('currentRx').innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink3)">Select a prescription to view details</div>';
  }, 800);
}

function renderInventory() {
  const container = document.getElementById('inventoryList');
  container.innerHTML = `
    <div style="padding:16px">
      <div class="inventory-row"><span>Amoxicillin 500mg capsules</span><span>184 units</span></div>
      <div class="inventory-row"><span>Metformin 500mg tabs</span><span>320 units</span></div>
      <div class="inventory-row"><span>Paracetamol 1g tabs</span><span class="stock-low">42 units</span></div>
      <div class="inventory-row"><span>Lisinopril 10mg tabs</span><span>156 units</span></div>
    </div>
  `;
}

function renderDispensedToday() {
  const container = document.getElementById('dispensedList');
  container.innerHTML = `
    <div style="padding:16px">
      <div class="rx-item" style="border-bottom:none">
        <div>RX-240327-01 • Grace Akinyi — Dispensed 15:12</div>
        <span class="bdg bdg-pine">Completed</span>
      </div>
    </div>
  `;
}

function renderStockAlerts() {
  const container = document.getElementById('stockAlerts');
  container.innerHTML = `
    <div style="padding:20px;color:var(--rust)">
      <strong>Low Stock Items:</strong><br><br>
      • Paracetamol 1g — Only 42 units left<br>
      • Amoxicillin suspension — Reorder recommended
    </div>
  `;
}

function refreshPharmacy() {
  toast("Pharmacy queue refreshed", "check");
  renderPendingList();
}

// Toast (shared)
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
  }, 3200);
}

function updateClock() {
  setInterval(() => {
    const time = new Date().toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
    document.getElementById('liveClock').textContent = time;
  }, 1000);
}

function initPharmacy() {
  renderPendingList();
  renderInventory();
  renderDispensedToday();
  renderStockAlerts();
  updateClock();
  show('pending');
}

window.onload = initPharmacy;