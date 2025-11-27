import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { Item } from '../../services/items/items';
import * as ItemsActions from '../../items/state/items.actions';
import * as ItemsSelectors from '../../items/state/items.selectors';

import { ItemCardComponent } from '../item-card/item-card';
import { SearchBar } from '../search-bar/search-bar';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.items$ = this.store.select(ItemsSelectors.selectItems);
    this.loading$ = this.store.select(ItemsSelectors.selectItemsLoading);
    this.error$ = this.store.select(ItemsSelectors.selectItemsError);
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map((params) => params.get('q') || ''),
        distinctUntilChanged()
      )
      .subscribe((query) => {
        this.store.dispatch(ItemsActions.loadItems({ query }));
      });
  }

  onQuery(value: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: value || null },
      queryParamsHandling: 'merge',
    });
  }

  trackById(index: number, item: Item): string {
    return item.id;
  }
}
