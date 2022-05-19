import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractSearchFacadeService, FhirUtilService } from '@red-probeaufgabe/search';
import { FhirResourceType, IFhirPatient, IFhirPractitioner } from '@red-probeaufgabe/types';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent implements OnInit {
  type: FhirResourceType;
  FhirResourceType = FhirResourceType;
  data: IFhirPatient | IFhirPractitioner | undefined;

  private id: string;

  constructor(
    private route: ActivatedRoute,
    @Inject('AbstractSearchFacadeService') private searchFacade: AbstractSearchFacadeService,
    private fhirUtilService: FhirUtilService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.type =
      this.route.snapshot.paramMap.get('type') === FhirResourceType.Patient
        ? FhirResourceType.Patient
        : FhirResourceType.Practitioner;

    if (this.type === FhirResourceType.Patient) {
      this.searchFacade.findPatientById(this.id).subscribe((result) => {
        this.data = this.fhirUtilService.prepareData(result);
      });
    } else {
      this.searchFacade.findPractitionerById(this.id).subscribe((result) => {
        this.data = this.fhirUtilService.prepareData(result);
      });
    }
  }
}
