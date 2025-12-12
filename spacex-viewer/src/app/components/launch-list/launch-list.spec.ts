import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { LaunchList } from './launch-list';

describe('LaunchList', () => {
  let component: LaunchList;
  let fixture: ComponentFixture<LaunchList>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      queryParamMap: of({
        get: (key: string) => {
          const params: any = { q: '', page: '1', limit: '10' };
          return params[key] || null;
        }
      })
    };

    mockStore.select.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [LaunchList],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have observables for items, loading, error', () => {
    expect(component.items$).toBeDefined();
    expect(component.loading$).toBeDefined();
    expect(component.error$).toBeDefined();
  });

  it('should have pagination observables', () => {
    expect(component.currentPage$).toBeDefined();
    expect(component.pageSize$).toBeDefined();
    expect(component.totalPages$).toBeDefined();
    expect(component.hasNextPage$).toBeDefined();
    expect(component.hasPrevPage$).toBeDefined();
  });

  it('should dispatch loadItems on query change', () => {
    component.onQuery('test');
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should dispatch loadItems on page change', () => {
    component.onPageChange(2);
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should dispatch loadItems on limit change', () => {
    component.onLimitChange(20);
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should track items by id', () => {
    const item = { id: '1', name: 'Test', date_utc: '2024-01-01', links: { patch: { small: '' }, flickr: { original: [] } }, rocket: '', launchpad: '' };
    expect(component.trackById(0, item)).toBe('1');
  });

  it('should handle offline status', () => {
    window.dispatchEvent(new Event('offline'));
    expect(component).toBeTruthy();
  });

  it('should handle online status', () => {
    window.dispatchEvent(new Event('online'));
    expect(component).toBeTruthy();
  });

  it('should navigate with query params on query change', () => {
    component.onQuery('test query');
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: { q: 'test query', page: 1 },
        queryParamsHandling: 'merge'
      })
    );
  });

  it('should navigate with page param on page change', () => {
    component.onPageChange(3);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: { page: 3 },
        queryParamsHandling: 'merge'
      })
    );
  });

  it('should navigate with limit and reset page on limit change', () => {
    component.onLimitChange(20);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: { limit: 20, page: 1 },
        queryParamsHandling: 'merge'
      })
    );
  });
});
