import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Launch } from '../../models/launch';
import { SpacexService } from '../../services/spacex';
import {
  Observable, Subject, BehaviorSubject, combineLatest, of, switchMap, tap,
} from 'rxjs';
import {
  debounceTime, distinctUntilChanged, startWith,
  map, catchError, shareReplay
} from 'rxjs/operators';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  selector: 'app-launch-list',
  standalone: true,
  imports: [CommonModule, SearchBar, RouterLink],
  templateUrl: './launch-list.html',
  styleUrl: './launch-list.css'
})
export class LaunchList implements OnDestroy {
  private query$ = new Subject<string>();
  private successOnly$ = new BehaviorSubject<boolean>(false);

  launches$!: Observable<Launch[]>;

  loading = true;
  error = '';

  constructor(private api: SpacexService) {
    const search$ = this.query$.pipe(
      startWith(''),
      map(s => s.trim()),
      debounceTime(300),
      distinctUntilChanged()
    );

    const success$ = this.successOnly$.pipe(
      startWith(false),
      distinctUntilChanged()
    )


    this.launches$ = combineLatest([search$, success$]).pipe(
      tap(() => { this.loading = true; this.error = ''; }),
      switchMap(([term, successOnly]) =>
        (term || successOnly
            ? this.api.searchLaunches(term, successOnly, 120)
            : this.api.getLaunches(120)
        ).pipe(
          catchError(() => {
            this.error = 'Failed to load launch';
            return of<Launch[]>([]);
          })
        )
      ),
      tap(() => { this.loading = false; })
    );

    this.launches$.subscribe({ next: () => (this.loading = false) });
  }

  onQuery(value: string) {
    this.query$.next(value);
  }

  toggleSuccessOnly(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.successOnly$.next(checked);
  }

  ngOnDestroy() {
    this.query$.complete();
    this.successOnly$.complete();
  }
}
