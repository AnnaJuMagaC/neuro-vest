import { hasSupabaseConfig, supabase } from "./lib/supabase";

// ============================================================
// api.js — camada de dados com fallback local
// Usa Supabase quando a configuração estiver disponível.
// ============================================================

export const fakePatient = {
  id: "P-00142",
  nome: "João Carlos Medeiros",
  idade: 58,
  sexo: "Masculino",
  peso: 84,
  altura: 175,
  condicoes: ["Hipertensão", "Histórico familiar de AVC"],
  medico: "Dra. Ana Paula Ferreira",
  ultimaSessao: "2025-03-18T14:30:00",
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
  {
    id: 1,
    tipo: "warning",
    mensagem: "Pressão arterial sistólica elevada (138 mmHg)",
    sensor: "Colete — Pressão",
    hora: "14:31",
  },
  {
    id: 2,
    tipo: "info",
    mensagem: "Oxigenação cerebral dentro da faixa normal",
    sensor: "Faixa — fNIRS",
    hora: "14:28",
  },
  {
    id: 3,
    tipo: "warning",
    mensagem: "Variabilidade da FC ligeiramente reduzida",
    sensor: "Colete — ECG",
    hora: "14:25",
  },
];

export const fakeHistorico = [
  {
    data: "18/03 14:31",
    fc: 78,
    paSis: 138,
    paDias: 88,
    spo2: 97,
    riscoGeral: 39,
    status: "warning",
  },
  {
    data: "18/03 14:00",
    fc: 75,
    paSis: 132,
    paDias: 85,
    spo2: 98,
    riscoGeral: 35,
    status: "normal",
  },
  {
    data: "18/03 13:30",
    fc: 80,
    paSis: 140,
    paDias: 90,
    spo2: 97,
    riscoGeral: 43,
    status: "warning",
  },
  {
    data: "18/03 13:00",
    fc: 72,
    paSis: 128,
    paDias: 82,
    spo2: 99,
    riscoGeral: 30,
    status: "normal",
  },
  {
    data: "18/03 12:30",
    fc: 77,
    paSis: 130,
    paDias: 84,
    spo2: 98,
    riscoGeral: 32,
    status: "normal",
  },
  {
    data: "18/03 12:00",
    fc: 82,
    paSis: 145,
    paDias: 92,
    spo2: 96,
    riscoGeral: 52,
    status: "danger",
  },
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
  beta: 20 + Math.round(Math.random() * 8),
}));

export const fakeDevices = [
  {
    id: "D-01",
    nome: "Colete Biomédico",
    tipo: "Vascular",
    status: "ativo",
    bateria: 82,
    sinal: 95,
    sensores: ["ECG", "SpO₂", "PA", "Temp", "Resp"],
  },
  {
    id: "D-02",
    nome: "Faixa Cerebral",
    tipo: "Neural",
    status: "ativo",
    bateria: 71,
    sinal: 88,
    sensores: ["EEG", "fNIRS", "IMU"],
  },
];

function formatTime(value) {
  if (!value) return "--:--";
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(value) {
  if (!value) return new Date().toISOString();
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizePatientProfile(profile, login, conditions = []) {
  return {
    id: profile?.id || login?.id || fakePatient.id,
    nome:
      profile?.nome_completo || login?.email?.split("@")[0] || fakePatient.nome,
    idade: profile?.idade ?? fakePatient.idade,
    sexo: profile?.sexo || fakePatient.sexo,
    peso: profile?.peso_kg || fakePatient.peso,
    altura: profile?.altura_cm || fakePatient.altura,
    condicoes: conditions.length ? conditions : fakePatient.condicoes,
    medico: fakePatient.medico,
    ultimaSessao:
      profile?.created_at || login?.data_criacao || fakePatient.ultimaSessao,
  };
}

function mapTelemetriaToVitals(session, analysis) {
  if (!session) {
    return { ...fakeVitals, ultimaAtualizacao: new Date().toISOString() };
  }

  return {
    freqCardiaca: session.fc_bpm ?? fakeVitals.freqCardiaca,
    pressaoSistolica: session.pa_sistolica ?? fakeVitals.pressaoSistolica,
    pressaoDiastolica: session.pa_diastolica ?? fakeVitals.pressaoDiastolica,
    spo2: session.spo2 ?? fakeVitals.spo2,
    tempCorporal: fakeVitals.tempCorporal,
    freqRespiratoria: fakeVitals.freqRespiratoria,
    ecgAmplitude: session.amplitude_ecg ?? fakeVitals.ecgAmplitude,
    eegDelta: analysis?.delta ?? fakeVitals.eegDelta,
    eegTheta: analysis?.theta ?? fakeVitals.eegTheta,
    eegAlpha: analysis?.alpha ?? fakeVitals.eegAlpha,
    eegBeta: analysis?.beta ?? fakeVitals.eegBeta,
    eegGamma: analysis?.gamma ?? fakeVitals.eegGamma,
    fluxoCerebral: session.fluxo_cerebral ?? fakeVitals.fluxoCerebral,
    oxigenacaoCerebral:
      session.oxig_cerebral_fnirs ?? fakeVitals.oxigenacaoCerebral,
    indiceRiscoVascular:
      analysis?.risco_vascular ?? fakeVitals.indiceRiscoVascular,
    indiceRiscoCerebral:
      analysis?.risco_cerebral ?? fakeVitals.indiceRiscoCerebral,
    indiceRiscoGeral: analysis?.score_geral ?? fakeVitals.indiceRiscoGeral,
    ultimaAtualizacao: session.data_hora || new Date().toISOString(),
  };
}

async function canUseSupabaseData() {
  if (!hasSupabaseConfig || !supabase) return false;

  const { data, error } = await supabase.auth.getSession();
  return !error && Boolean(data?.session?.access_token);
}

export async function getPatient() {
  if (await canUseSupabaseData()) {
    try {
      const { data: patientProfile } = await supabase
        .from("perfilpaciente")
        .select(
          "id, login_id, nome_completo, idade, sexo, peso_kg, altura_cm, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!patientProfile) return fakePatient;

      const { data: loginRow } = await supabase
        .from("login")
        .select("id, email, data_criacao")
        .eq("id", patientProfile.login_id)
        .maybeSingle();

      const { data: conditions } = await supabase
        .from("condicaopreexistente")
        .select("nome_condicao")
        .eq("paciente_id", patientProfile.id)
        .order("created_at", { ascending: false });

      return normalizePatientProfile(
        patientProfile,
        loginRow,
        (conditions || []).map((entry) => entry.nome_condicao),
      );
    } catch (error) {
      console.warn(
        "[API] Fallback local em getPatient:",
        error?.message || error,
      );
    }
  }

  return Promise.resolve(fakePatient);
}

export async function getVitals() {
  if (await canUseSupabaseData()) {
    try {
      const { data: sessions } = await supabase
        .from("sessaotelemetria")
        .select(
          "id, login_id, paciente_id, data_hora, fc_bpm, pa_sistolica, pa_diastolica, spo2, amplitude_ecg, fluxo_cerebral, oxig_cerebral_fnirs",
        )
        .order("data_hora", { ascending: false })
        .limit(1);

      const session = sessions?.[0] || null;

      let analysis = null;
      if (session?.paciente_id) {
        const { data } = await supabase
          .from("analiseiaeriscos")
          .select(
            "score_geral, risco_vascular, risco_cerebral, delta, theta, alpha, beta, gamma",
          )
          .eq("paciente_id", session.paciente_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        analysis = data;
      }

      return mapTelemetriaToVitals(session, analysis);
    } catch (error) {
      console.warn(
        "[API] Fallback local em getVitals:",
        error?.message || error,
      );
    }
  }

  return Promise.resolve({
    ...fakeVitals,
    ultimaAtualizacao: new Date().toISOString(),
  });
}

export async function getAlerts() {
  if (await canUseSupabaseData()) {
    try {
      const { data } = await supabase
        .from("alertasistema")
        .select("id, data_hora, tipo_sensor, mensagem, criticidade, created_at")
        .order("data_hora", { ascending: false })
        .limit(10);

      return (data || []).map((item) => ({
        id: item.id,
        tipo:
          item.criticidade === "URGENTE"
            ? "danger"
            : item.criticidade === "ATENCAO"
              ? "warning"
              : "info",
        mensagem: item.mensagem,
        sensor: item.tipo_sensor,
        hora: formatTime(item.data_hora || item.created_at),
      }));
    } catch (error) {
      console.warn(
        "[API] Fallback local em getAlerts:",
        error?.message || error,
      );
    }
  }

  return Promise.resolve(fakeAlerts);
}

export async function getHistorico() {
  if (await canUseSupabaseData()) {
    try {
      const { data } = await supabase
        .from("sessaotelemetria")
        .select(
          "id, data_hora, fc_bpm, pa_sistolica, pa_diastolica, spo2, status_geral",
        )
        .order("data_hora", { ascending: false })
        .limit(10);

      return (data || []).map((item) => ({
        data: formatDateTime(item.data_hora),
        fc: item.fc_bpm,
        paSis: item.pa_sistolica,
        paDias: item.pa_diastolica,
        spo2: item.spo2,
        riscoGeral:
          item.status_geral === "CRITICO"
            ? 80
            : item.status_geral === "ATENCAO"
              ? 55
              : 25,
        status:
          item.status_geral === "CRITICO"
            ? "danger"
            : item.status_geral === "ATENCAO"
              ? "warning"
              : "normal",
      }));
    } catch (error) {
      console.warn(
        "[API] Fallback local em getHistorico:",
        error?.message || error,
      );
    }
  }

  return Promise.resolve(fakeHistorico);
}

export async function getDevices() {
  if (await canUseSupabaseData()) {
    try {
      const { data } = await supabase
        .from("dispositivo")
        .select(
          "id, nome_dispositivo, tipo, status_operacional, bateria_porcentagem, sinal_porcentagem",
        )
        .order("created_at", { ascending: false });

      return (data || []).map((item) => ({
        id: item.id,
        nome: item.nome_dispositivo,
        tipo: item.tipo === "NEURAL" ? "Neural" : "Vascular",
        status: item.status_operacional?.toLowerCase() || "ativo",
        bateria: item.bateria_porcentagem,
        sinal: item.sinal_porcentagem,
        sensores:
          item.tipo === "NEURAL"
            ? ["EEG", "fNIRS", "IMU"]
            : ["ECG", "SpO₂", "PA", "Temp", "Resp"],
      }));
    } catch (error) {
      console.warn(
        "[API] Fallback local em getDevices:",
        error?.message || error,
      );
    }
  }

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
