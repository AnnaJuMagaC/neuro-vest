import React from "react";

const navItems = [
  { icon: "bi-grid-1x2-fill", label: "Dashboard", page: "dashboard" },
  { icon: "bi-heart-pulse-fill", label: "Monit. Cardíaco", page: "cardio" },
  { icon: "bi-activity", label: "Monit. Neural", page: "neural" },
  { icon: "bi-shield-exclamation", label: "Risco Vascular", page: "risco" },
  { icon: "bi-clock-history", label: "Histórico", page: "historico" },
  { icon: "bi-cpu", label: "Dispositivos", page: "dispositivos" },
  { icon: "bi-person-lines-fill", label: "Paciente", page: "paciente" },
  { icon: "bi-chat-dots-fill", label: "IA de Suporte", page: "suporte" },
];

export default function Sidebar({
  currentPage,
  setPage,
  isOpen,
  onClose,
  authRole,
  hasSelectedPatient,
  themeMode,
  resolvedTheme,
  onChangeTheme,
}) {
  const hideMonitoring =
    authRole === "admin" && (!hasSelectedPatient || currentPage === "clientes");

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">🧠</div>
          <div className="logo-title">NeuroVest</div>
          <div className="logo-sub">Sistema Biomédico v1.0</div>
        </div>

        {authRole === "admin" && (
          <>
            <div className="nav-section-label">Médico</div>
            <div
              className={`nav-item ${currentPage === "clientes" ? "active" : ""}`}
              onClick={() => {
                setPage("clientes");
                onClose();
              }}
            >
              <i className="bi bi-people-fill"></i>
              Meus Clientes
            </div>
          </>
        )}

        {!hideMonitoring && (
          <>
            <div className="nav-section-label">Monitoramento</div>
            {navItems.slice(0, 4).map((item) => (
              <div
                key={item.page}
                className={`nav-item ${currentPage === item.page ? "active" : ""}`}
                onClick={() => {
                  setPage(item.page);
                  onClose();
                }}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </div>
            ))}

            <div className="nav-section-label">Sistema</div>
            {navItems.slice(4, 7).map((item) => (
              <div
                key={item.page}
                className={`nav-item ${currentPage === item.page ? "active" : ""}`}
                onClick={() => {
                  setPage(item.page);
                  onClose();
                }}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </div>
            ))}

            <div className="nav-section-label">Apoio</div>
            {navItems.slice(7).map((item) => (
              <div
                key={item.page}
                className={`nav-item ${item.page === "suporte" ? "support-nav-item" : ""} ${currentPage === item.page ? "active" : ""}`}
                onClick={() => {
                  setPage(item.page);
                  onClose();
                }}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </div>
            ))}
          </>
        )}

        <div className="sidebar-footer">
          <div className="theme-section">
            <div className="theme-label" style={{ color: "#ffffff" }}>
              Tema
            </div>
            <div className="theme-toggle" role="group" aria-label="Alternar tema">
              <button
                type="button"
                className={`theme-btn ${themeMode === "auto" ? "active" : ""}`}
                onClick={() => onChangeTheme("auto")}
              >
                <i className="bi bi-circle-half me-1"></i>
                Auto
              </button>
              <button
                type="button"
                className={`theme-btn ${themeMode === "light" ? "active" : ""}`}
                onClick={() => onChangeTheme("light")}
              >
                <i className="bi bi-sun-fill me-1"></i>
                Claro
              </button>
              <button
                type="button"
                className={`theme-btn ${themeMode === "dark" ? "active" : ""}`}
                onClick={() => onChangeTheme("dark")}
              >
                <i className="bi bi-moon-stars-fill me-1"></i>
                Escuro
              </button>
            </div>
            <div className="theme-hint" style={{ color: "#ffffff" }}>
              Aplicado: {resolvedTheme === "dark" ? "Escuro" : "Claro"}
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span className="status-dot"></span>
            Dispositivos conectados
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#ffffff",
              fontFamily: "var(--font-mono)",
              marginTop: 4,
            }}
          >
            API: <span style={{ color: "var(--accent-orange)" }}>SIMULAÇÃO</span>
          </div>
        </div>
      </nav>
    </>
  );
}
