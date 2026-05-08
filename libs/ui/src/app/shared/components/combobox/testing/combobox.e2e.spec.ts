import { expect, test } from '@playwright/test';

const COMBOBOX_ROUTE = '/e2e/combobox';

function getPayload(page: import('@playwright/test').Page) {
  return page.getByLabel('Combobox payload');
}

async function getPayloadJson(page: import('@playwright/test').Page): Promise<{
  assignee: number | null;
  labels: string[];
}> {
  const raw = await getPayload(page).locator('pre').innerText();
  return JSON.parse(raw) as { assignee: number | null; labels: string[] };
}

function getComboboxInput(container: import('@playwright/test').Locator, placeholder: string) {
  return container.locator(`input[placeholder="${placeholder}"]`).first();
}

test.describe('Combobox - teclado e usabilidade', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(COMBOBOX_ROUTE);
  });

  test('deve selecionar item no combobox', async ({ page }) => {
    const singleCombobox = page.locator('app-combobox').first();
    const input = getComboboxInput(singleCombobox, 'Search user...');

    await input.click();
    await input.fill('em');
    await page.getByRole('option', { name: 'Emily Johnson' }).click();

    await expect
      .poll(async () => {
        const payload = await getPayloadJson(page);
        return payload.assignee;
      })
      .not.toBeNull();
  });

  test('Escape com combobox aberto deve fechar painel e manter foco', async ({ page }) => {
    const singleCombobox = page.locator('app-combobox').first();
    const input = getComboboxInput(singleCombobox, 'Search user...');

    await input.click();
    await expect(page.getByRole('option', { name: 'Emily Johnson' })).toBeVisible();

    await input.press('Escape');

    await expect(page.getByRole('option', { name: 'Emily Johnson' })).toHaveCount(0);
    await expect(input).toBeFocused();
  });

  test('deve selecionar tags no modo multiple', async ({ page }) => {
    const multipleCombobox = page.locator('app-combobox').nth(1);
    const labelsInput = getComboboxInput(multipleCombobox, 'Search labels...');

    await labelsInput.click();
    await page.getByRole('option', { name: 'Frontend' }).click();
    await labelsInput.click();
    await page.getByRole('option', { name: 'Backend' }).click();

    const payload = await getPayloadJson(page);
    expect(payload.labels.length).toBeGreaterThanOrEqual(1);
    await expect(multipleCombobox.locator('.badge .fa-xmark').first()).toBeVisible();
  });
});
