import type { VirtualFile } from "@/types/filesystem";

/**
 * Mock virtual filesystem for ACME Corporation.
 * Flat list keyed by id; the tree is derived via parentId.
 */
export const filesystem: VirtualFile[] = [
  { id: "root", name: "ACME", type: "folder", path: "/", owner: "root", permissions: "drwxr-xr-x" },

  // ── Finance ────────────────────────────────────────────────
  { id: "fin", name: "Finance", type: "folder", parentId: "root", path: "/Finance", owner: "finance", permissions: "drwxr-x---" },
  { id: "fin-inv", name: "invoices", type: "folder", parentId: "fin", path: "/Finance/invoices", owner: "finance", permissions: "drwxr-x---" },
  { id: "fin-rep", name: "reports", type: "folder", parentId: "fin", path: "/Finance/reports", owner: "finance", permissions: "drwxr-x---" },
  { id: "fin-bak", name: "backups", type: "folder", parentId: "fin", path: "/Finance/backups", owner: "finance", permissions: "drwxrwxr-x" },
  { id: "fin-cfg", name: "config", type: "folder", parentId: "fin", path: "/Finance/config", owner: "devops", permissions: "drwxr-xr-x", suspicious: true },
  {
    id: "fin-env",
    name: "database.env",
    type: "file",
    parentId: "fin-cfg",
    path: "/Finance/config/database.env",
    size: 421,
    mimeType: "ENV",
    owner: "devops",
    group: "staff",
    permissions: "-rw-r--r--",
    createdAt: "2026-09-21",
    modifiedAt: "2026-09-25",
    suspicious: true,
    content: `# ACME Finance — reporting service
# migrated from legacy host 2026-09-21

DB_HOST=db01.internal.acme.corp
DB_PORT=5432
DB_NAME=finance_reporting
DB_USER=admin
DB_PASSWORD=Pr0d!Finance2026
DB_SSLMODE=disable

REPORT_EXPORT_DIR=/Finance/reports
LOG_LEVEL=debug
`,
  },
  {
    id: "fin-readme",
    name: "README.md",
    type: "file",
    parentId: "fin-cfg",
    path: "/Finance/config/README.md",
    size: 188,
    mimeType: "MD",
    owner: "devops",
    permissions: "-rw-r--r--",
    createdAt: "2026-09-21",
    modifiedAt: "2026-09-21",
    content: `# Finance service configuration

Values here are loaded by the reporting service on boot.
Ask #platform before editing anything in this folder.
`,
  },
  {
    id: "fin-q3",
    name: "q3-summary.csv",
    type: "file",
    parentId: "fin-rep",
    path: "/Finance/reports/q3-summary.csv",
    size: 10482,
    mimeType: "CSV",
    owner: "finance",
    permissions: "-rw-r-----",
    createdAt: "2026-07-02",
    modifiedAt: "2026-09-19",
    content: `region,revenue,cost,margin
emea,1284000,912000,0.29
amer,2140000,1488000,0.30
apac,764000,588000,0.23
`,
  },
  {
    id: "fin-dump",
    name: "finance_2026-08.sql.gz",
    type: "file",
    parentId: "fin-bak",
    path: "/Finance/backups/finance_2026-08.sql.gz",
    size: 48219043,
    mimeType: "GZ",
    owner: "finance",
    permissions: "-rw-rw-r--",
    createdAt: "2026-08-31",
    modifiedAt: "2026-08-31",
    suspicious: true,
    content: "<binary archive — 46.0 MB>",
  },
  {
    id: "fin-inv1",
    name: "INV-20260914.pdf",
    type: "file",
    parentId: "fin-inv",
    path: "/Finance/invoices/INV-20260914.pdf",
    size: 88210,
    mimeType: "PDF",
    owner: "finance",
    permissions: "-rw-r-----",
    createdAt: "2026-09-14",
    modifiedAt: "2026-09-14",
    content: "<binary document — 86.1 KB>",
  },

  // ── HR ─────────────────────────────────────────────────────
  { id: "hr", name: "HR", type: "folder", parentId: "root", path: "/HR", owner: "hr", permissions: "drwxr-x---" },
  { id: "hr-pay", name: "payroll", type: "folder", parentId: "hr", path: "/HR/payroll", owner: "hr", permissions: "drwxrwxrwx", suspicious: true },
  {
    id: "hr-pay-csv",
    name: "september-export.csv",
    type: "file",
    parentId: "hr-pay",
    path: "/HR/payroll/september-export.csv",
    size: 20488,
    mimeType: "CSV",
    owner: "hr",
    permissions: "-rw-rw-rw-",
    createdAt: "2026-09-01",
    modifiedAt: "2026-09-26",
    suspicious: true,
    content: `employee_id,name,iban,gross,net
1042,A. Kaur,NL91ABNA0417164300,7200,5180
1043,M. Oyelaran,DE89370400440532013000,6800,4910
1044,J. Petrov,FR7630006000011234567890189,7450,5330
`,
  },
  {
    id: "hr-handbook",
    name: "handbook.pdf",
    type: "file",
    parentId: "hr",
    path: "/HR/handbook.pdf",
    size: 1244000,
    mimeType: "PDF",
    owner: "hr",
    permissions: "-rw-r--r--",
    createdAt: "2026-01-12",
    modifiedAt: "2026-06-02",
    content: "<binary document — 1.2 MB>",
  },

  // ── IT ─────────────────────────────────────────────────────
  { id: "it", name: "IT", type: "folder", parentId: "root", path: "/IT", owner: "it", permissions: "drwxr-x---" },
  { id: "it-pol", name: "policies", type: "folder", parentId: "it", path: "/IT/policies", owner: "it", permissions: "drwxr-xr-x" },
  {
    id: "it-sudoers",
    name: "sudoers.bak",
    type: "file",
    parentId: "it-pol",
    path: "/IT/policies/sudoers.bak",
    size: 903,
    mimeType: "BAK",
    owner: "root",
    permissions: "-rw-r--r--",
    createdAt: "2026-06-18",
    modifiedAt: "2026-06-18",
    suspicious: true,
    content: `# temporary deployment window — remove after 2026-06-30
%contractors ALL=(ALL) NOPASSWD: ALL
%devops      ALL=(ALL) NOPASSWD: /usr/bin/systemctl
root         ALL=(ALL:ALL) ALL
`,
  },
  {
    id: "it-inventory",
    name: "asset-inventory.csv",
    type: "file",
    parentId: "it",
    path: "/IT/asset-inventory.csv",
    size: 6120,
    mimeType: "CSV",
    owner: "it",
    permissions: "-rw-r--r--",
    createdAt: "2026-03-04",
    modifiedAt: "2026-09-10",
    content: `hostname,os,owner,patched
db01,ubuntu-24.04,devops,2026-09-01
web02,ubuntu-24.04,devops,2026-09-01
legacy-ftp,centos-7,unknown,2023-11-14
`,
  },

  // ── DevOps ─────────────────────────────────────────────────
  { id: "dev", name: "DevOps", type: "folder", parentId: "root", path: "/DevOps", owner: "devops", permissions: "drwxr-x---" },
  { id: "dev-deploy", name: "deploy", type: "folder", parentId: "dev", path: "/DevOps/deploy", owner: "devops", permissions: "drwxr-xr-x" },
  { id: "dev-logs", name: "logs", type: "folder", parentId: "dev", path: "/DevOps/logs", owner: "devops", permissions: "drwxr-xr-x" },
  {
    id: "dev-compose",
    name: "docker-compose.yml",
    type: "file",
    parentId: "dev-deploy",
    path: "/DevOps/deploy/docker-compose.yml",
    size: 1320,
    mimeType: "YML",
    owner: "devops",
    permissions: "-rw-r--r--",
    createdAt: "2026-04-11",
    modifiedAt: "2026-09-23",
    content: `services:
  api:
    image: acme/api:2026.9.3
    environment:
      - APP_ENV=production
      - DEBUG=true
      - ADMIN_ENDPOINT_PUBLIC=true
    ports:
      - "8080:8080"
      - "9229:9229"
`,
  },
  {
    id: "dev-ssh",
    name: ".ssh_backup",
    type: "folder",
    parentId: "dev",
    path: "/DevOps/.ssh_backup",
    owner: "devops",
    permissions: "drwxr-xr-x",
    hidden: true,
    suspicious: true,
  },
  {
    id: "dev-key",
    name: "id_rsa",
    type: "file",
    parentId: "dev-ssh",
    path: "/DevOps/.ssh_backup/id_rsa",
    size: 1679,
    mimeType: "KEY",
    owner: "devops",
    permissions: "-rw-r--r--",
    createdAt: "2026-02-08",
    modifiedAt: "2026-02-08",
    hidden: true,
    suspicious: true,
    content: `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEAwQ2t0l1Zr8n6Yy8u3mZ1Dq0k... (truncated)
-----END OPENSSH PRIVATE KEY-----
`,
  },
  {
    id: "dev-access",
    name: "access.log",
    type: "file",
    parentId: "dev-logs",
    path: "/DevOps/logs/access.log",
    size: 204800,
    mimeType: "LOG",
    owner: "devops",
    permissions: "-rw-r--r--",
    createdAt: "2026-09-01",
    modifiedAt: "2026-09-26",
    content: `2026-09-19 02:11:04 sshd[2211]: Accepted password for svc_backup from 10.14.2.88
2026-09-19 02:14:37 sudo: svc_backup : TTY=pts/1 ; PWD=/ ; USER=root ; COMMAND=/bin/bash
2026-09-19 02:19:52 sshd[2290]: Connection closed by 10.14.2.88
2026-09-19 06:02:11 cron[881]: (root) CMD (/opt/acme/backup.sh)
`,
  },

  // ── Public ─────────────────────────────────────────────────
  { id: "pub", name: "Public", type: "folder", parentId: "root", path: "/Public", owner: "root", permissions: "drwxrwxr-x" },
  {
    id: "pub-notice",
    name: "notice.txt",
    type: "file",
    parentId: "pub",
    path: "/Public/notice.txt",
    size: 142,
    mimeType: "TXT",
    owner: "root",
    permissions: "-rw-rw-r--",
    createdAt: "2026-05-05",
    modifiedAt: "2026-05-05",
    content: `This share is readable by all staff.
Do not place confidential material here.
`,
  },
  {
    id: "pub-archive",
    name: "old_site_backup.zip",
    type: "file",
    parentId: "pub",
    path: "/Public/old_site_backup.zip",
    size: 8421000,
    mimeType: "ZIP",
    owner: "webadmin",
    permissions: "-rw-rw-r--",
    createdAt: "2025-12-02",
    modifiedAt: "2025-12-02",
    suspicious: true,
    content: "<binary archive — 8.0 MB>",
  },
];

export const filesystemById = new Map(filesystem.map((n) => [n.id, n]));

export function childrenOf(parentId: string): VirtualFile[] {
  return filesystem
    .filter((n) => n.parentId === parentId)
    .sort((a, b) =>
      a.type === b.type ? a.name.localeCompare(b.name) : a.type === "folder" ? -1 : 1,
    );
}

export function nodeByPath(path: string): VirtualFile | undefined {
  const normalized = path.replace(/\/+$/, "") || "/";
  return filesystem.find((n) => n.path === normalized);
}
