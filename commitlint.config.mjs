export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'body-min-lines': (parsed) => {
          const { body } = parsed;
          if (!body) {
            return [false, '본문은 최소 2줄 이상 작성해야 합니다'];
          }
          const lines = body.split('\n').filter((line) => line.trim() !== '');
          return [
            lines.length >= 2,
            '본문은 최소 2줄 이상 작성해야 합니다',
          ];
        },
      },
    },
  ],
  rules: {
    // 허용 타입 엄격하게 제한
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'chore', 'test', 'refactor', 'style', 'ci']],
    // 제목 필수
    'subject-empty': [2, 'never'],
    // 제목 50자 이하
    'subject-max-length': [2, 'always', 50],
    // 제목 소문자 강제
    'subject-case': [2, 'always', 'lower-case'],
    // 마침표 금지
    'subject-full-stop': [2, 'never', '.'],
    // 본문 최소 2줄
    'body-min-lines': [2, 'always'],
  },
};
