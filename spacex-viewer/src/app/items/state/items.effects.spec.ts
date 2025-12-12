import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { ItemsEffects } from './items.effects';
import { ItemsService } from '../../services/items/items';
import * as ItemsActions from './items.actions';
import { Item } from '../../services/items/items';

describe('ItemsEffects', () => {
  let actions$: Observable<any>;
  let effects: ItemsEffects;
  let mockItemsService: jasmine.SpyObj<ItemsService>;

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

  beforeEach(() => {
    mockItemsService = jasmine.createSpyObj('ItemsService', ['getItems', 'getItemById']);

    TestBed.configureTestingModule({
      providers: [
        ItemsEffects,
        provideMockActions(() => actions$),
        { provide: ItemsService, useValue: mockItemsService }
      ]
    });

    effects = TestBed.inject(ItemsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should load items successfully', (done) => {
    const action = ItemsActions.loadItems({ query: null, page: 1, limit: 10 });
    const successAction = ItemsActions.loadItemsSuccess({
      items: [mockItem],
      totalDocs: 100,
      page: 1,
      limit: 10
    });

    actions$ = of(action);
    mockItemsService.getItems.and.returnValue(of({
      items: [mockItem],
      totalDocs: 100,
      page: 1,
      limit: 10
    }));

    effects.loadItems$.subscribe(result => {
      expect(result).toEqual(successAction);
      done();
    });
  });

  it('should handle load items error', (done) => {
    const action = ItemsActions.loadItems({ query: null, page: 1, limit: 10 });
    const errorAction = ItemsActions.loadItemsFailure({
      error: 'Failed to load items'
    });

    actions$ = of(action);
    mockItemsService.getItems.and.returnValue(throwError(() => new Error('Failed to load items')));

    effects.loadItems$.subscribe(result => {
      expect(result).toEqual(errorAction);
      done();
    });
  });

  it('should load item successfully', (done) => {
    const action = ItemsActions.loadItem({ id: '1' });
    const successAction = ItemsActions.loadItemSuccess({ item: mockItem });

    actions$ = of(action);
    mockItemsService.getItemById.and.returnValue(of(mockItem));

    effects.loadItem$.subscribe(result => {
      expect(result).toEqual(successAction);
      done();
    });
  });

  it('should handle load item error', (done) => {
    const action = ItemsActions.loadItem({ id: '1' });
    const errorAction = ItemsActions.loadItemFailure({
      error: 'Failed to load item'
    });

    actions$ = of(action);
    mockItemsService.getItemById.and.returnValue(throwError(() => new Error('Failed to load item')));

    effects.loadItem$.subscribe(result => {
      expect(result).toEqual(errorAction);
      done();
    });
  });
});

