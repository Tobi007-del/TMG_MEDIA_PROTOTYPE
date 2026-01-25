import { mergeObjs, parseAnyObj } from "../utils/obj";

// ============================================
// Example 1: Type-safe mergeObjs
// ============================================

const config1 = {
  server: {
    port: 8080,
    host: "localhost",
  },
  features: {
    logging: true,
  },
};

const config2 = {
  server: {
    port: 3000, // Overrides config1
    timeout: 5000, // New property
  },
  features: {
    caching: false, // New property
  },
  database: {
    url: "mongodb://localhost",
  },
};

const merged = mergeObjs(config1, config2);

// TypeScript knows all these properties exist and their types!
merged.server.port; // number
merged.server.host; // string
merged.server.timeout; // number
merged.features.logging; // boolean
merged.features.caching; // boolean
merged.database.url; // string

// ============================================
// Example 2: Type-safe parseAnyObj
// ============================================

// Flatten nested keys with separator
const flatConfig = {
  "server.port": 8080,
  "server.host": "localhost",
  "features.logging": true,
  "features.caching": false,
};

const parsed = parseAnyObj(flatConfig, ".");

// TypeScript infers the unflattened structure
parsed.server.port; // number
parsed.server.host; // string
parsed.features.logging; // boolean
parsed.features.caching; // boolean

// ============================================
// Example 3: Custom separator
// ============================================

const flatWithDash = {
  "server--port": 9000,
  "server--host": "127.0.0.1",
};

const parsedDash = parseAnyObj(flatWithDash, "--");

// Unflattened with custom separator
parsedDash.server.port; // number
parsedDash.server.host; // string

// ============================================
// Example 4: Merge with partial objects
// ============================================

interface AppConfig {
  theme: {
    primary: string;
    secondary: string;
  };
  settings: {
    autoSave: boolean;
    interval: number;
  };
}

const defaults: AppConfig = {
  theme: {
    primary: "#007bff",
    secondary: "#6c757d",
  },
  settings: {
    autoSave: true,
    interval: 5000,
  },
};

const userOverrides = {
  theme: {
    primary: "#ff0000",
  },
  settings: {
    interval: 10000,
  },
};

const finalConfig = mergeObjs(defaults, userOverrides);

// All properties are correctly typed
finalConfig.theme.primary; // "#ff0000"
finalConfig.theme.secondary; // "#6c757d" (from defaults)
finalConfig.settings.autoSave; // true (from defaults)
finalConfig.settings.interval; // 10000 (overridden)
