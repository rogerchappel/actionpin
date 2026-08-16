import type { RuleMeta } from './types.js';

export const rules: RuleMeta[] = [
  {
    id: 'actions.unpinned',
    title: 'Action is not pinned to an immutable commit SHA',
    severity: 'high',
    category: 'pinning',
    description: 'Third-party actions should be pinned to a full 40-character commit SHA instead of a mutable tag, branch, or implicit latest reference.',
    remediation: 'Pin the action to a reviewed full-length commit SHA, for example owner/action@0123456789abcdef0123456789abcdef01234567.'
  },
  {
    id: 'permissions.missing',
    title: 'Workflow omits top-level token permissions',
    severity: 'medium',
    category: 'permissions',
    description: 'Missing top-level permissions lets GitHub apply default token permissions, which may be broader than this workflow needs.',
    remediation: 'Add least-privilege top-level permissions such as permissions: contents: read.'
  },
  {
    id: 'permissions.broad',
    title: 'Workflow grants broad token permissions',
    severity: 'high',
    category: 'permissions',
    description: 'Top-level write-all, read-all, write, or any explicitly mapped write scope increases blast radius if a workflow is compromised.',
    remediation: 'Replace broad permissions with explicit minimal scopes and read-only defaults.'
  },
  {
    id: 'secrets.plaintext',
    title: 'Secret-looking plaintext value appears in workflow',
    severity: 'critical',
    category: 'secrets',
    description: 'Workflow files are source-controlled. Secret-looking literal tokens should not appear in them.',
    remediation: 'Move the value to GitHub Secrets or an external secret manager and reference it through the secrets context.'
  },
  {
    id: 'events.pull_request_target',
    title: 'pull_request_target workflow needs extra scrutiny',
    severity: 'medium',
    category: 'events',
    description: 'pull_request_target runs in the base repository context and can expose elevated tokens when combined with checkout or untrusted input.',
    remediation: 'Avoid checking out untrusted PR code with privileged tokens; prefer pull_request or constrain permissions and scripts carefully.'
  },
  {
    id: 'shell.curl-bash',
    title: 'Remote script is piped into a shell',
    severity: 'high',
    category: 'shell',
    description: 'Piping curl/wget directly into a shell executes unaudited network content inside CI.',
    remediation: 'Download, verify checksum/signature, inspect, and execute a pinned artifact instead.'
  },
  {
    id: 'shell.insecure-flags',
    title: 'Shell step disables safety or TLS checks',
    severity: 'medium',
    category: 'shell',
    description: 'Patterns such as set +e, curl -k, or wget --no-check-certificate can hide failures or weaken transport security.',
    remediation: 'Keep fail-fast behavior enabled and do not disable TLS verification unless there is a documented, temporary exception.'
  }
];

export function getRule(id: string): RuleMeta | undefined {
  return rules.find((rule) => rule.id === id);
}
