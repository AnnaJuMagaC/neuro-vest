import React, { useState } from "react";

export default function AuthPage({ onLogin, onRegister, onQuickAccess }) {
  const [step, setStep] = useState("login");
  const [feedback, setFeedback] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [patientRegisterData, setPatientRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [doctorRegisterData, setDoctorRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    crm: "CRM-SP 123456",
  });

  const submitLogin = (e) => {
    e.preventDefault();
    const result = onLogin(loginData);
    setFeedback(result.message);
  };

  const submitPatientRegister = (e) => {
    e.preventDefault();
    const result = onRegister({ ...patientRegisterData, role: "patient" });
    setFeedback(result.message);
  };

  const submitDoctorRegister = (e) => {
    e.preventDefault();
    const result = onRegister({ ...doctorRegisterData, role: "admin" });
    setFeedback(result.message);
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-header">
          <div className="logo-title">NeuroVest</div>
          <div className="page-subtitle">Acesso do sistema clínico</div>
        </div>

        {step === "login" && (
          <form className="d-flex flex-column gap-2" onSubmit={submitLogin}>
            <input
              type="email"
              className="support-input"
              placeholder="Seu e-mail"
              value={loginData.email}
              onChange={(e) => {
                setLoginData((prev) => ({ ...prev, email: e.target.value }));
                setFeedback("");
              }}
            />
            <input
              type="password"
              className="support-input"
              placeholder="Sua senha"
              value={loginData.password}
              onChange={(e) => {
                setLoginData((prev) => ({ ...prev, password: e.target.value }));
                setFeedback("");
              }}
            />
            <button type="submit" className="btn-neuro">
              Acessar
            </button>
            <button
              type="button"
              className="btn-neuro"
              onClick={() => {
                setStep("selectRole");
                setFeedback("");
              }}
            >
              Ir para cadastro
            </button>
            <button type="button" className="btn-neuro" onClick={onQuickAccess}>
              Acesso direto (edição)
            </button>
          </form>
        )}

        {step === "selectRole" && (
          <div className="d-flex flex-column gap-2">
            <div className="auth-label">Escolha seu tipo de cadastro</div>
            <button
              type="button"
              className="btn-neuro"
              onClick={() => {
                setStep("registerPatient");
                setFeedback("");
              }}
            >
              Sou paciente
            </button>
            <button
              type="button"
              className="btn-neuro"
              onClick={() => {
                setStep("registerDoctor");
                setFeedback("");
              }}
            >
              Sou médico
            </button>
            <button
              type="button"
              className="btn-neuro"
              onClick={() => {
                setStep("login");
                setFeedback("");
              }}
            >
              Voltar para login
            </button>
          </div>
        )}

        {step === "registerPatient" && (
          <form
            className="d-flex flex-column gap-2"
            onSubmit={submitPatientRegister}
          >
            <div className="auth-label">Cadastro de paciente</div>
            <input
              type="text"
              className="support-input"
              placeholder="Nome completo"
              value={patientRegisterData.name}
              onChange={(e) => {
                setPatientRegisterData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
                setFeedback("");
              }}
            />
            <input
              type="email"
              className="support-input"
              placeholder="E-mail"
              value={patientRegisterData.email}
              onChange={(e) => {
                setPatientRegisterData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
                setFeedback("");
              }}
            />
            <input
              type="password"
              className="support-input"
              placeholder="Senha"
              value={patientRegisterData.password}
              onChange={(e) => {
                setPatientRegisterData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
                setFeedback("");
              }}
            />

            <button type="submit" className="btn-neuro mt-2">
              Cadastrar paciente
            </button>
            <button
              type="button"
              className="btn-neuro"
              onClick={() => {
                setStep("selectRole");
                setFeedback("");
              }}
            >
              Voltar
            </button>
          </form>
        )}

        {step === "registerDoctor" && (
          <form
            className="d-flex flex-column gap-2"
            onSubmit={submitDoctorRegister}
          >
            <div className="auth-label">Cadastro de médico</div>
            <input
              type="text"
              className="support-input"
              placeholder="Nome completo"
              value={doctorRegisterData.name}
              onChange={(e) => {
                setDoctorRegisterData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
                setFeedback("");
              }}
            />
            <input
              type="email"
              className="support-input"
              placeholder="E-mail"
              value={doctorRegisterData.email}
              onChange={(e) => {
                setDoctorRegisterData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
                setFeedback("");
              }}
            />
            <input
              type="password"
              className="support-input"
              placeholder="Senha"
              value={doctorRegisterData.password}
              onChange={(e) => {
                setDoctorRegisterData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
                setFeedback("");
              }}
            />
            <input
              type="text"
              className="support-input"
              placeholder="CRM"
              value={doctorRegisterData.crm}
              onChange={(e) => {
                setDoctorRegisterData((prev) => ({
                  ...prev,
                  crm: e.target.value,
                }));
                setFeedback("");
              }}
            />

            <button type="submit" className="btn-neuro mt-2">
              Cadastrar médico
            </button>
            <button
              type="button"
              className="btn-neuro"
              onClick={() => {
                setStep("selectRole");
                setFeedback("");
              }}
            >
              Voltar
            </button>
          </form>
        )}

        {feedback && <div className="auth-feedback">{feedback}</div>}

        <div className="auth-hint">
          Acesso de demonstração: paciente@neurovest.com / 123456 e
          medico@neurovest.com / 123456.
        </div>
      </section>
    </main>
  );
}
