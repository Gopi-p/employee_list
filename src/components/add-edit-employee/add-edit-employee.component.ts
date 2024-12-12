import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { EmployeeService } from '../../shared/services/employee/employee.service';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatDialog } from '@angular/material/dialog';
import {
  displayToRawDate,
  genUniqueId,
  rawToDisplayDate,
} from '../../shared/functions/helper.function';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
  MatSnackBarModule,
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

  @ViewChild('snackBarUI') snackbarUI?: TemplateRef<any>;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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

  async onDeleteEmployee() {
    if (this.isEditMode && this.employeeId) {
      await this.employeeService.deleteEmployee(this.employeeId);
      this.snackBar.open('Employee data has been deleted', 'Undo', {
        duration: 3000,
      });

      this.router.navigate(['/employee']);
    }
  }

  onClickSave() {
    if (this.employeeForm.valid) {
      const employeeDetails = {
        ...this.employeeForm.value,
        fromDate: displayToRawDate(this.employeeFormControl['fromDate'].value),
        toDate: displayToRawDate(this.employeeFormControl['toDate'].value),
      };

      if (this.isEditMode) {
        this.employeeService.updateEmployee({
          id: this.employeeId,
          ...employeeDetails,
        });
      } else {
        this.employeeService.addEmployee({
          id: this.getNewEmpId(),
          ...employeeDetails,
        });
      }
      this.router.navigate(['/employee']);
    }
  }

  getNewEmpId() {
    let newId;
    do {
      newId = genUniqueId();
    } while (this.employeeService.getEmployee(newId) != null);

    return newId;
  }

  openDatePicker(formField: string) {
    const dialogRef = this.dialog.open(DatePickerComponent, {
      data: {
        initialDate: displayToRawDate(
          this.employeeFormControl[formField].value
        ),
        isEndDate: formField === 'toDate',
      },
      minWidth: '325px',
      width: '100%',
      maxWidth: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeForm.patchValue({
          [formField]: rawToDisplayDate(result),
        });
      } else if (result === null && formField === 'toDate') {
        this.employeeForm.patchValue({
          [formField]: undefined,
        });
      }
    });
  }

  onClickCancel() {
    this.router.navigate(['employee']);
  }
}
