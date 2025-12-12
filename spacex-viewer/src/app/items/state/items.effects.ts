import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as ItemsActions from './items.actions';
import { ItemsService } from '../../services/items/items';

@Injectable()
export class ItemsEffects {
  private actions$ = inject(Actions);
  private itemsService = inject(ItemsService);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItems),
      switchMap(({ query, page = 1, limit = 10 }) =>
        this.itemsService.getItems(query ?? undefined, page, limit).pipe(
          map(({ items, totalDocs, page: resPage, limit: resLimit }) => 
            ItemsActions.loadItemsSuccess({ 
              items, 
              totalDocs, 
              page: resPage, 
              limit: resLimit 
            })
          ),
          catchError((error) =>
            of(
              ItemsActions.loadItemsFailure({
                error: error?.message ?? 'Failed to load items',
              })
            )
          )
        )
      )
    )
  );

  loadItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItem),
      switchMap(({ id }) =>
        this.itemsService.getItemById(id).pipe(
          map((item) => ItemsActions.loadItemSuccess({ item })),
          catchError((error) =>
            of(
              ItemsActions.loadItemFailure({
                error: error?.message ?? 'Failed to load item',
              })
            )
          )
        )
      )
    )
  );
}
