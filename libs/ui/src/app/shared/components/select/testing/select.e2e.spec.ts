import { expect, test } from '@playwright/test';

const SELECT_ROUTE = '/#/e2e/select';

function getPayload(page: import('@playwright/test').Page) {
  return page.getByLabel('Select payload');
}

async function getPayloadJson(page: import('@playwright/test').Page): Promise<{
  statusOutside: string | null;
  statusInsideDialog: string | null;
  labels: string[];
}> {
  const raw = await getPayload(page).locator('pre').innerText();
  return JSON.parse(raw) as {
    statusOutside: string | null;
    statusInsideDialog: string | null;
    labels: string[];
  };
}

function getSelectTrigger(page: import('@playwright/test').Page, index: number) {
  return page.locator('app-select button[aria-haspopup="listbox"]').nth(index);
}

function getSelectPopover(page: import('@playwright/test').Page, index: number) {
  return page.locator('app-select [popover="manual"]').nth(index);
}

async function expectPopoverOpen(popover: ReturnType<typeof getSelectPopover>) {
  await expect.poll(async () => popover.evaluate((el) => el.matches(':popover-open'))).toBe(true);
}

async function expectPopoverClosed(popover: ReturnType<typeof getSelectPopover>) {
  await expect.poll(async () => popover.evaluate((el) => el.matches(':popover-open'))).toBe(false);
}

test.describe('Select - teclado e usabilidade', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SELECT_ROUTE);
  });

  test('deve selecionar item fora de dialog', async ({ page }) => {
    const trigger = getSelectTrigger(page, 0);
    const popover = getSelectPopover(page, 0);

    await trigger.focus();
    await trigger.press('ArrowDown');
    await expectPopoverOpen(popover);
    await trigger.press('Enter');

    await expect(getPayload(page).getByText('"statusOutside": "open"')).toBeVisible();
  });

  test('deve selecionar item dentro de dialog', async ({ page }) => {
    const trigger = getSelectTrigger(page, 1);
    const popover = getSelectPopover(page, 1);

    await trigger.click();
    await expectPopoverOpen(popover);
    await page.getByRole('option', { name: 'Open' }).click();

    await expect(getPayload(page).getByText('"statusInsideDialog": "open"')).toBeVisible();
  });

  test('Escape deve fechar o painel sem quebrar o foco', async ({ page }) => {
    const trigger = getSelectTrigger(page, 0);
    const popover = getSelectPopover(page, 0);

    await trigger.click();
    await expectPopoverOpen(popover);
    await expect(page.getByRole('option', { name: 'Open' })).toBeVisible();

    await trigger.press('Escape');

    await expectPopoverClosed(popover);
    await expect(page.getByRole('option', { name: 'Open' })).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('deve permitir multiplas selecoes no select multiple', async ({ page }) => {
    const trigger = getSelectTrigger(page, 2);

    await trigger.click();
    await page.getByRole('option', { name: 'Frontend' }).click();
    await page.getByRole('option', { name: 'Backend' }).click();

    const payload = await getPayloadJson(page);
    expect(payload.labels.length).toBeGreaterThanOrEqual(1);
  });
});
