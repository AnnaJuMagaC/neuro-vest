// ====================================
// SERVIDOR DE CHAT EM TEMPO REAL
// ====================================
// Este servidor gerencia as conexões de usuários e distribui mensagens
// Tecnologias:
// - Express: Framework web para HTTP
// - Socket.io: Comunicação bidirecional em tempo real via WebSocket

require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const express = require("express");
const { randomUUID } = require("crypto");
const app = express(); // Importa a biblioteca Express
const server = require("http").createServer(app); // Importa módulo HTTP nativo do Node.js (necessário para o Socket.io)
const io = require("socket.io")(server, {
  // Importa Socket.io e configura para o servidor HTTP
  // CORS (Cross-Origin Resource Sharing): permite que clientes de outros domínios/IPs se conectem
  // Altere o IP para o IP da máquina onde o servidor está rodando
  cors: { origin: "http://192.168.1.232:3000" },
  // Exemplo: "http://localhost:5173" para desenvolvimento local
  // Exemplo: "http://seu.ip.aqui:5173" para rede
});
const cors = require("cors");
const { hasSupabaseConfig, supabase } = require("./supabase");

const PORT = 3001; // Porta na qual o servidor irá escutar conexões
const MAX_CHAT_HISTORY = 50;
const chatMessages = [];
const fallbackPatients = [
  {
    id: "P-00142",
    nome_completo: "João Carlos Medeiros",
    idade: 58,
    sexo: "MASCULINO",
    created_at: "2026-06-11T14:30:00.000Z",
  },
];
const fallbackAlerts = [
  {
    id: "A-001",
    data_hora: "2026-06-11T14:31:00.000Z",
    tipo_sensor: "Colete - Pressão",
    mensagem: "Pressão arterial sistólica elevada (138 mmHg)",
    criticidade: "ATENCAO",
  },
];
const fallbackDevices = [
  {
    id: "D-01",
    nome_dispositivo: "Colete Biomédico",
    tipo: "VASCULAR",
    status_operacional: "ATIVO",
    bateria_porcentagem: 82,
    sinal_porcentagem: 95,
  },
];

app.use(cors({ origin: true }));
app.use(express.json());

function createChatMessage({ text, author, authorId }) {
  return {
    id: randomUUID(),
    text,
    author,
    authorId,
    createdAt: new Date().toISOString(),
  };
}

function mapChatRow(row) {
  return {
    id: row.id,
    text: row.text,
    author: row.author,
    authorId: row.author_id,
    createdAt: row.created_at,
  };
}

async function hydrateChatMessages() {
  if (!hasSupabaseConfig || !supabase) return chatMessages;

  try {
    const { data, error } = await supabase
      .from("chatmensagens")
      .select("id, author_id, author, text, created_at")
      .order("created_at", { ascending: true })
      .limit(MAX_CHAT_HISTORY);

    if (error) throw error;

    if (Array.isArray(data)) {
      chatMessages.splice(0, chatMessages.length, ...data.map(mapChatRow));
    }
  } catch (error) {
    console.warn(
      "[API] Falha ao carregar histórico do chat:",
      error?.message || error,
    );
  }

  return chatMessages;
}

async function persistChatMessage(message) {
  if (!hasSupabaseConfig || !supabase) return { persisted: false };

  try {
    const { error } = await supabase.from("chatmensagens").insert({
      id: message.id,
      author_id: message.authorId,
      author: message.author,
      text: message.text,
      created_at: message.createdAt,
    });

    if (error) throw error;
    return { persisted: true };
  } catch (error) {
    console.warn(
      "[API] Falha ao persistir mensagem do chat:",
      error?.message || error,
    );
    return { persisted: false, error };
  }
}

async function fetchSupabaseList({ table, select, orderBy, fallback, mapRow }) {
  if (!hasSupabaseConfig || !supabase) return fallback;

  try {
    let query = supabase.from(table).select(select);

    if (orderBy?.column) {
      query = query.order(orderBy.column, {
        ascending: Boolean(orderBy.ascending),
      });
    }

    if (orderBy?.limit) {
      query = query.limit(orderBy.limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    return Array.isArray(data) ? data.map(mapRow) : fallback;
  } catch (error) {
    console.warn(`[API] Fallback local em ${table}:`, error?.message || error);
    return fallback;
  }
}

app.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    status: "up",
    service: "neurovest-server",
  });
});

app.get("/api/patients", async (req, res) => {
  const patients = await fetchSupabaseList({
    table: "perfilpaciente",
    select: "id, codigo_paciente, nome_completo, idade, sexo, created_at",
    orderBy: { column: "created_at", ascending: false, limit: 20 },
    fallback: fallbackPatients,
    mapRow: (row) => ({
      id: row.id,
      codigo_paciente: row.codigo_paciente,
      nome_completo: row.nome_completo,
      idade: row.idade,
      sexo: row.sexo,
      created_at: row.created_at,
    }),
  });

  res.status(200).json({ ok: true, count: patients.length, patients });
});

app.get("/api/alerts", async (req, res) => {
  const alerts = await fetchSupabaseList({
    table: "alertasistema",
    select: "id, data_hora, tipo_sensor, mensagem, criticidade, created_at",
    orderBy: { column: "data_hora", ascending: false, limit: 20 },
    fallback: fallbackAlerts,
    mapRow: (row) => ({
      id: row.id,
      data_hora: row.data_hora,
      tipo_sensor: row.tipo_sensor,
      mensagem: row.mensagem,
      criticidade: row.criticidade,
      created_at: row.created_at,
    }),
  });

  res.status(200).json({ ok: true, count: alerts.length, alerts });
});

app.get("/api/devices", async (req, res) => {
  const devices = await fetchSupabaseList({
    table: "dispositivo",
    select:
      "id, nome_dispositivo, tipo, status_operacional, bateria_porcentagem, sinal_porcentagem, created_at",
    orderBy: { column: "created_at", ascending: false, limit: 20 },
    fallback: fallbackDevices,
    mapRow: (row) => ({
      id: row.id,
      nome_dispositivo: row.nome_dispositivo,
      tipo: row.tipo,
      status_operacional: row.status_operacional,
      bateria_porcentagem: row.bateria_porcentagem,
      sinal_porcentagem: row.sinal_porcentagem,
      created_at: row.created_at,
    }),
  });

  res.status(200).json({ ok: true, count: devices.length, devices });
});

app.get("/api/status", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "neurovest-server",
    socket: true,
    supabaseConfigured: hasSupabaseConfig,
    messagesStored: chatMessages.length,
  });
});

app.get("/api/chat/messages", async (req, res) => {
  await hydrateChatMessages();

  res.status(200).json({
    ok: true,
    count: chatMessages.length,
    messages: chatMessages,
  });
});

app.post("/api/chat/messages", async (req, res) => {
  const text = String(req.body?.text || "").trim();
  const author = String(req.body?.author || "Anônimo").trim();

  if (!text) {
    return res.status(400).json({
      ok: false,
      message: "Informe o texto da mensagem.",
    });
  }

  const message = createChatMessage({
    text,
    author,
    authorId: req.body?.authorId || "http-client",
  });

  chatMessages.push(message);
  await persistChatMessage(message);
  io.emit("receive_message", message);

  res.status(201).json({
    ok: true,
    message,
  });
});

// =============================================
// EVENT LISTENER: Quando um cliente se conecta
// =============================================
io.on("connection", (socket) => {
  // "socket" representa a conexão de um único cliente
  // Cada cliente que se conecta recebe um novo objeto "socket"
  // socket.id: ID único do cliente (gerado automaticamente)
  // socket.data: Objeto para armazenar dados do cliente (username, etc)

  // ==================================
  // EVENTO: Usuário define seu nome
  // ==================================
  socket.on("set_username", (username) => {
    // Armazena o nome de usuário no objeto socket para uso posterior
    socket.data.username = username;
    // Registra no console que um usuário conectou
    userName(username, socket.id);
  });

  // ==================================
  // EVENTO: Usuário desconecta
  // ==================================
  socket.on("disconnect", (reason) => {
    // Registra informação sobre desconexão
    console.log(
      `Usuário ${socket.data.username} desconetado! Sua id era ${socket.id}`,
    );
    // Motivo da desconexão. Motivos comuns: "client namespace disconnect", "client left", etc
    console.log(`Motivo: ${reason}`);
  });

  // ==================================
  // EVENTO: Servidor recebe mensagem
  // ==================================

  socket.on("message", (text) => {
    // Quando um cliente envia uma mensagem, o servidor:
    // 1. Cria um objeto com dados da mensagem
    // 2. Envia para TODOS os clientes conectados usando io.emit()
    // Isso permite que todos vejam a mensagem em tempo real
    const message = createChatMessage({
      text,
      authorId: socket.id,
      author: socket.data.username,
    });

    chatMessages.push(message);
    void persistChatMessage(message);
    io.emit("receive_message", message);
    console.log(`Usuário ${socket.data.username} enviou uma mensagem!`);
  });

  chatHistoryReady
    .then(() => {
      socket.emit("chat_history", chatMessages);
    })
    .catch(() => {
      socket.emit("chat_history", chatMessages);
    });
});

// Registra no console quando um novo usuário se conecta
const userName = (username, id) => {
  console.log(`Usuário ${username} conectado com o seguinte id: ${id}`);
};

const chatHistoryReady = hydrateChatMessages();

// ==================================
// INICIAR O SERVIDOR
// ==================================
server.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}...`);
  console.log(`Cliente deve conectar em http://seu-ip:${PORT}`);
});
