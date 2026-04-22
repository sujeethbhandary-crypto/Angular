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
})
export class Home {
  locationService: LocationService = inject(LocationService);
  mode = signal<'normal' | 'edit'>('normal');
  router = inject(Router);
  selectedIds = signal<number[]>([]);

  toggleMode() {
    const newMode = this.mode() === 'normal' ? 'edit' : 'normal';
    this.mode.set(newMode);

    if (newMode === 'normal') {
      this.selectedIds.set([]);
    }
  }

  handleClick(item: HousingLocationInfo) {
    if (this.mode() === 'normal') {
      this.router.navigate(['details', item.id]);
    } else {
      this.selectedIds.update((current) =>
        current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id],
      );
    }
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
