import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testMatch: /(.+.)?(test|spec).[jt]s/,
	testDir: 'tests',
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	use: {
		headless: false
	}
};

export default config;
