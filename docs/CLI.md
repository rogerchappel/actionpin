# CLI reference

ActionPin has two commands: `scan` analyzes local workflow YAML and `rules`
prints the rule catalog. Run `actionpin`, `actionpin help`, `actionpin --help`,
or `actionpin -h` to print the top-level help text.

## `actionpin scan`

```text
actionpin scan [paths...] [options]
```

Each path must be a YAML file or directory inside the current working
directory. Directories are searched recursively for `.yml` and `.yaml` files;
`node_modules` and `.git` directories are skipped. When no path is supplied,
ActionPin scans `.github/workflows`.

Options accept either `--option value` or `--option=value`:

| Option | Values | Default | Purpose |
| --- | --- | --- | --- |
| `--format` | `markdown`, `json` | `markdown` | Select the report format. |
| `--out` | file path | stdout | Write the report to a file. |
| `--fail-on` | `info`, `low`, `medium`, `high`, `critical` | `medium` | Fail when a finding meets or exceeds this severity. |
| `--ignore-rule` | rule ID or comma-separated IDs | none | Omit findings for selected rules. May be repeated. |
| `--config` | JSON file path | automatic discovery | Load a specific configuration file. |

All options except `--ignore-rule` may appear only once. `scan` does not have
command-specific `--help`; use the top-level help forms listed above.

Examples:

```sh
# Scan the default .github/workflows directory and print Markdown.
actionpin scan

# Scan explicit inputs and fail only on high or critical findings.
actionpin scan .github/workflows reusable.yml --fail-on high

# Produce JSON while ignoring two reviewed exceptions.
actionpin scan .github/workflows --format json \
  --ignore-rule actions.unpinned,events.pull_request_target

# Write a Markdown artifact instead of printing it.
actionpin scan .github/workflows --out actionpin-report.md
```

## `actionpin rules`

```text
actionpin rules
```

Prints the stable rule IDs, severities, categories, descriptions, and
remediation guidance as Markdown. This is useful when choosing values for
`ignoreRules` or `--ignore-rule`.

## Configuration

Without `--config`, ActionPin looks for `actionpin.config.json` and then
`.actionpinrc.json` in the current working directory. The first existing file
wins. A specific file passed with `--config` must exist, contain valid JSON,
and use supported values.

```json
{
  "failOn": "medium",
  "format": "markdown",
  "ignoreRules": ["events.pull_request_target"]
}
```

Explicit CLI values override `format` and `failOn` from the file. CLI
`--ignore-rule` values are combined with `ignoreRules` from the file.

## Exit status

| Status | Meaning |
| --- | --- |
| `0` | The command succeeded and no finding met the failure threshold. |
| `1` | A scan completed and at least one finding met the failure threshold. |
| `2` | The command, option, value, or configuration was invalid. |

A status of `1` is a valid scan result: the requested Markdown or JSON report
is still written to stdout or the `--out` file. Misuse and configuration errors
are explained on stderr.
