/**
 * Grafana Faro Configuration Interface
 * Defines the structure for Grafana Frontend Observability configuration
 */
export interface GrafanaConfig {
  enabled: boolean;
  url: string;
  appName: string;
  appVersion: string;
  environment: string;
  sessionTracking?: {
    enabled: boolean;
    persistent: boolean;
  };
  instrumentations?: {
    errors: boolean;
    console: boolean;
    webVitals: boolean;
    interactions: boolean;
    network: boolean;
  };
}

/**
 * User context for Grafana Faro
 * Used to track user information in observability data
 */
export interface GrafanaUserContext {
  id: string;
  email?: string;
  username?: string;
  attributes?: Record<string, string>;
}

/**
 * Custom event for Grafana Faro
 * Used to track custom application events
 */
export interface GrafanaCustomEvent {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  domain?: string;
}

/**
 * Performance measurement for Grafana Faro
 * Used to track custom performance metrics
 */
export interface GrafanaPerformanceMeasurement {
  name: string;
  value: number;
  attributes?: Record<string, string | number | boolean>;
}

/**
 * Error context for Grafana Faro
 * Additional context to attach to error reports
 */
export interface GrafanaErrorContext {
  context?: string;
  attributes?: Record<string, string | number | boolean>;
}

