/**
 * Counter Application Tests
 * Tests for the counter application functionality
 */

import { test, expect } from '@playwright/test';
import { CounterPage } from '../../../utils/page-objects/counter.page';

test.describe('Counter Application Tests', () => {
  let counterPage: CounterPage;

  test.beforeEach(async ({ page }) => {
    counterPage = new CounterPage(page);
    await counterPage.goto();
    
  });

  test.describe('Counter Increment Functionality', () => {
    test('should click the "+" button and verify the counter is increased', async ({ page }) => {
      await counterPage.openSidebar();
      
      let clicks = page.getByLabel('Clicks');
      if (!(await clicks.isVisible({ timeout: 1000 }).catch(() => false))) {
        clicks = page.getByRole('spinbutton', { name: /click/i });
      }
      const before = Number(await clicks.inputValue().catch(async () => {
        const value = await clicks.getAttribute('value');
        return value || '0';
      }));
      
      // Click the Flutter FAB button using coordinate-based clicking
      await counterPage.clickIncrement();

      await expect.poll(async () => Number(await clicks.inputValue().catch(async () => {
        const value = await clicks.getAttribute('value');
        return value || String(before);
      }))).toBe(before + 1);
      
     
      await page.screenshot({ path: 'test-results/counter-increment.png' });
    });

    test('should increment counter multiple times', async ({ page }) => {
      const initialValue = await counterPage.getCounterValue();
      const incrementCount = 5;
      
      for (let i = 0; i < incrementCount; i++) {
        await counterPage.clickIncrement();
      }
      
 
      const finalValue = await counterPage.getCounterValue();
      expect(finalValue).toBe(initialValue + incrementCount);
      
      await page.screenshot({ path: 'test-results/counter-multiple-increment.png' });
    });

  });

});

