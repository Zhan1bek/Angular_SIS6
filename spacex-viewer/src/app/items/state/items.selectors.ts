import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITEMS_FEATURE_KEY, ItemsState } from './items.reducer';

export const selectItemsState =
  createFeatureSelector<ItemsState>(ITEMS_FEATURE_KEY);

export const selectItems = createSelector(
  selectItemsState,
  (state) => state.items
);

export const selectItemsLoading = createSelector(
  selectItemsState,
  (state) => state.itemsLoading
);

export const selectItemsError = createSelector(
  selectItemsState,
  (state) => state.itemsError
);

export const selectSelectedItem = createSelector(
  selectItemsState,
  (state) => state.selectedItem
);

export const selectSelectedItemLoading = createSelector(
  selectItemsState,
  (state) => state.selectedItemLoading
);

export const selectSelectedItemError = createSelector(
  selectItemsState,
  (state) => state.selectedItemError
);

export const selectCurrentPage = createSelector(
  selectItemsState,
  (state) => state.currentPage
);

export const selectPageSize = createSelector(
  selectItemsState,
  (state) => state.pageSize
);

export const selectTotalDocs = createSelector(
  selectItemsState,
  (state) => state.totalDocs
);

export const selectTotalPages = createSelector(
  selectItemsState,
  (state) => Math.ceil(state.totalDocs / state.pageSize)
);

export const selectHasNextPage = createSelector(
  selectItemsState,
  (state) => state.currentPage < Math.ceil(state.totalDocs / state.pageSize)
);

export const selectHasPrevPage = createSelector(
  selectItemsState,
  (state) => state.currentPage > 1
);