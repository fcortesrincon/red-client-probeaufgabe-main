import { Component, OnInit, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchFormService, SearchModel } from './search-form.service';

@Component({
  selector: 'app-search',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  providers: [SearchFormService],
})
export class SearchFormComponent<T> implements OnInit {
  /** Implement Search Form */
  searchForm: FormGroup;

  constructor(public formBuilder: FormBuilder, @SkipSelf() public searchFormService: SearchFormService<T>) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      searchText: ['', { validators: [Validators.pattern('[a-zA-Z0-9]*')], updateOn: 'change' }],
      filter: [''],
    });
    const filterControl = this.searchForm.get('filter');
    this.searchFormService.filterOptionsAsObservable().subscribe((value) => {
      filterControl?.setValue(value[0]?.filterValue);
    });
    this.onChanges();
  }

  getSearchErrorMessage(): string {
    const searchTextControl = this.searchForm.get('searchText');
    return searchTextControl?.hasError(Validators.pattern.name) ? 'Not a valid search' : '';
  }

  private onChanges() {
    const searchTextControl = this.searchForm.get('searchText');
    const filterControl = this.searchForm.get('filter');
    searchTextControl?.valueChanges.subscribe((searchText) => {
      if (searchTextControl.valid) {
        this.searchFormService.setSearch({ filter: filterControl.value, query: searchText });
      }
    });
    filterControl?.valueChanges.subscribe(() => {
      if (searchTextControl.valid) {
        this.searchFormService.setSearch({ filter: filterControl.value, query: searchTextControl.value });
      }
    });
  }
}
