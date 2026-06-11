import { isSupabaseConfigured, supabase } from "../lib/supabase";

const SUPABASE_MANAGED_PASSWORD = "supabase-auth-managed";

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeRole(role) {
  return String(role || "patient").toLowerCase() === "admin"
    ? "admin"
    : "patient";
}

function isAdminType(value) {
  return ["admin", "medico"].includes(String(value || "").toLowerCase());
}

function buildSessionUser({ id, name, email, role, crm }) {
  return {
    id,
    name,
    email,
    role,
    crm,
  };
}

function mapLoginRowToSession(loginRow, fallbackMetadata = {}) {
  if (!loginRow) return null;

  const role = isAdminType(loginRow.tipo_usuario || fallbackMetadata.role)
    ? "admin"
    : "patient";

  const name = normalizeText(fallbackMetadata.name || loginRow.email);
  return buildSessionUser({
    id: loginRow.id,
    name,
    email: loginRow.email,
    role,
    crm: fallbackMetadata.crm,
  });
}

async function upsertAppUserProfile({ authUser, name, role, crm }) {
  const loginPayload = {
    id: authUser.id,
    email: authUser.email,
    senha: SUPABASE_MANAGED_PASSWORD,
    tipo_usuario: role === "admin" ? "ADMIN" : "PACIENTE",
  };

  const loginResult = await supabase.from("login").upsert(loginPayload);
  if (loginResult.error) return loginResult;

  if (role === "admin") {
    const adminProfileResult = await supabase.from("perfilmedico").upsert(
      {
        login_id: authUser.id,
        nome_completo: name,
        crm,
      },
      { onConflict: "login_id" },
    );

    if (adminProfileResult.error) return adminProfileResult;
  } else {
    const patientProfileResult = await supabase.from("perfilpaciente").upsert(
      {
        login_id: authUser.id,
        codigo_paciente: `PAC-${authUser.id.slice(0, 8).toUpperCase()}`,
        nome_completo: name,
        sexo: "NAO_INFORMADO",
      },
      { onConflict: "login_id" },
    );

    if (patientProfileResult.error) return patientProfileResult;
  }

  return { error: null };
}

async function fetchSessionUser(authUser) {
  const { data: loginRow, error } = await supabase
    .from("login")
    .select("id,email,tipo_usuario")
    .eq("id", authUser.id)
    .maybeSingle();

  if (error) return { user: null, error };

  return {
    user: mapLoginRowToSession(loginRow, authUser.user_metadata || {}),
    error: null,
  };
}

function fallbackConfiguredError() {
  return {
    ok: false,
    message:
      "Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ativar o fluxo Supabase.",
  };
}

export async function signInWithAppAuth({ email, password }) {
  if (!isSupabaseConfigured) return fallbackConfiguredError();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizeEmail(email),
    password: normalizeText(password),
  });

  if (error) {
    return {
      ok: false,
      message: error.message || "Falha ao autenticar com Supabase.",
    };
  }

  const authUser = data.user;
  if (!authUser) {
    return {
      ok: false,
      message: "Supabase não retornou um usuário autenticado.",
    };
  }

  const sessionUserResult = await fetchSessionUser(authUser);
  if (sessionUserResult.error || !sessionUserResult.user) {
    return {
      ok: true,
      user: buildSessionUser({
        id: authUser.id,
        name: normalizeText(authUser.user_metadata?.name || authUser.email),
        email: authUser.email,
        role: normalizeRole(authUser.user_metadata?.role),
        crm: authUser.user_metadata?.crm,
      }),
      message: "Acesso liberado com Supabase Auth.",
    };
  }

  return {
    ok: true,
    user: sessionUserResult.user,
    message: "Acesso liberado com Supabase Auth.",
  };
}

export async function registerWithAppAuth({
  name,
  email,
  password,
  role,
  crm,
}) {
  if (!isSupabaseConfigured) return fallbackConfiguredError();

  const normalizedName = normalizeText(name);
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = normalizeText(password);
  const normalizedRole = normalizeRole(role);
  const normalizedCrm = normalizeText(crm);

  if (!normalizedName || !normalizedEmail || !normalizedPassword) {
    return {
      ok: false,
      message: "Preencha nome, e-mail e senha para continuar.",
    };
  }

  if (normalizedRole === "admin" && !normalizedCrm) {
    return {
      ok: false,
      message: "Informe o CRM para cadastrar o médico.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: normalizedPassword,
    options: {
      data: {
        name: normalizedName,
        role: normalizedRole,
        crm: normalizedCrm || undefined,
      },
    },
  });

  if (error) {
    return {
      ok: false,
      message: error.message || "Falha ao cadastrar com Supabase.",
    };
  }

  const authUser = data.user;
  if (!authUser) {
    return {
      ok: false,
      message: "Supabase não confirmou o cadastro do usuário.",
    };
  }

  const profileResult = await upsertAppUserProfile({
    authUser,
    name: normalizedName,
    role: normalizedRole,
    crm: normalizedCrm,
  });

  if (profileResult.error) {
    return {
      ok: false,
      message:
        profileResult.error.message ||
        "Usuário criado, mas o perfil clínico não pôde ser salvo.",
    };
  }

  return {
    ok: true,
    user: buildSessionUser({
      id: authUser.id,
      name: normalizedName,
      email: normalizedEmail,
      role: normalizedRole,
      crm: normalizedRole === "admin" ? normalizedCrm : undefined,
    }),
    message: "Cadastro concluído com Supabase.",
  };
}

export async function restoreAppSession() {
  if (!isSupabaseConfigured) return { user: null };

  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session?.user) {
    return { user: null };
  }

  const sessionUserResult = await fetchSessionUser(data.session.user);
  return {
    user: sessionUserResult.user,
    error: sessionUserResult.error || null,
  };
}

export async function signOutAppAuth() {
  if (!isSupabaseConfigured) return { ok: true };

  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      ok: false,
      message: error.message || "Falha ao sair do Supabase.",
    };
  }

  return { ok: true };
}

export function buildDemoUser(role = "admin") {
  const normalizedRole = normalizeRole(role);

  return buildSessionUser({
    id: normalizedRole === "admin" ? "seed-admin" : "seed-patient",
    name: normalizedRole === "admin" ? "Médico Demo" : "Paciente Demo",
    email:
      normalizedRole === "admin"
        ? "medico@neurovest.com"
        : "paciente@neurovest.com",
    role: normalizedRole,
    crm: normalizedRole === "admin" ? "CRM-SP 123456" : undefined,
  });
}
