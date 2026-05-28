import React from "react";

export default function PerfilPaciente({ patient }) {
  if (!patient) {
    return (
      <div
        style={{
          color: "var(--text-muted)",
          padding: 40,
          fontFamily: "var(--font-mono)",
        }}
      >
        Carregando perfil do paciente...
      </div>
    );
  }

  const imc = (patient.peso / (patient.altura / 100) ** 2).toFixed(1);

  return (
    <div>
      {/* Card Principal do Paciente */}
      <div className="card-dark mb-4">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7b35c1, #4a7fa0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              flexShrink: 0,
            }}
          >
            👤
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              {patient.nome}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
                lineHeight: 1.6,
              }}
            >
              <div>
                <strong>ID:</strong> {patient.id}
              </div>
              <div>
                <strong>Idade:</strong> {patient.idade} anos
              </div>
              <div>
                <strong>Sexo:</strong> {patient.sexo}
              </div>
            </div>
          </div>
          <div
            style={{
              textAlign: "right",
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <i className="bi bi-calendar-event me-1"></i>
              Criado em
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {new Date(patient.ultimaSessao).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Medidas Antropométricas */}
      <div className="section-header">Medidas Antropométricas</div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-lg-2">
          <div className="metric-card blue h-100">
            <div className="metric-label">
              <i className="bi bi-speedometer2 me-1"></i>Peso
            </div>
            <div>
              <span className="metric-value">{patient.peso}</span>
              <span className="metric-unit">kg</span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                marginTop: 4,
              }}
            >
              {patient.peso < 60
                ? "abaixo da média"
                : patient.peso > 90
                  ? "acima da média"
                  : "na média"}
            </div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="metric-card green h-100">
            <div className="metric-label">
              <i className="bi bi-rulers me-1"></i>Altura
            </div>
            <div>
              <span className="metric-value">{patient.altura}</span>
              <span className="metric-unit">cm</span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                marginTop: 4,
              }}
            >
              {patient.altura < 160
                ? "abaixo da média"
                : patient.altura > 185
                  ? "acima da média"
                  : "na média"}
            </div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div
            className={`metric-card ${imc < 18.5 ? "blue" : imc < 25 ? "green" : imc < 30 ? "orange" : "orange"} h-100`}
          >
            <div className="metric-label">
              <i className="bi bi-graph-up me-1"></i>IMC
            </div>
            <div>
              <span className="metric-value">{imc}</span>
              <span className="metric-unit">kg/m²</span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                marginTop: 4,
              }}
            >
              {imc < 18.5
                ? "abaixo do peso"
                : imc < 25
                  ? "normal"
                  : imc < 30
                    ? "sobrepeso"
                    : "obeso"}
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Informações Médicas */}
      <div className="section-header">Informações Médicas</div>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card-dark">
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              <i className="bi bi-person-badge me-1"></i>Médico Responsável
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              {patient.medico}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Especialista em monitoramento biomédico
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card-dark">
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              <i className="bi bi-exclamation-triangle-fill me-1"></i>Condições
            </div>
            {patient.condicoes && patient.condicoes.length > 0 ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {patient.condicoes.map((condicao) => (
                  <span key={condicao} className="tag tag-orange">
                    {condicao}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Nenhuma condição registrada
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção de Status do Monitoramento */}
      <div className="section-header">Status do Monitoramento</div>
      <div className="card-dark mb-4">
        <div className="row g-4">
          <div className="col-md-4">
            <div
              style={{
                textAlign: "center",
                paddingBottom: 16,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                <i className="bi bi-wifi me-1"></i>Conectividade
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--accent-green)",
                }}
              >
                ● CONECTADO
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              style={{
                textAlign: "center",
                paddingBottom: 16,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                <i className="bi bi-clock-history me-1"></i>Última Sessão
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {new Date(patient.ultimaSessao).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              style={{
                textAlign: "center",
                paddingBottom: 16,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                <i className="bi bi-check-circle me-1"></i>Status
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--accent-green)",
                }}
              >
                ATIVO
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Ações */}
      <div className="section-header">Ações</div>
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <button
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "linear-gradient(135deg, #8dc1df, #6b9cc1)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text-primary)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-main)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg, #91b6cb, #7a9cc1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg, #8dc1df, #6b9cc1)")
            }
          >
            <i className="bi bi-pencil-square me-1"></i>Editar Perfil
          </button>
        </div>

        <div className="col-6 col-md-3">
          <button
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "linear-gradient(135deg, #91b6cb, #7b9cc1)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text-primary)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-main)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg, #a0c5d9, #8a9cc1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg, #91b6cb, #7b9cc1)")
            }
          >
            <i className="bi bi-download me-1"></i>Exportar Dados
          </button>
        </div>

        <div className="col-6 col-md-3">
          <button
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "linear-gradient(135deg, #7b9cc1, #6b9cc1)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text-primary)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-main)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg, #8aabcf, #7a9cc1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg, #7b9cc1, #6b9cc1)")
            }
          >
            <i className="bi bi-printer me-1"></i>Imprimir Relatório
          </button>
        </div>

        <div className="col-6 col-md-3">
          <button
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "linear-gradient(135deg, #6645ac, #5a3a9a)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text-primary)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-main)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg, #7655b9, #6a4aa7)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg, #6645ac, #5a3a9a)")
            }
          >
            <i className="bi bi-calendar-check me-1"></i>Agendar Consulta
          </button>
        </div>
      </div>
    </div>
  );
}
