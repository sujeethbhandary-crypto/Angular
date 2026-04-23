import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forms.html',
  styleUrl: './forms.css',
})
export class Forms {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    middlename: new FormControl(''),
    lastName: new FormControl(''),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl(''),
    }),
  });

  updateName() {
    this.profileForm.patchValue({
      firstName: 'Sujee',
      lastName: 'Bhandary',
      address: { zip: '54755' },
    });
  }

  onSubmit() {
    console.log(this.profileForm.value);
  }
}
