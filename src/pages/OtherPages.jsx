// ===== RISCO VASCULAR =====
import React, { useMemo, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { fakeHistorico, fakeDevices, postComando } from "../api";

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
        style={{ background: "#001a0a", border: "1px solid #00e67622" }}
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
  const resumo = [
    {
      label: "Dispositivos ativos",
      value: fakeDevices.length,
      icon: "bi-cpu-fill",
      color: "var(--accent-green)",
      note: "Todos respondendo ao painel",
    },
    {
      label: "Bateria média",
      value:
        Math.round(
          fakeDevices.reduce((acc, device) => acc + device.bateria, 0) /
            fakeDevices.length,
        ) + "%",
      icon: "bi-battery-half",
      color: "var(--accent-cyan)",
      note: "Boa autonomia operacional",
    },
    {
      label: "Sinal médio",
      value:
        Math.round(
          fakeDevices.reduce((acc, device) => acc + device.sinal, 0) /
            fakeDevices.length,
        ) + "%",
      icon: "bi-wifi",
      color: "var(--accent-orange)",
      note: "Conexão estável na simulação",
    },
  ];

  const handleComando = async (id, cmd) => {
    await postComando(id, cmd);
    alert(`Comando "${cmd}" enviado para ${id}`);
  };

  return (
    <div>
      <div
        className="card-dark mb-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(141, 193, 223, 0.12), rgba(102, 69, 172, 0.10))",
          border: "1px solid rgba(141, 193, 223, 0.18)",
        }}
      >
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-center">
          <div>
            <div className="section-header mb-2">Central de Dispositivos</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Acompanhe os equipamentos conectados, autonomia, sinal e ações de
              manutenção em um painel visual.
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <span className="tag tag-green">2 dispositivos ativos</span>
            <span className="tag tag-blue">Telemetria em tempo real</span>
            <span className="tag tag-orange">Sem falhas críticas</span>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {resumo.map((item) => (
          <div className="col-12 col-md-4" key={item.label}>
            <div className="card-dark h-100">
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div>
                  <div className="metric-label">{item.label}</div>
                  <div
                    style={{
                      fontSize: 30,
                      lineHeight: 1,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      color: item.color,
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {item.note}
                  </div>
                </div>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${item.color}33, ${item.color}14)`,
                    color: item.color,
                    fontSize: 20,
                    flex: "0 0 auto",
                  }}
                >
                  <i className={`bi ${item.icon}`}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {fakeDevices.map((d) => (
          <div className="col-12 col-md-6" key={d.id}>
            <div className="card-dark h-100">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="section-header mb-2">{d.nome}</div>
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

              <div className="row g-3 mb-3">
                <div className="col-12 col-xl-4">
                  <div
                    style={{
                      background: "var(--bg-panel)",
                      borderRadius: 10,
                      padding: 12,
                      height: "100%",
                    }}
                  >
                    <div className="metric-label">Status</div>
                    <div style={{ fontSize: 14, color: "var(--text-primary)" }}>
                      Operando normalmente
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginTop: 6,
                      }}
                    >
                      Última sincronização há poucos segundos
                    </div>
                  </div>
                </div>
                <div className="col-6 col-xl-4">
                  <div
                    style={{
                      background: "var(--bg-panel)",
                      borderRadius: 10,
                      padding: 12,
                      height: "100%",
                    }}
                  >
                    <div className="metric-label">Bateria</div>
                    <div
                      style={{
                        fontSize: 24,
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
                <div className="col-6 col-xl-4">
                  <div
                    style={{
                      background: "var(--bg-panel)",
                      borderRadius: 10,
                      padding: 12,
                      height: "100%",
                    }}
                  >
                    <div className="metric-label">Sinal</div>
                    <div
                      style={{
                        fontSize: 24,
                        fontFamily: "var(--font-mono)",
                        color: "var(--accent-cyan)",
                      }}
                    >
                      {d.sinal}%
                    </div>
                    <div className="risk-bar mt-1">
                      <div
                        className="risk-fill"
                        style={{
                          width: `${d.sinal}%`,
                          background: "var(--accent-cyan)",
                        }}
                      />
                    </div>
                  </div>
                </div>
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

// ===== CLIENTES (MÉDICO) =====
function ClientesPage({
  patients,
  selectedPatientId,
  onSelectPatient,
  onAddPatient,
}) {
  const [novoNome, setNovoNome] = useState("");
  const [novaIdade, setNovaIdade] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleCadastro = (e) => {
    e.preventDefault();
    const result = onAddPatient({ nome: novoNome, idade: novaIdade });
    setFeedback(result.message);
    if (result.ok) {
      setNovoNome("");
      setNovaIdade("");
    }
  };

  return (
    <div>
      <div className="card-dark mb-4">
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center">
          <div>
            <div className="section-header mb-2">Pacientes do médico</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Selecione um cliente para abrir o monitoramento ou cadastre um
              novo paciente.
            </div>
          </div>
          <div className="tag tag-blue">Total: {patients.length}</div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card-dark h-100">
            <div className="section-header">Meus clientes</div>
            <div className="contact-list">
              {patients.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={`contact-item ${selectedPatientId === entry.id ? "active" : ""}`}
                  onClick={() => onSelectPatient(entry.id)}
                >
                  <div className="contact-item-title">{entry.id}</div>
                  <div className="contact-item-name">{entry.nome}</div>
                  <div className="contact-item-meta">
                    {entry.idade} anos · {entry.sexo}
                  </div>
                  <div
                    className="contact-item-status"
                    style={{ color: "var(--accent-cyan)" }}
                  >
                    Clique para abrir monitoramento
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card-dark h-100">
            <div className="section-header">Cadastrar novo cliente</div>
            <form
              className="d-flex flex-column gap-2"
              onSubmit={handleCadastro}
            >
              <input
                type="text"
                className="support-input"
                placeholder="Nome do paciente"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
              />
              <input
                type="number"
                className="support-input"
                placeholder="Idade"
                min="0"
                value={novaIdade}
                onChange={(e) => setNovaIdade(e.target.value)}
              />
              <button type="submit" className="btn-neuro mt-2">
                Cadastrar paciente
              </button>
            </form>

            {feedback && (
              <div
                className="card-dark mt-3"
                style={{
                  borderLeft: "3px solid var(--accent-cyan)",
                  padding: "12px 14px",
                }}
              >
                <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
                  {feedback}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== CHAT HUMANO (PORTAL DE ACESSO) =====
function ChatAccessPage({
  patient,
  setPage,
  authRole,
  accessError,
  unreadCount = 0,
}) {
  const isPatient = authRole === "patient";
  const isAdmin = authRole === "admin";
  const unreadLabel = isAdmin ? "paciente" : "médico";

  return (
    <div>
      <div className="card-dark mb-4">
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center">
          <div>
            <div className="section-header mb-2">
              Portal de acesso ao chat humano
            </div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Escolha o tipo de acesso para entrar na área correta de conversa.
            </div>
          </div>
          <div className="tag tag-blue" style={{ alignSelf: "flex-start" }}>
            Paciente: {patient?.nome || "Não identificado"}
          </div>
        </div>
      </div>

      {accessError && (
        <div className="alert-strip" style={{ marginTop: -4 }}>
          <i
            className="bi bi-shield-lock-fill"
            style={{ color: "var(--accent-orange)", fontSize: 18 }}
          ></i>
          <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
            {accessError}
          </div>
        </div>
      )}

      {unreadCount > 0 && (
        <div
          className="alert-strip"
          style={{ marginTop: accessError ? 12 : 0 }}
        >
          <i
            className="bi bi-bell-fill"
            style={{ color: "var(--accent-cyan)", fontSize: 18 }}
          ></i>
          <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
            Você tem {unreadCount} nova{unreadCount > 1 ? "s" : ""} mensagem
            {unreadCount > 1 ? "ens" : ""} de {unreadLabel}.
          </div>
        </div>
      )}

      <div className="row g-4">
        {isPatient && (
          <div className="col-12">
            <div
              className="card-dark h-100 d-flex flex-column"
              style={{ borderLeft: "3px solid var(--accent-cyan)" }}
            >
              <div className="section-header">Acesso do Paciente</div>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                Área para o paciente enviar mensagens para a equipe médica.
              </div>
              <div className="d-flex flex-wrap gap-2 mt-3 mb-4">
                <span className="tag tag-blue">Enviar mensagens</span>
                <span className="tag tag-green">Acompanhar retorno</span>
              </div>

              <button
                type="button"
                className="btn-neuro mt-auto"
                onClick={() => setPage("chatPaciente")}
              >
                Entrar como Paciente
              </button>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="col-12">
            <div
              className="card-dark h-100 d-flex flex-column"
              style={{ borderLeft: "3px solid var(--accent-purple)" }}
            >
              <div className="section-header">Acesso Médico/Admin</div>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                Área da equipe para leitura e resposta das mensagens dos
                pacientes.
              </div>
              <div className="d-flex flex-wrap gap-2 mt-3 mb-4">
                <span className="tag tag-purple">Responder pacientes</span>
                <span className="tag tag-orange">Painel clínico</span>
              </div>

              <button
                type="button"
                className="btn-neuro mt-auto"
                onClick={() => setPage("chatAdmin")}
              >
                Entrar como Médico/Admin
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className="card-dark mt-4"
        style={{ borderLeft: "3px solid var(--accent-orange)" }}
      >
        <div
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          Perfil autenticado: {isAdmin ? "Médico/Admin" : "Paciente"}. Cada
          perfil só acessa a própria área de chat.
        </div>
      </div>
    </div>
  );
}

function PacienteChatPage({
  patient,
  setPage,
  onLogout,
  chat = [],
  onSendMessage,
  currentUserName,
  directMode = false,
}) {
  const [mensagem, setMensagem] = useState("");
  const mensagensVisiveis =
    chat.length > 0
      ? chat
      : [
          {
            id: "welcome-patient",
            sender: "system",
            text: "Canal humano ativo. Escreva sua mensagem para o médico.",
          },
        ];

  const enviarMensagem = (texto) => {
    const conteudo = texto.trim();
    if (!conteudo) return;

    if (typeof onSendMessage === "function") {
      onSendMessage(conteudo);
    }
    setMensagem("");
  };

  return (
    <div>
      <div className="card-dark mb-4">
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center">
          <div>
            <div className="section-header mb-2">Canal do Paciente</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Esta tela é exclusiva para envio de mensagens do paciente para o
              médico.
            </div>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <span className="tag tag-blue">
              Paciente: {patient?.nome || "Não identificado"}
            </span>
            {!directMode && (
              <button
                type="button"
                className="btn-neuro"
                onClick={() => setPage("contatos")}
              >
                Voltar ao Portal
              </button>
            )}
            <button type="button" className="btn-neuro" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="card-dark">
        <div className="section-header">Chat com equipe médica</div>

        <div className="support-chat-window">
          {mensagensVisiveis.map((item) => {
            const isOwnMessage = item.sender === "patient";
            const senderTitle = isOwnMessage
              ? currentUserName || "Você"
              : item.senderName || "Médico/Admin";
            return (
              <div
                key={item.id}
                className={`support-chat-row ${isOwnMessage ? "user" : "ia"}`}
              >
                <div
                  className={`support-chat-bubble ${isOwnMessage ? "user" : "ia"}`}
                >
                  <div className="support-chat-sender">{senderTitle}</div>
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>

        <form
          className="support-input-row mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            enviarMensagem(mensagem);
          }}
        >
          <input
            type="text"
            className="support-input"
            placeholder="Digite sua mensagem para o médico..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />
          <button type="submit" className="btn-neuro">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminChatPage({
  patient,
  patients = [],
  selectedPatientId,
  onSelectPatient,
  onDeletePatientChat,
  setPage,
  onLogout,
  chat = [],
  threads = {},
  unreadByPatient = {},
  onSendMessage,
  currentUserName,
  directMode = false,
}) {
  const [mensagem, setMensagem] = useState("");
  const mensagensVisiveis =
    chat.length > 0
      ? chat
      : [
          {
            id: "welcome-admin",
            sender: "system",
            text: `Paciente ${patient?.nome || "não identificado"} iniciou conversa.`,
          },
        ];

  const enviarResposta = (texto) => {
    const conteudo = texto.trim();
    if (!conteudo || !patient) return;

    if (typeof onSendMessage === "function") {
      onSendMessage(conteudo);
    }
    setMensagem("");
  };

  const getPreview = (patientId) => {
    const thread = threads[patientId] || [];
    const last = thread[thread.length - 1];
    if (!last) return "Sem mensagens ainda";
    const sender =
      last.senderName || (last.sender === "admin" ? "Médico" : "Paciente");
    const text = String(last.text || "");
    const clipped = text.length > 40 ? `${text.slice(0, 40)}...` : text;
    return `${sender}: ${clipped}`;
  };

  return (
    <div>
      <div className="card-dark mb-4">
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center">
          <div>
            <div className="section-header mb-2">Canal Médico/Admin</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Conversas dos pacientes em um único painel.
            </div>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <span className="tag tag-purple">
              Paciente ativo: {patient?.nome || "Selecione um paciente"}
            </span>
            {!directMode && (
              <button
                type="button"
                className="btn-neuro"
                onClick={() => setPage("contatos")}
              >
                Voltar ao Portal
              </button>
            )}
            <button type="button" className="btn-neuro" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <div className="card-dark h-100">
            <div className="section-header">Pacientes</div>
            <div className="contact-list">
              {patients.length === 0 && (
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Nenhum paciente cadastrado.
                </div>
              )}

              {patients.map((entry) => {
                const unread = unreadByPatient[entry.id]?.admin || 0;
                return (
                  <div key={entry.id} className="contact-item-row">
                    <button
                      type="button"
                      className={`contact-item ${selectedPatientId === entry.id ? "active" : ""}`}
                      onClick={() => onSelectPatient?.(entry.id)}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div>
                          <div className="contact-item-title">Paciente</div>
                          <div className="contact-item-name">{entry.nome}</div>
                          <div className="contact-item-meta">
                            {getPreview(entry.id)}
                          </div>
                        </div>
                        {unread > 0 && (
                          <span className="contact-unread-badge">
                            {unread > 99 ? "99+" : unread}
                          </span>
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      className="contact-delete-btn"
                      onClick={() => onDeletePatientChat?.(entry.id)}
                      title="Excluir chat"
                      aria-label={`Excluir chat de ${entry.nome}`}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card-dark h-100">
            <div className="section-header">Conversa com paciente</div>

            {!patient ? (
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Selecione um paciente na lista para abrir a conversa.
              </div>
            ) : (
              <>
                <div className="support-chat-window">
                  {mensagensVisiveis.map((item) => {
                    const isOwnMessage = item.sender === "admin";
                    const senderTitle = isOwnMessage
                      ? currentUserName || "Você"
                      : item.senderName || patient?.nome || "Paciente";
                    return (
                      <div
                        key={item.id}
                        className={`support-chat-row ${isOwnMessage ? "user" : "ia"}`}
                      >
                        <div
                          className={`support-chat-bubble ${isOwnMessage ? "user" : "ia"}`}
                        >
                          <div className="support-chat-sender">{senderTitle}</div>
                          {item.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form
                  className="support-input-row mt-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    enviarResposta(mensagem);
                  }}
                >
                  <input
                    type="text"
                    className="support-input"
                    placeholder={`Digite a resposta para ${patient.nome || "o paciente"}...`}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                  />
                  <button type="submit" className="btn-neuro">
                    Responder
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getAssistantReply(message) {
  const texto = message.toLowerCase();

  if (
    texto.includes("muito mal") ||
    texto.includes("não estou bem") ||
    texto.includes("n estou bem") ||
    texto.includes("triste")
  ) {
    return "Sinto muito que você esteja passando por isso. Tente respirar devagar por 4 segundos e soltar por 6. Se houver piora importante, procure um profissional de saúde imediatamente.";
  }

  if (
    texto.includes("ansioso") ||
    texto.includes("ansiedade") ||
    texto.includes("nervoso")
  ) {
    return "Vamos desacelerar juntos: inspire pelo nariz, segure 2 segundos e solte lentamente. Posso te ajudar a montar uma mensagem para seu psicólogo agora.";
  }

  if (
    texto.includes("suic") ||
    texto.includes("me machucar") ||
    texto.includes("morrer")
  ) {
    return "Isso é sério e requer ajuda humana imediata. Procure um serviço de urgência agora e avise alguém de confiança. Se estiver em risco imediato, ligue para a emergência local.";
  }

  return "Estou aqui para te ouvir e ajudar a organizar um próximo passo de apoio. Se quiser, descreva em uma frase como você está se sentindo agora.";
}

// ===== IA DE SUPORTE =====
function IAsuportePage() {
  const [mensagem, setMensagem] = useState("");
  const [chat, setChat] = useState([
    {
      id: 1,
      sender: "ia",
      text: "Olá, eu sou a IA de suporte do NeuroVest. Posso oferecer acolhimento inicial, mas não substituo psicólogo, médico ou fisioterapeuta.",
    },
    {
      id: 2,
      sender: "ia",
      text: "Se quiser, escreva: 'n estou muito bem'.",
    },
  ]);

  const atalhos = useMemo(
    () => [
      "n estou muito bem",
      "estou ansioso",
      "me sinto sozinho",
      "preciso de ajuda",
    ],
    [],
  );

  const enviarMensagem = (texto) => {
    const conteudo = texto.trim();
    if (!conteudo) return;

    const idBase = Date.now();
    setChat((prev) => [
      ...prev,
      { id: `${idBase}-u`, sender: "user", text: conteudo },
      { id: `${idBase}-ia`, sender: "ia", text: getAssistantReply(conteudo) },
    ]);
    setMensagem("");
  };

  return (
    <div>
      <div className="card-dark mb-4">
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center">
          <div>
            <div className="section-header mb-2">IA de suporte</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Conversa de apoio emocional inicial e orientação para próximos
              passos.
            </div>
          </div>
          <div className="tag tag-orange" style={{ alignSelf: "flex-start" }}>
            Não substitui atendimento profissional
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card-dark h-100">
            <div className="section-header">Conversa com IA</div>
            <div className="support-chat-window">
              {chat.map((item) => (
                <div
                  key={item.id}
                  className={`support-chat-row ${item.sender === "user" ? "user" : "ia"}`}
                >
                  <div className={`support-chat-bubble ${item.sender}`}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="support-quick-actions mt-3">
              {atalhos.map((atalho) => (
                <button
                  key={atalho}
                  type="button"
                  className="support-quick-btn"
                  onClick={() => enviarMensagem(atalho)}
                >
                  {atalho}
                </button>
              ))}
            </div>

            <form
              className="support-input-row mt-3"
              onSubmit={(e) => {
                e.preventDefault();
                enviarMensagem(mensagem);
              }}
            >
              <input
                type="text"
                className="support-input"
                placeholder="Escreva como você está se sentindo..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />
              <button type="submit" className="btn-neuro">
                Enviar
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card-dark">
            <div className="section-header">Limites e segurança</div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Esta IA oferece apoio inicial e não realiza diagnóstico. Em caso
              de dor intensa, falta de ar, confusão, risco de autoagressão ou
              qualquer urgência, procure atendimento humano imediato.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export {
  ClientesPage,
  RiscoPage,
  HistoricoPage,
  DispositivosPage,
  PacientePage,
  ChatAccessPage,
  PacienteChatPage,
  AdminChatPage,
  IAsuportePage,
};
