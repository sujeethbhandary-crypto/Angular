import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
  effect,
  linkedSignal,
} from '@angular/core';
import { ShippingSelection } from '@components/shipping-selection/shipping-selection';

@Component({
  selector: 'app-linked-signal',
  imports: [ShippingSelection],
  standalone: true,
  templateUrl: './linked-signal.html',
  styleUrl: './linked-signal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedSignal {
  userStatus = signal<'online' | 'away' | 'offline'>('offline');

  // independent signal
  notificationPreference = linkedSignal<boolean>(() => this.userStatus() === 'online');

  notificationEffect = effect(() => {
    this.notificationPreference.set(this.userStatus() === 'online');
  });

  notificationsEnabled = computed(() => this.userStatus() === 'online');

  statusMessage = computed(() => {
    switch (this.userStatus()) {
      case 'online':
        return 'You are available';
      case 'away':
        return 'You are away';
      case 'offline':
        return 'You are offline';
      default:
        return '';
    }
  });

  isWithinWorkingHours = computed(() => {
    const hour = new Date().getHours();
    return hour >= 9 && hour < 18;
  });

  // actions
  goOnline() {
    this.userStatus.set('online');
  }

  goAway() {
    this.userStatus.set('away');
  }

  goOffline() {
    this.userStatus.set('offline');
  }

  toggleStatus() {
    const current = this.userStatus();
    switch (current) {
      case 'offline':
        this.userStatus.set('online');
        break;
      case 'online':
        this.userStatus.set('away');
        break;
      case 'away':
        this.userStatus.set('offline');
        break;
    }
  }

  toggleNotifications() {
    this.notificationPreference.update((prev) => !prev);
  }
}
