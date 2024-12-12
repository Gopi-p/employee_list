import { AfterViewInit, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';

import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

const MAT = [
  MatButtonModule,
  MatIconModule,
  MatDialogClose,
  MatDialogContent,
  MatDatepickerModule,
  MatDividerModule,
];

const CORE = [DatePipe, NgClass];

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [...MAT, ...CORE],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [DatePipe, provideNativeDateAdapter()],
})
export class DatePickerComponent {
  chosenDate: Date | undefined;

  today: Date;
  nextMonday: Date;
  nextTuesday: Date;
  afterWeek: Date;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.chosenDate = data?.initialDate
      ? new Date(data?.initialDate)
      : undefined;

    this.today = new Date();
    this.nextMonday = this.getNextShift(8);
    this.nextTuesday = this.getNextShift(9);

    this.afterWeek = new Date();
    this.afterWeek.setDate(this.today.getDate() + 7);
  }

  getNextShift(shift: number = 7) {
    const nextMonday = new Date();
    const day = nextMonday.getDay();
    const daysUntilMonday = (shift - day) % 7;
    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
    return nextMonday;
  }

  isSameDate(date1: any, date2: any) {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
      return false;
    }

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  onClickShortcut(date: Date) {
    this.chosenDate = date;
  }
}
