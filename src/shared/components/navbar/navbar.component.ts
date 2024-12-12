import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [MatIconModule],
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
