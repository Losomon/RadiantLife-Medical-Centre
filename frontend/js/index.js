
  let step = 0;
  const total = 5;
 
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }
 
  function updateNav() {
    for (let i = 0; i < total; i++) {
      const nav = document.getElementById('nav-' + i);
      const dot = document.getElementById('dot-' + i);
      nav.classList.remove('active', 'done');
      if (i < step) {
        nav.classList.add('done');
        dot.textContent = '✓';
      } else if (i === step) {
        nav.classList.add('active');
        dot.textContent = i + 1;
      } else {
        dot.textContent = i + 1;
      }
    }
    const pct = Math.round(((step + 1) / total) * 100);
    document.getElementById('pct').textContent = pct + '%';
    document.getElementById('progressFill').style.width = pct + '%';
  }
 
  function goTo(n) {
    document.getElementById('sec-' + step).classList.remove('visible');
    step = n;
    const sec = document.getElementById('sec-' + step);
    if (sec) sec.classList.add('visible');
    updateNav();
    document.getElementById('formArea').scrollTop = 0;
  }
 
  function nextStep() {
    if (step < total - 1) goTo(step + 1);
  }
 
  function prevStep() {
    if (step > 0) goTo(step - 1);
  }
 
  function selectRadio(groupId, el) {
    document.querySelectorAll('#' + groupId + ' .radio-opt').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
  }
 
  function calculateAge() {
    const dob = document.getElementById('dob').value;
    if (!dob) return;
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    document.getElementById('ageField').value = age >= 0 ? age + ' years' : '—';
  }
 
  function previewPhoto(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = e => {
      const prev = document.getElementById('photoPreview');
      prev.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:2px">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
 
  function addCondition() {
    const inp = document.getElementById('condInput');
    const val = inp.value.trim();
    if (!val) return;
    const tag = document.createElement('div');
    tag.className = 'cond-tag';
    tag.innerHTML = `${val} <button onclick="this.parentElement.remove()">×</button>`;
    document.getElementById('condList').appendChild(tag);
    inp.value = '';
  }
 
  document.getElementById('condInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addCondition(); }
  });
 
  function addAllergy() {
    const div = document.createElement('div');
    div.className = 'allergy-row';
    div.innerHTML = `<input type="text" placeholder="Drug name (e.g. Penicillin)"><input type="text" placeholder="Reaction (e.g. Rash, anaphylaxis)"><button class="rm-btn" onclick="rmRow(this)">×</button>`;
    document.getElementById('allergyList').appendChild(div);
  }
 
  function addMed() {
    const div = document.createElement('div');
    div.className = 'allergy-row';
    div.innerHTML = `<input type="text" placeholder="Medication name (e.g. Metformin)"><input type="text" placeholder="Dose & frequency (e.g. 500mg twice daily)"><button class="rm-btn" onclick="rmRow(this)">×</button>`;
    document.getElementById('medList').appendChild(div);
  }
 
  function rmRow(btn) { btn.parentElement.remove(); }
 
  function saveDraft() {
    showToast('Draft saved — ' + new Date().toLocaleTimeString());
  }
 
  function submitForm() {
    for (let i = 0; i < total; i++) {
      document.getElementById('sec-' + i).classList.remove('visible');
      const nav = document.getElementById('nav-' + i);
      nav.classList.remove('active');
      nav.classList.add('done');
      document.getElementById('dot-' + i).textContent = '✓';
    }
    document.getElementById('progressFill').style.width = '100%';
    document.getElementById('pct').textContent = '100%';
    document.getElementById('successPanel').classList.add('visible');
    showToast('Patient registered successfully!');
  }
 
  function newReg() {
    document.getElementById('successPanel').classList.remove('visible');
    step = 0;
    goTo(0);
  }
 
  // Generate patient ID
  const pid = 'PRG-2026-' + String(Math.floor(1000 + Math.random() * 8999)).padStart(4, '0');
  document.getElementById('patientId').textContent = pid;
  document.getElementById('successId').textContent = pid;
    