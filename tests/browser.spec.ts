import { test, expect } from '@playwright/test';

const SUBMIT_TIMEOUT = 15000;
const SUBMIT_MODAL_ID = 'SUBMIT_MODAL';

test.describe('Svelte Modal Complete Functionality Test', () => {
	test('should complete the entire modal workflow', async ({ page }) => {
		await page.goto('http://localhost:5173');
		await page.waitForSelector('#form button', { state: 'visible' });

		await page.click('#btn-INFO_MODAL');

		await page.fill('#name', 'John Doe');
		await page.fill('#phone', '555-555-5555');
		await page.fill('#email', 'john.doe@acme.com');

		await page.click('#btn-submit-form');

		await page.click(`#btn-submit`);
		await page.waitForTimeout(500);

		await page.click(`#btn-submit`);
		await page.click('body');

		const successMessage = page.locator('.text-4xl');
		console.log(successMessage);

		expect(await successMessage.textContent()).toBe('🎉 Desafio finalizado com sucesso!');
	});

	test('should display profile data correctly', async ({ page }) => {
		await page.goto('http://localhost:5173');
		await page.waitForSelector('#form button', { state: 'visible' });

		await page.click('#btn-INFO_MODAL');

		await page.fill('#name', 'John Doe');
		await page.fill('#phone', '555-555-5555');
		await page.fill('#email', 'john.doe@acme.com');

		await page.click('#btn-submit-form');

		await page.click(`#btn-candidate`);
		await page.waitForURL('http://localhost:5173/candidate');

		await page.click('body');

		const nameText = await page.textContent('#profile-name');
		const phoneText = await page.textContent('#profile-phone');
		const emailText = await page.textContent('#profile-email');

		expect(nameText).toBe('John Doe');
		expect(phoneText).toBe('555-555-5555');
		expect(emailText).toBe('john.doe@acme.com');

		await page.click('.btn-primary');
		await page.waitForURL('http://localhost:5173/');

		const currentUrl = page.url();

		expect(currentUrl).toBe('http://localhost:5173/');
	});

	test('should handle timeout correctly', async ({ page }) => {
		await page.goto('http://localhost:5173');

		await page.waitForSelector('#form button', { state: 'visible' });

		await page.click('#btn-INFO_MODAL');

		await page.fill('#name', 'John Doe');
		await page.fill('#phone', '555-555-5555');
		await page.fill('#email', 'john.doe@acme.com');

		await page.click('#btn-submit-form');

		await page.click(`#btn-submit`);

		await page.waitForTimeout(SUBMIT_TIMEOUT);
		await page.waitForSelector(`#${SUBMIT_MODAL_ID}`, { state: 'visible' });

		const failureMessage = page.locator('.text-4xl');
		expect(await failureMessage.textContent()).toBe('Desafio finalizado com falha!');

		await page.click(`#${SUBMIT_MODAL_ID} button`);
	});
});
