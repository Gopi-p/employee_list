import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavbarComponent } from '../../shared/component/navbar/navbar.component';
import { EmployeeService } from '../../shared/services/employee/employee.service';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatDialog } from '@angular/material/dialog';
import { DatePickerComponent } from '../../shared/component/date-picker/date-picker.component';
import {
  displayToRawDate,
  rawToDisplayDate,
} from '../../shared/functions/helper.function';

const SHARED = [NavbarComponent];
const CORE = [ReactiveFormsModule];
const MAT = [
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatFormFieldModule,
  MatDividerModule,
  MatDatepickerModule,
  MatNativeDateModule,
];

@Component({
  selector: 'app-add-edit-employee',
  standalone: true,
  imports: [...CORE, ...MAT, ...SHARED],
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss'],
})
export class AddEditEmployeeComponent implements OnInit {
  employeeId?: string;
  isEditMode: boolean = false;

  employeeForm: FormGroup;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {
    this.employeeForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl(),
    });
  }

  ngOnInit(): void {
    const params = this.activateRoute.snapshot.params;
    if (params['id']) {
      this.isEditMode = true;
      this.employeeId = params['id'];
      this.patchFormForEditMode();
    }
  }

  get employeeFormControl() {
    return this.employeeForm.controls;
  }

  patchFormForEditMode() {
    const emp = this.employeeService.getEmployee(this.employeeId!);
    this.employeeForm.patchValue({
      ...emp,
      fromDate: rawToDisplayDate(emp?.fromDate),
      toDate: rawToDisplayDate(emp?.toDate),
    });
  }

  onDeleteEmployee() {
    if (this.isEditMode && this.employeeId) {
      this.employeeService.deleteEmployee(this.employeeId);
      this.router.navigate(['/employee']);
    }
  }

  onClickSave() {
    if (this.employeeForm.valid) {
      if (this.isEditMode) {
        this.employeeService.updateEmployee({
          id: this.employeeId,
          ...this.employeeForm.value,
          fromDate: this.employeeFormControl['fromDate'].value,
        });
      } else {
        this.employeeService.addEmployee({
          id: `${this.employeeService.employeeList().length + 1}`,
          ...this.employeeForm.value,
        });
      }
      this.router.navigate(['/employee']);
    }
  }

  openDatePicker(formField: string) {
    const dialogRef = this.dialog.open(DatePickerComponent, {
      data: {
        initialDate: displayToRawDate(
          this.employeeFormControl[formField].value
        ),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeForm.patchValue({
          [formField]: rawToDisplayDate(result),
        });
      }
    });
  }

  onClickCancel() {
    this.router.navigate(['employee']);
  }
}
