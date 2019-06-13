import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  public searchControl: FormControl;
  public contacts: any[];

  constructor(private contactService: ContactService) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.setFilteredItems("");

    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.setFilteredItems(search);
      });
  }

  addContact(contact) {
    this.contactService.addContact(contact);
  }

  setFilteredItems(searchTerm) {
    this.contactService.retrieveContacts(searchTerm);

    this.contactService.contactChanged.subscribe(users => {
      this.contacts = users;

      this.contactService.contacts.forEach((savedContact) => {
        this.contacts = this.contacts.filter(contact => contact.email != savedContact.email);
      })
    })
  }
}
