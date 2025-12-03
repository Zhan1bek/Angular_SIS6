import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';

import { SpacexService } from '../spacex';
import { Launch } from '../../models/launch';

export type Item = Launch;

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private spacex: SpacexService) {}

  getItems(query?: string): Observable<Item[]> {
    const term = query?.trim() ?? '';
    const limit = 120;

    if (!navigator.onLine) {
      return throwError(() => new Error("You are offline. Cached data is not available yet."));
    }

    if (term.length > 0) {
      return this.spacex.searchLaunches(term, false, limit);
    }


    return this.spacex.getLaunches(limit);
  }

  getItemById(id: string | number): Observable<Item> {
    return this.spacex.getLaunch(String(id));
  }
}
