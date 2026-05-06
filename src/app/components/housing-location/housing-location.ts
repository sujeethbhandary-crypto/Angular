import { Component, inject, input, output } from '@angular/core';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { BASE_URL, LocationService } from '../../services/location-service';
import { Router } from '@angular/router';
import { CardLayout } from '@components/card-layout/card-layout';

@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [CardLayout],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
  host: { [`class.selected`]: `this.selected()` },
})
export class HousingLocation {
  router = inject(Router);
  location = input.required<HousingLocationInfo>();
  selected = input<boolean>();
  onLocationClick = output<HousingLocationInfo>();
  locationService = inject(LocationService);
  baseURL = inject(BASE_URL);
  mode = input<'normal' | 'edit'>();

  handleClick(event: MouseEvent) {
    console.log(event.target);
    console.log(event.type);
    console.log(this.baseURL);
    console.log(`${this.location().name} is clicked`);
    this.onLocationClick.emit(this.location());
  }

  handleEdit(event: Event) {
    event?.stopPropagation();
    console.log('Edit clicked');

    const id = this.location().id;
    this.router.navigate(['details', id, 'edit']);
  }
}
