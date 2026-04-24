import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { first, zip } from 'rxjs';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forms.html',
  styleUrl: './forms.css',
})
export class Forms {
  formBuilder = inject(FormBuilder);

  // profileForm = new FormGroup({
  //   firstName: new FormControl(''),
  //   middlename: new FormControl(''),
  //   lastName: new FormControl(''),
  //   address: new FormGroup({
  //     street: new FormControl(''),
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //     zip: new FormControl(''),
  //   }),
  // });

  profileForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(6)]],
    middlename: [''],
    lastName: [''],
    email: ['', Validators.email],
    address: this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
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
