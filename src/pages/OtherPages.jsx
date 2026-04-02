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

function getRespostaProfissional(profissao, texto) {
  const mensagem = texto.toLowerCase();

  if (profissao === "Psicólogo(a)") {
    if (mensagem.includes("ans") || mensagem.includes("nerv")) {
      return "Entendo. Vamos fazer uma pausa curta: respire por 4 segundos, solte por 6 e repita 3 vezes. Depois me conte o que piorou hoje para eu te orientar melhor.";
    }
    if (
      mensagem.includes("triste") ||
      mensagem.includes("sozinho") ||
      mensagem.includes("não estou bem") ||
      mensagem.includes("n estou bem")
    ) {
      return "Obrigado por compartilhar isso. Você não está sozinho. Podemos organizar um plano para hoje com passos pequenos e também agendar um atendimento de acolhimento.";
    }
    return "Recebi sua mensagem. Vamos entender juntos o que você está sentindo agora para definir o melhor apoio.";
  }

  if (profissao === "Médico(a)") {
    if (
      mensagem.includes("dor") ||
      mensagem.includes("falta de ar") ||
      mensagem.includes("tontura")
    ) {
      return "Se houver dor intensa, falta de ar importante ou piora rápida, procure atendimento presencial imediato. Enquanto isso, descreva há quanto tempo começou e intensidade de 0 a 10.";
    }
    return "Mensagem recebida. Vou te orientar clinicamente com base nos sintomas relatados e, se necessário, ajustar a conduta da equipe.";
  }

  if (mensagem.includes("dor") || mensagem.includes("cans")) {
    return "Vamos ajustar sua rotina com foco em conforto e recuperação. Me diga onde está a dor, intensidade e em que momento ela piora.";
  }

  return "Perfeito. Posso te orientar com exercícios leves e respiração para reduzir desconforto e melhorar mobilidade.";
}

// ===== CONTATOS (CHAT) =====
function ContatosPage({ patient }) {
  const profissionais = [
    {
      key: "psico",
      cargo: "Psicólogo(a)",
      nome: "Dra. Marina Souza",
      registro: "CRP 06/12345",
      status: "Online",
      cor: "var(--accent-violet)",
      abertura:
        "Olá! Sou sua psicóloga de apoio. Pode me contar como você está hoje.",
    },
    {
      key: "medico",
      cargo: "Médico(a)",
      nome: "Dra. Ana Paula Ferreira",
      registro: "CRM 12.345-SP",
      status: "Disponível",
      cor: "var(--accent-purple)",
      abertura:
        "Olá, estou acompanhando seus dados clínicos. Quais sintomas você deseja relatar agora?",
    },
    {
      key: "fisio",
      cargo: "Fisioterapeuta",
      nome: "Dr. Rafael Lima",
      registro: "CREFITO 3/456789-F",
      status: "Online",
      cor: "var(--accent-blue)",
      abertura:
        "Vamos cuidar da sua mobilidade. Me diga como está dor, cansaço ou respiração hoje.",
    },
  ];

  const [selecionado, setSelecionado] = useState(profissionais[0].key);
  const [mensagem, setMensagem] = useState("");
  const [conversas, setConversas] = useState(() => {
    const base = {};
    profissionais.forEach((p) => {
      base[p.key] = [{ id: `${p.key}-1`, sender: "pro", text: p.abertura }];
    });
    return base;
  });

  const profissionalAtivo = profissionais.find((p) => p.key === selecionado);
  const mensagens = conversas[selecionado] || [];

  const enviarMensagem = (conteudo) => {
    const texto = conteudo.trim();
    if (!texto || !profissionalAtivo) return;

    const idBase = Date.now();
    const resposta = getRespostaProfissional(profissionalAtivo.cargo, texto);

    setConversas((prev) => ({
      ...prev,
      [selecionado]: [
        ...(prev[selecionado] || []),
        { id: `${idBase}-u`, sender: "user", text: texto },
        { id: `${idBase}-p`, sender: "pro", text: resposta },
      ],
    }));
    setMensagem("");
  };

  return (
    <div>
      <div className="card-dark mb-4">
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center">
          <div>
            <div className="section-header mb-2">Contatos por chat</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Converse diretamente com psicólogo, médico e fisioterapeuta em um
              só lugar.
            </div>
          </div>
          <div className="tag tag-blue" style={{ alignSelf: "flex-start" }}>
            Paciente: {patient?.nome || "Não identificado"}
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card-dark h-100">
            <div className="section-header">Profissionais</div>
            <div className="contact-list">
              {profissionais.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className={`contact-item ${selecionado === p.key ? "active" : ""}`}
                  onClick={() => setSelecionado(p.key)}
                >
                  <div className="contact-item-title">{p.cargo}</div>
                  <div className="contact-item-name">{p.nome}</div>
                  <div className="contact-item-meta">{p.registro}</div>
                  <div className="contact-item-status" style={{ color: p.cor }}>
                    <span className="status-dot" style={{ marginRight: 6 }}></span>
                    {p.status}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card-dark h-100">
            <div className="section-header">Chat com {profissionalAtivo?.cargo}</div>
            <div className="support-chat-window">
              {mensagens.map((item) => (
                <div
                  key={item.id}
                  className={`support-chat-row ${item.sender === "user" ? "user" : "ia"}`}
                >
                  <div className={`support-chat-bubble ${item.sender === "user" ? "user" : "ia"}`}>
                    {item.text}
                  </div>
                </div>
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
                placeholder="Digite sua mensagem para o profissional..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />
              <button type="submit" className="btn-neuro">
                Enviar
              </button>
            </form>
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
    return "Sinto muito que você esteja passando por isso. Tente respirar devagar por 4 segundos, soltar por 6 e, se puder, fale com alguém de confiança agora. Se os sintomas estiverem fortes ou você sentir risco imediato, procure um profissional de saúde ou emergência.";
  }

  if (
    texto.includes("ansioso") ||
    texto.includes("ansiedade") ||
    texto.includes("nervoso")
  ) {
    return "Vamos desacelerar juntos: inspire pelo nariz, segure 2 segundos e solte lentamente. Depois, nomeie 3 coisas que você vê ao redor. Se quiser, eu também posso te ajudar a organizar o que está te deixando assim para levar ao psicólogo.";
  }

  if (
    texto.includes("sozinho") ||
    texto.includes("isolado") ||
    texto.includes("desamparado")
  ) {
    return "Você não precisa lidar com isso sozinho. Tente mandar uma mensagem para alguém de confiança e, se preferir, posso ajudar a montar uma frase curta para pedir apoio agora.";
  }

  if (
    texto.includes("dor") ||
    texto.includes("cansado") ||
    texto.includes("fraqueza") ||
    texto.includes("tontura")
  ) {
    return "Se houver dor forte, fraqueza súbita, falta de ar ou piora importante, procure atendimento presencial. Posso também te ajudar a registrar os sintomas para falar com o médico ou fisioterapeuta.";
  }

  if (
    texto.includes("suic") ||
    texto.includes("me machucar") ||
    texto.includes("morrer") ||
    texto.includes("acabar com tudo")
  ) {
    return "Isso é sério e eu quero te orientar a buscar ajuda humana imediata. Se houver risco agora, ligue para a emergência local ou procure um serviço de urgência e avise alguém de confiança imediatamente. Se quiser, responda apenas com 'preciso de ajuda' e eu vou continuar com passos curtos de apoio.";
  }

  return "Estou aqui para te ouvir e te ajudar a organizar o que você sente. Me conte um pouco do que está acontecendo, e eu posso sugerir um próximo passo de apoio ou encaminhamento para psicólogo, médico ou fisioterapeuta.";
}

// ===== IA DE APOIO =====
function IAsuportePage() {
  const [mensagem, setMensagem] = useState("");
  const [chat, setChat] = useState([
    {
      id: 1,
      sender: "ia",
      text: "Olá, eu sou a IA de apoio do NeuroVest. Posso ouvir o que você está sentindo e ajudar com orientação inicial, mas não substituo um profissional de saúde.",
    },
    {
      id: 2,
      sender: "ia",
      text: "Se quiser, escreva algo como 'n estou muito bem' e eu vou te responder de forma acolhedora.",
    },
  ]);

  const atalhos = useMemo(
    () => [
      "n estou muito bem",
      "estou ansioso",
      "me sinto sozinho",
      "preciso falar com alguém",
    ],
    [],
  );

  const enviarMensagem = (texto) => {
    const conteudo = texto.trim();
    if (!conteudo) return;

    const novaMensagem = { id: Date.now(), sender: "user", text: conteudo };
    const resposta = {
      id: Date.now() + 1,
      sender: "ia",
      text: getAssistantReply(conteudo),
    };

    setChat((prev) => [...prev, novaMensagem, resposta]);
    setMensagem("");
  };

  return (
    <div>
      <div className="card-dark mb-4">
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center">
          <div>
            <div className="section-header mb-2">IA de apoio emocional</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Um espaço para conversar quando você precisar de acolhimento,
              orientação inicial e organização do próximo passo.
            </div>
          </div>
          <div className="tag tag-orange" style={{ alignSelf: "flex-start" }}>
            Não substitui psicólogo, médico ou serviço de urgência
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card-dark h-100">
            <div className="section-header">Conversa guiada</div>
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
          <div className="card-dark mb-4">
            <div className="section-header">O que esta IA faz</div>
            <div className="d-flex flex-column gap-3">
              {[
                "Escuta sua mensagem e responde com apoio inicial.",
                "Ajuda a organizar sintomas, emoções e próximos passos.",
                "Sugere contato com profissional quando necessário.",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    background: "var(--bg-panel)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: 12,
                    color: "var(--text-secondary)",
                    fontSize: 13,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="card-dark">
            <div className="section-header">Limites importantes</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Esta IA não faz diagnóstico, não prescreve tratamento e não deve
              ser usada em situações de emergência. Se houver risco imediato ou
              piora importante, procure atendimento humano sem demora.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { RiscoPage, HistoricoPage, DispositivosPage, PacientePage, ContatosPage, IAsuportePage };
