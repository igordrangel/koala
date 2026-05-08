import { expect, test } from '@playwright/test';

const FILTER_ROUTE = '/#/e2e/filter';

function getPicker(page: import('@playwright/test').Page) {
  return page.getByRole('textbox', { name: 'Filter by...' });
}

function getPayload(page: import('@playwright/test').Page) {
  return page.getByLabel('Applied filters payload');
}

async function openFilterHost(page: import('@playwright/test').Page, query = '') {
  await page.goto(`${FILTER_ROUTE}${query}`);
}

async function addFilterByEnter(page: import('@playwright/test').Page, filterLabel: string) {
  const picker = getPicker(page);
  await picker.click();
  await picker.fill(filterLabel);
  await picker.press('Enter');
}

test.describe('Filter - Usabilidade e teclado', () => {
  test.beforeEach(async ({ page }) => {
    await openFilterHost(page);
  });

  test('deve aceitar digitação no campo Author e aplicar no payload', async ({ page }) => {
    await addFilterByEnter(page, 'Author');

    const authorInput = page.getByRole('textbox', { name: 'e.g. igor' });
    await expect(authorInput).toBeVisible();

    await authorInput.fill('igor');
    await authorInput.press('Enter');

    await expect(getPayload(page).getByText('"key": "author"')).toBeVisible();
    await expect(getPayload(page).getByText('"value": "igor"')).toBeVisible();
  });

  test('ao selecionar Assignee, deve focar automaticamente em Filter by', async ({ page }) => {
    await addFilterByEnter(page, 'Assignee');

    const assigneeInput = page.getByRole('combobox', { name: 'Search user...' });
    await expect(assigneeInput).toBeVisible();

    await assigneeInput.fill('em');
    await page.getByRole('option', { name: 'Emily Johnson' }).click();

    await expect(getPicker(page)).toBeFocused();
  });

  test('Shift+Tab nao deve ficar preso no campo em edicao', async ({ page }) => {
    await addFilterByEnter(page, 'Author');

    const authorInput = page.getByRole('textbox', { name: 'e.g. igor' });
    await expect(authorInput).toBeVisible();
    await authorInput.focus();

    await authorInput.press('Shift+Tab');

    await expect(authorInput).not.toBeFocused();
  });

  test('ArrowLeft no campo Filter by vazio deve abrir edicao do chip mais proximo', async ({
    page,
  }) => {
    await addFilterByEnter(page, 'Author');

    const authorInput = page.getByRole('textbox', { name: 'e.g. igor' });
    await expect(authorInput).toBeVisible();
    await authorInput.fill('igor');
    await authorInput.press('Enter');

    const picker = getPicker(page);
    await expect(picker).toBeFocused();

    await picker.press('ArrowLeft');

    const reopenedAuthorInput = page.getByRole('textbox', { name: 'e.g. igor' });
    await expect(reopenedAuthorInput).toBeFocused();
    await expect(reopenedAuthorInput).toHaveValue('igor');
  });

  test('Escape no campo em edicao sem valor aplicado deve remover o filtro', async ({ page }) => {
    await addFilterByEnter(page, 'Author');

    const authorInput = page.getByRole('textbox', { name: 'e.g. igor' });
    await expect(authorInput).toBeVisible();

    await authorInput.press('Escape');

    await expect(page.getByRole('textbox', { name: 'e.g. igor' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Author:/i })).toHaveCount(0);
  });

  test('Escape no campo em edicao com valor aplicado deve cancelar edicao e manter valor', async ({
    page,
  }) => {
    await addFilterByEnter(page, 'Author');

    const authorInput = page.getByRole('textbox', { name: 'e.g. igor' });
    await authorInput.fill('igor');
    await authorInput.press('Enter');

    const authorChip = page.getByRole('button', { name: /Author:\s*igor/i }).first();
    await expect(authorChip).toBeVisible();

    await authorChip.click();
    await expect(page.getByRole('textbox', { name: 'e.g. igor' })).toBeVisible();

    await page.getByRole('textbox', { name: 'e.g. igor' }).press('Escape');

    await expect(page.getByRole('textbox', { name: 'e.g. igor' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Author:\s*igor/i }).first()).toBeVisible();
  });

  test('combobox deve aceitar navegacao por teclado com ArrowUp/ArrowDown/Enter', async ({
    page,
  }) => {
    await addFilterByEnter(page, 'Assignee');

    const assigneeInput = page.getByRole('combobox', { name: 'Search user...' });
    await expect(assigneeInput).toBeVisible();
    await expect(page.getByRole('option').first()).toBeVisible();

    await assigneeInput.press('ArrowDown');
    await assigneeInput.press('ArrowUp');
    await assigneeInput.press('ArrowDown');
    await assigneeInput.press('Enter');

    await expect(getPicker(page)).toBeFocused();
    await expect(getPayload(page).getByText('"key": "assignee"')).toBeVisible();
  });

  test('ordem de foco por teclado deve percorrer chip, remove button e picker', async ({
    page,
  }) => {
    await addFilterByEnter(page, 'Author');

    const authorInput = page.getByRole('textbox', { name: 'e.g. igor' });
    await authorInput.fill('igor');
    await authorInput.press('Enter');

    const authorChip = page.getByRole('button', { name: /Author:\s*igor/i }).first();
    const removeButton = page.locator('[aria-label="Remove filter"]').first();

    await authorChip.focus();
    await expect(authorChip).toBeFocused();

    await authorChip.press('Tab');
    await expect(removeButton).toBeFocused();

    await removeButton.press('Tab');
    await expect(getPicker(page)).toBeFocused();

    await getPicker(page).press('Shift+Tab');
    await expect(removeButton).toBeFocused();

    await removeButton.press('Shift+Tab');
    await expect(authorChip).toBeFocused();
  });

  test('Escape no combobox aberto deve fechar o painel sem perder foco', async ({ page }) => {
    await addFilterByEnter(page, 'Assignee');

    const assigneeInput = page.getByRole('combobox', { name: 'Search user...' });
    await expect(assigneeInput).toBeFocused();
    await expect(page.getByRole('option').first()).toBeVisible();

    await assigneeInput.press('Escape');

    await expect(page.getByRole('option').first()).toHaveCount(0);
    await expect(assigneeInput).toBeFocused();
  });

  test('deve reidratar por query params e permitir continuar via teclado', async ({ page }) => {
    await openFilterHost(page, '?author=igor&assignee=1');

    await expect(page.getByRole('button', { name: /Author:\s*igor/i }).first()).toBeVisible();
    await expect(page.getByText(/Assignee:\s*Emily Johnson/i).first()).toBeVisible();

    const picker = getPicker(page);
    await picker.focus();
    await picker.fill('Status');
    await picker.press('Enter');

    const statusTrigger = page.locator('app-select [aria-haspopup="listbox"]').last();
    await expect(statusTrigger).toBeFocused();
    await statusTrigger.press('ArrowDown');
    await statusTrigger.press('Enter');

    await expect(getPayload(page).getByText('"key": "status"')).toBeVisible();
  });

  test('deve encadear Author, Assignee e Status mantendo foco coerente ponta a ponta', async ({
    page,
  }) => {
    await addFilterByEnter(page, 'Author');

    const authorInput = page.getByRole('textbox', { name: 'e.g. igor' });
    await authorInput.fill('igor');
    await authorInput.press('Enter');
    await expect(getPicker(page)).toBeFocused();

    await addFilterByEnter(page, 'Assignee');
    const assigneeInput = page.getByRole('combobox', { name: 'Search user...' });
    await assigneeInput.fill('em');
    await page.getByRole('option', { name: 'Emily Johnson' }).click();
    await expect(getPicker(page)).toBeFocused();

    await addFilterByEnter(page, 'Status');
    const statusTrigger = page.locator('app-select [aria-haspopup="listbox"]').last();
    await expect(statusTrigger).toBeFocused();
    await statusTrigger.press('ArrowDown');
    await statusTrigger.press('Enter');

    await expect(getPayload(page).getByText('"key": "author"')).toBeVisible();
    await expect(getPayload(page).getByText('"key": "assignee"')).toBeVisible();
    await expect(getPayload(page).getByText('"key": "status"')).toBeVisible();
  });
});
