import { Component, inject, signal, computed, linkedSignal } from '@angular/core';
import { HousingLocation } from '@components/housing-location/housing-location';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { Router } from '@angular/router';
import { HousingLocationViewModel } from '../../models/housing-location-info';

@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  locationService = inject(LocationService);
  router = inject(Router);

  mode = signal<'normal' | 'edit'>('normal');

  //  linkedSignal
  locationsToDisplay = linkedSignal<HousingLocationInfo[], HousingLocationViewModel[]>({
    source: this.locationService.getAllLocations(),

    computation: (newLocations, prevValue) => {
      const previousViewModels = (prevValue?.value as HousingLocationViewModel[]) ?? [];

      return newLocations.map((location) => {
        const previousMatch = previousViewModels.find(
          (previousLocation) => previousLocation.id === location.id,
        );
        return {
          ...location,
          selected: previousMatch?.selected ?? false,
        };
      });
    },
  });

  //  derived count
  selectedCount = computed(() => this.locationsToDisplay().filter((vm) => vm.selected).length);

  toggleMode() {
    const newMode = this.mode() === 'normal' ? 'edit' : 'normal';
    this.mode.set(newMode);

    // clear selection when leaving edit mode
    if (newMode === 'normal') {
      this.locationsToDisplay.set(
        this.locationsToDisplay().map((vm) => ({
          ...vm,
          selected: false,
        })),
      );
    }
  }

  handleLocationClick(vm: HousingLocationViewModel) {
    if (this.mode() === 'normal') {
      this.router.navigate(['details', vm.id]);
      return;
    }

    // toggle selection
    this.locationsToDisplay.set(
      this.locationsToDisplay().map((item) =>
        item.id === vm.id ? { ...item, selected: !item.selected } : item,
      ),
    );
  }

  onDelete() {
    const ids = this.locationsToDisplay()
      .filter((vm) => vm.selected)
      .map((vm) => vm.id);

    if (ids.length === 0) return;

    const confirmed = confirm('Are you sure you want to delete selected items?');
    if (!confirmed) return;

    this.locationService.deleteLocationsByIds(ids);
  }

  onRestore() {
    this.locationService.restoreAllDeletedLocation();
  }

  onAddLocation() {
    const newLocation: HousingLocationInfo = {
      id: 0,
      name: 'nn',
      city: 'Mangalore',
      state: 'KA',
      photo: `https://picsum.photos/300/200`,
      availableUnits: 1,
      wifi: false,
      laundry: false,
      deleted: false,
    };

    this.locationService.addLocation(newLocation);
    console.log(newLocation.id);
  }
}
