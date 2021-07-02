import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.css']
})



export class ContactsListComponent implements OnInit {

  contactsList: any
  closeResult = ''
  contactsStatus: boolean = false
  searchContactForm = this.fb.group({
  searchContact: ['']
  })
  removingIndex: any
  constructor(private fb: FormBuilder, private modalService: NgbModal) { }

  ngOnInit(): void {
    if (localStorage.getItem('Contacts List')) {
      this.contactsList = JSON.parse(localStorage.getItem('Contacts List') || '{}');
      console.log(this.contactsList);
      if (this.contactsList.length > 0) {
        this.contactsStatus = false;
      }
      else {
        this.contactsStatus = true;
      }
    }
  }

  searchContactResults(){
    console.log(this.searchContactForm.value.searchContact);
    let searchString = this.searchContactForm.value.searchContact
    this.contactsList.map(function(contact:any, index:number){
        let contactName = contact.firstName.concat(' '+contact.lastName);
        console.log(contactName.search(searchString));
        if(contactName.search(searchString) >=0){
          console.log("Contact Found");
        }
        else{
          console.log("Contact not found")
        }
    })
  }


  removeContact() {
    this.contactsList.splice(this.removingIndex, 1);
    localStorage.setItem('Contacts List', JSON.stringify(this.contactsList));
    if (this.contactsList.length == 0) {
      this.contactsStatus = true;
    }
    this.modalService.dismissAll();
  }

  viewContact(index: number) {
    window.location.replace('view-contact/' + index);
  }

  open(content:any, index:any) {
    this.removingIndex = index;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}


