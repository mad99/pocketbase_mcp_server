import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface PocketBaseConfig {
  url: string;
  adminEmail?: string;
  adminPassword?: string;
}

export function loadPocketBaseConfig(): PocketBaseConfig {
  const silent = process.env.MCP_SILENT === 'true';

  // 1. Check for .pocketbase-mcp.json in current directory
  const localConfigPath = join(process.cwd(), '.pocketbase-mcp.json');
  if (existsSync(localConfigPath)) {
    try {
      const config = JSON.parse(readFileSync(localConfigPath, 'utf-8'));
      if (config.url) {
        if (!silent) console.error(`Using PocketBase URL from local config: ${config.url}`);
        return {
          url: config.url,
          adminEmail: config.adminEmail ?? process.env.POCKETBASE_ADMIN_EMAIL,
          adminPassword: config.adminPassword ?? process.env.POCKETBASE_ADMIN_PASSWORD,
        };
      }
    } catch (e) {
      if (!silent) console.error('Error reading local config:', e);
    }
  }

  // 2. Check environment variables
  const envUrl = process.env.POCKETBASE_URL;
  if (envUrl) {
    if (!silent) console.error(`Using PocketBase URL from environment: ${envUrl}`);
    return {
      url: envUrl,
      adminEmail: process.env.POCKETBASE_ADMIN_EMAIL,
      adminPassword: process.env.POCKETBASE_ADMIN_PASSWORD,
    };
  }

  // 3. Default URL
  const defaultUrl = 'http://127.0.0.1:8090';
  if (!silent) console.error(`Using default PocketBase URL: ${defaultUrl}`);
  return {
    url: defaultUrl,
    adminEmail: process.env.POCKETBASE_ADMIN_EMAIL,
    adminPassword: process.env.POCKETBASE_ADMIN_PASSWORD,
  };
}

// Backwards compatibility
export function loadPocketBaseUrl(): string {
  return loadPocketBaseConfig().url;
}