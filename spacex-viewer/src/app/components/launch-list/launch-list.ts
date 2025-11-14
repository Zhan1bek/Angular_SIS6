import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Observable, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';

import { Item, ItemsService } from '../../services/items/items';
import { SearchBar } from '../search-bar/search-bar';
import { ItemCardComponent } from '../item-card/item-card';

@Component({
  selector: 'app-launch-list',
  standalone: true,
  imports: [CommonModule, SearchBar, ItemCardComponent],
  templateUrl: './launch-list.html',
  styleUrl: './launch-list.css'
})
export class LaunchList {
  launches$!: Observable<Item[]>;
  loading = true;
  error = '';

  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const query$ = this.route.queryParamMap.pipe(
      map(params => (params.get('q') ?? '').trim()),
      distinctUntilChanged()
    );

    this.launches$ = query$.pipe(
      startWith(''),
      tap(() => {
        this.loading = true;
        this.error = '';
      }),
      switchMap(term =>
        this.itemsService.getItems(term).pipe(
          catchError(() => {
            this.error = 'Failed to load items';
            return of([] as Item[]);
          })
        )
      ),
      tap(() => {
        this.loading = false;
      }),
      shareReplay(1)
    );
  }

  onQuery(value: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: value || null },
      queryParamsHandling: 'merge'
    });
  }
}
