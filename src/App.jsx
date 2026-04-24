import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CardioPage from "./pages/CardioPage";
import NeuralPage from "./pages/NeuralPage";
import AuthPage from "./pages/AuthPage";
import {
  ClientesPage,
  RiscoPage,
  HistoricoPage,
  DispositivosPage,
  PacientePage,
  ChatAccessPage,
  PacienteChatPage,
  AdminChatPage,
  IAsuportePage,
} from "./pages/OtherPages";
import { getPatient } from "./api";

const THEME_STORAGE_KEY = "neurovest-theme-mode";
const USERS_STORAGE_KEY = "neurovest-users";
const SESSION_STORAGE_KEY = "neurovest-session";
const HUMAN_CHAT_STORAGE_KEY = "neurovest-human-chat-threads";
const HUMAN_CHAT_UNREAD_STORAGE_KEY = "neurovest-human-chat-unread";

const SEED_USERS = [
  {
    id: "seed-patient",
    name: "Paciente Demo",
    email: "paciente@neurovest.com",
    password: "123456",
    role: "patient",
  },
  {
    id: "seed-admin",
    name: "Médico Demo",
    email: "medico@neurovest.com",
    password: "123456",
    role: "admin",
    crm: "CRM-SP 123456",
  },
];

function getInitialUsers() {
  if (typeof window === "undefined") return SEED_USERS;

  const saved = localStorage.getItem(USERS_STORAGE_KEY);
  if (!saved) return SEED_USERS;

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return SEED_USERS;

    const existing = new Set(
      parsed.map((user) => String(user.email || "").toLowerCase()),
    );
    const merged = [...parsed];

    SEED_USERS.forEach((seed) => {
      if (!existing.has(seed.email.toLowerCase())) {
        merged.push(seed);
      }
    });

    return merged;
  } catch {
    return SEED_USERS;
  }
}

function getInitialSession() {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

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

function getInitialHumanChatThreads() {
  if (typeof window === "undefined") return {};
  const saved = localStorage.getItem(HUMAN_CHAT_STORAGE_KEY);
  if (!saved) return {};

  try {
    const parsed = JSON.parse(saved);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

function getInitialHumanChatUnread() {
  if (typeof window === "undefined") return {};
  const saved = localStorage.getItem(HUMAN_CHAT_UNREAD_STORAGE_KEY);
  if (!saved) return {};

  try {
    const parsed = JSON.parse(saved);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

const PAGE_TITLES = {
  clientes: {
    title: "Meus Clientes",
    subtitle: "Lista de pacientes e cadastro rápido",
  },
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
    title: "Acesso ao Chat Humano",
    subtitle: "Escolha o tipo de acesso para iniciar a conversa",
  },
  chatPaciente: {
    title: "Chat do Paciente",
    subtitle: "Paciente envia mensagens para a equipe médica",
  },
  chatAdmin: {
    title: "Chat Médico/Admin",
    subtitle: "Médicos respondem às mensagens dos pacientes",
  },
  suporte: {
    title: "IA de Suporte",
    subtitle: "Apoio emocional inicial, sem substituir profissionais",
  },
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [clock, setClock] = useState(new Date());
  const [users, setUsers] = useState(getInitialUsers);
  const [currentUser, setCurrentUser] = useState(getInitialSession);
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);
  const [humanChatThreads, setHumanChatThreads] = useState(
    getInitialHumanChatThreads,
  );
  const [humanChatUnread, setHumanChatUnread] = useState(
    getInitialHumanChatUnread,
  );
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    resolveTheme(getInitialThemeMode()),
  );

  const authRole = currentUser?.role || null;
  const hasSelectedPatient = Boolean(selectedPatientId);

  const patient =
    patients.find((entry) => entry.id === selectedPatientId) ||
    patients[0] ||
    null;

  const buildPatient = ({ name, idade }) => ({
    id: `P-${Date.now().toString().slice(-5)}`,
    nome: name,
    idade: Number(idade) || 40,
    sexo: "Não informado",
    peso: 70,
    altura: 170,
    condicoes: [],
    medico: currentUser?.name || "Equipe Clínica",
    ultimaSessao: new Date().toISOString(),
  });

  useEffect(() => {
    getPatient().then((basePatient) => {
      setPatients([basePatient]);
      setSelectedPatientId(null);
    });
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (authRole === "patient" && !selectedPatientId && patients.length > 0) {
      setSelectedPatientId(patients[0].id);
    }
  }, [authRole, selectedPatientId, patients]);

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

    if (media.addEventListener) media.addEventListener("change", handleChange);
    else media.addListener(handleChange);

    return () => {
      if (media.removeEventListener)
        media.removeEventListener("change", handleChange);
      else media.removeListener(handleChange);
    };
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(
      HUMAN_CHAT_STORAGE_KEY,
      JSON.stringify(humanChatThreads),
    );
  }, [humanChatThreads]);

  useEffect(() => {
    localStorage.setItem(
      HUMAN_CHAT_UNREAD_STORAGE_KEY,
      JSON.stringify(humanChatUnread),
    );
  }, [humanChatUnread]);

  const { title, subtitle } = PAGE_TITLES[page] || PAGE_TITLES.dashboard;

  const handleSiteLogin = ({ email, password }) => {
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const normalizedPassword = String(password || "");
    const user = users.find(
      (entry) =>
        String(entry.email || "").toLowerCase() === normalizedEmail &&
        String(entry.password || "") === normalizedPassword,
    );

    if (!user) {
      return {
        ok: false,
        message: "Credenciais inválidas. Verifique e tente novamente.",
      };
    }

    setCurrentUser(user);
    if (user.role === "admin") setSelectedPatientId(null);
    setPage(user.role === "admin" ? "clientes" : "dashboard");
    return {
      ok: true,
      message: `Acesso liberado para ${user.role === "admin" ? "Médico/Admin" : "Paciente"}.`,
    };
  };

  const handleSiteRegister = ({ name, email, password, role, crm }) => {
    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const normalizedPassword = String(password || "");
    const normalizedCrm = String(crm || "").trim();

    if (!normalizedName || !normalizedEmail || !normalizedPassword || !role) {
      return { ok: false, message: "Preencha todos os campos para cadastrar." };
    }

    if (role === "admin" && !normalizedCrm) {
      return { ok: false, message: "Informe o CRM para cadastro de médico." };
    }

    if (
      users.some(
        (entry) => String(entry.email || "").toLowerCase() === normalizedEmail,
      )
    ) {
      return {
        ok: false,
        message: "Este e-mail já está cadastrado. Faça login para acessar.",
      };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
      role,
      crm: role === "admin" ? normalizedCrm : undefined,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    if (newUser.role === "admin") setSelectedPatientId(null);
    setPage(newUser.role === "admin" ? "clientes" : "dashboard");

    return { ok: true, message: "Cadastro concluído com sucesso." };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("dashboard");
  };

  const handleQuickAccess = () => {
    const quickUser =
      users.find((entry) => entry.role === "admin") || users[0] || null;
    if (!quickUser) return;
    setCurrentUser(quickUser);
    if (quickUser.role === "admin") setSelectedPatientId(null);
    setPage(quickUser.role === "admin" ? "clientes" : "dashboard");
  };

  const handleAddPatient = ({ nome, idade }) => {
    const normalizedName = String(nome || "").trim();
    if (!normalizedName) {
      return {
        ok: false,
        message: "Informe o nome do paciente para cadastrar.",
      };
    }

    const newPatient = buildPatient({ name: normalizedName, idade });
    setPatients((prev) => [...prev, newPatient]);
    return {
      ok: true,
      message: `Paciente ${newPatient.nome} cadastrado. Selecione-o na lista para iniciar o monitoramento.`,
    };
  };

  const handleSelectPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setPage("dashboard");
  };

  const handleSendHumanMessage = (text, senderRole) => {
    const content = String(text || "").trim();
    const activePatientId = patient?.id;
    if (!content || !activePatientId) return;

    const sender = senderRole === "admin" ? "admin" : "patient";
    const senderName = String(currentUser?.name || "").trim();
    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sender,
      senderName:
        senderName || (sender === "admin" ? "Médico/Admin" : "Paciente"),
      text: content,
      createdAt: new Date().toISOString(),
    };

    setHumanChatThreads((prev) => ({
      ...prev,
      [activePatientId]: [...(prev[activePatientId] || []), message],
    }));

    setHumanChatUnread((prev) => {
      const currentThreadUnread = prev[activePatientId] || {
        patient: 0,
        admin: 0,
      };
      const targetRole = sender === "admin" ? "patient" : "admin";
      return {
        ...prev,
        [activePatientId]: {
          ...currentThreadUnread,
          [targetRole]: (currentThreadUnread[targetRole] || 0) + 1,
        },
      };
    });
  };

  const activeHumanChat = patient?.id ? humanChatThreads[patient.id] || [] : [];
  const unreadRoleKey = authRole === "admin" ? "admin" : "patient";
  const activeHumanChatUnread =
    patient?.id && unreadRoleKey
      ? (humanChatUnread[patient.id]?.[unreadRoleKey] ?? 0)
      : 0;

  useEffect(() => {
    const activePatientId = patient?.id;
    const chatOpenForCurrentRole =
      (authRole === "patient" &&
        (page === "chatPaciente" || page === "contatos")) ||
      (authRole === "admin" && (page === "chatAdmin" || page === "contatos"));

    if (!activePatientId || !chatOpenForCurrentRole) return;

    setHumanChatUnread((prev) => {
      const current = prev[activePatientId];
      if (!current || !current[unreadRoleKey]) return prev;
      return {
        ...prev,
        [activePatientId]: {
          ...current,
          [unreadRoleKey]: 0,
        },
      };
    });
  }, [authRole, page, patient?.id, unreadRoleKey]);

  const renderPage = () => {
    if (authRole === "admin" && !hasSelectedPatient && page !== "clientes") {
      return (
        <ClientesPage
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={handleSelectPatient}
          onAddPatient={handleAddPatient}
        />
      );
    }

    const canRenderWithoutPatient = page === "clientes" && authRole === "admin";
    if (!patient && !canRenderWithoutPatient) return null;
    switch (page) {
      case "clientes":
        if (authRole !== "admin") return <Dashboard patient={patient} />;
        return (
          <ClientesPage
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={handleSelectPatient}
            onAddPatient={handleAddPatient}
          />
        );
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
        if (authRole === "patient") {
          return (
            <PacienteChatPage
              patient={patient}
              setPage={setPage}
              onLogout={handleLogout}
              chat={activeHumanChat}
              onSendMessage={(text) => handleSendHumanMessage(text, "patient")}
              currentUserName={currentUser?.name}
              directMode
            />
          );
        }
        if (authRole === "admin") {
          return (
            <AdminChatPage
              patient={patient}
              patients={patients}
              selectedPatientId={selectedPatientId}
              onSelectPatient={handleSelectPatient}
              setPage={setPage}
              onLogout={handleLogout}
              chat={activeHumanChat}
              threads={humanChatThreads}
              unreadByPatient={humanChatUnread}
              onSendMessage={(text) => handleSendHumanMessage(text, "admin")}
              currentUserName={currentUser?.name}
              directMode
            />
          );
        }
        return (
          <ChatAccessPage
            patient={patient}
            setPage={setPage}
            authRole={authRole}
            unreadCount={activeHumanChatUnread}
          />
        );
      case "chatPaciente":
        if (authRole !== "patient") {
          return (
            <ChatAccessPage
              patient={patient}
              setPage={setPage}
              authRole={authRole}
              unreadCount={activeHumanChatUnread}
              accessError="Apenas pacientes autenticados podem abrir esta área."
            />
          );
        }
        return (
          <PacienteChatPage
            patient={patient}
            setPage={setPage}
            onLogout={handleLogout}
            chat={activeHumanChat}
            onSendMessage={(text) => handleSendHumanMessage(text, "patient")}
            currentUserName={currentUser?.name}
          />
        );
      case "chatAdmin":
        if (authRole !== "admin") {
          return (
            <ChatAccessPage
              patient={patient}
              setPage={setPage}
              authRole={authRole}
              unreadCount={activeHumanChatUnread}
              accessError="Apenas médicos/admin autenticados podem abrir esta área."
            />
          );
        }
        return (
          <AdminChatPage
            patient={patient}
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={handleSelectPatient}
            setPage={setPage}
            onLogout={handleLogout}
            chat={activeHumanChat}
            threads={humanChatThreads}
            unreadByPatient={humanChatUnread}
            onSendMessage={(text) => handleSendHumanMessage(text, "admin")}
            currentUserName={currentUser?.name}
          />
        );
      case "suporte":
        return <IAsuportePage />;
      default:
        return <Dashboard patient={patient} />;
    }
  };

  if (!currentUser) {
    return (
      <AuthPage
        onLogin={handleSiteLogin}
        onRegister={handleSiteRegister}
        onQuickAccess={handleQuickAccess}
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
        authRole={authRole}
        hasSelectedPatient={hasSelectedPatient}
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
            <div className="tag tag-purple" style={{ fontSize: 10 }}>
              {authRole === "admin" ? "Médico/Admin" : "Paciente"}:{" "}
              {currentUser?.name}
            </div>
            <button type="button" className="btn-neuro" onClick={handleLogout}>
              Sair
            </button>
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
                border: "1px solid #ff910033",
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
          </div>
        </div>

        {/* Conteúdo da página */}
        {renderPage()}
      </main>

      <button
        type="button"
        className={`chat-human-fab ${
          ["contatos", "chatPaciente", "chatAdmin"].includes(page)
            ? "active"
            : ""
        }`}
        onClick={() => {
          setPage("contatos");
          setSidebarOpen(false);
        }}
        aria-label="Abrir chat humano"
        title="Chat Humano"
      >
        <i className="bi bi-chat-dots-fill"></i>
        {activeHumanChatUnread > 0 && (
          <span className="chat-human-fab-badge">
            {activeHumanChatUnread > 99 ? "99+" : activeHumanChatUnread}
          </span>
        )}
      </button>
    </>
  );
}
