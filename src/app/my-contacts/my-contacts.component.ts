import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact/contact.service';

@Component({
  selector: 'app-my-contacts',
  templateUrl: './my-contacts.component.html',
  styleUrls: ['./my-contacts.component.scss'],
})
export class MyContactsComponent implements OnInit {

  public items: any;

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.contactService.getContacts();

    this.contactService.contactsChanged.subscribe((contacts) => {
      this.items = contacts;
    })
  }

}
