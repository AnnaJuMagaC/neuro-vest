create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'tipo_usuario') then
    create type tipo_usuario as enum ('MEDICO', 'PACIENTE', 'ADMIN');
  end if;

  if not exists (select 1 from pg_type where typname = 'status_geral') then
    create type status_geral as enum ('NORMAL', 'ATENCAO', 'CRITICO');
  end if;

  if not exists (select 1 from pg_type where typname = 'tipo_dispositivo') then
    create type tipo_dispositivo as enum ('VASCULAR', 'NEURAL');
  end if;

  if not exists (select 1 from pg_type where typname = 'modo_funcionamento') then
    create type modo_funcionamento as enum ('REAL', 'SIMULACAO');
  end if;

  if not exists (select 1 from pg_type where typname = 'tipo_intervencao') then
    create type tipo_intervencao as enum ('RECALIBRACAO', 'TROCA_BATERIA', 'ATUALIZACAO_FIRMWARE');
  end if;

  if not exists (select 1 from pg_type where typname = 'categoria_alerta') then
    create type categoria_alerta as enum ('URGENTE', 'IMPORTANTE', 'PREVENTIVO', 'ESTILO_DE_VIDA');
  end if;

  if not exists (select 1 from pg_type where typname = 'criticidade_alerta') then
    create type criticidade_alerta as enum ('INFO', 'ATENCAO', 'URGENTE');
  end if;

  if not exists (select 1 from pg_type where typname = 'sexo_enum') then
    create type sexo_enum as enum ('MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO');
  end if;
exception
  when others then
    null;
end $$;

create table if not exists public.login (
  id uuid primary key default gen_random_uuid(),
  email varchar(320) not null unique,
  senha varchar not null,
  tipo_usuario tipo_usuario not null,
  data_criacao timestamp not null default now(),
  created_at timestamp not null default now()
);

create table if not exists public.perfilmedico (
  id uuid primary key default gen_random_uuid(),
  login_id uuid not null unique,
  nome_completo varchar(200) not null,
  crm varchar(50) not null,
  created_at timestamp not null default now(),
  constraint fk_perfilmedico_login
    foreign key (login_id) references public.login(id)
    on delete cascade
);

create index if not exists idx_perfilmedico_login_id on public.perfilmedico(login_id);

create table if not exists public.perfilpaciente (
  id uuid primary key default gen_random_uuid(),
  login_id uuid not null unique,
  medico_responsavel_id uuid,
  codigo_paciente varchar(100) not null unique,
  nome_completo varchar(200) not null,
  idade int4 check (idade >= 0 and idade <= 130),
  sexo sexo_enum not null default 'NAO_INFORMADO',
  peso_kg numeric check (peso_kg > 0),
  altura_cm int4 check (altura_cm > 0 and altura_cm <= 250),
  imc numeric check (imc >= 0),
  created_at timestamp not null default now(),
  constraint fk_perfilpaciente_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint fk_perfilpaciente_medico
    foreign key (medico_responsavel_id) references public.perfilmedico(id)
    on delete set null
);

create index if not exists idx_perfilpaciente_medico on public.perfilpaciente(medico_responsavel_id);

create table if not exists public.condicaopreexistente (
  id uuid primary key default gen_random_uuid(),
  login_id uuid not null,
  paciente_id uuid not null,
  nome_condicao varchar(200) not null,
  created_at timestamp not null default now(),
  constraint fk_condicao_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint fk_condicao_paciente
    foreign key (paciente_id) references public.perfilpaciente(id)
    on delete cascade,
  constraint uq_condicao_por_paciente unique (paciente_id, nome_condicao)
);

create index if not exists idx_condicao_paciente on public.condicaopreexistente(paciente_id);
create index if not exists idx_condicao_login on public.condicaopreexistente(login_id);

create table if not exists public.dispositivo (
  id uuid primary key default gen_random_uuid(),
  login_id uuid not null,
  codigo_hardware varchar(120) not null,
  nome_dispositivo varchar(200) not null,
  tipo tipo_dispositivo not null,
  status_operacional varchar(100) not null,
  bateria_porcentagem int4 check (bateria_porcentagem >= 0 and bateria_porcentagem <= 100),
  sinal_porcentagem int4 check (sinal_porcentagem >= 0 and sinal_porcentagem <= 100),
  modo_funcionamento modo_funcionamento not null,
  created_at timestamp not null default now(),
  constraint fk_dispositivo_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint uq_dispositivo_hardware unique (login_id, codigo_hardware)
);

create index if not exists idx_dispositivo_login on public.dispositivo(login_id);

create table if not exists public.parametrizacaoalerta (
  id uuid primary key default gen_random_uuid(),
  login_id uuid not null,
  metrica_alvo varchar(120) not null,
  valor_minimo_toleravel numeric not null,
  valor_maximo_toleravel numeric not null,
  mensagem_customizada varchar(500),
  created_at timestamp not null default now(),
  constraint fk_parametrizacao_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint ck_valores_toleraveis check (valor_minimo_toleravel <= valor_maximo_toleravel),
  constraint uq_parametrizacao unique (login_id, metrica_alvo)
);

create table if not exists public.historicomanutencaodispositivo (
  id uuid primary key default gen_random_uuid(),
  login_id uuid not null,
  dispositivo_id uuid not null,
  data_manutencao timestamp not null default now(),
  tipo_intervencao tipo_intervencao not null,
  descricao_detalhada text,
  created_at timestamp not null default now(),
  constraint fk_manutencao_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint fk_manutencao_dispositivo
    foreign key (dispositivo_id) references public.dispositivo(id)
    on delete cascade
);

create index if not exists idx_manutencao_dispositivo on public.historicomanutencaodispositivo(dispositivo_id);
create index if not exists idx_manutencao_login on public.historicomanutencaodispositivo(login_id);

create table if not exists public.sessaotelemetria (
  id bigint generated always as identity primary key,
  login_id uuid not null,
  paciente_id uuid not null,
  data_hora timestamp not null default now(),
  fc_bpm int4 check (fc_bpm is null or (fc_bpm >= 0 and fc_bpm <= 300)),
  pa_sistolica int4 check (pa_sistolica is null or (pa_sistolica >= 0 and pa_sistolica <= 300)),
  pa_diastolica int4 check (pa_diastolica is null or (pa_diastolica >= 0 and pa_diastolica <= 200)),
  spo2 int4 check (spo2 is null or (spo2 >= 0 and spo2 <= 100)),
  vfc_rmssd int4,
  amplitude_ecg numeric,
  fluxo_cerebral int4,
  oxig_cerebral_fnirs int4,
  indice_alfa_beta numeric,
  status_geral status_geral not null default 'NORMAL',
  created_at timestamp not null default now(),
  constraint fk_sessao_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint fk_sessao_paciente
    foreign key (paciente_id) references public.perfilpaciente(id)
    on delete cascade
);

create index if not exists idx_sessao_login on public.sessaotelemetria(login_id);
create index if not exists idx_sessao_paciente on public.sessaotelemetria(paciente_id);
create index if not exists idx_sessao_data_hora on public.sessaotelemetria(data_hora);

create table if not exists public.sessaoecg_rawdata (
  id bigint generated always as identity primary key,
  login_id uuid not null,
  sessao_id bigint not null,
  frequencia_amostragem_hz int4 not null check (frequencia_amostragem_hz > 0),
  valores_sinal_mv text not null,
  created_at timestamp not null default now(),
  constraint fk_raw_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint fk_raw_sessao
    foreign key (sessao_id) references public.sessaotelemetria(id)
    on delete cascade
);

create index if not exists idx_raw_sessao_id on public.sessaoecg_rawdata(sessao_id);
create index if not exists idx_raw_login_id on public.sessaoecg_rawdata(login_id);

create table if not exists public.metricasondaseeg (
  id bigint generated always as identity primary key,
  login_id uuid not null,
  sessao_id bigint not null,
  delta int4,
  theta int4,
  alpha int4,
  beta int4,
  gamma int4,
  created_at timestamp not null default now(),
  constraint fk_eeg_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint fk_eeg_sessao
    foreign key (sessao_id) references public.sessaotelemetria(id)
    on delete cascade,
  constraint ck_metricas_eeg_nonneg
    check (
      (delta is null or delta >= 0) and
      (theta is null or theta >= 0) and
      (alpha is null or alpha >= 0) and
      (beta  is null or beta  >= 0) and
      (gamma is null or gamma >= 0)
    )
);

create index if not exists idx_eeg_sessao on public.metricasondaseeg(sessao_id);
create index if not exists idx_eeg_login on public.metricasondaseeg(login_id);

create table if not exists public.analiseiaeriscos (
  id uuid primary key default gen_random_uuid(),
  login_id uuid not null,
  paciente_id uuid not null,
  score_geral int4 check (score_geral >= 0 and score_geral <= 100),
  risco_vascular int4 check (risco_vascular >= 0 and risco_vascular <= 100),
  risco_cerebral int4 check (risco_cerebral >= 0 and risco_cerebral <= 100),
  risco_cardiaco int4 check (risco_cardiaco >= 0 and risco_cardiaco <= 100),
  classificacao_texto varchar(200),
  created_at timestamp not null default now(),
  constraint fk_analise_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint fk_analise_paciente
    foreign key (paciente_id) references public.perfilpaciente(id)
    on delete cascade
);

create index if not exists idx_analise_paciente on public.analiseiaeriscos(paciente_id);
create index if not exists idx_analise_login on public.analiseiaeriscos(login_id);

create table if not exists public.recomendacaosistema (
  id uuid primary key default gen_random_uuid(),
  login_id uuid not null,
  analise_id uuid not null,
  categoria categoria_alerta not null,
  descricao text not null,
  created_at timestamp not null default now(),
  constraint fk_reco_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint fk_reco_analise
    foreign key (analise_id) references public.analiseiaeriscos(id)
    on delete cascade
);

create index if not exists idx_reco_analise on public.recomendacaosistema(analise_id);
create index if not exists idx_reco_login on public.recomendacaosistema(login_id);

create table if not exists public.alertasistema (
  id uuid primary key default gen_random_uuid(),
  login_id uuid not null,
  paciente_id uuid not null,
  data_hora timestamp not null default now(),
  tipo_sensor varchar(120) not null,
  mensagem varchar(500) not null,
  criticidade criticidade_alerta not null default 'INFO',
  created_at timestamp not null default now(),
  constraint fk_alert_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint fk_alert_paciente
    foreign key (paciente_id) references public.perfilpaciente(id)
    on delete cascade
);

create index if not exists idx_alert_paciente on public.alertasistema(paciente_id);
create index if not exists idx_alert_login on public.alertasistema(login_id);
create index if not exists idx_alert_data_hora on public.alertasistema(data_hora);

create table if not exists public.logexportacaodados (
  id uuid primary key default gen_random_uuid(),
  login_id uuid not null,
  paciente_id uuid not null,
  data_hora_solicitacao timestamp not null default now(),
  formato_arquivo varchar(50) not null,
  status_operacao varchar(20) not null,
  created_at timestamp not null default now(),
  constraint fk_export_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint fk_export_paciente
    foreign key (paciente_id) references public.perfilpaciente(id)
    on delete cascade,
  constraint ck_export_status
    check (status_operacao in ('SUCESSO', 'FALHA'))
);

create index if not exists idx_export_paciente on public.logexportacaodados(paciente_id);
create index if not exists idx_export_login on public.logexportacaodados(login_id);
create index if not exists idx_export_data_hora on public.logexportacaodados(data_hora_solicitacao);

create table if not exists public.loginteracaoia (
  id uuid primary key default gen_random_uuid(),
  login_id uuid not null,
  contexto_paciente_id uuid not null,
  pergunta_usuario text not null,
  resposta_ia text not null,
  tokens_consumidos int4 check (tokens_consumidos is null or tokens_consumidos >= 0),
  data_hora_mensagem timestamp not null default now(),
  created_at timestamp not null default now(),
  constraint fk_interacao_login
    foreign key (login_id) references public.login(id)
    on delete cascade,
  constraint fk_interacao_paciente
    foreign key (contexto_paciente_id) references public.perfilpaciente(id)
    on delete cascade
);

create index if not exists idx_interacao_paciente on public.loginteracaoia(contexto_paciente_id);
create index if not exists idx_interacao_login on public.loginteracaoia(login_id);

create table if not exists public.chatmensagens (
  id uuid primary key,
  author_id varchar(120) not null,
  author varchar(120) not null,
  text text not null,
  created_at timestamp not null default now()
);

create index if not exists idx_chatmensagens_created_at on public.chatmensagens(created_at);