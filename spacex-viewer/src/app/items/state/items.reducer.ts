import { createReducer, on } from '@ngrx/store';
import * as ItemsActions from './items.actions';
import { Item } from '../../services/items/items';

export const ITEMS_FEATURE_KEY = 'items';

export interface ItemsState {
  items: Item[];
  itemsLoading: boolean;
  itemsError: string | null;

  selectedItem: Item | null;
  selectedItemLoading: boolean;
  selectedItemError: string | null;
}

export const initialState: ItemsState = {
  items: [],
  itemsLoading: false,
  itemsError: null,

  selectedItem: null,
  selectedItemLoading: false,
  selectedItemError: null,
};

export const itemsReducer = createReducer(
  initialState,

  on(ItemsActions.loadItems, (state) => ({
    ...state,
    itemsLoading: true,
    itemsError: null,
  })),
  on(ItemsActions.loadItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    itemsLoading: false,
    itemsError: null,
  })),
  on(ItemsActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    itemsLoading: false,
    itemsError: error,
  })),

  on(ItemsActions.loadItem, (state) => ({
    ...state,
    selectedItemLoading: true,
    selectedItemError: null,
    selectedItem: null,
  })),
  on(ItemsActions.loadItemSuccess, (state, { item }) => ({
    ...state,
    selectedItem: item,
    selectedItemLoading: false,
    selectedItemError: null,
  })),
  on(ItemsActions.loadItemFailure, (state, { error }) => ({
    ...state,
    selectedItemLoading: false,
    selectedItemError: error,
  }))
);
