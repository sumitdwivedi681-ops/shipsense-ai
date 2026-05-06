/**
 * Shipping Delay Prediction — Frontend Logic
 * Handles form submission, API calls, results display, and prediction history.
 */

const API_BASE = "http://127.0.0.1:5000";

// ── DOM References ──────────────────────────────────────────
const form = document.getElementById("prediction-form");
const btnPredict = document.getElementById("btn-predict");
const resultPanel = document.getElementById("result-panel");
const historyBody = document.getElementById("history-body");
const btnClear = document.getElementById("btn-clear");

let importanceChart = null;

// ── On Page Load ────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadHistory();
  loadModelInfo();
  loadAnalytics();
});

// ── Form Submission ─────────────────────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  btnPredict.classList.add("loading");

  const payload = {
    shipMode: document.getElementById("shipMode").value,
    city: document.getElementById("city").value.trim() || "New York",
    stateProvince: document.getElementById("stateProvince").value.trim() || "New York",
    region: document.getElementById("region").value,
    division: document.getElementById("division").value,
    productName: document.getElementById("productName").value.trim() || "Milk Chocolate",
    sales: parseFloat(document.getElementById("sales").value) || 0,
    units: parseInt(document.getElementById("units").value) || 1,
    grossProfit: parseFloat(document.getElementById("grossProfit").value) || 0,
    cost: parseFloat(document.getElementById("cost").value) || 0,
    orderMonth: parseInt(document.getElementById("orderMonth").value) || 1,
    orderDay: parseInt(document.getElementById("orderDay").value) || 1,
    orderWeekday: parseInt(document.getElementById("orderWeekday").value),
  };

  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Prediction failed");
    }

    const data = await res.json();
    showResult(data);
    saveToHistory(data);
    updateImportanceChart(data.importances);
  } catch (err) {
    alert("⚠️ " + err.message + "\n\nMake sure the Flask server is running: python app.py");
  } finally {
    btnPredict.classList.remove("loading");
  }
});

// ── Show Result ─────────────────────────────────────────────
function showResult(data) {
  const isDelayed = data.prediction === 1;
  const icon = isDelayed ? "⚠️" : "✅";
  const cls = isDelayed ? "delayed" : "on-time";
  const label = isDelayed ? "DELAYED" : "ON TIME";
  const proba = data.probabilities || { onTime: 0, delayed: 100 };

  document.getElementById("result-icon").className = `result-icon ${cls}`;
  document.getElementById("result-icon").textContent = icon;
  document.getElementById("result-label").className = `result-label ${cls}`;
  document.getElementById("result-label").textContent = label;
  document.getElementById("result-sub").textContent =
    isDelayed
      ? "This shipment has a high probability of being delayed."
      : "This shipment is predicted to arrive on time.";

  // Confidence bars
  const onTimePercent = proba.onTime ?? 0;
  const delayedPercent = proba.delayed ?? 100;

  const greenBar = document.getElementById("conf-green");
  const redBar = document.getElementById("conf-red");

  greenBar.style.width = "0%";
  redBar.style.width = "0%";

  requestAnimationFrame(() => {
    setTimeout(() => {
      greenBar.style.width = onTimePercent + "%";
      redBar.style.width = delayedPercent + "%";
    }, 100);
  });

  document.getElementById("conf-green-val").textContent = onTimePercent + "%";
  document.getElementById("conf-red-val").textContent = delayedPercent + "%";

  resultPanel.classList.add("show");
  resultPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ── Importance Chart ────────────────────────────────────────
function updateImportanceChart(importances) {
  const canvas = document.getElementById("importanceChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  if (importanceChart) {
    importanceChart.destroy();
  }

  importanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: importances.map(i => i.feature),
      datasets: [{
        label: 'Impact Score',
        data: importances.map(i => i.value),
        backgroundColor: 'rgba(124, 58, 237, 0.6)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false, grid: { display: false } },
        y: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });
}

// ── Analytics ───────────────────────────────────────────────
async function loadAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) return;
    const data = await res.json();

    renderRegionChart(data.delaysByRegion);
    renderEfficiencyChart(data.shipModeEfficiency);
  } catch (err) {
    console.error("Failed to load analytics:", err);
  }
}

function renderRegionChart(data) {
  const ctx = document.getElementById("regionChart").getContext("2d");
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.data,
        backgroundColor: [
          '#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'
        ],
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#94a3b8', font: { size: 11 }, padding: 15 }
        }
      },
      cutout: '70%'
    }
  });
}

function renderEfficiencyChart(data) {
  const ctx = document.getElementById("efficiencyChart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'On Time',
          data: data.onTime,
          backgroundColor: '#10b981',
          borderRadius: 4
        },
        {
          label: 'Delayed',
          data: data.delayed,
          backgroundColor: '#ef4444',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { color: '#94a3b8', font: { size: 11 } } }
      },
      scales: {
        x: { stacked: true, ticks: { color: '#94a3b8' }, grid: { display: false } },
        y: { stacked: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

// ── History ─────────────────────────────────────────────────
function saveToHistory(data) {
  const history = JSON.parse(localStorage.getItem("shippingHistory") || "[]");
  history.unshift({
    time: new Date().toLocaleString(),
    city: data.input.city,
    shipMode: data.input.shipMode,
    label: data.label,
    delayed: data.prediction,
    prob: data.probabilities ? data.probabilities.delayed : "—",
  });
  if (history.length > 20) history.pop();
  localStorage.setItem("shippingHistory", JSON.stringify(history));
  renderHistory(history);
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("shippingHistory") || "[]");
  renderHistory(history);
}

function renderHistory(history) {
  if (!history.length) {
    historyBody.innerHTML = `<tr><td colspan="5" class="no-history">No predictions yet. Try one above!</td></tr>`;
    return;
  }
  historyBody.innerHTML = history
    .map(
      (h) => `
    <tr>
      <td>${h.time}</td>
      <td>${h.city || "—"}</td>
      <td>${h.shipMode}</td>
      <td><span class="badge-status ${h.delayed ? "delayed" : "on-time"}">${h.label}</span></td>
      <td>${typeof h.prob === "number" ? h.prob + "%" : h.prob}</td>
    </tr>`
    )
    .join("");
}

btnClear.addEventListener("click", () => {
  localStorage.removeItem("shippingHistory");
  renderHistory([]);
});

// ── Model Info ──────────────────────────────────────────────
async function loadModelInfo() {
  try {
    const res = await fetch(`${API_BASE}/model-info`);
    if (!res.ok) return;
    const info = await res.json();

    document.getElementById("dash-accuracy").textContent = (info.accuracy * 100).toFixed(0) + "%";
    document.getElementById("dash-estimators").textContent = info.nEstimators;
    document.getElementById("dash-features").textContent = info.features.length;
    document.getElementById("dash-dataset").textContent = info.datasetRows.toLocaleString();
  } catch {
    // Server not running yet — silently ignore
  }
}

// ── Smooth scroll nav ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});
