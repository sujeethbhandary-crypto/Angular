import { Component, inject, signal, computed, linkedSignal, DestroyRef } from '@angular/core';
import { HousingLocation } from '@components/housing-location/housing-location';
import { HousingLocationInfo, HousingLocationViewModel } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Forms } from '@components/forms/forms';

import { Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  catchError,
  map,
} from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [HousingLocation, Forms, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private destroyRef = inject(DestroyRef);

  activatedRouter = inject(ActivatedRoute);
  locationService = inject(LocationService);
  router = inject(Router);

  mode = signal<'normal' | 'edit'>('normal');
  isSearching = signal(false);
  // SEARCH STREAM
  private searchInput$ = new Subject<string>();

  // SEARCH RESULTS SIGNAL
  searchResults = signal<HousingLocationInfo[]>([]);

  // ORIGINAL DATA
  baseLocations = linkedSignal<HousingLocationInfo[], HousingLocationViewModel[]>({
    source: this.locationService.getAllLocations(),

    computation: (newLocations, prevValue) => {
      const previous = (prevValue?.value as HousingLocationViewModel[]) ?? [];

      return newLocations.map((loc) => {
        const prevMatch = previous.find((p) => p.id === loc.id);
        return {
          ...loc,
          selected: prevMatch?.selected ?? false,
        };
      });
    },
  });

  // FINAL DATA FOR UI
  locationsToDisplay = computed(() => {
    if (this.isSearching()) {
      const search = this.searchResults();
      const base = this.baseLocations();

      return search.map((loc) => {
        const match = base.find((b) => b.id === loc.id);
        return {
          ...loc,
          selected: match?.selected ?? false,
        };
      });
    }

    return this.baseLocations();
  });
  //  DERIVED COUNT
  selectedCount = computed(() => this.locationsToDisplay().filter((vm) => vm.selected).length);

  constructor() {
    this.initSearch();
  }

  //  RXJS SEARCH PIPELINE
  private initSearch() {
    this.searchInput$
      .pipe(
        debounceTime(300),
        map((v) => v.trim()),
        filter((v) => v.length === 0 || v.length >= 3),

        distinctUntilChanged(),

        //  cancels previous API calls
        switchMap((query) => {
          if (query.length === 0) {
            this.isSearching.set(false);
            return of([]);
          } else {
            this.isSearching.set(true);
            return this.locationService.searchLocationsApi(query).pipe(catchError(() => of([])));
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((results) => {
        this.searchResults.set(results);
      });
  }

  //  INPUT HANDLER
  onSearch(value: string) {
    this.searchInput$.next(value);
  }

  toggleMode() {
    const newMode = this.mode() === 'normal' ? 'edit' : 'normal';
    this.mode.set(newMode);

    if (newMode === 'normal') {
      this.baseLocations.set(
        this.baseLocations().map((vm) => ({
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

    this.baseLocations.set(
      this.baseLocations().map((item) =>
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

    this.baseLocations.set(
      this.baseLocations().map((vm) => ({
        ...vm,
        selected: false,
      })),
    );
  }

  onRestore() {
    this.locationService.restoreAllDeletedLocation();
  }

  onAddLocation() {
    this.router.navigate(['edit', { relativeTo: this.activatedRouter }]);
  }
}
