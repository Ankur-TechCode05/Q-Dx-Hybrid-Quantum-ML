import type { HealthData, AnalysisResult } from '@/types';
import { DISEASES, getDiseaseInfo } from '@/lib/analysis';

/**
 * Generates a printable HTML report and triggers a download.
 * Uses the browser's print-to-PDF capability for a clean, downloadable report.
 */
export function generateReport(
  data: HealthData,
  result: AnalysisResult,
  userName?: string,
): void {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const overallColor =
    result.overallRiskLevel === 'low' ? '#10b981' :
    result.overallRiskLevel === 'moderate' ? '#f59e0b' : '#f43f5e';

  const diseaseSections = result.diseases.map((d) => {
    const info = getDiseaseInfo(d.disease);
    const color = d.riskLevel === 'low' ? '#10b981' : d.riskLevel === 'moderate' ? '#f59e0b' : '#f43f5e';
    return `
    <div class="section">
      <h2 style="color: ${info.color};">${info.label} — Risk Score: ${d.riskScore}/100 (${d.riskLevel})</h2>
      <p style="font-size:13px;color:#64748b;margin-bottom:12px;">${info.description}</p>
      <div class="grid">
        <div class="stat"><div class="label">Classical ML Score</div><div class="value">${d.classicalScore}/100</div></div>
        <div class="stat"><div class="label">Quantum ML Score</div><div class="value">${d.quantumScore}/100</div></div>
      </div>
      <table style="margin-top:16px;">
        <thead><tr><th>Metric</th><th>Classical ML</th><th>Quantum ML</th></tr></thead>
        <tbody>
          <tr><td>Accuracy</td><td>${d.modelMetrics.classical.accuracy}%</td><td>${d.modelMetrics.quantum.accuracy}%</td></tr>
          <tr><td>Precision</td><td>${d.modelMetrics.classical.precision}%</td><td>${d.modelMetrics.quantum.precision}%</td></tr>
          <tr><td>Recall</td><td>${d.modelMetrics.classical.recall}%</td><td>${d.modelMetrics.quantum.recall}%</td></tr>
          <tr><td>F1 Score</td><td>${d.modelMetrics.classical.f1}%</td><td>${d.modelMetrics.quantum.f1}%</td></tr>
          <tr><td>ROC-AUC</td><td>${d.modelMetrics.classical.roc_auc}%</td><td>${d.modelMetrics.quantum.roc_auc}%</td></tr>
        </tbody>
      </table>
      <h3 style="font-size:14px;margin-top:16px;margin-bottom:8px;">Key Risk Factors</h3>
      ${d.riskFactors.map(f => `
      <div class="factor">
        <div>
          <div class="name">${f.name}</div>
          <div style="font-size:13px;color:#64748b;">${f.description}</div>
          <div style="font-size:12px;color:#94a3b8;margin-top:2px;">Current: ${f.value} · Contribution: ${f.contribution}%</div>
        </div>
        <span class="severity severity-${f.severity}">${f.severity}</span>
      </div>`).join('')}
      <h3 style="font-size:14px;margin-top:16px;margin-bottom:8px;">Recommendations</h3>
      <ul class="recs">
        ${d.recommendations.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>`;
  }).join('');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Q-Dx Multi-Disease Health Risk Report — ${date}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; background: #f8fafc; line-height: 1.6; }
  .header { background: linear-gradient(135deg, #3361ff, #8b5cf6); color: white; padding: 40px; text-align: center; }
  .header h1 { font-size: 28px; margin-bottom: 8px; }
  .header p { opacity: 0.9; font-size: 14px; }
  .container { max-width: 800px; margin: 0 auto; padding: 30px; }
  .section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .section h2 { font-size: 18px; margin-bottom: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
  .risk-score-display { text-align: center; padding: 20px; }
  .risk-score-display .score { font-size: 56px; font-weight: 700; color: ${overallColor}; }
  .risk-score-display .label { font-size: 18px; text-transform: uppercase; letter-spacing: 2px; color: ${overallColor}; font-weight: 600; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .stat { padding: 12px; background: #f8fafc; border-radius: 8px; }
  .stat .label { font-size: 12px; color: #64748b; text-transform: uppercase; }
  .stat .value { font-size: 16px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
  th { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 12px; }
  .factor { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
  .factor .name { font-weight: 600; }
  .factor .severity { padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
  .severity-low { background: #d1fae5; color: #065f46; }
  .severity-moderate { background: #fef3c7; color: #92400e; }
  .severity-high { background: #fee2e2; color: #991b1b; }
  .recs li { margin-bottom: 8px; padding-left: 8px; }
  .disclaimer { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; color: #92400e; }
  .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
  .disease-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
  .disease-card { padding: 12px; border-radius: 8px; background: #f8fafc; text-align: center; }
  .disease-card .name { font-size: 11px; color: #64748b; }
  .disease-card .score { font-size: 20px; font-weight: 700; }
  @media print { .no-print { display: none; } body { background: white; } }
</style>
</head>
<body>
  <div class="header">
    <h1>Q-Dx Multi-Disease Health Risk Report</h1>
    <p>Hybrid Quantum-Classical Machine Learning Analysis · 6 Diseases</p>
    <p style="margin-top:8px;font-size:13px;">${date}${userName ? ' · ' + userName : ''}</p>
  </div>

  <div class="container">
    <div class="disclaimer">
      <strong>Research Prototype — Not a Medical Diagnosis.</strong> This report is generated by a
      research prototype combining classical and quantum machine learning for illustrative purposes.
      The scores and analysis are for educational demonstration only and should not be used as a
      substitute for professional medical advice, diagnosis, or treatment.
    </div>

    <div class="section">
      <h2>Overall Risk Assessment Summary</h2>
      <div class="risk-score-display">
        <div class="score">${result.overallRiskScore}/100</div>
        <div class="label">${result.overallRiskLevel} Risk</div>
      </div>
      <div class="disease-summary">
        ${result.diseases.map(d => {
          const info = getDiseaseInfo(d.disease);
          const c = d.riskLevel === 'low' ? '#10b981' : d.riskLevel === 'moderate' ? '#f59e0b' : '#f43f5e';
          return `<div class="disease-card"><div class="name">${info.shortLabel}</div><div class="score" style="color:${c}">${d.riskScore}</div></div>`;
        }).join('')}
      </div>
    </div>

    <div class="section">
      <h2>Health Data Summary</h2>
      <div class="grid">
        <div class="stat"><div class="label">Age</div><div class="value">${data.age} years</div></div>
        <div class="stat"><div class="label">Gender</div><div class="value">${data.gender}</div></div>
        <div class="stat"><div class="label">BMI</div><div class="value">${data.bmi.toFixed(1)}</div></div>
        <div class="stat"><div class="label">Blood Pressure</div><div class="value">${data.bloodPressureSystolic}/${data.bloodPressureDiastolic} mmHg</div></div>
        <div class="stat"><div class="label">Heart Rate</div><div class="value">${data.heartRate} bpm</div></div>
        <div class="stat"><div class="label">Glucose</div><div class="value">${data.glucose} mg/dL</div></div>
        <div class="stat"><div class="label">Cholesterol</div><div class="value">${data.cholesterol} mg/dL</div></div>
        <div class="stat"><div class="label">Smoking</div><div class="value">${data.smoking ? 'Yes' : 'No'}</div></div>
        <div class="stat"><div class="label">Physical Activity</div><div class="value">${data.physicalActivity}</div></div>
        <div class="stat"><div class="label">Sleep</div><div class="value">${data.sleepHours} hours</div></div>
        <div class="stat"><div class="label">Alcohol</div><div class="value">${data.alcohol}</div></div>
        <div class="stat"><div class="label">Family History</div><div class="value">${data.familyHistory ? 'Yes' : 'No'}</div></div>
        <div class="stat"><div class="label">UV Exposure</div><div class="value">${data.skinExposure} hrs/week</div></div>
        <div class="stat"><div class="label">Skin Type</div><div class="value">Type ${data.skinType}</div></div>
        <div class="stat"><div class="label">Mole Count</div><div class="value">${data.molesCount}</div></div>
        <div class="stat"><div class="label">Water Intake</div><div class="value">${data.waterIntake} glasses/day</div></div>
      </div>
    </div>

    ${diseaseSections}

    <div class="footer">
      <p>Generated by Q-Dx — Hybrid Quantum Machine Learning for Multi-Disease Risk Detection</p>
      <p>SIH 2026 Research Prototype · ${date}</p>
      <p style="margin-top:4px;">Research Prototype — Not a Medical Diagnosis</p>
    </div>
  </div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `qdx-report-${Date.now()}.html`;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
