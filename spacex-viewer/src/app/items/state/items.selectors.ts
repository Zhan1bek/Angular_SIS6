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
