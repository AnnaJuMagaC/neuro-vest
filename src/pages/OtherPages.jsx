// ===== RISCO VASCULAR =====
import React from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

function RiscoPage() {
  const fatores = [
    {
      fator: "Hipertensão Arterial",
      peso: "Alto",
      contribuicao: 28,
      cor: "var(--accent-orange)",
      status: "danger",
    },
    {
      fator: "Variabilidade FC reduzida",
      peso: "Moderado",
      contribuicao: 18,
      cor: "var(--accent-orange)",
      status: "warning",
    },
    {
      fator: "SpO₂ limítrofe",
      peso: "Baixo",
      contribuicao: 8,
      cor: "var(--accent-cyan)",
      status: "normal",
    },
    {
      fator: "Histórico familiar AVC",
      peso: "Alto",
      contribuicao: 22,
      cor: "var(--accent-red)",
      status: "danger",
    },
    {
      fator: "EEG dentro do normal",
      peso: "Protetor",
      contribuicao: -12,
      cor: "var(--accent-green)",
      status: "normal",
    },
    {
      fator: "Oxigenação cerebral ok",
      peso: "Protetor",
      contribuicao: -8,
      cor: "var(--accent-green)",
      status: "normal",
    },
  ];

  const pieData = [
    { name: "Vascular", value: 41, color: "var(--accent-orange)" },
    { name: "Cerebral", value: 38, color: "var(--accent-purple)" },
    { name: "Cardíaco", value: 35, color: "var(--accent-blue)" },
  ];

  const recomendacoes = [
    {
      prioridade: "URGENTE",
      texto: "Monitorar PA — sistólica persistentemente acima de 135 mmHg",
      icone: "bi-exclamation-triangle-fill",
      cor: "var(--accent-orange)",
    },
    {
      prioridade: "IMPORTANTE",
      texto: "Encaminhar para avaliação cardiológica em até 30 dias",
      icone: "bi-calendar-check",
      cor: "var(--accent-cyan)",
    },
    {
      prioridade: "PREVENTIVO",
      texto:
        "Considerar angiotomografia para rastreamento de aneurisma aórtico",
      icone: "bi-shield-check",
      cor: "var(--accent-green)",
    },
    {
      prioridade: "ESTILO DE VIDA",
      texto: "Redução de sódio e prática de atividade física moderada",
      icone: "bi-heart-fill",
      cor: "var(--accent-green)",
    },
  ];

  return (
    <div>
      <div className="row g-3 mb-4">
        {/* Índice geral */}
        <div className="col-12 col-lg-4">
          <div className="card-dark h-100 text-center">
            <div className="section-header">Índice de Risco Geral (IA)</div>
            <div style={{ position: "relative", height: 180 }}>
              <ResponsiveContainer width="100%" height={180}>
                <RadialBarChart
                  innerRadius="60%"
                  outerRadius="90%"
                  data={[{ value: 39 }]}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill="var(--accent-orange)"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: "absolute",
                  top: "55%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: "var(--accent-orange)",
                  }}
                >
                  39
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  / 100
                </div>
              </div>
            </div>
            <span className="tag tag-orange">RISCO MODERADO</span>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginTop: 12,
              }}
            >
              Baseado em 14 variáveis fisiológicas + histórico clínico
            </div>
          </div>
        </div>

        {/* Distribuição */}
        <div className="col-12 col-lg-4">
          <div className="card-dark h-100">
            <div className="section-header">Distribuição por Sistema</div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div
              className="d-flex justify-content-center gap-3 mt-2"
              style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
            >
              {pieData.map((d) => (
                <span key={d.name}>
                  <span style={{ color: d.color }}>●</span> {d.name} {d.value}%
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Fatores */}
        <div className="col-12 col-lg-4">
          <div className="card-dark h-100">
            <div className="section-header">Fatores de Risco Detectados</div>
            <div className="d-flex flex-column gap-2">
              {fatores.map((f, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <div
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {f.fator}
                  </div>
                  <div
                    style={{
                      width: 60,
                      textAlign: "right",
                      fontSize: 13,
                      fontFamily: "var(--font-mono)",
                      color: f.cor,
                      fontWeight: 700,
                    }}
                  >
                    {f.contribuicao > 0 ? `+${f.contribuicao}` : f.contribuicao}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recomendações */}
      <div className="section-header">Recomendações do Sistema de IA</div>
      <div className="row g-3">
        {recomendacoes.map((r, i) => (
          <div className="col-12 col-md-6" key={i}>
            <div
              className="card-dark d-flex gap-3"
              style={{ borderLeft: `3px solid ${r.cor}` }}
            >
              <i
                className={`bi ${r.icone}`}
                style={{ color: r.cor, fontSize: 20, marginTop: 2 }}
              ></i>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    color: r.cor,
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  {r.prioridade}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
                  {r.texto}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="card-dark mt-4"
        style={{
          background: "var(--success-surface)",
          border: "1px solid var(--success-border)",
        }}
      >
        <div className="d-flex gap-2 align-items-start">
          <i
            className="bi bi-info-circle-fill"
            style={{ color: "var(--accent-green)", fontSize: 16, marginTop: 2 }}
          ></i>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--accent-green)" }}>
              Aviso Clínico:
            </strong>{" "}
            Este sistema não realiza diagnóstico médico. Os índices de risco são
            indicativos baseados em padrões fisiológicos e devem ser
            interpretados por profissional de saúde habilitado.
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== HISTÓRICO =====
function HistoricoPage() {
  const { fakeHistorico } = require("../api");

  const statusMap = {
    normal: { label: "Normal", cls: "tag-green" },
    warning: { label: "Atenção", cls: "tag-orange" },
    danger: { label: "Crítico", cls: "tag-red" },
  };

  return (
    <div>
      <div className="card-dark mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="section-header mb-0">Sessões de Monitoramento</div>
          <button className="btn-neuro">
            <i className="bi bi-download me-2"></i>Exportar CSV
          </button>
        </div>
        <div className="scroll-table">
          <table className="table table-dark-custom table-borderless mb-0">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>FC</th>
                <th>PA Sis.</th>
                <th>PA Dias.</th>
                <th>SpO₂</th>
                <th>Risco IA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fakeHistorico.map((row, i) => {
                const s = statusMap[row.status];
                return (
                  <tr key={i}>
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {row.data}
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--accent-green)",
                        }}
                      >
                        {row.fc}
                      </span>{" "}
                      <span
                        style={{ color: "var(--text-muted)", fontSize: 11 }}
                      >
                        bpm
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          color:
                            row.paSis > 135
                              ? "var(--accent-orange)"
                              : "var(--text-primary)",
                        }}
                      >
                        {row.paSis}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          color:
                            row.paDias > 89
                              ? "var(--accent-orange)"
                              : "var(--text-primary)",
                        }}
                      >
                        {row.paDias}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--accent-blue)",
                        }}
                      >
                        {row.spo2}%
                      </span>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <div
                          className="risk-bar"
                          style={{ width: 60, height: 6 }}
                        >
                          <div
                            className="risk-fill"
                            style={{
                              width: `${row.riscoGeral}%`,
                              background:
                                row.riscoGeral > 50
                                  ? "var(--accent-red)"
                                  : row.riscoGeral > 35
                                    ? "var(--accent-orange)"
                                    : "var(--accent-green)",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                          }}
                        >
                          {row.riscoGeral}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`tag ${s.cls}`}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===== DISPOSITIVOS =====
function DispositivosPage() {
  const { fakeDevices, postComando } = require("../api");

  const handleComando = async (id, cmd) => {
    await postComando(id, cmd);
    alert(`Comando "${cmd}" enviado para ${id}`);
  };

  return (
    <div>
      <div className="row g-4">
        {fakeDevices.map((d) => (
          <div className="col-12 col-md-6" key={d.id}>
            <div className="card-dark">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{d.nome}</div>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {d.id} · {d.tipo}
                  </div>
                </div>
                <span className="tag tag-green">
                  <span className="device-dot on me-1"></span>ATIVO
                </span>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div
                    style={{
                      background: "var(--bg-panel)",
                      borderRadius: 8,
                      padding: "10px 12px",
                    }}
                  >
                    <div className="metric-label">Bateria</div>
                    <div
                      style={{
                        fontSize: 22,
                        fontFamily: "var(--font-mono)",
                        color:
                          d.bateria > 30
                            ? "var(--accent-green)"
                            : "var(--accent-red)",
                      }}
                    >
                      {d.bateria}%
                    </div>
                    <div className="risk-bar mt-1">
                      <div
                        className="risk-fill"
                        style={{
                          width: `${d.bateria}%`,
                          background: "var(--accent-green)",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    style={{
                      background: "var(--bg-panel)",
                      borderRadius: 8,
                      padding: "10px 12px",
                    }}
                  >
                    <div className="metric-label">Sinal</div>
                    <div
                      style={{
                        fontSize: 22,
                        fontFamily: "var(--font-mono)",
                        color: "var(--accent-blue)",
                      }}
                    >
                      {d.sinal}%
                    </div>
                    <div className="risk-bar mt-1">
                      <div
                        className="risk-fill"
                        style={{
                          width: `${d.sinal}%`,
                          background: "var(--accent-blue)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="metric-label mb-2">Sensores Ativos</div>
                <div className="d-flex flex-wrap gap-2">
                  {d.sensores.map((s) => (
                    <span key={s} className="tag tag-blue">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn-neuro"
                  onClick={() => handleComando(d.id, "calibrar")}
                >
                  <i className="bi bi-sliders me-1"></i>Calibrar
                </button>
                <button
                  className="btn-neuro"
                  onClick={() => handleComando(d.id, "reiniciar")}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>Reiniciar
                </button>
                <button
                  className="btn-neuro"
                  style={{
                    borderColor: "var(--accent-red)",
                    color: "var(--accent-red)",
                  }}
                  onClick={() => handleComando(d.id, "desligar")}
                >
                  <i className="bi bi-power me-1"></i>Desligar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== PACIENTE =====
function PacientePage({ patient }) {
  return (
    <div>
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card-dark">
            <div className="section-header">Dados do Paciente</div>
            <div className="d-flex flex-column gap-3">
              {[
                ["ID", patient.id],
                ["Nome", patient.nome],
                ["Idade", `${patient.idade} anos`],
                ["Sexo", patient.sexo],
                ["Peso", `${patient.peso} kg`],
                ["Altura", `${patient.altura} cm`],
                [
                  "IMC",
                  `${(patient.peso / (patient.altura / 100) ** 2).toFixed(1)}`,
                ],
                ["Médico Resp.", patient.medico],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="d-flex justify-content-between"
                  style={{
                    borderBottom: "1px solid var(--border)",
                    paddingBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {k}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-7">
          <div className="card-dark mb-4">
            <div className="section-header">Condições Pré-existentes</div>
            <div className="d-flex flex-wrap gap-2">
              {patient.condicoes.map((c) => (
                <span
                  key={c}
                  className="tag tag-orange"
                  style={{ fontSize: 13, padding: "6px 12px" }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="card-dark">
            <div className="section-header">Última Sessão</div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--accent-cyan)",
                fontSize: 18,
              }}
            >
              {new Date(patient.ultimaSessao).toLocaleString("pt-BR")}
            </div>
            <div
              style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}
            >
              Próxima sessão recomendada:{" "}
              <span style={{ color: "var(--text-primary)" }}>Em 24 horas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { RiscoPage, HistoricoPage, DispositivosPage, PacientePage };
