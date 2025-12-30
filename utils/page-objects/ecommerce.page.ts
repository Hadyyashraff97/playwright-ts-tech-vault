/**
 * E-Commerce Page Object Model
 * Encapsulates page interactions for the e-commerce application
 */

import { Page, Locator, expect } from '@playwright/test';

export class ECommercePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly addProductButton: Locator;
  readonly productModal: Locator;
  readonly productNameInput: Locator;
  readonly productPriceInput: Locator;
  readonly productDescriptionInput: Locator;
  readonly submitProductButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder*="Search for products ..."]');
    this.addProductButton = page.locator('button:has-text("Add"), button:has-text("Add Product"), a:has-text("Add Product")').first();
    this.productModal = page.locator('[role="dialog"], .modal, .product-form').first();
    this.productNameInput = page.locator('input[name="title"]');
    this.productPriceInput = page.locator('input[name*="price" i], input[type="number"], #productPrice').first();
    this.productDescriptionInput = page.locator('input[name="description"]');
    this.submitProductButton = page.locator('button[type="submit"]:has-text("Create Product")');

  }

  /**
   * Navigate to the e-commerce page
   */
  async goto(): Promise<void> {
    await this.page.goto('https://e-commerce-kib.netlify.app/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Search for products
   */
  async searchProduct(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get search results count
   */


  /**
   * Get product titles from search results


  /**
   * Click add product button
   */
  async clickAddProduct(): Promise<void> {
    await this.addProductButton.click();
    await this.page.waitForTimeout(500); 
  }

  /**
   * Fill product form
   */
  async fillProductForm(name: string, price: string, description: string): Promise<void> {
    if (await this.productNameInput.isVisible()) {
      await this.productNameInput.fill(name);
    }
    
    if (await this.productPriceInput.isVisible()) {
      await this.productPriceInput.fill(price);
    }
    
    if (await this.productDescriptionInput.isVisible()) {
      await this.productDescriptionInput.fill(description);
    }
    
  }

  /**
   * Submit product form
   */
  async submitProduct(): Promise<void> {
    await this.submitProductButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add a new product
   */
  async addProduct(name: string, price: string, description: string): Promise<void> {
    await this.clickAddProduct();
    await this.fillProductForm(name, price, description);
    await this.submitProduct();
  }



 
}

