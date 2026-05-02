import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Calendar, Check, Trash2, Edit3, MoreHorizontal, Phone, Mail, Building2, ArrowLeft, GripVertical, Trophy, XCircle, ExternalLink, ChevronDown, PawPrint, TrendingUp, Users, AlertCircle, Clock, Repeat, Receipt, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'crm-data-v1';

const DEFAULT_STAGES = [
  { id: 's1', name: 'Inicio de contacto' },
  { id: 's2', name: 'Contactado' },
  { id: 's3', name: 'Presupuesto enviado' },
];

const STAGE_ACCENTS = ['#c8553d', '#d4a574', '#7a8b6f', '#5a7a8a', '#9a6a8a', '#8a7a5a'];

const uid = () => Math.random().toString(36).slice(2, 10);

// ────────────────────────────────────────────────
// STYLES
// ────────────────────────────────────────────────
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=DM+Sans:opsz,wght@9..40,300..700&family=JetBrains+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }

.crm-root {
  --bg: #faf7f2;
  --surface: #ffffff;
  --surface-2: #f4efe6;
  --border: #e8e2d6;
  --border-strong: #d4ccbc;
  --ink: #1a1815;
  --ink-2: #4a4640;
  --muted: #8a8478;
  --accent: #2d5a3f;
  --accent-soft: #e8f0e8;
  --won: #2d5a3f;
  --lost: #a04545;
  --warn: #c8553d;
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-feature-settings: 'ss01';
  color: var(--ink);
  background: var(--bg);
  min-height: 100vh;
  letter-spacing: -0.005em;
}

.crm-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(rgba(26, 24, 21, 0.025) 1px, transparent 1px);
  background-size: 4px 4px;
  pointer-events: none;
  z-index: 0;
}

.serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; letter-spacing: -0.02em; }
.mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: 'tnum'; }
.smallcaps {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 11px;
  font-weight: 500;
}

button { font-family: inherit; cursor: pointer; }
input, textarea, select { font-family: inherit; }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--ink);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}
.btn:hover { border-color: var(--ink-2); }
.btn-primary {
  background: var(--ink);
  color: var(--bg);
  border-color: var(--ink);
}
.btn-primary:hover { background: var(--accent); border-color: var(--accent); }
.btn-ghost { border-color: transparent; background: transparent; }
.btn-ghost:hover { background: var(--surface-2); }
.btn-danger:hover { color: var(--lost); border-color: var(--lost); }

.input, .textarea, .select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  background: var(--surface);
  font-size: 14px;
  color: var(--ink);
  outline: none;
  transition: border-color 0.15s;
}
.input:focus, .textarea:focus, .select:focus {
  border-color: var(--ink);
}
.textarea { resize: vertical; min-height: 70px; font-family: inherit; }

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin-bottom: 6px;
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(250, 247, 242, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  padding: 18px 32px;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;
}
.brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.brand-mark {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--bg);
  display: inline-grid;
  place-items: center;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 600;
  font-size: 15px;
  align-self: center;
}
.brand-name {
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: 22px;
  letter-spacing: -0.02em;
}
.brand-name em { color: var(--accent); font-style: italic; font-weight: 400;}
.tabs {
  display: flex;
  gap: 4px;
  background: var(--surface-2);
  padding: 4px;
  border-radius: 8px;
}
.tab {
  padding: 7px 16px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-2);
  border-radius: 5px;
  transition: all 0.15s;
}
.tab.active {
  background: var(--surface);
  color: var(--ink);
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

/* Page container */
.page {
  position: relative;
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px;
  z-index: 1;
}
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 24px;
}
.page-title {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 56px;
  line-height: 1;
  letter-spacing: -0.035em;
}
.page-sub {
  margin-top: 8px;
  color: var(--muted);
  font-size: 14px;
  max-width: 480px;
}
.head-actions { display: flex; gap: 10px; }

/* Kanban */
.kanban {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 24px;
  margin: 0 -32px;
  padding-left: 32px;
  padding-right: 32px;
  scrollbar-width: thin;
}
.kanban::-webkit-scrollbar { height: 8px; }
.kanban::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }

.column {
  flex: 0 0 290px;
  display: flex;
  flex-direction: column;
  background: rgba(244, 239, 230, 0.55);
  border-radius: 10px;
  border: 1px solid var(--border);
}
.column-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 10px;
}
.col-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
}
.col-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.col-count {
  font-family: 'JetBrains Mono', monospace;
  color: var(--muted);
  font-size: 11px;
  background: var(--surface);
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid var(--border);
}
.col-actions { display: flex; gap: 2px; }
.icon-btn {
  border: none;
  background: transparent;
  color: var(--muted);
  padding: 4px;
  border-radius: 4px;
  display: inline-grid;
  place-items: center;
  transition: all 0.15s;
}
.icon-btn:hover { background: var(--surface); color: var(--ink); }

.col-body {
  flex: 1;
  padding: 4px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 50px;
}
.col-body.drag-over {
  background: var(--accent-soft);
  border-radius: 8px;
}
.col-empty {
  padding: 20px 10px;
  text-align: center;
  color: var(--muted);
  font-size: 12px;
  font-style: italic;
  border: 1px dashed var(--border-strong);
  border-radius: 6px;
}

/* Card */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
  box-shadow: 0 1px 2px rgba(26, 24, 21, 0.03);
}
.card:hover {
  border-color: var(--border-strong);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 24, 21, 0.06);
}
.card.dragging { opacity: 0.4; }
.card-contact {
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  font-weight: 500;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.card-title {
  font-family: 'Fraunces', serif;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.25;
  margin-bottom: 8px;
}
.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--border);
}
.card-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink);
}
.card-tasks {
  font-size: 11px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 4px;
}
.card-tasks.has-due {
  color: var(--warn);
  font-weight: 500;
}

.card.won { border-left: 3px solid var(--won); background: linear-gradient(to right, rgba(45, 90, 63, 0.04), var(--surface) 30%); }
.card.lost { border-left: 3px solid var(--lost); opacity: 0.75; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 24, 21, 0.35);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 20px;
  animation: fadeIn 0.2s;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.modal {
  background: var(--bg);
  border-radius: 12px;
  border: 1px solid var(--border);
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  animation: slideUp 0.2s;
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 1;
}
.modal-title {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 24px;
  font-weight: 400;
}
.modal-body { padding: 22px 24px; }
.modal-section { margin-bottom: 22px; }
.modal-section:last-child { margin-bottom: 0; }
.modal-section h3 {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin: 0 0 10px;
}

.row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.row-3 { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; }

/* Status pills */
.status-row { display: flex; gap: 8px; padding: 12px 24px; background: var(--surface-2); border-bottom: 1px solid var(--border); }
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.status-pill.won { background: var(--accent-soft); color: var(--won); }
.status-pill.lost { background: rgba(160, 69, 69, 0.1); color: var(--lost); }
.status-pill.active { background: var(--surface); color: var(--ink-2); border: 1px solid var(--border); }

/* Tasks */
.task {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 6px;
  transition: all 0.15s;
}
.task.done { opacity: 0.6; }
.task.done .task-title { text-decoration: line-through; }
.task-check {
  width: 18px; height: 18px;
  border: 1.5px solid var(--border-strong);
  border-radius: 4px;
  display: grid;
  place-items: center;
  background: var(--surface);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
}
.task-check.checked {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}
.task-content { flex: 1; min-width: 0; }
.task-title { font-size: 13.5px; font-weight: 500; }
.task-due {
  font-size: 11px;
  color: var(--muted);
  font-family: 'JetBrains Mono', monospace;
  margin-top: 2px;
}
.task-due.overdue { color: var(--warn); font-weight: 500;}
.task-actions { display: flex; gap: 2px; }

.task-form {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px;
  margin-top: 10px;
}

/* Contacts */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}
.contact-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px;
  transition: all 0.15s;
}
.contact-card:hover { border-color: var(--border-strong); box-shadow: 0 4px 12px rgba(26, 24, 21, 0.05); }
.contact-name {
  font-family: 'Fraunces', serif;
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}
.contact-company { font-size: 12.5px; color: var(--muted); margin-bottom: 12px; }
.contact-pet {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--ink-2);
  background: var(--surface-2);
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 12px;
  margin-top: 2px;
}
.contact-pet strong { color: var(--ink); font-weight: 600; }

/* Drop zones for Won/Lost */
.drop-zones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 16px;
  transition: all 0.25s;
}
.drop-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 14px;
  border: 2px dashed var(--border-strong);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  background: rgba(244, 239, 230, 0.3);
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.drop-zones.dragging .drop-zone { padding: 28px 14px; }
.drop-zone.won.dragging {
  border-color: var(--won);
  color: var(--won);
  background: var(--accent-soft);
}
.drop-zone.lost.dragging {
  border-color: var(--lost);
  color: var(--lost);
  background: rgba(160, 69, 69, 0.06);
}
.drop-zone.over {
  transform: scale(1.015);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.drop-zone.won.over {
  background: rgba(45, 90, 63, 0.12);
  border-style: solid;
}
.drop-zone.lost.over {
  background: rgba(160, 69, 69, 0.12);
  border-style: solid;
}
.contact-line {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: var(--ink-2);
  margin-bottom: 4px;
}
.contact-stats {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 16px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}
.contact-stats strong { font-family: 'JetBrains Mono', monospace; color: var(--ink); font-size: 13px; }

/* Empty state */
.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--muted);
}
.empty-title {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 28px;
  margin-bottom: 8px;
  color: var(--ink);
}
.empty-text { font-size: 14px; max-width: 400px; margin: 0 auto 20px; }

/* Stage manager */
.stage-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 6px;
}
.stage-row input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  padding: 4px;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--ink);
  color: var(--bg);
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 13px;
  z-index: 100;
  animation: slideUp 0.2s;
}

/* Dashboard */
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 28px;
}
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px 20px;
  position: relative;
  overflow: hidden;
}
.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 3px;
  height: 100%;
  background: var(--stat-accent, var(--accent));
}
.stat-icon {
  display: inline-grid;
  place-items: center;
  width: 30px; height: 30px;
  background: var(--stat-soft, var(--accent-soft));
  color: var(--stat-accent, var(--accent));
  border-radius: 7px;
  margin-bottom: 12px;
}
.stat-label {
  text-transform: uppercase;
  font-size: 10.5px;
  letter-spacing: 0.12em;
  color: var(--muted);
  margin-bottom: 6px;
  font-weight: 500;
}
.stat-value {
  font-family: 'Fraunces', serif;
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1;
  font-feature-settings: 'tnum';
}
.stat-foot {
  font-size: 11.5px;
  color: var(--muted);
  margin-top: 8px;
}

.dashboard-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 22px 24px;
}
.panel-title {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.panel-sub {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 16px;
}
.panel-empty {
  font-size: 13px;
  color: var(--muted);
  font-style: italic;
  padding: 24px 0;
  text-align: center;
}

.top-row {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.top-row:last-child { border-bottom: none; }
.top-rank {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 18px;
  color: var(--muted);
  font-weight: 500;
}
.top-name {
  font-size: 14px;
  font-weight: 500;
}
.top-meta {
  font-size: 11.5px;
  color: var(--muted);
  margin-top: 2px;
}
.top-amount {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13.5px;
  font-weight: 500;
  text-align: right;
}

.dash-task {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.dash-task:last-child { border-bottom: none; }
.dash-task-content { flex: 1; min-width: 0; }
.dash-task-title { font-size: 13.5px; font-weight: 500; line-height: 1.35; }
.dash-task-context {
  font-size: 11.5px;
  color: var(--muted);
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.dash-task-when {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--ink-2);
  white-space: nowrap;
  flex-shrink: 0;
}
.dash-task-when.overdue {
  background: rgba(200, 85, 61, 0.1);
  color: var(--warn);
  font-weight: 500;
}
.dash-task-auto {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--accent-soft);
  color: var(--accent);
  padding: 1px 6px;
  border-radius: 3px;
  margin-left: 6px;
  font-weight: 500;
}
.dash-task.done { opacity: 0.5; }
.dash-task.done .dash-task-title { text-decoration: line-through; }

@media (max-width: 1024px) {
  .dashboard-stats { grid-template-columns: repeat(2, 1fr); }
  .dashboard-cols { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .dashboard-stats { grid-template-columns: 1fr; }
  .header { padding: 14px 16px; }
  .page { padding: 20px 16px; }
  .page-title { font-size: 38px; }
  .kanban { margin: 0 -16px; padding-left: 16px; padding-right: 16px; }
  .row, .row-3 { grid-template-columns: 1fr; }
  .header-inner { flex-direction: column; align-items: stretch; }
}
`;

// ────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────
function formatMoney(n) {
  if (!n && n !== 0) return '—';
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function isOverdue(iso) {
  return iso && new Date(iso) < new Date();
}

function relativeTime(iso) {
  if (!iso) return '';
  const now = new Date();
  const d = new Date(iso);
  const diffMs = d - now;
  const isPast = diffMs < 0;
  const absMs = Math.abs(diffMs);
  const days = Math.floor(absMs / 86400000);
  const hours = Math.floor((absMs % 86400000) / 3600000);
  if (days >= 1) {
    if (isPast) return `hace ${days}d`;
    if (days === 1) return 'mañana';
    return `en ${days}d`;
  }
  if (hours >= 1) return isPast ? `hace ${hours}h` : `en ${hours}h`;
  return isPast ? 'recién venció' : 'pronto';
}

function gcalUrl(task) {
  if (!task.dueDate) return '#';
  const start = new Date(task.dueDate);
  const end = new Date(start.getTime() + 30 * 60000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: task.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: task.description || '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadIcs(task) {
  if (!task.dueDate) return;
  const start = new Date(task.dueDate);
  const end = new Date(start.getTime() + 30 * 60000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CRM//ES',
    'BEGIN:VEVENT',
    `UID:${task.id}@crm`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${task.title}`,
    `DESCRIPTION:${(task.description || '').replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${task.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

// ────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────
export default function CRM() {
  const [view, setView] = useState('pipeline');
  const [contacts, setContacts] = useState([]);
  const [stages, setStages] = useState(DEFAULT_STAGES);
  const [opportunities, setOpportunities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const [selectedOpp, setSelectedOpp] = useState(null);
  const [showNewOpp, setShowNewOpp] = useState(false);
  const [showNewContact, setShowNewContact] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showStageMgr, setShowStageMgr] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  // Load
  useEffect(() => {
    (async () => {
      try {
        console.log('[APP] llamando a storage.get...');
        const res = await window.storage.get(STORAGE_KEY);
        console.log('[APP] respuesta de storage:', res);
        if (res && res.value) {
          const data = JSON.parse(res.value);
          console.log('[APP] datos parseados:', data);
          console.log('[APP] contacts:', data.contacts);
          setContacts(data.contacts || []);
          setStages(data.stages || DEFAULT_STAGES);
          setOpportunities(data.opportunities || []);
          setTasks(data.tasks || []);
        } else {
          console.log('[APP] sin datos — empezando vacío');
        }
      } catch (e) {
        console.error('[APP] error:', e);
      }
      setLoading(false);
    })();
  }, []);

  // Save (debounced)
  const saveTimerRef = useRef(null);
  useEffect(() => {
    if (loading) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify({ contacts, stages, opportunities, tasks }));
      } catch (e) {
        showToast('No se pudo guardar');
      }
    }, 400);
    return () => clearTimeout(saveTimerRef.current);
  }, [contacts, stages, opportunities, tasks, loading]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  // CONTACT actions
  function saveContact(data) {
    if (data.id) {
      setContacts(contacts.map(c => c.id === data.id ? data : c));
      showToast('Contacto actualizado');
    } else {
      setContacts([...contacts, { ...data, id: uid() }]);
      showToast('Contacto agregado');
    }
    setShowNewContact(false);
    setEditingContact(null);
  }
  function deleteContact(id) {
    if (!confirm('¿Eliminar este contacto y todas sus oportunidades?')) return;
    const oppIds = opportunities.filter(o => o.contactId === id).map(o => o.id);
    setOpportunities(opportunities.filter(o => o.contactId !== id));
    setTasks(tasks.filter(t => !oppIds.includes(t.opportunityId) && t.contactId !== id));
    setContacts(contacts.filter(c => c.id !== id));
    showToast('Contacto eliminado');
  }

  // OPP actions
  function saveOpp(data) {
    if (data.id) {
      setOpportunities(opportunities.map(o => o.id === data.id ? data : o));
      showToast('Oportunidad actualizada');
    } else {
      const newOpp = { ...data, id: uid(), status: 'active', createdAt: new Date().toISOString() };
      setOpportunities([...opportunities, newOpp]);
      showToast('Oportunidad creada');
    }
    setShowNewOpp(false);
  }
  function deleteOpp(id) {
    if (!confirm('¿Eliminar esta oportunidad y sus tareas?')) return;
    setOpportunities(opportunities.filter(o => o.id !== id));
    setTasks(tasks.filter(t => t.opportunityId !== id));
    setSelectedOpp(null);
    showToast('Oportunidad eliminada');
  }
  function setOppStatus(id, status) {
    const opp = opportunities.find(o => o.id === id);
    const wasWon = opp?.status === 'won';
    setOpportunities(opportunities.map(o => o.id === id ? { ...o, status, closedAt: status !== 'active' ? new Date().toISOString() : null } : o));
    if (selectedOpp?.id === id) setSelectedOpp({ ...selectedOpp, status });

    // Auto-generate follow-up task on win (only on transition to won)
    let autoTaskCreated = false;
    if (status === 'won' && !wasWon && opp) {
      const contact = contacts.find(c => c.id === opp.contactId);
      const freq = Number(contact?.purchaseFrequency);
      if (contact && freq > 0) {
        const days = Math.max(0, freq - 1);
        const due = new Date();
        due.setDate(due.getDate() + days);
        due.setHours(9, 0, 0, 0);
        const newTask = {
          id: uid(),
          contactId: contact.id,
          opportunityId: null,
          title: `Contactar a ${contact.name} — próxima compra`,
          description: `Seguimiento automático. Frecuencia de compra: ${freq} días. Última oportunidad ganada: "${opp.title}".`,
          dueDate: due.toISOString(),
          completed: false,
          autoGenerated: true,
        };
        setTasks([...tasks, newTask]);
        autoTaskCreated = true;
      }
    }

    if (status === 'won') {
      showToast(autoTaskCreated ? '🏆 Ganada · tarea de seguimiento creada' : '🏆 Marcada como ganada');
    } else if (status === 'lost') {
      showToast('Marcada como perdida');
    } else {
      showToast('Reabierta');
    }
  }
  function moveOpp(id, stageId) {
    setOpportunities(opportunities.map(o => o.id === id ? { ...o, stageId } : o));
  }

  // TASK actions
  function addTask(opportunityId, data) {
    setTasks([...tasks, { ...data, id: uid(), opportunityId, completed: false }]);
  }
  function toggleTask(id) {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }
  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  // STAGE actions
  function saveStages(newStages) {
    setStages(newStages);
    showToast('Etapas actualizadas');
    setShowStageMgr(false);
  }

  // Selectors
  const activeOpps = opportunities.filter(o => o.status === 'active');
  const closedOpps = opportunities.filter(o => o.status !== 'active');
  const tasksByOpp = (oppId) => tasks.filter(t => t.opportunityId === oppId);
  const nextDueTask = (oppId) => tasksByOpp(oppId)
    .filter(t => !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
  const contactById = (id) => contacts.find(c => c.id === id);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="crm-root" style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
          <div style={{ color: 'var(--muted)', fontStyle: 'italic' }} className="serif">cargando…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="crm-root">
        {/* HEADER */}
        <header className="header">
          <div className="header-inner">
            <div className="brand">
              <span className="brand-mark">e</span>
              <span className="brand-name">embudo<em>.</em></span>
            </div>
            <div className="tabs">
              <button className={`tab ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>Dashboard</button>
              <button className={`tab ${view === 'pipeline' ? 'active' : ''}`} onClick={() => setView('pipeline')}>Pipeline</button>
              <button className={`tab ${view === 'contacts' ? 'active' : ''}`} onClick={() => setView('contacts')}>Contactos</button>
              <button className={`tab ${view === 'closed' ? 'active' : ''}`} onClick={() => setView('closed')}>Cerradas</button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={() => setShowStageMgr(true)}>
                <Edit3 size={14} /> Etapas
              </button>
              <button className="btn btn-primary" onClick={() => {
                if (contacts.length === 0) {
                  setShowNewContact(true);
                  showToast('Primero agregá un contacto');
                } else {
                  setShowNewOpp(true);
                }
              }}>
                <Plus size={14} /> Oportunidad
              </button>
            </div>
          </div>
        </header>

        <main className="page">
          {view === 'dashboard' && (
            <DashboardView
              opportunities={opportunities}
              contacts={contacts}
              tasks={tasks}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onOppClick={setSelectedOpp}
            />
          )}

          {view === 'pipeline' && (
            <PipelineView
              stages={stages}
              opps={activeOpps}
              contactById={contactById}
              tasksByOpp={tasksByOpp}
              nextDueTask={nextDueTask}
              onCardClick={setSelectedOpp}
              onDragStart={setDraggingId}
              onDragEnd={() => { setDraggingId(null); setDragOverStage(null); }}
              draggingId={draggingId}
              dragOverStage={dragOverStage}
              setDragOverStage={setDragOverStage}
              onDrop={(stageId) => {
                if (draggingId) moveOpp(draggingId, stageId);
                setDraggingId(null);
                setDragOverStage(null);
              }}
              onNewInStage={(stageId) => {
                if (contacts.length === 0) {
                  setShowNewContact(true);
                  showToast('Primero agregá un contacto');
                } else {
                  setShowNewOpp({ stageId });
                }
              }}
              onDropStatus={(status) => {
                if (draggingId) {
                  setOppStatus(draggingId, status);
                }
                setDraggingId(null);
              }}
            />
          )}

          {view === 'contacts' && (
            <ContactsView
              contacts={contacts}
              opportunities={opportunities}
              onNew={() => setShowNewContact(true)}
              onEdit={setEditingContact}
              onDelete={deleteContact}
            />
          )}

          {view === 'closed' && (
            <ClosedView
              opps={closedOpps}
              contactById={contactById}
              onCardClick={setSelectedOpp}
            />
          )}
        </main>

        {/* MODALS */}
        {selectedOpp && (
          <OpportunityDetail
            opp={selectedOpp}
            contact={contactById(selectedOpp.contactId)}
            stages={stages}
            tasks={tasksByOpp(selectedOpp.id)}
            onClose={() => setSelectedOpp(null)}
            onSave={(data) => { saveOpp(data); setSelectedOpp(data); }}
            onDelete={() => deleteOpp(selectedOpp.id)}
            onStatus={(s) => setOppStatus(selectedOpp.id, s)}
            onAddTask={(data) => addTask(selectedOpp.id, data)}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        )}

        {showNewOpp && (
          <OpportunityForm
            contacts={contacts}
            stages={stages}
            initial={typeof showNewOpp === 'object' ? { stageId: showNewOpp.stageId } : null}
            onSave={saveOpp}
            onClose={() => setShowNewOpp(false)}
            onNewContact={() => { setShowNewOpp(false); setShowNewContact(true); }}
          />
        )}

        {(showNewContact || editingContact) && (
          <ContactForm
            initial={editingContact}
            onSave={saveContact}
            onClose={() => { setShowNewContact(false); setEditingContact(null); }}
          />
        )}

        {showStageMgr && (
          <StageManager
            stages={stages}
            opportunities={opportunities}
            onSave={saveStages}
            onClose={() => setShowStageMgr(false)}
          />
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

// ────────────────────────────────────────────────
// PIPELINE VIEW
// ────────────────────────────────────────────────
function PipelineView({ stages, opps, contactById, tasksByOpp, nextDueTask, onCardClick, onDragStart, onDragEnd, draggingId, dragOverStage, setDragOverStage, onDrop, onNewInStage, onDropStatus }) {
  const totalValue = opps.reduce((s, o) => s + (Number(o.value) || 0), 0);
  const [dragOverZone, setDragOverZone] = useState(null);
  const isDragging = !!draggingId;

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Pipeline</h1>
          <p className="page-sub">{opps.length} oportunidades activas — valor total {formatMoney(totalValue)}</p>
        </div>
      </div>

      {opps.length === 0 && stages.length > 0 && (
        <div className="empty">
          <div className="empty-title">Pizarra en blanco</div>
          <div className="empty-text">Empezá agregando un contacto y luego una oportunidad. Las verás moverse por el embudo.</div>
        </div>
      )}

      <div className="kanban">
        {stages.map((stage, idx) => {
          const colOpps = opps.filter(o => o.stageId === stage.id);
          const accent = STAGE_ACCENTS[idx % STAGE_ACCENTS.length];
          return (
            <div
              key={stage.id}
              className="column"
              onDragOver={(e) => { e.preventDefault(); setDragOverStage(stage.id); }}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={() => onDrop(stage.id)}
            >
              <div className="column-head">
                <div className="col-title">
                  <span className="col-dot" style={{ background: accent }}></span>
                  {stage.name}
                  <span className="col-count">{colOpps.length}</span>
                </div>
                <div className="col-actions">
                  <button className="icon-btn" onClick={() => onNewInStage(stage.id)} title="Nueva oportunidad aquí">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className={`col-body ${dragOverStage === stage.id ? 'drag-over' : ''}`}>
                {colOpps.length === 0 && <div className="col-empty">vacío</div>}
                {colOpps.map(opp => {
                  const c = contactById(opp.contactId);
                  const ts = tasksByOpp(opp.id);
                  const next = nextDueTask(opp.id);
                  const pendingTasks = ts.filter(t => !t.completed).length;
                  return (
                    <div
                      key={opp.id}
                      className={`card ${draggingId === opp.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={() => onDragStart(opp.id)}
                      onDragEnd={onDragEnd}
                      onClick={() => onCardClick(opp)}
                    >
                      <div className="card-contact">
                        {c ? c.name : 'Sin contacto'}
                      </div>
                      <div className="card-title">{opp.title}</div>
                      <div className="card-meta">
                        <span className="card-value">{formatMoney(opp.value)}</span>
                        {next ? (
                          <span className={`card-tasks ${isOverdue(next.dueDate) ? 'has-due' : ''}`}>
                            <Calendar size={11} /> {formatDateTime(next.dueDate)}
                          </span>
                        ) : pendingTasks > 0 ? (
                          <span className="card-tasks"><Check size={11} /> {pendingTasks} tarea{pendingTasks !== 1 ? 's' : ''}</span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`drop-zones ${isDragging ? 'dragging' : ''}`}>
        <div
          className={`drop-zone won ${isDragging ? 'dragging' : ''} ${dragOverZone === 'won' ? 'over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOverZone('won'); }}
          onDragLeave={() => setDragOverZone(null)}
          onDrop={() => { onDropStatus('won'); setDragOverZone(null); }}
        >
          <Trophy size={16} />
          {isDragging ? 'Soltar aquí para ganar' : 'Ganadas'}
        </div>
        <div
          className={`drop-zone lost ${isDragging ? 'dragging' : ''} ${dragOverZone === 'lost' ? 'over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOverZone('lost'); }}
          onDragLeave={() => setDragOverZone(null)}
          onDrop={() => { onDropStatus('lost'); setDragOverZone(null); }}
        >
          <XCircle size={16} />
          {isDragging ? 'Soltar aquí para perder' : 'Perdidas'}
        </div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────
// CONTACTS VIEW
// ────────────────────────────────────────────────
function ContactsView({ contacts, opportunities, onNew, onEdit, onDelete }) {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Contactos</h1>
          <p className="page-sub">{contacts.length} {contacts.length === 1 ? 'persona' : 'personas'} en tu agenda comercial.</p>
        </div>
        <div className="head-actions">
          <button className="btn btn-primary" onClick={onNew}><Plus size={14} /> Nuevo contacto</button>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="empty">
          <div className="empty-title">Sin contactos todavía</div>
          <div className="empty-text">Agregá tu primer contacto para empezar a registrar oportunidades.</div>
          <button className="btn btn-primary" onClick={onNew}><Plus size={14} /> Agregar contacto</button>
        </div>
      ) : (
        <div className="contact-grid">
          {contacts.map(c => {
            const oppsList = opportunities.filter(o => o.contactId === c.id);
            const active = oppsList.filter(o => o.status === 'active').length;
            const won = oppsList.filter(o => o.status === 'won').length;
            return (
              <div key={c.id} className="contact-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="contact-name">{c.name}</div>
                    {c.petName && (
                      <div className="contact-pet">
                        <PawPrint size={12} />
                        <span>
                          <strong>{c.petName}</strong>
                          {c.petType && ` · ${c.petType}`}
                          {c.petBreed && ` · ${c.petBreed}`}
                          {c.petAge && ` · ${c.petAge} ${Number(c.petAge) === 1 ? 'año' : 'años'}`}
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    <button className="icon-btn" onClick={() => onEdit(c)} title="Editar"><Edit3 size={14} /></button>
                    <button className="icon-btn" onClick={() => onDelete(c.id)} title="Eliminar"><Trash2 size={14} /></button>
                  </div>
                </div>
                {c.email && <div className="contact-line"><Mail size={12} /> {c.email}</div>}
                {c.phone && <div className="contact-line"><Phone size={12} /> {c.phone}</div>}
                {c.purchaseFrequency && <div className="contact-line"><Repeat size={12} /> compra cada {c.purchaseFrequency} días</div>}
                {c.notes && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>{c.notes}</div>}
                <div className="contact-stats">
                  <span><strong>{active}</strong> activas</span>
                  <span><strong>{won}</strong> ganadas</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ────────────────────────────────────────────────
// CLOSED VIEW
// ────────────────────────────────────────────────
function ClosedView({ opps, contactById, onCardClick }) {
  const won = opps.filter(o => o.status === 'won');
  const lost = opps.filter(o => o.status === 'lost');
  const wonValue = won.reduce((s, o) => s + (Number(o.value) || 0), 0);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Cerradas</h1>
          <p className="page-sub">{won.length} ganadas por {formatMoney(wonValue)} · {lost.length} perdidas.</p>
        </div>
      </div>

      {opps.length === 0 ? (
        <div className="empty">
          <div className="empty-title">Aún no cerraste nada</div>
          <div className="empty-text">Cuando ganes o pierdas una oportunidad aparecerá acá.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {opps.map(opp => {
            const c = contactById(opp.contactId);
            return (
              <div key={opp.id} className={`card ${opp.status}`} onClick={() => onCardClick(opp)} style={{ cursor: 'pointer' }}>
                <div className="card-contact">
                  {opp.status === 'won' ? <Trophy size={11} /> : <XCircle size={11} />}
                  {c ? c.name : 'Sin contacto'}
                </div>
                <div className="card-title">{opp.title}</div>
                <div className="card-meta">
                  <span className="card-value">{formatMoney(opp.value)}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {opp.closedAt && new Date(opp.closedAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ────────────────────────────────────────────────
// OPPORTUNITY DETAIL MODAL
// ────────────────────────────────────────────────
function OpportunityDetail({ opp, contact, stages, tasks, onClose, onSave, onDelete, onStatus, onAddTask, onToggleTask, onDeleteTask }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...opp });
  const [showTaskForm, setShowTaskForm] = useState(false);

  function handleSave() {
    onSave({ ...opp, ...form });
    setEditing(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 4 }}>
              {contact ? contact.name : 'Sin contacto'}{contact?.petName ? ` · 🐾 ${contact.petName}` : ''}
            </div>
            {editing ? (
              <input className="input" style={{ fontSize: 22, fontFamily: 'Fraunces, serif', fontStyle: 'italic', padding: 6 }} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} autoFocus />
            ) : (
              <div className="modal-title">{opp.title}</div>
            )}
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="status-row">
          <span className={`status-pill ${opp.status}`}>
            {opp.status === 'won' && <><Trophy size={11} /> Ganada</>}
            {opp.status === 'lost' && <><XCircle size={11} /> Perdida</>}
            {opp.status === 'active' && <>● Activa</>}
          </span>
          {opp.status === 'active' ? (
            <>
              <button className="btn" style={{ marginLeft: 'auto', color: 'var(--won)' }} onClick={() => onStatus('won')}>
                <Trophy size={14} /> Ganar
              </button>
              <button className="btn" style={{ color: 'var(--lost)' }} onClick={() => onStatus('lost')}>
                <XCircle size={14} /> Perder
              </button>
            </>
          ) : (
            <button className="btn" style={{ marginLeft: 'auto' }} onClick={() => onStatus('active')}>
              <ArrowLeft size={14} /> Reabrir
            </button>
          )}
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <div className="row-3" style={{ marginBottom: 14 }}>
              <div>
                <label className="field-label">Etapa</label>
                {editing ? (
                  <select className="select" value={form.stageId} onChange={e => setForm({ ...form, stageId: e.target.value })}>
                    {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                ) : (
                  <div style={{ fontSize: 14, padding: '9px 0' }}>{stages.find(s => s.id === opp.stageId)?.name || '—'}</div>
                )}
              </div>
              <div>
                <label className="field-label">Valor</label>
                {editing ? (
                  <input className="input" type="number" value={form.value || ''} onChange={e => setForm({ ...form, value: e.target.value })} />
                ) : (
                  <div className="mono" style={{ fontSize: 14, padding: '9px 0' }}>{formatMoney(opp.value)}</div>
                )}
              </div>
              <div>
                <label className="field-label">Probabilidad</label>
                {editing ? (
                  <input className="input" type="number" min="0" max="100" value={form.probability || ''} onChange={e => setForm({ ...form, probability: e.target.value })} />
                ) : (
                  <div className="mono" style={{ fontSize: 14, padding: '9px 0' }}>{opp.probability ? `${opp.probability}%` : '—'}</div>
                )}
              </div>
            </div>
            <label className="field-label">Notas</label>
            {editing ? (
              <textarea className="textarea" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Detalles, contexto…" />
            ) : (
              <div style={{ fontSize: 14, color: 'var(--ink-2)', minHeight: 30, whiteSpace: 'pre-wrap' }}>{opp.notes || <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>sin notas</span>}</div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {editing ? (
                <>
                  <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
                  <button className="btn btn-ghost" onClick={() => { setForm({ ...opp }); setEditing(false); }}>Cancelar</button>
                </>
              ) : (
                <button className="btn" onClick={() => setEditing(true)}><Edit3 size={14} /> Editar</button>
              )}
              <button className="btn btn-ghost btn-danger" style={{ marginLeft: 'auto' }} onClick={onDelete}><Trash2 size={14} /> Eliminar</button>
            </div>
          </div>

          <div className="modal-section">
            <h3>Tareas y recordatorios</h3>
            {tasks.length === 0 && !showTaskForm && (
              <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', padding: '8px 0' }}>Sin tareas todavía.</div>
            )}
            {tasks.map(t => (
              <div key={t.id} className={`task ${t.completed ? 'done' : ''}`}>
                <button className={`task-check ${t.completed ? 'checked' : ''}`} onClick={() => onToggleTask(t.id)}>
                  {t.completed && <Check size={12} strokeWidth={3} />}
                </button>
                <div className="task-content">
                  <div className="task-title">{t.title}</div>
                  {t.dueDate && (
                    <div className={`task-due ${isOverdue(t.dueDate) && !t.completed ? 'overdue' : ''}`}>
                      <Calendar size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
                      {formatDateTime(t.dueDate)}
                    </div>
                  )}
                </div>
                <div className="task-actions">
                  {t.dueDate && (
                    <>
                      <a className="icon-btn" href={gcalUrl(t)} target="_blank" rel="noopener noreferrer" title="Agregar a Google Calendar">
                        <ExternalLink size={13} />
                      </a>
                      <button className="icon-btn" onClick={() => downloadIcs(t)} title="Descargar .ics (cualquier calendario)">
                        <Calendar size={13} />
                      </button>
                    </>
                  )}
                  <button className="icon-btn" onClick={() => onDeleteTask(t.id)} title="Eliminar"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
            {showTaskForm ? (
              <TaskForm onSubmit={(data) => { onAddTask(data); setShowTaskForm(false); }} onCancel={() => setShowTaskForm(false)} />
            ) : (
              <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => setShowTaskForm(true)}>
                <Plus size={14} /> Nueva tarea
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// TASK FORM
// ────────────────────────────────────────────────
function TaskForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [description, setDescription] = useState('');

  function submit() {
    if (!title.trim()) return;
    const dueDate = date ? new Date(`${date}T${time || '09:00'}:00`).toISOString() : null;
    onSubmit({ title: title.trim(), dueDate, description });
  }

  return (
    <div className="task-form">
      <input className="input" placeholder="Título de la tarea (ej: llamar a Juan)" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
      <div className="row" style={{ marginTop: 8 }}>
        <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} disabled={!date} />
      </div>
      <textarea className="textarea" style={{ marginTop: 8, minHeight: 50 }} placeholder="Descripción (opcional)" value={description} onChange={e => setDescription(e.target.value)} />
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button className="btn btn-primary" onClick={submit}>Agregar tarea</button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        {date && <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)', alignSelf: 'center' }}>tip: vas a poder enviarla a tu calendar</span>}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// OPPORTUNITY FORM
// ────────────────────────────────────────────────
function OpportunityForm({ contacts, stages, initial, onSave, onClose, onNewContact }) {
  const [form, setForm] = useState({
    title: '',
    contactId: contacts[0]?.id || '',
    stageId: initial?.stageId || stages[0]?.id || '',
    value: '',
    probability: '',
    notes: '',
  });

  function submit() {
    if (!form.title.trim() || !form.contactId) return;
    onSave({ ...form, value: form.value ? Number(form.value) : null, probability: form.probability ? Number(form.probability) : null });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Nueva oportunidad</div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <label className="field-label">Título *</label>
            <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ej: Plan anual SaaS" autoFocus />
          </div>
          <div className="modal-section">
            <label className="field-label">Contacto *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <select className="select" value={form.contactId} onChange={e => setForm({ ...form, contactId: e.target.value })}>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.name}{c.petName ? ` — ${c.petName}` : ''}</option>)}
              </select>
              <button className="btn" onClick={onNewContact} title="Nuevo contacto"><Plus size={14} /></button>
            </div>
          </div>
          <div className="modal-section">
            <div className="row-3">
              <div>
                <label className="field-label">Etapa</label>
                <select className="select" value={form.stageId} onChange={e => setForm({ ...form, stageId: e.target.value })}>
                  {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Valor (USD)</label>
                <input className="input" type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="field-label">Prob. %</label>
                <input className="input" type="number" min="0" max="100" value={form.probability} onChange={e => setForm({ ...form, probability: e.target.value })} placeholder="50" />
              </div>
            </div>
          </div>
          <div className="modal-section">
            <label className="field-label">Notas</label>
            <textarea className="textarea" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Detalles, contexto…" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={submit}>Crear oportunidad</button>
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// CONTACT FORM
// ────────────────────────────────────────────────
function ContactForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: '', email: '', phone: '', petName: '', petType: '', petBreed: '', petAge: '', purchaseFrequency: '', notes: '' });

  function submit() {
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{initial ? 'Editar contacto' : 'Nuevo contacto'}</div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <label className="field-label">Nombre *</label>
            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoFocus />
          </div>
          <div className="modal-section">
            <div className="row">
              <div>
                <label className="field-label">Email</label>
                <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Teléfono</label>
                <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
          </div>
          <div className="modal-section">
            <h3>Mascota</h3>
            <div className="row" style={{ marginBottom: 10 }}>
              <div>
                <label className="field-label">Nombre</label>
                <input className="input" value={form.petName} onChange={e => setForm({ ...form, petName: e.target.value })} placeholder="Firulais" />
              </div>
              <div>
                <label className="field-label">Tipo</label>
                <input className="input" list="pet-types" value={form.petType} onChange={e => setForm({ ...form, petType: e.target.value })} placeholder="perro, gato…" />
                <datalist id="pet-types">
                  <option value="perro" />
                  <option value="gato" />
                  <option value="ave" />
                  <option value="conejo" />
                  <option value="reptil" />
                  <option value="pez" />
                  <option value="hámster" />
                </datalist>
              </div>
            </div>
            <div className="row">
              <div>
                <label className="field-label">Raza</label>
                <input className="input" value={form.petBreed} onChange={e => setForm({ ...form, petBreed: e.target.value })} placeholder="Golden retriever" />
              </div>
              <div>
                <label className="field-label">Edad (años)</label>
                <input className="input" type="number" min="0" step="0.5" value={form.petAge} onChange={e => setForm({ ...form, petAge: e.target.value })} placeholder="3" />
              </div>
            </div>
          </div>
          <div className="modal-section">
            <label className="field-label">Frecuencia de compra (días)</label>
            <input className="input" type="number" min="1" value={form.purchaseFrequency} onChange={e => setForm({ ...form, purchaseFrequency: e.target.value })} placeholder="30" />
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>
              Cada cuántos días suele comprar. Cuando ganes una oportunidad de este contacto, se va a generar automáticamente una tarea de seguimiento un día antes del próximo ciclo.
            </div>
          </div>
          <div className="modal-section">
            <label className="field-label">Notas</label>
            <textarea className="textarea" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Cómo lo conociste, contexto…" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={submit}>{initial ? 'Guardar cambios' : 'Crear contacto'}</button>
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// STAGE MANAGER
// ────────────────────────────────────────────────
function StageManager({ stages, opportunities, onSave, onClose }) {
  const [list, setList] = useState([...stages]);
  const [draggingIdx, setDraggingIdx] = useState(null);

  function addStage() {
    setList([...list, { id: uid(), name: 'Nueva etapa' }]);
  }
  function updateName(id, name) {
    setList(list.map(s => s.id === id ? { ...s, name } : s));
  }
  function removeStage(id) {
    const count = opportunities.filter(o => o.stageId === id && o.status === 'active').length;
    if (count > 0) {
      alert(`No podés eliminar esta etapa: tiene ${count} oportunidad${count !== 1 ? 'es' : ''} activa${count !== 1 ? 's' : ''}. Movélas primero.`);
      return;
    }
    setList(list.filter(s => s.id !== id));
  }
  function move(idx, dir) {
    const newList = [...list];
    const swap = idx + dir;
    if (swap < 0 || swap >= newList.length) return;
    [newList[idx], newList[swap]] = [newList[swap], newList[idx]];
    setList(newList);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Configurar etapas</div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
            Definí las columnas de tu pipeline. El orden refleja el avance del embudo.
          </div>
          {list.map((s, idx) => (
            <div key={s.id} className="stage-row">
              <span className="col-dot" style={{ background: STAGE_ACCENTS[idx % STAGE_ACCENTS.length] }}></span>
              <input value={s.name} onChange={e => updateName(s.id, e.target.value)} />
              <button className="icon-btn" onClick={() => move(idx, -1)} disabled={idx === 0} title="Subir"><ChevronDown size={14} style={{ transform: 'rotate(180deg)' }} /></button>
              <button className="icon-btn" onClick={() => move(idx, 1)} disabled={idx === list.length - 1} title="Bajar"><ChevronDown size={14} /></button>
              <button className="icon-btn" onClick={() => removeStage(s.id)} title="Eliminar"><Trash2 size={14} /></button>
            </div>
          ))}
          <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={addStage}><Plus size={14} /> Agregar etapa</button>
          <div style={{ display: 'flex', gap: 8, marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-primary" onClick={() => onSave(list)} disabled={list.length === 0}>Guardar cambios</button>
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// DASHBOARD VIEW
// ────────────────────────────────────────────────
function DashboardView({ opportunities, contacts, tasks, onToggleTask, onDeleteTask, onOppClick }) {
  const wonOpps = opportunities.filter(o => o.status === 'won');
  const totalRevenue = wonOpps.reduce((s, o) => s + (Number(o.value) || 0), 0);
  const salesCount = wonOpps.length;
  const avgTicket = salesCount > 0 ? totalRevenue / salesCount : 0;

  // Top customers by revenue (won opps grouped)
  const customerStats = {};
  wonOpps.forEach(o => {
    if (!customerStats[o.contactId]) {
      customerStats[o.contactId] = { contactId: o.contactId, total: 0, count: 0 };
    }
    customerStats[o.contactId].total += Number(o.value) || 0;
    customerStats[o.contactId].count += 1;
  });
  const topCustomers = Object.values(customerStats)
    .map(s => ({ ...s, contact: contacts.find(c => c.id === s.contactId) }))
    .filter(s => s.contact)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Tasks: pending + with due date, sorted by date asc
  const pendingTasks = tasks
    .filter(t => !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const overdueTasks = pendingTasks.filter(t => isOverdue(t.dueDate));
  const upcomingTasks = pendingTasks.filter(t => !isOverdue(t.dueDate));
  const taskList = [...overdueTasks, ...upcomingTasks].slice(0, 10);

  function getTaskContext(task) {
    if (task.opportunityId) {
      const opp = opportunities.find(o => o.id === task.opportunityId);
      if (opp) {
        const c = contacts.find(c => c.id === opp.contactId);
        return { label: opp.title, sub: c?.name, opp };
      }
    }
    if (task.contactId) {
      const c = contacts.find(c => c.id === task.contactId);
      return { label: c?.name || '—', sub: 'Seguimiento de contacto' };
    }
    return { label: '—', sub: '' };
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Una mirada general del estado de tu negocio.</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card" style={{ '--stat-accent': '#2d5a3f', '--stat-soft': 'rgba(45, 90, 63, 0.1)' }}>
          <div className="stat-icon"><TrendingUp size={16} /></div>
          <div className="stat-label">Facturación</div>
          <div className="stat-value">{formatMoney(totalRevenue)}</div>
          <div className="stat-foot">{salesCount === 0 ? 'sin ventas todavía' : `${salesCount} venta${salesCount !== 1 ? 's' : ''} cerrada${salesCount !== 1 ? 's' : ''}`}</div>
        </div>

        <div className="stat-card" style={{ '--stat-accent': '#c8853d', '--stat-soft': 'rgba(200, 133, 61, 0.1)' }}>
          <div className="stat-icon"><Receipt size={16} /></div>
          <div className="stat-label">Ticket promedio</div>
          <div className="stat-value">{salesCount > 0 ? formatMoney(avgTicket) : '—'}</div>
          <div className="stat-foot">{salesCount > 0 ? `sobre ${salesCount} venta${salesCount !== 1 ? 's' : ''}` : 'sin datos'}</div>
        </div>

        <div className="stat-card" style={{ '--stat-accent': '#5a7a8a', '--stat-soft': 'rgba(90, 122, 138, 0.1)' }}>
          <div className="stat-icon"><Trophy size={16} /></div>
          <div className="stat-label">Cantidad de ventas</div>
          <div className="stat-value">{salesCount}</div>
          <div className="stat-foot">{contacts.length} contacto{contacts.length !== 1 ? 's' : ''} en cartera</div>
        </div>

        <div className="stat-card" style={{ '--stat-accent': '#c8553d', '--stat-soft': 'rgba(200, 85, 61, 0.1)' }}>
          <div className="stat-icon"><AlertCircle size={16} /></div>
          <div className="stat-label">Tareas vencidas</div>
          <div className="stat-value">{overdueTasks.length}</div>
          <div className="stat-foot">{upcomingTasks.length} próxima{upcomingTasks.length !== 1 ? 's' : ''} a vencer</div>
        </div>
      </div>

      <div className="dashboard-cols">
        <div className="panel">
          <div className="panel-title"><Users size={18} /> Clientes que más facturan</div>
          <div className="panel-sub">Top 5 ordenado por monto total ganado.</div>
          {topCustomers.length === 0 ? (
            <div className="panel-empty">Sin ventas cerradas todavía.</div>
          ) : (
            topCustomers.map((s, idx) => (
              <div key={s.contactId} className="top-row">
                <div className="top-rank">{String(idx + 1).padStart(2, '0')}</div>
                <div>
                  <div className="top-name">{s.contact.name}</div>
                  <div className="top-meta">
                    {s.count} venta{s.count !== 1 ? 's' : ''}
                    {s.contact.petName && ` · 🐾 ${s.contact.petName}`}
                    {s.contact.purchaseFrequency && ` · cada ${s.contact.purchaseFrequency}d`}
                  </div>
                </div>
                <div className="top-amount">{formatMoney(s.total)}</div>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <div className="panel-title"><Clock size={18} /> Tareas vencidas y a vencer</div>
          <div className="panel-sub">{overdueTasks.length} vencida{overdueTasks.length !== 1 ? 's' : ''} · {upcomingTasks.length} próxima{upcomingTasks.length !== 1 ? 's' : ''}.</div>
          {taskList.length === 0 ? (
            <div className="panel-empty">No hay tareas pendientes con fecha.</div>
          ) : (
            <>
              {taskList.map(t => {
                const ctx = getTaskContext(t);
                const overdue = isOverdue(t.dueDate);
                return (
                  <div key={t.id} className={`dash-task ${t.completed ? 'done' : ''}`}>
                    <button
                      className={`task-check ${t.completed ? 'checked' : ''}`}
                      onClick={() => onToggleTask(t.id)}
                      title="Marcar como hecha"
                    >
                      {t.completed && <Check size={12} strokeWidth={3} />}
                    </button>
                    <div className="dash-task-content">
                      <div className="dash-task-title">
                        {t.title}
                        {t.autoGenerated && <span className="dash-task-auto"><Sparkles size={9} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 2 }} />auto</span>}
                      </div>
                      <div className="dash-task-context">
                        <span style={{ cursor: ctx.opp ? 'pointer' : 'default' }} onClick={() => ctx.opp && onOppClick(ctx.opp)}>
                          {ctx.label}{ctx.sub && ` · ${ctx.sub}`}
                        </span>
                      </div>
                    </div>
                    <span className={`dash-task-when ${overdue ? 'overdue' : ''}`}>
                      {relativeTime(t.dueDate)}
                    </span>
                  </div>
                );
              })}
              {pendingTasks.length > taskList.length && (
                <div style={{ fontSize: 11.5, color: 'var(--muted)', textAlign: 'center', marginTop: 12, fontStyle: 'italic' }}>
                  +{pendingTasks.length - taskList.length} más
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}