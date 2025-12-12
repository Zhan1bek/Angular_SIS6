import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { map } from 'rxjs/operators';

import { SpacexService } from '../spacex';
import { Launch } from '../../models/launch';

export type Item = Launch;

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private spacex: SpacexService) {}

  getItems(query?: string, page: number = 1, limit: number = 10): Observable<{items: Item[], totalDocs: number, page: number, limit: number}> {
    const term = query?.trim() ?? '';

    if (term.length > 0) {
      return this.spacex.searchLaunches(term, false, limit, page).pipe(
        map(res => ({
          items: res.docs,
          totalDocs: res.totalDocs,
          page: res.page,
          limit: res.limit
        }))
      );
    }

    return this.spacex.getLaunches(limit, page).pipe(
      map(res => ({
        items: res.docs,
        totalDocs: res.totalDocs,
        page: res.page,
        limit: res.limit
      }))
    );
  }

  getItemById(id: string | number): Observable<Item> {
    return this.spacex.getLaunch(String(id));
  }
}
