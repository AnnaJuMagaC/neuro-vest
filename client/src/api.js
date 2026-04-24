// ============================================================
// api.js — Camada de serviço para a API C#
// Troque BASE_URL pela URL real quando a API estiver pronta
// ============================================================

const BASE_URL = 'https://localhost:7001/api'; // TODO: trocar pela URL real

// ---- Dados FAKE (remover quando a API C# estiver pronta) ----

export const fakePatient = {
  id: 'P-00142',
  nome: 'João Carlos Medeiros',
  idade: 58,
  sexo: 'Masculino',
  peso: 84,
  altura: 175,
  condicoes: ['Hipertensão', 'Histórico familiar de AVC'],
  medico: 'Dra. Ana Paula Ferreira',
  ultimaSessao: '2025-03-18T14:30:00',
};

export const fakeVitals = {
  // Colete Biomédico
  freqCardiaca: 78,
  pressaoSistolica: 138,
  pressaoDiastolica: 88,
  spo2: 97,
  tempCorporal: 36.8,
  freqRespiratoria: 16,
  ecgAmplitude: 1.2,

  // Faixa Cerebral
  eegDelta: 22,
  eegTheta: 18,
  eegAlpha: 35,
  eegBeta: 25,
  eegGamma: 8,
  fluxoCerebral: 62,
  oxigenacaoCerebral: 68,

  // IA
  indiceRiscoVascular: 41,
  indiceRiscoCerebral: 38,
  indiceRiscoGeral: 39,

  ultimaAtualizacao: new Date().toISOString(),
};

export const fakeAlerts = [
  { id: 1, tipo: 'warning', mensagem: 'Pressão arterial sistólica elevada (138 mmHg)', sensor: 'Colete — Pressão', hora: '14:31' },
  { id: 2, tipo: 'info', mensagem: 'Oxigenação cerebral dentro da faixa normal', sensor: 'Faixa — fNIRS', hora: '14:28' },
  { id: 3, tipo: 'warning', mensagem: 'Variabilidade da FC ligeiramente reduzida', sensor: 'Colete — ECG', hora: '14:25' },
];

export const fakeHistorico = [
  { data: '18/03 14:31', fc: 78, paSis: 138, paDias: 88, spo2: 97, riscoGeral: 39, status: 'warning' },
  { data: '18/03 14:00', fc: 75, paSis: 132, paDias: 85, spo2: 98, riscoGeral: 35, status: 'normal' },
  { data: '18/03 13:30', fc: 80, paSis: 140, paDias: 90, spo2: 97, riscoGeral: 43, status: 'warning' },
  { data: '18/03 13:00', fc: 72, paSis: 128, paDias: 82, spo2: 99, riscoGeral: 30, status: 'normal' },
  { data: '18/03 12:30', fc: 77, paSis: 130, paDias: 84, spo2: 98, riscoGeral: 32, status: 'normal' },
  { data: '18/03 12:00', fc: 82, paSis: 145, paDias: 92, spo2: 96, riscoGeral: 52, status: 'danger' },
];

export const fakeChartFC = Array.from({ length: 30 }, (_, i) => ({
  t: i,
  valor: 70 + Math.round(Math.sin(i * 0.5) * 8 + Math.random() * 6),
}));

export const fakeChartPA = Array.from({ length: 20 }, (_, i) => ({
  t: i * 3,
  sistolica: 130 + Math.round(Math.sin(i * 0.4) * 10 + Math.random() * 5),
  diastolica: 82 + Math.round(Math.cos(i * 0.4) * 6 + Math.random() * 4),
}));

export const fakeChartEEG = Array.from({ length: 30 }, (_, i) => ({
  t: i,
  delta: 18 + Math.round(Math.random() * 8),
  alpha: 30 + Math.round(Math.random() * 10),
  beta:  20 + Math.round(Math.random() * 8),
}));

export const fakeDevices = [
  { id: 'D-01', nome: 'Colete Biomédico', tipo: 'Vascular', status: 'ativo', bateria: 82, sinal: 95, sensores: ['ECG', 'SpO₂', 'PA', 'Temp', 'Resp'] },
  { id: 'D-02', nome: 'Faixa Cerebral', tipo: 'Neural', status: 'ativo', bateria: 71, sinal: 88, sensores: ['EEG', 'fNIRS', 'IMU'] },
];

// ---- Funções da API (trocar o retorno fake pelo fetch real) ----

export async function getPatient() {
  // TODO: return fetch(`${BASE_URL}/paciente/atual`).then(r => r.json());
  return Promise.resolve(fakePatient);
}

export async function getVitals() {
  // TODO: return fetch(`${BASE_URL}/sensores/vitais`).then(r => r.json());
  return Promise.resolve({ ...fakeVitals, ultimaAtualizacao: new Date().toISOString() });
}

export async function getAlerts() {
  // TODO: return fetch(`${BASE_URL}/alertas`).then(r => r.json());
  return Promise.resolve(fakeAlerts);
}

export async function getHistorico() {
  // TODO: return fetch(`${BASE_URL}/historico`).then(r => r.json());
  return Promise.resolve(fakeHistorico);
}

export async function getDevices() {
  // TODO: return fetch(`${BASE_URL}/dispositivos`).then(r => r.json());
  return Promise.resolve(fakeDevices);
}

export async function postComando(deviceId, comando) {
  // TODO: return fetch(`${BASE_URL}/dispositivos/${deviceId}/comando`, {
  //   method: 'POST', headers: {'Content-Type': 'application/json'},
  //   body: JSON.stringify({ comando })
  // }).then(r => r.json());
  console.log(`[API] Comando enviado para ${deviceId}:`, comando);
  return Promise.resolve({ ok: true });
}
