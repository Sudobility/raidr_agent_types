// Re-export common types from @sudobility/types
// Generic response/health types and the response constructors/guards are the
// canonical ones from @sudobility/types — this package never redefines them.
export type {
  ApiResponse,
  BaseResponse,
  NetworkClient,
  Optional,
  ApiInfoResponse,
  HealthResponse,
  HealthCheckData,
} from '@sudobility/types';
export {
  successResponse,
  errorResponse,
  isSuccessResponse,
  isErrorResponse,
} from '@sudobility/types';

// =============================================================================
// Type Aliases
// =============================================================================

/**
 * ISO 8601 formatted datetime string.
 *
 * @example "2025-01-15T10:30:00.000Z"
 */
export type ISODateString = string & { readonly __brand: 'ISODateString' };

// =============================================================================
// User
// =============================================================================

/**
 * User account information.
 *
 * @example
 * ```typescript
 * const user: User = {
 *   firebase_uid: 'uid123',
 *   email: 'user@example.com',
 *   display_name: 'John Doe',
 *   created_at: '2025-01-15T10:30:00.000Z',
 *   updated_at: '2025-01-15T10:30:00.000Z',
 * };
 * ```
 */
export interface User {
  /** Firebase Authentication UID */
  firebase_uid: string;
  /** User email address, nullable */
  email: string | null;
  /** User display name, nullable */
  display_name: string | null;
  /** ISO 8601 timestamp of account creation, nullable */
  created_at: string | null;
  /** ISO 8601 timestamp of last update, nullable */
  updated_at: string | null;
}

// =============================================================================
// API Responses, response helpers and guards
//
// `ApiInfoResponse`, `HealthResponse`, `HealthCheckData`, `successResponse`,
// `errorResponse`, `isSuccessResponse` and `isErrorResponse` are re-exported
// from `@sudobility/types` at the top of this file — not defined here.
// =============================================================================

export * from './agent.js';
