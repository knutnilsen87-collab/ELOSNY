-- SQL Schema v1 for Evida core workflow.

create table matters (
  id text primary key,
  title text not null,
  client text not null,
  status text not null,
  created_at text not null,
  updated_at text not null
);

create table documents (
  id text primary key,
  matter_id text not null references matters(id),
  name text not null,
  type text not null,
  status text not null,
  created_at text not null
);

create table document_versions (
  id text primary key,
  document_id text not null references documents(id),
  matter_id text not null references matters(id),
  content_hash text not null,
  created_at text not null
);

create table facts (
  id text primary key,
  matter_id text not null references matters(id),
  statement text not null,
  confidence real not null,
  status text not null,
  created_by text not null,
  reviewed_by text,
  reviewed_at text,
  created_at text not null
);

create table source_refs (
  id text primary key,
  matter_id text not null references matters(id),
  fact_id text references facts(id),
  document_id text not null references documents(id),
  document_version_id text not null references document_versions(id),
  page integer,
  paragraph text,
  excerpt_hash text not null
);

create table evidence (
  id text primary key,
  matter_id text not null references matters(id),
  fact_id text not null references facts(id),
  document_id text not null references documents(id),
  strength text not null,
  status text not null
);

create table drafts (
  id text primary key,
  matter_id text not null references matters(id),
  title text not null,
  version integer not null,
  status text not null,
  content text not null,
  changed_after_review integer not null default 0,
  created_at text not null,
  updated_at text not null
);

create table verification_results (
  id text primary key,
  matter_id text not null references matters(id),
  draft_id text not null references drafts(id),
  draft_version integer not null,
  status text not null,
  source_coverage real not null,
  residual_risk text not null,
  created_at text not null
);

create table review_decisions (
  id text primary key,
  matter_id text not null references matters(id),
  draft_id text not null references drafts(id),
  draft_version integer not null,
  verification_result_id text not null references verification_results(id),
  decision text not null,
  reviewer text not null,
  comment text,
  created_at text not null
);

create table export_packages (
  id text primary key,
  matter_id text not null references matters(id),
  draft_id text not null references drafts(id),
  draft_version integer not null,
  status text not null,
  created_at text not null
);

create table audit_events (
  id text primary key,
  matter_id text not null references matters(id),
  type text not null,
  payload_json text not null,
  created_at text not null
);

create table ai_jobs (
  id text primary key,
  matter_id text not null references matters(id),
  document_id text references documents(id),
  type text not null,
  status text not null,
  created_at text not null,
  completed_at text
);
