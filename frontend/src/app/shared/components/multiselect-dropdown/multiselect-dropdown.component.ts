import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.css']
})
export class MultiselectDropdownComponent {
  @Input() title: string = 'Select Options';
  @Input() options: { [name: string]: boolean} = {
    'bob': true,
    'rat': false,
    "joe": true,
  };

  opened: boolean = false;

  GetOptions() {
    return this.options;
  }

  AddOption(name: string, value: boolean = false) {
    this.options[name] = value;
  }

  RemoveOption(name: string) {
    delete this.options[name];
  }

  SetOpened(value: boolean) {
    this.opened = value;
    console.log("opened: " + value)
  }
}
