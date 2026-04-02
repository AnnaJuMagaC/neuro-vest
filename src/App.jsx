import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CardioPage from "./pages/CardioPage";
import NeuralPage from "./pages/NeuralPage";
import LoginPage from "./pages/LoginPage";
import {
  RiscoPage,
  HistoricoPage,
  DispositivosPage,
  PacientePage,
  ContatosPage,
  IAsuportePage,
} from "./pages/OtherPages";
import { getPatient } from "./api";

const THEME_STORAGE_KEY = "neurovest-theme-mode";
const AUTH_STORAGE_KEY = "neurovest-auth-user";

function getSystemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(mode) {
  return mode === "auto" ? getSystemTheme() : mode;
}

function getInitialThemeMode() {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return "light";
}

function getInitialAuthUser() {
  if (typeof window === "undefined") return null;
  const localUser = localStorage.getItem(AUTH_STORAGE_KEY);
  const sessionUser = sessionStorage.getItem(AUTH_STORAGE_KEY);
  const saved = localUser || sessionUser;
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

const PAGE_TITLES = {
  dashboard: { title: "Dashboard", subtitle: "Visão geral em tempo real" },
  cardio: {
    title: "Monitoramento Cardíaco",
    subtitle: "Colete Biomédico — ECG · PA · SpO₂",
  },
  neural: {
    title: "Monitoramento Neural",
    subtitle: "Faixa Cerebral — EEG · fNIRS",
  },
  risco: {
    title: "Índice de Risco Vascular",
    subtitle: "Análise preditiva por IA",
  },
  historico: {
    title: "Histórico de Sessões",
    subtitle: "Registros e exportação",
  },
  dispositivos: {
    title: "Gerenciar Dispositivos",
    subtitle: "Status e controle de atuadores",
  },
  paciente: {
    title: "Dados do Paciente",
    subtitle: "Ficha clínica e condições",
  },
  contatos: {
    title: "Rede de Contatos",
    subtitle: "Psicólogo, médico e fisioterapeuta",
  },
  suporte: {
    title: "IA de Apoio",
    subtitle: "Acolhimento conversacional com limite clínico",
  },
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patient, setPatient] = useState(null);
  const [clock, setClock] = useState(new Date());
  const [authUser, setAuthUser] = useState(getInitialAuthUser);
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    resolveTheme(getInitialThemeMode()),
  );

  useEffect(() => {
    if (!authUser) return;

    getPatient().then(setPatient);
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    setResolvedTheme(resolveTheme(themeMode));
  }, [themeMode]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (themeMode === "auto") {
        setResolvedTheme(media.matches ? "dark" : "light");
      }
    };

    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
    } else {
      media.addListener(handleChange);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", handleChange);
      } else {
        media.removeListener(handleChange);
      }
    };
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const { title, subtitle } = PAGE_TITLES[page] || PAGE_TITLES.dashboard;

  const handleLogin = ({ usuario, senha, remember }) => {
    const user = usuario.trim();
    if (!user || !senha) {
      return { ok: false, message: "Preencha usuário e senha." };
    }

    if (user !== "admin" || senha !== "neuro123") {
      return { ok: false, message: "Credenciais inválidas." };
    }

    const payload = { nome: "Operador NeuroVest", usuario: user };
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    }

    setAuthUser(payload);
    setPage("dashboard");
    setSidebarOpen(false);
    return { ok: true };
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthUser(null);
    setPatient(null);
    setPage("dashboard");
    setSidebarOpen(false);
  };

  const renderPage = () => {
    if (!patient) return null;
    switch (page) {
      case "dashboard":
        return <Dashboard patient={patient} />;
      case "cardio":
        return <CardioPage />;
      case "neural":
        return <NeuralPage />;
      case "risco":
        return <RiscoPage />;
      case "historico":
        return <HistoricoPage />;
      case "dispositivos":
        return <DispositivosPage />;
      case "paciente":
        return <PacientePage patient={patient} />;
      case "contatos":
        return <ContatosPage patient={patient} />;
      case "suporte":
        return <IAsuportePage />;
      default:
        return <Dashboard patient={patient} />;
    }
  };

  if (!authUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        themeMode={themeMode}
        resolvedTheme={resolvedTheme}
        onChangeTheme={setThemeMode}
      />
    );
  }

  return (
    <>
      <Sidebar
        currentPage={page}
        setPage={setPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        themeMode={themeMode}
        resolvedTheme={resolvedTheme}
        onChangeTheme={setThemeMode}
      />

      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="bi bi-list"></i>
              Menu
            </button>
            <div>
              <div className="page-title">{title}</div>
              <div className="page-subtitle">{subtitle}</div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="user-chip">
              <i className="bi bi-person-circle"></i>
              {authUser.nome}
            </div>
            {/* Relógio */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                color: "var(--accent-cyan)",
                letterSpacing: 2,
              }}
            >
              {clock.toLocaleTimeString("pt-BR")}
            </div>
            {/* Status API */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid #d4875a33",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ color: "var(--accent-orange)" }}>●</span>
              <span style={{ color: "var(--text-muted)" }}>MODO SIMULAÇÃO</span>
            </div>
            <button className="btn-neuro" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>
              Sair
            </button>
          </div>
        </div>

        {/* Conteúdo da página */}
        {renderPage()}
      </main>
    </>
  );
}
