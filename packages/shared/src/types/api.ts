import { z } from 'zod';

// ── API Response Envelope ────────────────────────────────────────────────────────
// Every endpoint returns this shape. Never deviate — the frontend types its
// fetch calls against ApiResponse<T> and PaginatedResponse<T>.

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta: ResponseMeta;
}

export interface ApiError {
  /** Machine-readable error code from ERROR_CODES */
  code: string;
  /** Human-readable message (safe to show to users) */
  message: string;
  /** Field-level validation errors, keyed by field name */
  details?: Record<string, string[]>;
}

export interface ResponseMeta {
  /** ISO-8601 timestamp of when the response was generated */
  timestamp: string;
  /** Correlation ID for tracing — populated by request logging middleware in Phase 1 */
  requestId?: string;
}

// ── Paginated Response ────────────────────────────────────────────────────────────
// Extends ApiResponse, setting data to T[] and adding pagination metadata.
// Clients MUST use this for any list endpoint.

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  error?: ApiError;
  meta: ResponseMeta;
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  /** Precomputed for client convenience — never require the client to recompute */
  hasNext: boolean;
  hasPrev: boolean;
}

// ── Pagination Query Schema ────────────────────────────────────────────────────────
// Shared between frontend (query param building) and backend (query param validation).
// z.coerce.number() handles the fact that query params arrive as strings.

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

// ── Sort Direction ────────────────────────────────────────────────────────────────

export const sortDirectionSchema = z.enum(['asc', 'desc']).default('asc');
export type SortDirection = z.infer<typeof sortDirectionSchema>;

// ── Error Codes ────────────────────────────────────────────────────────────────────
// Const object (not enum) → no runtime indirection, plain string literals in JSON.
// Every error the API can return MUST have a code defined here.
// Frontend can import these codes and switch on them for localized error messages.

export const ERROR_CODES = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // ── Validation ──────────────────────────────────────────────────────────────
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // ── Resources ───────────────────────────────────────────────────────────────
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',

  // ── Server ──────────────────────────────────────────────────────────────────
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  // ── Business Logic ──────────────────────────────────────────────────────────
  BOOKING_CONFLICT: 'BOOKING_CONFLICT',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  CAR_NOT_AVAILABLE: 'CAR_NOT_AVAILABLE',
  BOOKING_ALREADY_CANCELLED: 'BOOKING_ALREADY_CANCELLED',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
} as const;

/** Union type of all valid error codes */
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
