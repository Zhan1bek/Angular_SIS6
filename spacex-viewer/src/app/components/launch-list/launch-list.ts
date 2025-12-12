import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Item } from '../../services/items/items';

import * as ItemsActions from '../../items/state/items.actions';
import * as ItemsSelectors from '../../items/state/items.selectors';
import { ItemCardComponent } from '../item-card/item-card';

import { SearchBar } from '../search-bar/search-bar';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-launch-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ItemCardComponent, SearchBar],
  templateUrl: './launch-list.html',
  styleUrls: ['./launch-list.css'],
})
export class LaunchList implements OnInit {
  items$!: Observable<Item[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  currentPage$!: Observable<number>;
  pageSize$!: Observable<number>;
  totalPages$!: Observable<number>;
  hasNextPage$!: Observable<boolean>;
  hasPrevPage$!: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.items$ = this.store.select(ItemsSelectors.selectItems);
    this.loading$ = this.store.select(ItemsSelectors.selectItemsLoading);
    this.error$ = this.store.select(ItemsSelectors.selectItemsError);
    this.currentPage$ = this.store.select(ItemsSelectors.selectCurrentPage);
    this.pageSize$ = this.store.select(ItemsSelectors.selectPageSize);
    this.totalPages$ = this.store.select(ItemsSelectors.selectTotalPages);
    this.hasNextPage$ = this.store.select(ItemsSelectors.selectHasNextPage);
    this.hasPrevPage$ = this.store.select(ItemsSelectors.selectHasPrevPage);
  }

  ngOnInit(): void {
    // Обработка поиска с debounceTime, distinctUntilChanged и switchMap в effects
    this.route.queryParamMap
      .pipe(
        map((params) => ({
          query: params.get('q') || '',
          page: parseInt(params.get('page') || '1', 10),
          limit: parseInt(params.get('limit') || '10', 10),
        })),
        debounceTime(300), // debounce для поиска
        distinctUntilChanged((prev, curr) => 
          prev.query === curr.query && prev.page === curr.page && prev.limit === curr.limit
        )
      )
      .subscribe(({ query, page, limit }) => {
        this.store.dispatch(ItemsActions.loadItems({ 
          query: query || null, 
          page, 
          limit 
        }));
      });
  }

  onQuery(value: string) {
    // При изменении поиска сбрасываем на первую страницу
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: value || null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  onLimitChange(limit: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { limit, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  trackById(index: number, item: Item): string {
    return item.id;
  }
}
