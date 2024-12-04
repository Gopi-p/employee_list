import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() title?: string;
  @Input() showDelete?: boolean = false;
  @Output() onClickDelete: EventEmitter<void> = new EventEmitter();

  onClickDeleteIcon() {
    this.onClickDelete?.emit();
  }
}
