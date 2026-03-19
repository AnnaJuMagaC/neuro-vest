import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getVitals, getAlerts, fakeChartFC, fakeChartPA } from "../api";

function MetricCard({ label, value, unit, status, color, icon, trend }) {
  const statusColors = {
    normal: "badge-normal",
    warning: "badge-warning",
    danger: "badge-danger",
  };
  const statusLabels = {
    normal: "Normal",
    warning: "Atenção",
    danger: "Crítico",
  };
  return (
    <div className={`metric-card ${color} h-100`}>
      <div className="metric-label">
        <i className={`bi ${icon} me-1`}></i>
        {label}
      </div>
      <div>
        <span className="metric-value">{value}</span>
        <span className="metric-unit">{unit}</span>
      </div>
      {trend && (
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            marginTop: 4,
          }}
        >
          {trend}
        </div>
      )}
      <div className={`metric-status ${statusColors[status]}`}>
        <i
          className={`bi ${status === "normal" ? "bi-check-circle" : status === "warning" ? "bi-exclamation-triangle" : "bi-x-circle"}`}
        ></i>
        {statusLabels[status]}
      </div>
    </div>
  );
}

function RiskGauge({ label, value, color }) {
  const colors = {
    blue: "var(--accent-blue)",
    orange: "var(--accent-orange)",
    red: "var(--accent-red)",
    green: "var(--accent-green)",
  };
  const riskColor =
    value < 30
      ? "var(--accent-green)"
      : value < 55
        ? "var(--accent-orange)"
        : "var(--accent-red)";
  return (
    <div className="text-center">
      <div className="metric-label mb-2">{label}</div>
      <div
        style={{
          fontSize: 36,
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          color: riskColor,
        }}
      >
        {value}
        <span style={{ fontSize: 16 }}>%</span>
      </div>
      <div className="risk-bar mt-2">
        <div
          className="risk-fill"
          style={{ width: `${value}%`, background: riskColor }}
        />
      </div>
      <div
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          marginTop: 6,
          fontFamily: "var(--font-mono)",
        }}
      >
        {value < 30 ? "BAIXO" : value < 55 ? "MODERADO" : "ALTO"}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: "var(--bg-panel)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 12,
          fontFamily: "var(--font-mono)",
        }}
      >
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ patient }) {
  const [vitals, setVitals] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [chartFC, setChartFC] = useState(fakeChartFC);

  useEffect(() => {
    getVitals().then(setVitals);
    getAlerts().then(setAlerts);
  }, []);

  // Simula atualização em tempo real
  useEffect(() => {
    const timer = setInterval(() => {
      getVitals().then((v) =>
        setVitals({ ...v, freqCardiaca: 70 + Math.round(Math.random() * 15) }),
      );
      setChartFC((prev) => {
        const next = [
          ...prev.slice(1),
          {
            t: prev[prev.length - 1].t + 1,
            valor:
              70 +
              Math.round(Math.sin(Date.now() / 1000) * 8 + Math.random() * 6),
          },
        ];
        return next;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  if (!vitals)
    return (
      <div
        style={{
          color: "var(--text-muted)",
          padding: 40,
          fontFamily: "var(--font-mono)",
        }}
      >
        Carregando sensores...
      </div>
    );

  const warnings = alerts.filter(
    (a) => a.tipo === "warning" || a.tipo === "danger",
  );

  return (
    <div>
      {/* Alerta ativo */}
      {warnings.length > 0 && (
        <div className="alert-strip mb-4">
          <i
            className="bi bi-exclamation-triangle-fill"
            style={{ color: "var(--accent-orange)", fontSize: 18 }}
          ></i>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--accent-orange)",
              }}
            >
              ALERTA ATIVO
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {warnings[0].mensagem}
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {warnings[0].hora}
          </div>
        </div>
      )}

      {/* Paciente */}
      <div className="card-dark mb-4 d-flex align-items-center gap-3 flex-wrap">
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          👤
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{patient.nome}</div>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {patient.id} · {patient.idade} anos · {patient.peso}kg · IMC{" "}
            {(patient.peso / (patient.altura / 100) ** 2).toFixed(1)}
          </div>
        </div>
        <div className="ms-auto d-flex gap-2 flex-wrap">
          {patient.condicoes.map((c) => (
            <span key={c} className="tag tag-orange">
              {c}
            </span>
          ))}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            textAlign: "right",
          }}
        >
          <i className="bi bi-wifi me-1"></i>Ao Vivo
          <div style={{ color: "var(--accent-green)" }}>● CONECTADO</div>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="section-header">Sensores — Colete Biomédico</div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-lg-2">
          <MetricCard
            label="Freq. Cardíaca"
            value={vitals.freqCardiaca}
            unit="bpm"
            status="normal"
            color="green"
            icon="bi-heart-pulse-fill"
            trend="↔ estável"
          />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <MetricCard
            label="PA Sistólica"
            value={vitals.pressaoSistolica}
            unit="mmHg"
            status="warning"
            color="orange"
            icon="bi-activity"
            trend="↑ +6 vs média"
          />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <MetricCard
            label="PA Diastólica"
            value={vitals.pressaoDiastolica}
            unit="mmHg"
            status="warning"
            color="orange"
            icon="bi-activity"
            trend="↑ +4 vs média"
          />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <MetricCard
            label="SpO₂"
            value={vitals.spo2}
            unit="%"
            status="normal"
            color="blue"
            icon="bi-lungs-fill"
            trend="↔ normal"
          />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <MetricCard
            label="Temperatura"
            value={vitals.tempCorporal}
            unit="°C"
            status="normal"
            color="purple"
            icon="bi-thermometer-half"
            trend="↔ normal"
          />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <MetricCard
            label="Freq. Resp."
            value={vitals.freqRespiratoria}
            unit="rpm"
            status="normal"
            color="blue"
            icon="bi-wind"
            trend="↔ normal"
          />
        </div>
      </div>

      <div className="section-header">Sensores — Faixa Cerebral</div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <MetricCard
            label="Fluxo Cerebral"
            value={vitals.fluxoCerebral}
            unit="%"
            status="normal"
            color="purple"
            icon="bi-diagram-3-fill"
            trend="↔ normal"
          />
        </div>
        <div className="col-6 col-md-3">
          <MetricCard
            label="Oxig. Cerebral"
            value={vitals.oxigenacaoCerebral}
            unit="%"
            status="normal"
            color="blue"
            icon="bi-broadcast"
            trend="↔ fNIRS ok"
          />
        </div>
        <div className="col-6 col-md-3">
          <MetricCard
            label="EEG Alpha"
            value={vitals.eegAlpha}
            unit="%"
            status="normal"
            color="green"
            icon="bi-soundwave"
            trend="dominante"
          />
        </div>
        <div className="col-6 col-md-3">
          <MetricCard
            label="EEG Beta"
            value={vitals.eegBeta}
            unit="%"
            status="normal"
            color="blue"
            icon="bi-soundwave"
            trend="↔ normal"
          />
        </div>
      </div>

      {/* Gráficos + Risco */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-5">
          <div className="card-dark h-100">
            <div className="section-header">
              Frequência Cardíaca — Tempo Real
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartFC}>
                <defs>
                  <linearGradient id="fcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--accent-green)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--accent-green)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" hide />
                <YAxis domain={[50, 110]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="var(--accent-green)"
                  fill="url(#fcGrad)"
                  strokeWidth={2}
                  name="FC (bpm)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card-dark h-100">
            <div className="section-header">Pressão Arterial</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={fakeChartPA}>
                <XAxis dataKey="t" hide />
                <YAxis domain={[60, 170]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="sistolica"
                  stroke="var(--accent-orange)"
                  strokeWidth={2}
                  dot={false}
                  name="Sistólica"
                />
                <Line
                  type="monotone"
                  dataKey="diastolica"
                  stroke="var(--accent-cyan)"
                  strokeWidth={2}
                  dot={false}
                  name="Diastólica"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-12 col-lg-3">
          <div className="card-dark h-100">
            <div className="section-header">Índices de Risco IA</div>
            <div className="d-flex flex-column gap-4 pt-2">
              <RiskGauge
                label="Risco Vascular"
                value={vitals.indiceRiscoVascular}
              />
              <RiskGauge
                label="Risco Cerebral"
                value={vitals.indiceRiscoCerebral}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      <div className="section-header">Últimos Alertas do Sistema</div>
      <div className="card-dark">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="d-flex align-items-start gap-3 py-2 border-bottom"
            style={{ borderColor: "var(--border) !important" }}
          >
            <i
              className={`bi ${a.tipo === "warning" ? "bi-exclamation-triangle-fill" : "bi-info-circle-fill"}`}
              style={{
                color:
                  a.tipo === "warning"
                    ? "var(--accent-orange)"
                    : "var(--accent-cyan)",
                fontSize: 16,
                marginTop: 2,
              }}
            ></i>
            <div>
              <div style={{ fontSize: 13 }}>{a.mensagem}</div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {a.sensor} · {a.hora}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
