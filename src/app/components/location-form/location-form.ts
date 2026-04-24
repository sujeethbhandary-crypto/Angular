import { Component, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '../../services/location-service';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-location-form',
  imports: [ReactiveFormsModule, A11yModule],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
})
export class LocationForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  locationService = inject(LocationService);
  shouldShowPanel = signal<boolean>(false);

  formBuilder = inject(FormBuilder);

  profileForm = this.formBuilder.group({
    id: this.formBuilder.control<number | null>(null),
    name: this.formBuilder.control<string>('', { validators: [Validators.required] }),
    city: this.formBuilder.control<string>('', { validators: [Validators.required] }),
    state: this.formBuilder.control<string>('', { validators: [Validators.required] }),
    photo: this.formBuilder.control<string>('', { validators: [Validators.required] }),
    availableUnits: this.formBuilder.control<number | null>(null),
    wifi: this.formBuilder.control<boolean>(false),
    laundry: this.formBuilder.control<boolean>(false),
    deleted: this.formBuilder.control<boolean>(false),
  });

  ngOnInit() {
    this.showPannel();
    document.body.style.overflow = 'hidden';

    const idParam = this.route.parent?.snapshot.paramMap.get('id');
    const routeId = idParam ? Number(idParam) : null;

    if (routeId !== null && !isNaN(routeId)) {
      const existingLocation = this.locationService.getLocationForId(routeId);

      if (existingLocation) {
        this.profileForm.patchValue(existingLocation);
      }
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.closeAndGoHome();
  }

  showPannel() {
    this.shouldShowPanel.set(true);
  }

  HidePannel() {
    this.shouldShowPanel.set(false);
  }

  onSubmit() {
    console.log(this.profileForm.value);
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const payload = this.profileForm.getRawValue() as HousingLocationInfo;

    const idParam = this.route.parent?.snapshot.paramMap.get('id');
    const routeId = idParam ? Number(idParam) : null;

    if (routeId !== null && !isNaN(routeId)) {
      console.log('updating');

      payload.id = routeId;

      this.locationService.updateLocation(payload);
    } else {
      this.locationService.addLocation(payload);
    }

    this.shouldShowPanel.set(false);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  closeAndGoHome(event?: Event) {
    this.shouldShowPanel.set(false);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  isFormDirty(): boolean {
    return this.profileForm.dirty || this.profileForm.touched;
  }

  handleOverlayClick() {
    if (this.isFormDirty()) {
      const confirmClose = confirm('You have unsaved changes. Close anyway?');
      if (!confirmClose) return;
    }

    this.closeAndGoHome();
  }
}
