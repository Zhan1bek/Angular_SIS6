import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { SpacexService } from '../../services/spacex';
import { Store } from '@ngrx/store';
import * as ItemsActions from '../../items/state/items.actions';
import * as ItemsSelectors from '../../items/state/items.selectors';
import { I18nService } from '../../services/i18n.service';

import { catchError, switchMap, filter, take, timeout } from 'rxjs/operators';
import { forkJoin, of, throwError } from 'rxjs';

@Component({
  selector: 'app-launch-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './launch-detail.html',
  styleUrls: ['./launch-detail.css'],
})
export class LaunchDetail implements OnInit, OnDestroy {
  vm: any = null;
  loading = true;
  error = '';
  isOffline = false;
  i18n = inject(I18nService);

  constructor(
    private route: ActivatedRoute,
    private spacex: SpacexService,
    private location: Location,
    private store: Store
  ) {
    this.isOffline = !navigator.onLine;
    this.load();
  }

  ngOnInit(): void {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  ngOnDestroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.isOffline = false;
  };

  private handleOffline = () => {
    this.isOffline = true;
  };

  private load() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) {
            this.error = 'Launch not found';
            this.loading = false;
            return of(null);
          }

          this.loading = true;
          this.error = '';

          this.store.dispatch(ItemsActions.loadItem({ id }));

          const error$ = this.store.select(ItemsSelectors.selectSelectedItemError);
          error$.pipe(take(1)).subscribe(err => {
            if (err) {
              this.error = err;
              this.loading = false;
            }
          });

          return this.store.select(ItemsSelectors.selectSelectedItem).pipe(
            filter((launch: any | null) => !!launch && String(launch.id) === id),
            timeout(10000),
            take(1),
            catchError((err) => {
              this.error = err?.message || 'Failed to load launch';
              this.loading = false;
              return of(null);
            })
          );
        }),
        switchMap((launch: any | null) => {
          if (!launch) {
            return of({ launch: null, rocket: null, launchpad: null });
          }

          const rocket$ = launch.rocket
            ? this.spacex
              .getRocket(launch.rocket)
              .pipe(catchError(() => of(null)))
            : of(null);

          const launchpad$ = launch.launchpad
            ? this.spacex
              .getLaunchpad(launch.launchpad)
              .pipe(catchError(() => of(null)))
            : of(null);

          return forkJoin({
            launch: of(launch),
            rocket: rocket$,
            launchpad: launchpad$,
          });
        }),
        catchError(() => {
          this.error = 'Failed to load launch';
          this.loading = false;
          return of({ launch: null, rocket: null, launchpad: null });
        })
      )
      .subscribe(({ launch, rocket, launchpad }) => {
        if (!launch) {
          this.error = 'Launch not found';
          this.loading = false;
          return;
        }

        this.vm = {
          id: launch.id,
          name: launch.name,
          date: launch.date_utc,
          success: launch.success,
          details: launch.details,
          patch: launch.links?.patch?.large || launch.links?.patch?.small,
          article: launch.links?.article,
          webcast: launch.links?.webcast,
          images: launch.links?.flickr?.original ?? [],
          rocketName: rocket?.name ?? null,
          launchpadName: launchpad
            ? `${launchpad.name} (${launchpad.locality})`
            : null,
        };

        this.loading = false;
        this.error = '';
      });
  }

  goBack() {
    this.location.back();
  }
}
