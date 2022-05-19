import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

export interface FilterOption<T> {
  filterValue: T;
  filterText: string;
}
export interface SearchModel<T> {
  filter: T;
  query: string;
}

@Injectable()
export class SearchFormService<T> {
  private filterOptions: BehaviorSubject<FilterOption<T>[]> = new BehaviorSubject<FilterOption<T>[]>([]);
  private searchRequest: ReplaySubject<SearchModel<T>> = new ReplaySubject<SearchModel<T>>();

  filterOptionsAsObservable(): Observable<FilterOption<T>[]> {
    return this.filterOptions.asObservable();
  }

  searchTextAsObservable(): Observable<SearchModel<T>> {
    return this.searchRequest.asObservable();
  }

  setFilterOptions(filterOptions: FilterOption<T>[]): void {
    this.filterOptions.next(filterOptions);
  }

  setSearch(searchModel: SearchModel<T>): void {
    this.searchRequest.next(searchModel);
  }
}
