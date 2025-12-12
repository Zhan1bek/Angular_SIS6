import { itemsReducer, initialState, ItemsState } from './items.reducer';
import * as ItemsSelectors from './items.selectors';

describe('ItemsSelectors', () => {
  const mockState: ItemsState = {
    items: [
      { id: '1', name: 'Test Launch 1', date_utc: '2024-01-01', links: { patch: { small: '' }, flickr: { original: [] } }, rocket: '', launchpad: '' }
    ],
    itemsLoading: false,
    itemsError: null,
    selectedItem: { id: '1', name: 'Test Launch 1', date_utc: '2024-01-01', links: { patch: { small: '' }, flickr: { original: [] } }, rocket: '', launchpad: '' },
    selectedItemLoading: false,
    selectedItemError: null,
    currentPage: 1,
    pageSize: 10,
    totalDocs: 100
  };

  it('should select items', () => {
    const result = ItemsSelectors.selectItems.projector(mockState);
    expect(result).toEqual(mockState.items);
  });

  it('should select items loading', () => {
    const result = ItemsSelectors.selectItemsLoading.projector(mockState);
    expect(result).toBe(false);
  });

  it('should select items error', () => {
    const result = ItemsSelectors.selectItemsError.projector(mockState);
    expect(result).toBeNull();
  });

  it('should select selected item', () => {
    const result = ItemsSelectors.selectSelectedItem.projector(mockState);
    expect(result).toEqual(mockState.selectedItem);
  });

  it('should select current page', () => {
    const result = ItemsSelectors.selectCurrentPage.projector(mockState);
    expect(result).toBe(1);
  });

  it('should select page size', () => {
    const result = ItemsSelectors.selectPageSize.projector(mockState);
    expect(result).toBe(10);
  });

  it('should select total docs', () => {
    const result = ItemsSelectors.selectTotalDocs.projector(mockState);
    expect(result).toBe(100);
  });

  it('should calculate total pages', () => {
    const result = ItemsSelectors.selectTotalPages.projector(mockState);
    expect(result).toBe(10);
  });

  it('should check has next page', () => {
    const stateWithNext = { ...mockState, currentPage: 1, totalDocs: 100, pageSize: 10 };
    const result = ItemsSelectors.selectHasNextPage.projector(stateWithNext);
    expect(result).toBe(true);
    
    const stateWithoutNext = { ...mockState, currentPage: 10, totalDocs: 100, pageSize: 10 };
    const result2 = ItemsSelectors.selectHasNextPage.projector(stateWithoutNext);
    expect(result2).toBe(false);
  });

  it('should check has prev page', () => {
    const statePage1 = { ...mockState, currentPage: 1 };
    const result = ItemsSelectors.selectHasPrevPage.projector(statePage1);
    expect(result).toBe(false);
    
    const statePage2 = { ...mockState, currentPage: 2 };
    const result2 = ItemsSelectors.selectHasPrevPage.projector(statePage2);
    expect(result2).toBe(true);
  });
});

