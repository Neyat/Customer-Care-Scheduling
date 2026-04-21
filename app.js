// Customer Solutions Team Hub — open to the whole team.
// All state in localStorage. Export/Import JSON to share.

const STORAGE_KEY = "cs-team-hub-v1";
const ROLE_KEY = "cs-team-hub-role";
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const STATUS_CYCLE = ["off","working","wfh","pto","half"];

let state = loadState();
let activeSup = "all"; // supervisor filter for schedule
let currentRole = localStorage.getItem(ROLE_KEY) || ""; // "" = view only

function isEditor() { return !!currentRole && state.editors && state.editors.includes(currentRole); }

function setRole(name) {
  currentRole = name || "";
  localStorage.setItem(ROLE_KEY, currentRole);
  applyRole();
}

function applyRole() {
  // Toggle visibility of edit-only UI
  const show = isEditor();
  document.querySelectorAll(".edit-only").forEach(el => el.style.display = show ? "" : "none");
  document.querySelectorAll(".edit-link").forEach(el => el.style.display = show ? "" : "none");
  // Banner message
  const b = document.getElementById("role-banner");
  if (b) {
    if (show) b.innerHTML = "\u270F\uFE0F Editing as " + esc(currentRole) + ".";
    else b.innerHTML = "View only.";
  }
  // Populate role picker
  const sel = document.getElementById("role-picker");
  if (sel && sel.options.length <= 1 && state.editors) {
    state.editors.forEach(n => {
      const o = document.createElement("option"); o.value = n; o.textContent = n;
      sel.appendChild(o);
    });
  }
  if (sel) sel.value = currentRole;
}

// ---------- State management ----------
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) { console.warn("Failed to load state", e); }
  return JSON.parse(JSON.stringify(window.DEFAULT_DATA));
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch(e) { alert("Could not save changes to local storage."); }
}
function resetData() {
  if (!confirm("Reset everything to the default seed data? Your local changes will be lost.")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = JSON.parse(JSON.stringify(window.DEFAULT_DATA));
  renderAll();
}

// ---------- Tab switching ----------
document.querySelectorAll("nav .tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("nav .tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll("main section").forEach(s => s.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// ---------- Helpers ----------
function esc(s) { return (s==null?"":String(s)).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

function parseShiftHours(shift) {
  // "8:00-4:30" -> [start, end] as decimals (end adjusted for PM if less than start)
  const m = /^(\d+):(\d+)-(\d+):(\d+)$/.exec(shift || "");
  if (!m) return null;
  let sh = parseInt(m[1]), sm = parseInt(m[2]);
  let eh = parseInt(m[3]), em = parseInt(m[4]);
  // shift end treated as same-day. If end < start, it's PM (e.g. 8-4:30 means 4:30 PM)
  if (eh < sh) eh += 12;
  return [sh + sm/60, eh + em/60];
}

function supColor(name) {
  const s = state.supervisors.find(s => s.name === name);
  return s ? s.color : "#64748b";
}

function dayOfDate(dateStr) {
  // "2026-04-21" -> day number 0-6
  const d = new Date(dateStr + "T12:00:00");
  return d.getDay();
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatShortDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isDateInRange(date, startStr, endStr) {
  const d = date.toISOString().slice(0,10);
  return d >= startStr && d <= endStr;
}

// ---------- Export / Import ----------
function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "team-hub-data-" + new Date().toISOString().slice(0,10) + ".json";
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON(evt) {
  const f = evt.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.agents || !data.supervisors) throw new Error("Missing required fields.");
      state = data;
      saveState();
      renderAll();
      alert("Imported successfully.");
    } catch(e) {
      alert("Failed to import: " + e.message);
    }
  };
  reader.readAsText(f);
  evt.target.value = "";
}

// ---------- Overview: heatmaps ----------
const TIME_SLOTS = []; // 6:00 to 19:30 in 30-min increments
for (let h=6; h<=19; h++) for (let m of [0, 30]) TIME_SLOTS.push([h, m]);

function getWeekStart(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay()); // Sunday
  d.setHours(0,0,0,0);
  return d;
}

function agentWorkingOnDate(agent, date) {
  const dow = date.getDay();
  if (!agent.workDays || !agent.workDays[dow]) return false;
  const dateStr = date.toISOString().slice(0,10);
  // Check time off
  for (const t of state.timeOff) {
    if (t.agent !== agent.name) continue;
    if (t.status === "Denied") continue;
    if (dateStr >= t.start && dateStr <= t.end) {
      if (t.type && t.type.toLowerCase().includes("half")) return "half";
      return false;
    }
  }
  return true;
}

function staffedAtTimeSlot(date, slotHour) {
  let count = 0;
  for (const a of state.agents) {
    const working = agentWorkingOnDate(a, date);
    if (!working) continue;
    const hrs = parseShiftHours(a.shift);
    if (!hrs) continue;
    const [start, end] = hrs;
    if (slotHour >= start && slotHour < end) {
      count += (working === "half") ? 0.5 : 1;
    }
  }
  return Math.round(count * 10) / 10;
}

function renderOverview() {
  // Use the current week (starting Sunday) as the reference
  const today = new Date();
  const weekStart = getWeekStart(today);
  const days = [];
  for (let i=0; i<7; i++) {
    const d = new Date(weekStart); d.setDate(d.getDate() + i);
    days.push(d);
  }

  function makeTable(containerId, colorScale) {
    const rows = [];
    rows.push("<tr><th>Time</th>" + days.map(d =>
      `<th class="day-head">${DAY_NAMES[d.getDay()]}<div class="date">${formatShortDate(d)}</div></th>`
    ).join("") + "</tr>");

    for (const [h, m] of TIME_SLOTS) {
      const slotHr = h + m/60;
      const label = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
      const cells = days.map(d => {
        const count = staffedAtTimeSlot(d, slotHr);
        if (count === 0) return '<td class="z0">&mdash;</td>';
        const style = colorScale(count);
        return `<td style="${style}">${count}</td>`;
      }).join("");
      rows.push(`<tr><td class="tl">${label}</td>${cells}</tr>`);
    }
    document.getElementById(containerId).innerHTML = '<table class="heatmap">' + rows.join("") + '</table>';
  }

  // Blue scale for total staffed
  makeTable("overview-total", (n) => {
    const intensity = Math.min(1, n / 30);
    const bg = `rgba(59,130,246,${0.1 + intensity * 0.7})`;
    const color = intensity > 0.45 ? "white" : "#1e3a8a";
    return `background:${bg}; color:${color};`;
  });

  // Green-to-warning scale for in-office
  makeTable("overview-inoffice", (n) => {
    if (n > 22) return `background:#fef3c7; color:#92400e;`;
    const intensity = Math.min(1, n / 22);
    const bg = `rgba(16,185,129,${0.1 + intensity * 0.6})`;
    const color = intensity > 0.55 ? "white" : "#065f46";
    return `background:${bg}; color:${color};`;
  });
}

// ---------- Today ----------
function renderToday() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0,10);
  const dow = today.getDay();

  document.getElementById("today-date").textContent = formatDate(today);
  const activeAgents = state.agents.length;
  document.getElementById("today-active").textContent = activeAgents + " active agents";
  document.getElementById("subtitle").textContent = formatShortDate(today) + " \u00B7 " + activeAgents + " active agents";

  let working = 0, inOffice = 0, wfh = 0, out = 0;
  const outList = [], inList = [];

  for (const a of state.agents) {
    const status = agentWorkingOnDate(a, today);
    const timeOffToday = state.timeOff.find(t => t.agent === a.name && t.status !== "Denied" && todayStr >= t.start && todayStr <= t.end);
    if (!a.workDays || !a.workDays[dow]) {
      // scheduled day off
      continue;
    }
    if (timeOffToday) {
      out++;
      outList.push({ name: a.name, detail: timeOffToday.type });
      continue;
    }
    working++;
    // Assume in-office default; WFH could be added via status later
    inOffice++;
    const hrs = parseShiftHours(a.shift);
    inList.push({ name: a.name, shift: a.shift, start: hrs ? hrs[0] : 0, sup: a.supervisor });
  }

  // Sort in-list by shift start time
  inList.sort((a,b) => a.start - b.start);

  document.getElementById("stat-working").textContent = working;
  document.getElementById("stat-inoffice").textContent = inOffice;
  document.getElementById("stat-wfh").textContent = wfh;
  document.getElementById("stat-out").textContent = out;

  const coverage = activeAgents ? Math.round(working / activeAgents * 100) : 0;
  document.getElementById("today-coverage-pct").textContent = coverage + "% coverage";
  const coverageChip = document.getElementById("today-coverage-chip");
  if (coverage >= 80) { coverageChip.className = "chip green"; coverageChip.innerHTML = "&#9989; Staffing OK"; }
  else if (coverage >= 60) { coverageChip.className = "chip amber"; coverageChip.innerHTML = "&#9888; Staffing low"; }
  else { coverageChip.className = "chip red"; coverageChip.innerHTML = "&#10060; Critical"; }

  // Out today list
  const outEl = document.getElementById("out-list");
  if (outList.length === 0) {
    outEl.innerHTML = '<div class="small" style="padding:10px 4px;">Nobody out today.</div>';
  } else {
    outEl.innerHTML = outList.map(o =>
      `<div class="agent-row"><div class="name">${esc(o.name)}</div><div><span class="pto-pill">${esc(o.detail)}</span></div></div>`
    ).join("");
  }

  // In-office list
  const inEl = document.getElementById("in-list");
  document.getElementById("in-office-count").textContent = "(" + inList.length + ")";
  inEl.innerHTML = inList.map(i => {
    const [start, end] = parseShiftHours(i.shift) || [0,0];
    return `<div class="agent-row"><div><div class="name">${esc(i.name)}</div></div>
      <div class="time"><span class="shift-start">${esc(i.shift.split("-")[0])}</span><span class="shift-end">${esc(i.shift.split("-")[1]||"")}</span></div>
    </div>`;
  }).join("");

  // Risk list — check time-off-heavy days this week, PTO conflicts, etc.
  const risks = [];
  if (out >= Math.ceil(activeAgents * 0.15)) {
    risks.push({ type: "warn", msg: `${out} agents out today (${Math.round(out/activeAgents*100)}% of the team)` });
  }
  // Check pending time off
  const pending = state.timeOff.filter(t => t.status === "Pending");
  if (pending.length > 0) {
    risks.push({ type: "info", msg: `${pending.length} pending time-off request(s) awaiting approval` });
  }
  const riskEl = document.getElementById("risk-list");
  if (risks.length === 0) {
    riskEl.innerHTML = '<div class="chip green" style="background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0;">&#9989; All Clear</div>';
  } else {
    riskEl.innerHTML = risks.map(r => {
      const cls = r.type === "warn" ? "amber" : "blue";
      return `<div class="chip ${cls}" style="margin-right:6px; margin-bottom:6px;">${esc(r.msg)}</div>`;
    }).join("");
  }
}

// ---------- Schedule ----------
function renderWeekTotals() {
  const today = new Date();
  const weekStart = getWeekStart(today);
  const days = [];
  for (let i=0; i<7; i++) { const d = new Date(weekStart); d.setDate(d.getDate()+i); days.push(d); }

  const html = days.map(d => {
    const dow = d.getDay();
    let n = 0, outCount = 0;
    for (const a of state.agents) {
      if (!a.workDays || !a.workDays[dow]) continue;
      const status = agentWorkingOnDate(a, d);
      if (status === true || status === "half") n++;
      else if (status === false) outCount++;
    }
    return `<div class="wt"><div class="d">${DAY_NAMES[dow]}<br><span style="font-weight:400; font-size:10px;">${formatShortDate(d)}</span></div>
      <div class="v">${n}</div>${outCount>0?`<div class="o">${outCount} out</div>`:""}</div>`;
  }).join("");
  document.getElementById("week-totals").innerHTML = html;
}

function renderSupChips() {
  const el = document.getElementById("sup-chips");
  const totalByS = new Map([["all", state.agents.length]]);
  for (const a of state.agents) {
    totalByS.set(a.supervisor, (totalByS.get(a.supervisor) || 0) + 1);
  }
  const chips = [
    `<div class="sup-chip ${activeSup==='all'?'active':''}" onclick="setSup('all')" style="border-color:#0f172a; ${activeSup==='all'?'background:#0f172a; color:white;':''}">All<span class="sup-count">${totalByS.get("all")}</span></div>`
  ];
  for (const s of state.supervisors) {
    const active = activeSup === s.name;
    const style = `border-color:${s.color}; color:${s.color};` + (active ? `background:${s.color};` : "");
    chips.push(`<div class="sup-chip ${active?'active':''}" onclick="setSup('${esc(s.name)}')" style="${style}">${esc(s.name)}<span class="sup-count">${totalByS.get(s.name)||0}</span></div>`);
  }
  el.innerHTML = chips.join("");
}

function setSup(s) { activeSup = s; renderSupChips(); renderSchedule(); }

function renderSchedule() {
  renderWeekTotals();
  const q = (document.getElementById("sched-search").value || "").toLowerCase();
  const today = new Date();
  const weekStart = getWeekStart(today);
  const days = [];
  for (let i=0; i<7; i++) { const d = new Date(weekStart); d.setDate(d.getDate()+i); days.push(d); }

  const filtered = state.agents.filter(a => {
    if (activeSup !== "all" && a.supervisor !== activeSup) return false;
    if (q && !a.name.toLowerCase().includes(q)) return false;
    return true;
  }).sort((a,b) => a.name.localeCompare(b.name));

  const rows = filtered.map((a, idx) => {
    const supC = supColor(a.supervisor);
    const dayCells = days.map((d, i) => {
      const dow = d.getDay();
      const status = agentWorkingOnDate(a, d);
      let cls = "off", label = "&mdash;";
      if (!a.workDays || !a.workDays[dow]) { cls = "off"; label = "off"; }
      else if (status === "half") { cls = "half"; label = "Half"; }
      else if (status === false) { cls = "pto"; label = "PTO"; }
      else if (status === true) { cls = "working"; label = a.shift.split("-")[0]; }
      return `<td><span class="day-pill ${cls}" onclick="cycleDay(${state.agents.indexOf(a)}, ${dow})">${label}</span></td>`;
    }).join("");
    return `<tr>
      <td><b>${esc(a.name)}</b></td>
      <td class="small">${esc(a.shift)}</td>
      <td style="color:${supC}; font-weight:500;">${esc(a.supervisor)}</td>
      ${dayCells}
      <td><span class="edit-link" onclick="openAgentModal(${state.agents.indexOf(a)})">&#9998;</span></td>
    </tr>`;
  }).join("");

  document.getElementById("sched-body").innerHTML = rows || `<tr><td colspan="11" class="small" style="text-align:center; padding:20px;">No agents match the filter.</td></tr>`;
  document.getElementById("sched-footer").textContent = filtered.length + " of " + state.agents.length + " agents";
}

function cycleDay(agentIdx, dow) {
  if (!isEditor()) { return; }
  const a = state.agents[agentIdx];
  if (!a) return;
  if (!a.workDays) a.workDays = [false,false,false,false,false,false,false];
  a.workDays[dow] = !a.workDays[dow];
  saveState();
  renderAll();
}

// ---------- Time Off ----------
function populateTimeOffFilters() {
  const supEl = document.getElementById("tf-sup");
  if (supEl.options.length <= 1) {
    state.supervisors.forEach(s => {
      const o = document.createElement("option");
      o.value = s.name; o.textContent = s.name;
      supEl.appendChild(o);
    });
  }
}

function renderTimeOff() {
  populateTimeOffFilters();
  const month = document.getElementById("tf-month").value;
  const sup = document.getElementById("tf-sup").value;
  const type = document.getElementById("tf-type").value;
  const q = (document.getElementById("tf-search").value || "").toLowerCase();

  const list = state.timeOff.filter(t => {
    if (month && (new Date(t.start + "T12:00:00").getMonth() + 1) != parseInt(month)) return false;
    if (sup && t.supervisor !== sup) return false;
    if (type && t.type !== type) return false;
    if (q && !(t.agent.toLowerCase().includes(q) || (t.type||"").toLowerCase().includes(q))) return false;
    return true;
  }).sort((a,b) => a.start.localeCompare(b.start));

  const rows = list.map(t => {
    const idx = state.timeOff.indexOf(t);
    const sameDay = t.start === t.end;
    const dates = sameDay ? formatShortDate(new Date(t.start + "T12:00:00"))
      : formatShortDate(new Date(t.start + "T12:00:00")) + " \u2013 " + formatShortDate(new Date(t.end + "T12:00:00"));
    const pill = timeOffTypePill(t.type);
    const statusCls = t.status === "Approved" ? "status-approved" : (t.status === "Pending" ? "status-pending" : "");
    const supC = supColor(t.supervisor);
    const rowCls = t.status === "Pending" ? "row-pending" : "";
    return `<tr class="${rowCls}">
      <td><b>${esc(t.agent)}</b></td>
      <td>${pill}</td>
      <td class="small">${dates}</td>
      <td>${t.days}</td>
      <td class="${statusCls}">${esc(t.status)}</td>
      <td style="color:${supC}; font-weight:500;">${esc(t.supervisor||"—")}</td>
      <td><span class="edit-link" onclick="openTimeOffModal(${idx})">&#9998;</span></td>
    </tr>`;
  }).join("");

  document.getElementById("timeoff-body").innerHTML = rows || `<tr><td colspan="7" class="small" style="text-align:center; padding:20px;">No time off matches.</td></tr>`;
}

function timeOffTypePill(type) {
  const colors = {
    "Vacation":   "background:#ede9fe;color:#5b21b6;",
    "Jiffy":      "background:#fef3c7;color:#92400e;",
    "Half Jiffy": "background:#fed7aa;color:#9a3412;",
    "Parental":   "background:#fce7f3;color:#9d174d;",
    "Unpaid":     "background:#f1f5f9;color:#475569;"
  };
  return `<span class="day-pill" style="${colors[type]||'background:#e2e8f0;color:#475569;'}">${esc(type)}</span>`;
}

// ---------- Roster ----------
function renderRoster() {
  const supEl = document.getElementById("roster-sup");
  if (supEl.options.length <= 1) {
    state.supervisors.forEach(s => {
      const o = document.createElement("option"); o.value = s.name; o.textContent = s.name;
      supEl.appendChild(o);
    });
  }
  const q = (document.getElementById("roster-search").value || "").toLowerCase();
  const supFilter = supEl.value;
  const list = state.agents.filter(a => {
    if (supFilter && a.supervisor !== supFilter) return false;
    if (q && !a.name.toLowerCase().includes(q)) return false;
    return true;
  }).sort((a,b) => a.name.localeCompare(b.name));

  const rows = list.map((a) => {
    const days = (a.workDays || []).map((d, i) => d ? DAY_NAMES[i] : null).filter(Boolean).join(", ");
    const supC = supColor(a.supervisor);
    const idx = state.agents.indexOf(a);
    return `<tr>
      <td><b>${esc(a.name)}</b></td>
      <td class="small">${esc(a.shift)}</td>
      <td style="color:${supC}; font-weight:500;">${esc(a.supervisor)}</td>
      <td class="small">${esc(days)}</td>
      <td><span class="edit-link" onclick="openAgentModal(${idx})">&#9998; Edit</span></td>
    </tr>`;
  }).join("");
  document.getElementById("roster-body").innerHTML = rows || `<tr><td colspan="5" class="small" style="text-align:center; padding:20px;">No agents match.</td></tr>`;
}

// ---------- Agent modal ----------
let editingAgentIdx = -1;
function openAgentModal(idx) {
  editingAgentIdx = idx == null ? -1 : idx;
  const supSel = document.getElementById("am-sup");
  supSel.innerHTML = state.supervisors.map(s => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join("");
  document.getElementById("am-delete").style.display = idx == null ? "none" : "";
  document.getElementById("agent-modal-title").textContent = idx == null ? "Add Agent" : "Edit Agent";

  if (idx != null && state.agents[idx]) {
    const a = state.agents[idx];
    document.getElementById("am-name").value = a.name || "";
    document.getElementById("am-shift").value = a.shift || "";
    supSel.value = a.supervisor || "";
    document.querySelectorAll(".am-day").forEach((cb, i) => { cb.checked = !!(a.workDays && a.workDays[i]); });
  } else {
    document.getElementById("am-name").value = "";
    document.getElementById("am-shift").value = "";
    document.querySelectorAll(".am-day").forEach((cb, i) => { cb.checked = (i >= 1 && i <= 5); });
  }
  document.getElementById("agent-modal-bg").classList.add("open");
}
function closeAgentModal() { document.getElementById("agent-modal-bg").classList.remove("open"); }
function saveAgent() {
  const name = document.getElementById("am-name").value.trim();
  if (!name) { alert("Name is required"); return; }
  const shift = document.getElementById("am-shift").value.trim();
  const sup = document.getElementById("am-sup").value;
  const workDays = Array.from(document.querySelectorAll(".am-day")).map(cb => cb.checked);
  const data = { name, shift, supervisor: sup, workDays };
  if (editingAgentIdx < 0) state.agents.push(data);
  else state.agents[editingAgentIdx] = Object.assign({}, state.agents[editingAgentIdx], data);
  saveState(); closeAgentModal(); renderAll();
}
function deleteAgent() {
  if (editingAgentIdx < 0) return;
  if (!confirm("Delete this agent?")) return;
  state.agents.splice(editingAgentIdx, 1);
  saveState(); closeAgentModal(); renderAll();
}

// ---------- Time Off modal ----------
let editingTOIdx = -1;
function openTimeOffModal(idx) {
  editingTOIdx = idx == null ? -1 : idx;
  const agentSel = document.getElementById("to-agent");
  agentSel.innerHTML = state.agents.map(a => `<option value="${esc(a.name)}">${esc(a.name)}</option>`).join("");
  document.getElementById("to-delete").style.display = idx == null ? "none" : "";
  document.getElementById("timeoff-modal-title").textContent = idx == null ? "Add Time Off Request" : "Edit Time Off Request";

  if (idx != null && state.timeOff[idx]) {
    const t = state.timeOff[idx];
    agentSel.value = t.agent;
    document.getElementById("to-type").value = t.type;
    document.getElementById("to-start").value = t.start;
    document.getElementById("to-end").value = t.end;
    document.getElementById("to-days").value = t.days;
    document.getElementById("to-status").value = t.status;
  } else {
    document.getElementById("to-start").value = new Date().toISOString().slice(0,10);
    document.getElementById("to-end").value = new Date().toISOString().slice(0,10);
    document.getElementById("to-days").value = 1;
    document.getElementById("to-status").value = "Approved";
  }
  document.getElementById("timeoff-modal-bg").classList.add("open");
}
function closeTimeOffModal() { document.getElementById("timeoff-modal-bg").classList.remove("open"); }
function saveTimeOff() {
  const agent = document.getElementById("to-agent").value;
  const type = document.getElementById("to-type").value;
  const start = document.getElementById("to-start").value;
  const end = document.getElementById("to-end").value;
  const days = parseFloat(document.getElementById("to-days").value) || 0;
  const status = document.getElementById("to-status").value;
  const a = state.agents.find(x => x.name === agent);
  const sup = a ? a.supervisor : "";
  const data = { agent, type, start, end, days, status, supervisor: sup };
  if (editingTOIdx < 0) state.timeOff.push(data);
  else state.timeOff[editingTOIdx] = data;
  saveState(); closeTimeOffModal(); renderAll();
}
function deleteTimeOff() {
  if (editingTOIdx < 0) return;
  if (!confirm("Delete this request?")) return;
  state.timeOff.splice(editingTOIdx, 1);
  saveState(); closeTimeOffModal(); renderAll();
}

// ---------- Render all ----------
function renderAll() {
  renderOverview();
  renderToday();
  renderSupChips();
  renderSchedule();
  renderTimeOff();
  renderRoster();
  applyRole();
}

renderAll();
