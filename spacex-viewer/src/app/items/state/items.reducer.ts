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

  // Pagination
  currentPage: number;
  pageSize: number;
  totalDocs: number;
}

export const initialState: ItemsState = {
  items: [],
  itemsLoading: false,
  itemsError: null,

  selectedItem: null,
  selectedItemLoading: false,
  selectedItemError: null,

  // Pagination
  currentPage: 1,
  pageSize: 10,
  totalDocs: 0,
};

export const itemsReducer = createReducer(
  initialState,

  on(ItemsActions.loadItems, (state) => ({
    ...state,
    itemsLoading: true,
    itemsError: null,
  })),
  on(ItemsActions.loadItemsSuccess, (state, { items, totalDocs, page, limit }) => ({
    ...state,
    items,
    itemsLoading: false,
    itemsError: null,
    totalDocs: totalDocs ?? state.totalDocs,
    currentPage: page ?? state.currentPage,
    pageSize: limit ?? state.pageSize,
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
