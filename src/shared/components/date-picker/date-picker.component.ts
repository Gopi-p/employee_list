import { Component, Inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

const MAT = [
  MatButtonModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDatepickerModule,
];

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [...MAT, DatePipe],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [DatePipe, provideNativeDateAdapter()],
})
export class DatePickerComponent {
  chosenDate: Date | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.chosenDate = data?.initialDate;
  }
}
