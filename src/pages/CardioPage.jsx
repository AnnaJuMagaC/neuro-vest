import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";
import { fakeChartFC, fakeChartPA } from "../api";

const CustomTooltip = ({ active, payload }) => {
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

// ECG simulado
function generateECG(count = 200) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const t = i / 10;
    const cycle = t % 1;
    let v = 0;
    if (cycle < 0.05) v = cycle * 4;
    else if (cycle < 0.1) v = (0.1 - cycle) * 4;
    else if (cycle < 0.3) v = 0;
    else if (cycle < 0.35) v = -0.1;
    else if (cycle < 0.38) v = (cycle - 0.35) * 20;
    else if (cycle < 0.4) v = 1 - (cycle - 0.38) * 50;
    else if (cycle < 0.45) v = -0.2;
    else if (cycle < 0.5) v = (cycle - 0.45) * 0.8;
    else if (cycle < 0.6) v = 0.3 - (cycle - 0.5) * 3;
    else v = 0;
    data.push({
      t: i,
      v: parseFloat(v.toFixed(3)) + (Math.random() - 0.5) * 0.02,
    });
  }
  return data;
}

export default function CardioPage() {
  const [ecg] = useState(generateECG());
  const [fc, setFc] = useState(fakeChartFC);
  const [currentFC, setCurrentFC] = useState(78);

  useEffect(() => {
    const t = setInterval(() => {
      const novo =
        68 + Math.round(Math.sin(Date.now() / 1200) * 9 + Math.random() * 6);
      setCurrentFC(novo);
      setFc((prev) => [
        ...prev.slice(1),
        { t: prev[prev.length - 1].t + 1, valor: novo },
      ]);
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const variabilidade = [
    { intervalo: "12:00", vrfc: 42 },
    { intervalo: "12:30", vrfc: 38 },
    { intervalo: "13:00", vrfc: 51 },
    { intervalo: "13:30", vrfc: 44 },
    { intervalo: "14:00", vrfc: 36 },
    { intervalo: "14:30", vrfc: 40 },
  ];

  return (
    <div>
      {/* Indicadores rápidos */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Freq. Cardíaca",
            value: currentFC,
            unit: "bpm",
            ok: currentFC < 100,
            icon: "bi-heart-pulse-fill",
            color: "var(--accent-green)",
          },
          {
            label: "PA Sistólica",
            value: 138,
            unit: "mmHg",
            ok: false,
            icon: "bi-activity",
            color: "var(--accent-orange)",
          },
          {
            label: "PA Diastólica",
            value: 88,
            unit: "mmHg",
            ok: false,
            icon: "bi-activity",
            color: "var(--accent-orange)",
          },
          {
            label: "SpO₂",
            value: 97,
            unit: "%",
            ok: true,
            icon: "bi-lungs-fill",
            color: "var(--accent-blue)",
          },
          {
            label: "VFC (RMSSD)",
            value: 40,
            unit: "ms",
            ok: true,
            icon: "bi-graph-up",
            color: "var(--accent-cyan)",
          },
          {
            label: "Amplitude ECG",
            value: 1.2,
            unit: "mV",
            ok: true,
            icon: "bi-soundwave",
            color: "var(--accent-purple)",
          },
        ].map((m) => (
          <div className="col-6 col-md-4 col-lg-2" key={m.label}>
            <div
              className="metric-card"
              style={{ borderTop: `2px solid ${m.color}` }}
            >
              <div className="metric-label">
                <i className={`bi ${m.icon} me-1`}></i>
                {m.label}
              </div>
              <div>
                <span className="metric-value" style={{ color: m.color }}>
                  {m.value}
                </span>
                <span className="metric-unit">{m.unit}</span>
              </div>
              <div
                className={`metric-status ${m.ok ? "badge-normal" : "badge-warning"}`}
                style={{ marginTop: 6 }}
              >
                <i
                  className={`bi ${m.ok ? "bi-check-circle" : "bi-exclamation-triangle"} me-1`}
                ></i>
                {m.ok ? "Normal" : "Atenção"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ECG */}
      <div className="card-dark mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <div className="section-header mb-0">
              Eletrocardiograma (ECG) — Derivação II
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Colete Biomédico · 500 Hz · Lead II
            </div>
          </div>
          <div className="d-flex gap-2">
            <span className="tag tag-green">
              <i className="bi bi-circle-fill me-1" style={{ fontSize: 8 }}></i>
              NORMAL SINUS
            </span>
            <span className="tag tag-blue">25 mm/s</span>
          </div>
        </div>
        <div
          style={{
            background: "var(--ecg-screen-bg)",
            border: "1px solid var(--ecg-screen-border)",
            borderRadius: 8,
            padding: "12px 0",
          }}
        >
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={ecg}>
              <XAxis dataKey="t" hide />
              <YAxis domain={[-0.4, 1.2]} hide />
              <ReferenceLine
                y={0}
                stroke="var(--accent-green)"
                strokeOpacity={0.25}
              />
              <Line
                type="monotone"
                dataKey="v"
                stroke="var(--accent-green)"
                strokeWidth={1.5}
                dot={false}
                name="mV"
                style={{ filter: "drop-shadow(0 0 3px var(--accent-green))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="row mt-3 g-2">
          {[
            ["Ritmo", "Sinusal Normal"],
            ["PR", "168 ms"],
            ["QRS", "92 ms"],
            ["QT", "410 ms"],
            ["ST", "+0.1 mV"],
          ].map(([k, v]) => (
            <div className="col" key={k}>
              <div
                style={{
                  background: "var(--bg-panel)",
                  borderRadius: 6,
                  padding: "6px 10px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {k}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-primary)",
                    fontWeight: 600,
                  }}
                >
                  {v}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row g-3">
        {/* FC tempo real */}
        <div className="col-12 col-lg-6">
          <div className="card-dark h-100">
            <div className="section-header">FC em Tempo Real</div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={fc}>
                <defs>
                  <linearGradient id="fcArea" x1="0" y1="0" x2="0" y2="1">
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
                <YAxis domain={[50, 120]} hide />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={100}
                  stroke="var(--accent-red)"
                  strokeDasharray="4 2"
                />
                <ReferenceLine
                  y={60}
                  stroke="var(--accent-orange)"
                  strokeDasharray="4 2"
                />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="var(--accent-green)"
                  fill="url(#fcArea)"
                  strokeWidth={2}
                  name="FC (bpm)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Pressão */}
        <div className="col-12 col-lg-6">
          <div className="card-dark h-100">
            <div className="section-header">
              Pressão Arterial — Histórico 1h
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={fakeChartPA}>
                <XAxis dataKey="t" hide />
                <YAxis domain={[60, 170]} hide />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={140}
                  stroke="var(--accent-red)"
                  strokeDasharray="4 2"
                  label={{
                    value: "140",
                    fill: "var(--accent-red)",
                    fontSize: 10,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sistolica"
                  stroke="var(--accent-orange)"
                  strokeWidth={2}
                  dot={false}
                  name="Sistólica (mmHg)"
                />
                <Line
                  type="monotone"
                  dataKey="diastolica"
                  stroke="var(--accent-cyan)"
                  strokeWidth={2}
                  dot={false}
                  name="Diastólica (mmHg)"
                />
              </LineChart>
            </ResponsiveContainer>
            <div
              className="d-flex gap-3 mt-2"
              style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
            >
              <span>
                <span style={{ color: "var(--accent-orange)" }}>─</span>{" "}
                Sistólica
              </span>
              <span>
                <span style={{ color: "var(--accent-cyan)" }}>─</span>{" "}
                Diastólica
              </span>
              <span>
                <span style={{ color: "var(--accent-red)" }}>- -</span> Limite
              </span>
            </div>
          </div>
        </div>
        {/* VFC */}
        <div className="col-12">
          <div className="card-dark">
            <div className="section-header">
              Variabilidade da Frequência Cardíaca (VFC)
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={variabilidade}>
                <XAxis
                  dataKey="intervalo"
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                />
                <YAxis domain={[0, 80]} hide />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={50}
                  stroke="var(--accent-green)"
                  strokeDasharray="4 2"
                />
                <Bar
                  dataKey="vrfc"
                  fill="var(--accent-blue)"
                  radius={[4, 4, 0, 0]}
                  name="VFC (ms)"
                />
              </BarChart>
            </ResponsiveContainer>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                marginTop: 8,
              }}
            >
              VFC reduzida pode indicar estresse autonômico. Referência normal:
              &gt;50ms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
