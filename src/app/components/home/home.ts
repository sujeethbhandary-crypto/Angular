import { Component, inject, signal, computed } from '@angular/core';
import { HousingLocation } from '@components/housing-location/housing-location';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css',
  // providers: [{ provide: LocationService, useClass: LocationService }],
})
export class Home {
  locationService: LocationService = inject(LocationService);
  mode = signal<'normal' | 'edit'>('normal');
  router = inject(Router);
  modeString = computed(() =>
    this.mode() === 'normal'
      ? 'Click on a property card to view its details'
      : 'Please select the items to edit',
  );
  selectedIds = signal<number[]>([]);

  handleClick(item: HousingLocationInfo) {
    // const filtered = this.locationService.getAllLocations().filter((l) => l.id !== item.id);
    // this.locationService = [item, ...filtered];

    //If we are in normal then only we need to naviagte
    if (this.mode() === 'normal') this.router.navigate(['details', item.id]);
    else {
      this.selectedIds.update((prev) =>
        prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
      );
    }
  }
  handleCheck(event: Event) {
    console.log('Checkbox is clicked', (event.target as HTMLInputElement).checked);
    this.mode.update((prev) => (prev === 'normal' ? 'edit' : 'normal'));
    if (this.mode() === 'normal') this.selectedIds.set([]);
  }
  onDelete() {
    const confirmed = confirm('Are you sure you want to delete selected items?');
    if (!confirmed) return;
    this.locationService.deleteLocationsByIds(this.selectedIds());
    this.selectedIds.set([]);
  }
  onRestore() {
    this.locationService.restoreAllDeletedLocation();
  }
}
