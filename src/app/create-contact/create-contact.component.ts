import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent implements OnInit {

  secondaryContactCheck = <Boolean>false
  hideButton = <Boolean>true
  longitudePosition = ''
  latitudePosition = ''
  contactsList: FormGroup[] = []
  contactForm:any = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    primaryPhoneNumber: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(11),Validators.pattern("^[0-9]*$")]],
    secondaryPhoneNumber: this.fb.array([]),
    emailAddress: ['', Validators.email],
    dob: ['', Validators.required],
    address: ['', Validators.required],
    longitude: [''],
    latitude: ['']

  });

  constructor(private fb: FormBuilder, private router: ActivatedRoute) { }

  ngOnInit() {
    if (this.router.snapshot.routeConfig?.path === "create-contact") {
      this.getPosition().then(pos => {
        this.longitudePosition = pos.lng;
        this.latitudePosition = pos.lat;
        this.contactForm.patchValue({
          'longitude': this.longitudePosition,
          'latitude': this.latitudePosition
        });
      });
    }
    else {
      this.hideButton = false;
      this.contactsList = JSON.parse(localStorage.getItem('Contacts List') || '{}');
      let contact: any = this.contactsList[parseInt(this.router.snapshot.params.id)]
      if (contact.secondaryPhoneNumber.length > 0) {
        this.secondaryContactCheck = true;
        for (let i = 0; i < contact.secondaryPhoneNumber.length; i++) {
          this.secondaryPhoneNumber.push(this.fb.control(contact.secondaryPhoneNumber[i]));
        }
      }
      this.contactForm.patchValue({
        'firstName': contact.firstName,
        'lastName': contact.lastName,
        'primaryPhoneNumber': contact.primaryPhoneNumber,
        'emailAddress': contact.emailAddress,
        'dob': contact.dob,
        'longitude': contact.longitude,
        'latitude': contact.latitude,
        'address': contact.address
      })
      this.contactForm.disable();
    }


  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });

  }

  get secondaryPhoneNumber() {
    return this.contactForm.get('secondaryPhoneNumber') as FormArray;
  }

  addSecondaryPhoneNumber() {
    this.secondaryContactCheck = true;
    this.secondaryPhoneNumber.push(this.fb.control('',[Validators.required, Validators.minLength(3),Validators.maxLength(11),Validators.pattern("^[0-9]*$")]));
  }

  removeField(index: number) {
    this.secondaryPhoneNumber.removeAt(index);
  }

  onSubmit() {
    console.warn(this.contactForm.value);
    if (localStorage.getItem('Contacts List')) {
      this.contactsList = JSON.parse(localStorage.getItem('Contacts List') || '{}');
      this.contactsList.push(this.contactForm.value);
    }
    else {
      this.contactsList.push(this.contactForm.value);
    }

    localStorage.setItem('Contacts List', JSON.stringify(this.contactsList));
    window.location.replace('/')
  }

}
