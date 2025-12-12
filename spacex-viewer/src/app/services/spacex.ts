import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Launch} from '../models/launch';

@Injectable({
  providedIn: 'root'
})
export class SpacexService {
  private base = 'https://api.spacexdata.com/v5';

  constructor(private http: HttpClient) {}

  getLaunches(limit = 30, page = 1) : Observable<{docs: Launch[], totalDocs: number, page: number, limit: number}> {
    const body = {
      query: {},
      options:{
        sort: { date_utc: 'desc' },
        limit,
        page
      }
    };

    return this.http.post<{docs: Launch[], totalDocs: number, page: number, limit: number}>(`${this.base}/launches/query`, body)
  }

  searchLaunches(term: string, successOnly = false, limit = 30, page = 1) : Observable<{docs: Launch[], totalDocs: number, page: number, limit: number}> {
    const query:any = {};
    if (term && term.trim().length > 0) {
      query.name = {$regex: term.trim(), $options: 'i'}
    }
    if (successOnly) {
      query.success = true
    }


    const body = {
      query,
      options:{
        sort: { date_utc: 'desc' },
        limit,
        page
      }
    }

    return this.http.post<{docs: Launch[], totalDocs: number, page: number, limit: number}>(`${this.base}/launches/query`, body)
  }

  getLaunch(id: string): Observable<Launch> {
    return this.http.get<Launch>(`${this.base}/launches/${id}`);
  }

  getRocket(id: string) {
    return this.http.get<{ id: string; name: string }>(`${this.base}/rockets/${id}`);
  }

  getLaunchpad(id: string) {
    return this.http.get<{ id: string; name: string; locality: string }>(`${this.base}/launchpads/${id}`);
  }


}
