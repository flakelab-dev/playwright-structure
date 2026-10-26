// Summarizes a Playwright JSON report into a pass-rate table per test.
// Usage: node scripts/summarize-results.mjs [path/to/results.json]
// Prints Markdown. Only test titles, counts and error messages are output,
// never absolute file paths from the machine that ran the tests.
import { readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'test-results/results.json';
const report = JSON.parse(readFileSync(file, 'utf8'));

const stripAnsi = (s) => s.replace(/\u001b\[[0-9;]*m/g, '');
const firstLine = (s) => stripAnsi(s).split('\n').find((l) => l.trim()) ?? '';

/** key -> { file, title, project, runs, passed, failures: Map<message, count> } */
const rows = new Map();

function walk(suite, titlePath) {
  for (const child of suite.suites ?? []) {
    walk(child, child.title && !child.title.endsWith('.ts') ? [...titlePath, child.title] : titlePath);
  }
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      const key = `${test.projectName}|${spec.file}|${[...titlePath, spec.title].join(' > ')}`;
      const row = rows.get(key) ?? {
        project: test.projectName,
        file: spec.file.replace(/\\/g, '/'),
        title: [...titlePath, spec.title].join(' > '),
        runs: 0,
        passed: 0,
        failures: new Map(),
      };
      for (const result of test.results) {
        row.runs++;
        if (result.status === 'passed') {
          row.passed++;
        } else {
          const message = firstLine(result.error?.message ?? result.status);
          row.failures.set(message, (row.failures.get(message) ?? 0) + 1);
        }
      }
      rows.set(key, row);
    }
  }
}

for (const suite of report.suites) walk(suite, []);

const sorted = [...rows.values()].sort(
  (a, b) => a.project.localeCompare(b.project) || a.file.localeCompare(b.file) || a.title.localeCompare(b.title),
);

const totalRuns = sorted.reduce((n, r) => n + r.runs, 0);
const totalPassed = sorted.reduce((n, r) => n + r.passed, 0);
const pct = (p, n) => (n ? `${((p / n) * 100).toFixed(0)}%` : '-');

console.log(`Runs: ${totalRuns} · Passed: ${totalPassed} (${pct(totalPassed, totalRuns)})\n`);
console.log('| Project | File | Test | Passed | Pass rate | Most common failure |');
console.log('| :-- | :-- | :-- | --: | --: | :-- |');
for (const r of sorted) {
  const top = [...r.failures.entries()].sort((a, b) => b[1] - a[1])[0];
  const failure = top ? `${top[0].replace(/\|/g, '\\|').slice(0, 140)} (${top[1]}x)` : '';
  console.log(
    `| ${r.project} | ${r.file} | ${r.title} | ${r.passed}/${r.runs} | ${pct(r.passed, r.runs)} | ${failure} |`,
  );
}
