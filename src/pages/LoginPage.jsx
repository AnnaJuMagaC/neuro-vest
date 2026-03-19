import React, { useState } from "react";

export default function LoginPage({
  onLogin,
  themeMode,
  resolvedTheme,
  onChangeTheme,
}) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = onLogin({ usuario, senha, remember });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError("");
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand-icon">🧠</div>
        <div className="login-title">NeuroVest</div>
        <div className="login-subtitle">Acesso ao Sistema Biomédico</div>

        <div className="login-theme-row">
          <div className="theme-label">Tema</div>
          <div className="theme-toggle" role="group" aria-label="Alternar tema">
            <button
              type="button"
              className={`theme-btn ${themeMode === "auto" ? "active" : ""}`}
              onClick={() => onChangeTheme("auto")}
            >
              Auto
            </button>
            <button
              type="button"
              className={`theme-btn ${themeMode === "light" ? "active" : ""}`}
              onClick={() => onChangeTheme("light")}
            >
              Claro
            </button>
            <button
              type="button"
              className={`theme-btn ${themeMode === "dark" ? "active" : ""}`}
              onClick={() => onChangeTheme("dark")}
            >
              Escuro
            </button>
          </div>
          <div className="theme-hint">
            Aplicado: {resolvedTheme === "dark" ? "Escuro" : "Claro"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 mt-3">
          <div>
            <label className="login-label" htmlFor="usuario">
              Usuário
            </label>
            <input
              id="usuario"
              className="login-input"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="login-label" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              className="login-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </div>

          <label className="login-checkbox-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Manter conectado neste dispositivo
          </label>

          {error ? <div className="login-error">{error}</div> : null}

          <button type="submit" className="login-btn">
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Entrar
          </button>
        </form>

        <div className="login-cred-hint">
          Demo: usuário <strong>admin</strong> e senha <strong>neuro123</strong>
        </div>
      </div>
    </div>
  );
}
