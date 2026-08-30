import { InjectionToken } from '@angular/core';

export interface DataCatalogConfig {
  defaultLimit: number;
  rowsPerPage: number;
}

// 📦 Your Single Source of Truth configuration constants
export const GLOBAL_CATALOG_CONFIG: DataCatalogConfig = {
  defaultLimit: 100, // Bulk chunk network size
  rowsPerPage: 10    // Baseline visibility UI count
};

// 🔑 The Injection Token used to broadcast this config across your monorepo workspace
export const CATALOG_CONFIG_TOKEN = new InjectionToken<DataCatalogConfig>('CatalogConfigToken', {
  providedIn: 'root',
  factory: () => GLOBAL_CATALOG_CONFIG
});
