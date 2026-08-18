import type { ColumnDef, RowData } from '@tanstack/react-table';
import { coreFeatures, tableFeatures } from '@tanstack/react-table';

// Only the core feature set (table/column/row/header/cell + the core row
// model) is registered - no optional features (sorting, filtering, expanding,
// pagination, selection, ...). Every table in this app sorts/filters
// server-side via query params, and Categories' expand/collapse rows are
// plain component state, not tanstack's row-expanding feature. Keeping this
// to core-only avoids pulling tanstack/react-table's full stock feature set
// into every table's bundle.
export const APP_TABLE_FEATURES = tableFeatures(coreFeatures);
export type TAppTableFeatures = typeof APP_TABLE_FEATURES;

/**
 * Widens one column definition's value type to `any` so a list of columns
 * with different value types (string/number/date/...) can live in a single
 * array and be handed to `useTable`. `TValue` is inferred from the column
 * passed in, so `header`/`cell` callbacks inside `def` are still checked
 * against their own concrete value type - only the value returned by this
 * function loses that precision, not the definition itself.
 */
export const toColumn = <TData extends RowData, TValue>(
  def: ColumnDef<TAppTableFeatures, TData, TValue>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see doc comment above
): ColumnDef<TAppTableFeatures, TData, any> => def;
