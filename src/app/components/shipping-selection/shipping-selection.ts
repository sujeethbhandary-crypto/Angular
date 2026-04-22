import { Component, linkedSignal, signal } from '@angular/core';

type ShippingMethod = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-shipping-selection',
  standalone: true,
  templateUrl: './shipping-selection.html',
  styleUrl: './shipping-selection.css',
})
export class ShippingSelection {
  shippingOptions = signal<string[]>(['Ground', 'Air', 'Sea']);

  userSelectedShippingOption = linkedSignal(() => this.shippingOptions()[0]);

  changeShippingOptions() {
    this.shippingOptions.set(['Email', 'Sea', 'Postal Service']);
  }

  handleUserInput(event: Event) {
    const userSelectedValue = (event.target as HTMLInputElement).value;
    console.log((event.target as HTMLInputElement).value);
    this.userSelectedShippingOption.set(userSelectedValue);
  }
}
