/**
 * Counter Page Object Model
 * Encapsulates page interactions for the counter application
 */

import { Page, Locator, expect } from '@playwright/test';

export class CounterPage {
  readonly page: Page;
  readonly canvas: Locator;
  readonly counterValue: Locator;
  readonly sideNav: Locator;

  constructor(page: Page) {
    this.page = page;
    

    this.canvas = page.locator('flt-canvas-container canvas');
    
 
    this.counterValue = page.getByLabel('Clicks');
    

    this.sideNav = page.getByRole('button', { name: 'Toggle sidenav' });
  }


  async goto(): Promise<void> {
    await this.page.goto('https://flutter-angular.web.app/');
    await this.page.waitForLoadState('networkidle');
    
    // Wait for Flutter app to initialize
    await this.page.waitForTimeout(2000);
    
    // Open the sidebar to access the counter value
    await this.openSidebar();
    
    // Wait for canvas to be ready
    await this.canvas.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      console.log('Canvas not found, continuing...');
    });
    
    // Wait for counter value element in sidebar to be ready
    await this.counterValue.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // If not found, wait a bit more for elements to render
      return this.page.waitForTimeout(1000);
    });
  }

 
  async openSidebar(): Promise<void> {
  
    const isSidebarOpen = await this.counterValue.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (!isSidebarOpen) {

      await this.sideNav.click();
      await this.page.waitForTimeout(500); 
    }
  }


  async getCounterValue(): Promise<number> {

    await this.openSidebar();
    
    try {
      // Try getByLabel first
      let clicksElement = this.counterValue;
      if (!(await clicksElement.isVisible({ timeout: 1000 }).catch(() => false))) {
        // Fallback to getByRole with spinbutton
        clicksElement = this.page.getByRole('spinbutton', { name: /click/i });
      }
      
      // Try inputValue first (for input/spinbutton elements)
      const inputValue = await clicksElement.inputValue().catch(() => null);
      if (inputValue !== null) {
        const numValue = parseInt(inputValue, 10);
        if (!isNaN(numValue)) return numValue;
      }
      
      // Fallback to value attribute
      const valueAttr = await clicksElement.getAttribute('value');
      if (valueAttr !== null && valueAttr !== '') {
        const numValue = parseInt(valueAttr, 10);
        if (!isNaN(numValue)) return numValue;
      }
      
      // Fallback to textContent
      const text = await clicksElement.textContent();
      if (text) {
        // Extract number from text (handles cases like "Count: 5" or just "5")
        const match = text.match(/-?\d+/);
        if (match) return parseInt(match[0], 10);
      }
    } catch (error) {
      console.log('Error getting counter value:', error);
    }
    
    return 0;
  }

  /**
   * Click the Flutter FAB (Floating Action Button) using coordinate-based clicking
   * FAB is usually positioned at bottom-right of the canvas
   */
  async clickIncrement(): Promise<void> {
    // Get the canvas bounding box
    const box = await this.canvas.boundingBox();
    if (!box) {
      throw new Error('Canvas not found');
    }
    

    const fabX = box.x + box.width - 50;
    const fabY = box.y + box.height - 50;
    
    // Click at the FAB coordinates
    await this.page.mouse.click(fabX, fabY);
    
    // Wait a bit for the state to update in Flutter
    await this.page.waitForTimeout(300);
  }


  
  async verifyCounterValue(expectedValue: number): Promise<void> {
    const actualValue = await this.getCounterValue();
    expect(actualValue).toBe(expectedValue);
  }


  async verifyCounterIncremented(beforeValue: number): Promise<void> {
    // Ensure sidebar is open
    await this.openSidebar();
    

    let clicksElement = this.counterValue;
    if (!(await clicksElement.isVisible({ timeout: 1000 }).catch(() => false))) {
      clicksElement = this.page.getByRole('spinbutton', { name: /click/i });
    }

    await expect.poll(async () => {
      try {
        const inputValue = await clicksElement.inputValue().catch(() => null);
        if (inputValue !== null) {
          return parseInt(inputValue, 10);
        }
        const valueAttr = await clicksElement.getAttribute('value');
        if (valueAttr) {
          return parseInt(valueAttr, 10);
        }
        const text = await clicksElement.textContent();
        if (text) {
          const match = text.match(/-?\d+/);
          return match ? parseInt(match[0], 10) : beforeValue;
        }
      } catch (error) {
        return beforeValue;
      }
      return beforeValue;
    }).toBe(beforeValue + 1);
  }

}

