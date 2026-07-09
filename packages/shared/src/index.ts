/**
 * @carrental/shared
 *
 * Public API of the shared package. Every cross-app type, schema, and constant
 * is exported from here. Consumers import directly from '@carrental/shared' —
 * never from deep paths within this package.
 */

export type {
  ApiResponse,
  ApiError,
  ResponseMeta,
  PaginatedResponse,
  PaginationMeta,
  PaginationQuery,
  SortDirection,
  ErrorCode,
} from './types/api';

export { paginationSchema, sortDirectionSchema, ERROR_CODES } from './types/api';
