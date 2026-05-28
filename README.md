
<h1 align="center">⚡ API Enercheck</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Ferramenta-ASP.NET%20Core%208.0-purple?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/IA-Gemini-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Framework-Entity%20Framework%20Core-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge"/>
</p>

---

# 📖 Descrição

Esta API oferece uma solução completa para gerenciamento de usuários, planos de serviço e projetos, focada no setor elétrico.

Seu principal diferencial é a integração de um **Módulo de Inteligência Artificial**, alimentado pelo **Google Gemini**, que permite o envio e análise automatizada de plantas elétricas.

A plataforma garante autenticação segura de contas e associação de usuários a diferentes níveis de planos e projetos.

---

# 🧠 Módulo de Inteligência Artificial (Gemini)

O recurso central da Enercheck é a capacidade de processar e analisar projetos elétricos.

## ⚙️ Como Funciona

1. O usuário envia uma imagem ou PDF da planta elétrica
2. A API envia o conteúdo para o Gemini
3. O modelo interpreta os elementos técnicos
4. O sistema retorna um relatório estruturado

## 📊 Análises e Retornos

- ✅ Validação de conformidade
- ⚡ Identificação de componentes
- 📐 Sugestões de otimização
- 🔍 Análise técnica automatizada

---

# ⚙️ Tecnologias Utilizadas

## 🔹 Back-end
- ASP.NET Core 8
- C#

## 🔹 Banco de Dados
- Microsoft SQL Server
- Entity Framework Core

## 🔹 Segurança
- JWT Bearer Token
- ASP.NET Identity

## 🔹 Inteligência Artificial
- Google Gemini API

## 🔹 Documentação
- Swagger

---

# 📦 Estrutura do Projeto

```bash
/APIEnercheck
├── Controllers/
├── Data/
├── Migrations/
├── Models/
├── Properties/
├── Services/
├── APIEnercheck.csproj
├── APIEnercheck.http
├── Program.cs
├── appsettings.json
└── appsettings.Development.json
````

---

# 🚀 Como Executar o Projeto




## 🔸 Requisitos Prévios

* .NET 8 SDK
* SQL Server ou LocalDB

---

## 1️⃣ Clonar o projeto

```bash
git clone https://github.com/ThiagoM22/APIEnercheck.git
cd APIEnercheck
```

---

## 2️⃣ Configurar Banco de Dados

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=SEU_SERVIDOR;Database=NOME_DB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

---

## 3️⃣ Aplicar Migrations

```bash
dotnet ef database update
```

---

## 4️⃣ Executar o Projeto

```bash
dotnet run
```

---

# 📚 Documentação e Autenticação

## 🔑 Autenticação

A API utiliza:

* JWT Bearer Token
* ASP.NET Identity

Exemplo de autenticação:

```bash
Authorization: Bearer SEU_TOKEN_JWT
```

---

## 📄 Swagger

Após iniciar o projeto:

```bash
http://localhost:5000/swagger
```

---

# 📌 Endpoints Principais

# 👤 Usuários

| Método | Endpoint                | Descrição            |
| ------ | ----------------------- | -------------------- |
| GET    | `/api/Usuarios`         | Lista usuários       |
| GET    | `/api/Usuarios/{id}`    | Busca usuário por ID |
| GET    | `/api/Usuarios/me`      | Busca usuário logado |
| POST   | `/api/Usuarios/Cliente` | Cria usuário cliente |
| POST   | `/api/Usuarios/Admin`   | Cria usuário admin   |
| PUT    | `/api/Usuarios/{id}`    | Atualiza usuário     |
| DELETE | `/api/Usuarios/{id}`    | Remove usuário       |

---

# 📁 Projetos

| Método | Endpoint                              | Descrição               |
| ------ | ------------------------------------- | ----------------------- |
| GET    | `/api/Projetos`                       | Lista projetos          |
| POST   | `/api/Projetos`                       | Cria projeto            |
| POST   | `/api/Projetos/projeto/{id}/analisar` | Analisa planta elétrica |
| PUT    | `/api/Projetos/{id}`                  | Atualiza projeto        |
| DELETE | `/api/Projetos/{id}`                  | Remove projeto          |

---

# 🧩 Planos

| Método | Endpoint           | Descrição      |
| ------ | ------------------ | -------------- |
| GET    | `/api/Planos`      | Lista planos   |
| GET    | `/api/Planos/{id}` | Busca plano    |
| POST   | `/api/Planos`      | Cria plano     |
| PUT    | `/api/Planos/{id}` | Atualiza plano |
| DELETE | `/api/Planos/{id}` | Remove plano   |

---

# 📄 Licença

Este projeto está licenciado sob a Licença MIT.

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge"/>
</p>

---

# 🧑‍💻 Desenvolvido por

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/ThiagoM22">
        <img src="https://avatars.githubusercontent.com/u/158314044" width="100px;" />
        <br />
        <sub><b>Thiago Mazzi</b></sub>
        <br />
        💻 Dev FullStack
      </a>
    </td>

  </tr>
</table>
```
