import { itemsReducer, initialState } from './items.reducer';
import * as ItemsActions from './items.actions';
import { Item } from '../../services/items/items';

describe('ItemsReducer', () => {
  const mockItem: Item = {
    id: '1',
    name: 'Test Launch',
    date_utc: '2024-01-01T00:00:00.000Z',
    success: true,
    details: 'Test details',
    links: {
      patch: { small: 'test.jpg' },
      flickr: { original: [] }
    },
    rocket: 'rocket-id',
    launchpad: 'launchpad-id'
  };

  it('should return initial state', () => {
    const action = {} as any;
    const state = itemsReducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('should handle loadItems', () => {
    const action = ItemsActions.loadItems({ query: null, page: 1, limit: 10 });
    const state = itemsReducer(initialState, action);
    
    expect(state.itemsLoading).toBe(true);
    expect(state.itemsError).toBeNull();
  });

  it('should handle loadItemsSuccess', () => {
    const items = [mockItem];
    const action = ItemsActions.loadItemsSuccess({
      items,
      totalDocs: 100,
      page: 1,
      limit: 10
    });
    const state = itemsReducer(initialState, action);
    
    expect(state.items).toEqual(items);
    expect(state.itemsLoading).toBe(false);
    expect(state.totalDocs).toBe(100);
    expect(state.currentPage).toBe(1);
    expect(state.pageSize).toBe(10);
  });

  it('should handle loadItemsFailure', () => {
    const error = 'Error loading items';
    const action = ItemsActions.loadItemsFailure({ error });
    const state = itemsReducer(initialState, action);
    
    expect(state.itemsLoading).toBe(false);
    expect(state.itemsError).toBe(error);
  });

  it('should handle loadItem', () => {
    const action = ItemsActions.loadItem({ id: '1' });
    const state = itemsReducer(initialState, action);
    
    expect(state.selectedItemLoading).toBe(true);
    expect(state.selectedItemError).toBeNull();
    expect(state.selectedItem).toBeNull();
  });

  it('should handle loadItemSuccess', () => {
    const action = ItemsActions.loadItemSuccess({ item: mockItem });
    const state = itemsReducer(initialState, action);
    
    expect(state.selectedItem).toEqual(mockItem);
    expect(state.selectedItemLoading).toBe(false);
    expect(state.selectedItemError).toBeNull();
  });

  it('should handle loadItemFailure', () => {
    const error = 'Error loading item';
    const action = ItemsActions.loadItemFailure({ error });
    const state = itemsReducer(initialState, action);
    
    expect(state.selectedItemLoading).toBe(false);
    expect(state.selectedItemError).toBe(error);
  });
});

