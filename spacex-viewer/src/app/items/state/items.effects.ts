// src/app/items/state/items.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as ItemsActions from './items.actions';
import { ItemsService } from '../../services/items/items';

@Injectable()
export class ItemsEffects {
  // безопасный способ для Angular 20+: получаем зависимости через inject()
  private actions$ = inject(Actions);
  private itemsService = inject(ItemsService);

  // Загрузка списка
  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItems),
      switchMap(({ query }) =>
        this.itemsService.getItems(query ?? undefined).pipe(
          map((items) => ItemsActions.loadItemsSuccess({ items })),
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

  // Загрузка деталей
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
