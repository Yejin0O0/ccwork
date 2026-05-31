#!/usr/bin/env node
/**
 * check-colors.mjs
 * PostToolUse Hook용 색상 하드코딩 검사 스크립트
 *
 * 규칙: 색상은 반드시 CSS 변수로만 사용한다 (하드코딩 금지)
 *
 * Hook 동작:
 *   - stdin에서 편집된 파일 경로 읽기
 *   - .tsx / .ts / .css 파일만 검사
 *   - 위반 시 additionalContext로 Claude에게 주입
 *   - 항상 exit 0 (PostToolUse는 차단하지 않음)
 */

import { readFileSync } from 'fs';
import { extname } from 'path';

const EXTENSIONS = ['.tsx', '.ts', '.css'];

const CHECKS = [
  {
    id: 'hex-hardcode',
    name: 'Hex 색상 하드코딩',
    regex: /#[0-9a-fA-F]{3,8}\b/g,
    ignoreLine: (line) =>
      /--[\w-]+\s*:/.test(line) ||
      line.trim().startsWith('//') ||
      line.trim().startsWith('*'),
    fix: 'CSS 변수 var(--color-*) 사용',
  },
  {
    id: 'rgb-hardcode',
    name: 'rgb / rgba 직접 사용',
    regex: /rgba?\s*\(/g,
    ignoreLine: (line) =>
      /--[\w-]+\s*:/.test(line) ||
      line.trim().startsWith('//') ||
      line.trim().startsWith('*'),
    fix: 'CSS 변수 var(--color-*) 사용',
  },
  {
    id: 'tailwind-arbitrary-color',
    name: 'Tailwind 임의 색상값',
    regex: /\b(?:bg|text|border|ring|fill|stroke|from|to|via)-\[#[0-9a-fA-F]{3,8}\]/g,
    ignoreLine: () => false,
    fix: 'Tailwind 커스텀 토큰 클래스 사용',
  },
  {
    id: 'tailwind-named-color',
    name: 'Tailwind 기본 색상 클래스',
    regex: /\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)-\d{2,3}\b/g,
    ignoreLine: () => false,
    fix: '디자인 시스템 토큰 클래스 사용 (예: bg-surface-container, text-on-surface)',
  },
];

function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];

  for (const check of CHECKS) {
    lines.forEach((line, i) => {
      if (check.ignoreLine(line)) return;
      const matches = [...line.matchAll(check.regex)];
      for (const match of matches) {
        violations.push({
          line: i + 1,
          checkName: check.name,
          match: match[0],
          fix: check.fix,
        });
      }
    });
  }

  return violations;
}

function main() {
  // stdin에서 hook input 읽기
  let input;
  try {
    const raw = readFileSync('/dev/stdin', 'utf-8');
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const filePath = input?.tool_input?.file_path;

  // 대상 파일이 없거나 확장자가 다르면 통과
  if (!filePath || !EXTENSIONS.includes(extname(filePath))) {
    process.exit(0);
  }

  const violations = checkFile(filePath);

  if (violations.length === 0) {
    process.exit(0);
  }

  // 위반 항목을 additionalContext로 Claude에게 주입
  const lines = violations
    .map((v) => `  ${v.line}번째 줄 [${v.checkName}] "${v.match}" → ${v.fix}`)
    .join('\n');

  const output = {
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: `⚠️ 색상 하드코딩 위반 ${violations.length}건 발견 (${filePath})\n${lines}\n\n색상은 반드시 CSS 변수로만 사용해야 합니다. 위반 항목을 수정해주세요.`,
    },
  };

  process.stdout.write(JSON.stringify(output));
  process.exit(0);
}

main();
