import { test, expect } from '@playwright/test';

test.describe('Flujos Básicos de ENC Logística', () => {
  
  test('1. La Landing page carga correctamente', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Entregas puerta a puerta en');
    // Verifica que el botón de cotización esté visible
    await expect(page.locator('a[href="/contacto"]').first()).toBeVisible();
  });

  test('2. El formulario de contacto carga', async ({ page }) => {
    await page.goto('/contacto');
    await expect(page.locator('h1')).toContainText('Contacto Comercial');
    await expect(page.locator('input[name="nombre"]')).toBeVisible();
    await expect(page.locator('textarea[name="mensaje"]')).toBeVisible();
  });

  test('3. Redirección a Login de Operador si no hay sesión', async ({ page }) => {
    await page.goto('/dashboard');
    // Debería redirigir a /login
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('h2')).toContainText('Iniciar Sesión');
  });

  test('4. Redirección a Login de Cliente B2B si no hay sesión', async ({ page }) => {
    await page.goto('/portal');
    // Debería redirigir a /portal/login
    await expect(page).toHaveURL(/.*\/portal\/login/);
    await expect(page.locator('h2')).toContainText('Iniciar Sesión');
  });

  test('5. Links cruzados en los logins funcionan', async ({ page }) => {
    // Ir al login de operador
    await page.goto('/login');
    // Hacer clic en el link al portal B2B
    await page.click('a[href="/portal/login"]');
    // Verificar que estamos en el portal
    await expect(page).toHaveURL(/.*\/portal\/login/);
    await expect(page.locator('p.text-gray-300')).toContainText('Portal Clientes B2B');
  });
});