import { Component, Inject } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { SiteTitleService } from '@red-probeaufgabe/core';
import { FhirSearchFn, IFhirPatient, IFhirPractitioner, IFhirSearchResponse } from '@red-probeaufgabe/types';
import { IUnicornTableColumn } from '@red-probeaufgabe/ui';
import { AbstractSearchFacadeService } from '@red-probeaufgabe/search';
import { SearchFormService } from '../ui/search-form/search-form.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [SearchFormService],
})
export class DashboardComponent {
  // Init unicorn columns to display
  columns: Set<IUnicornTableColumn> = new Set<IUnicornTableColumn>([
    'number',
    'resourceType',
    'name',
    'gender',
    'birthDate',
  ]);
  isLoading = true;

  /*
   * Implement search on keyword or fhirSearchFn change
   **/
  search$: Subject<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> = new Subject<
    IFhirSearchResponse<IFhirPatient | IFhirPractitioner>
  >();

  entries$: Observable<Array<IFhirPatient | IFhirPractitioner>> = this.search$.asObservable().pipe(
    map((data) => !!data && data.entry),
    startWith([]),
  );

  totalLength$ = this.search$.asObservable().pipe(
    map((data) => !!data && data.total),
    startWith(0),
  );

  /**
   *
   * @param siteTitleService
   * @param searchFacade
   * @param searchFormService
   */
  // AbstractSearchFacadeService is an abstract class that can not be instanced.
  // It is necessary to instance a class that defines the facade class and functions
  // SearchFacadeService extends from the facade and overwrites the abstract functions.
  // The definition should be done in the dashboard module as is only there required
  constructor(
    private siteTitleService: SiteTitleService,
    @Inject('AbstractSearchFacadeService') private searchFacade: AbstractSearchFacadeService,
    private searchFormService: SearchFormService<FhirSearchFn>,
  ) {
    this.siteTitleService.setSiteTitle('Dashboard');
    this.searchFormService.setFilterOptions([
      { filterValue: FhirSearchFn.SearchAll, filterText: 'Patients + Practitioners (Patient/Ärzte)' },
      { filterValue: FhirSearchFn.SearchPatients, filterText: 'Patients (Patient)' },
      { filterValue: FhirSearchFn.SearchPractitioners, filterText: 'Practitioners (Ärzte)' },
    ]);
    this.searchFormService.searchTextAsObservable().subscribe((searchResult) => {
      this.performSearch(searchResult.filter, searchResult.query);
    });
    this.performSearch(FhirSearchFn.SearchAll, '');
  }

  private performSearch(type: FhirSearchFn, query: string): void {
    this.searchFacade
      .search(type, query)
      .pipe(
        catchError(this.handleError),
        tap((data) => {
          this.isLoading = false;
        }),
        shareReplay(),
      )
      .subscribe((results) => {
        this.search$.next(results);
      });
  }

  private handleError(): Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> {
    return of({ entry: [], total: 0 });
  }
}
