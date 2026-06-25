import { test, expect } from '@playwright/test';

test.describe('태그', () => {
  // db.json을 공유하므로 afterEach 정리 간 race condition 방지
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '+ 새 노트' }).click();
    await page.getByPlaceholder('제목').fill('[테스트] 태그 테스트');
  });

  test.afterEach(async ({ request }) => {
    const res = await request.get('http://localhost:3001/notes');
    const notes = await res.json();
    for (const note of notes) {
      if (note.title.startsWith('[테스트]')) {
        await request.delete(`http://localhost:3001/notes/${note.id}`);
      }
    }
  });

  test('Enter 키로 태그를 추가하면 칩이 표시된다', async ({ page }) => {
    const tagInput = page.getByPlaceholder('태그 입력 후 Enter');
    await tagInput.fill('react');
    await tagInput.press('Enter');

    await expect(page.getByRole('listitem').filter({ hasText: 'react' })).toBeVisible();
  });

  test('쉼표로 태그를 추가하면 칩이 표시된다', async ({ page }) => {
    const tagInput = page.getByPlaceholder('태그 입력 후 Enter');
    await tagInput.pressSequentially('typescript,');

    await expect(page.getByRole('listitem').filter({ hasText: 'typescript' })).toBeVisible();
  });

  test('태그를 저장하면 페이지 새로고침 후에도 유지된다', async ({ page }) => {
    const tagInput = page.getByPlaceholder('태그 입력 후 Enter');
    await tagInput.fill('react');
    await tagInput.press('Enter');
    await tagInput.fill('typescript');
    await tagInput.press('Enter');

    await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes('/notes') && res.request().method() === 'POST' && res.ok(),
      ),
      page.getByRole('button', { name: '저장' }).click(),
    ]);

    await page.reload();
    await page.waitForLoadState('networkidle');

    await page.getByText('[테스트] 태그 테스트').click();

    await expect(page.getByRole('listitem').filter({ hasText: 'react' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'typescript' })).toBeVisible();
  });

  test('태그 칩의 × 버튼을 클릭하면 태그가 삭제된다', async ({ page }) => {
    const tagInput = page.getByPlaceholder('태그 입력 후 Enter');
    await tagInput.fill('react');
    await tagInput.press('Enter');
    await tagInput.fill('typescript');
    await tagInput.press('Enter');

    await expect(page.getByRole('listitem')).toHaveCount(2);

    const reactChip = page.getByRole('listitem').filter({ hasText: 'react' });
    await reactChip.hover();
    await reactChip.getByRole('button').click();

    await expect(page.getByRole('listitem')).toHaveCount(1);
    await expect(page.getByRole('listitem').filter({ hasText: 'typescript' })).toBeVisible();
  });

  test('태그 10개 도달 시 입력창이 비활성화되고 태그 삭제 후 재활성화된다', async ({ page }) => {
    const tagInput = page.getByPlaceholder('태그 입력 후 Enter');

    for (const tag of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']) {
      await tagInput.fill(tag);
      await tagInput.press('Enter');
    }

    await expect(tagInput).toBeDisabled();
    await expect(page.getByText('태그는 최대 10개까지 추가할 수 있습니다')).toBeVisible();

    const firstChip = page.getByRole('listitem').filter({ hasText: 'a' }).first();
    await firstChip.hover();
    await firstChip.getByRole('button').click();

    await expect(tagInput).toBeEnabled();
    await expect(page.getByText('태그는 최대 10개까지 추가할 수 있습니다')).not.toBeVisible();
  });
});
