import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../shared/component/navbar/navbar.component';
import { EmployeeService } from '../../shared/services/employee/employee.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

const SHARED = [NavbarComponent];
const CORE = [ReactiveFormsModule];

@Component({
  selector: 'app-add-edit-employee',
  standalone: true,
  imports: [...CORE, ...SHARED],
  templateUrl: './add-edit-employee.component.html',
  styleUrl: './add-edit-employee.component.scss',
})
export class AddEditEmployeeComponent implements OnInit {
  employeeId?: string;
  isEditMode: boolean = false;

  employeeForm: FormGroup;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = new FormGroup({
      name: new FormControl(),
      role: new FormControl(),
      fromDate: new FormControl(),
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

  patchFormForEditMode() {
    const emp = this.employeeService.getEmployee(this.employeeId!);
    this.employeeForm.patchValue({ ...emp });
  }

  onDeleteEmployee() {
    if (this.isEditMode && this.employeeId) {
      this.employeeService.deleteEmployee(this.employeeId);
      this.router.navigate(['/employee']);
    }
  }

  onClickSave() {
    if (this.isEditMode) {
      this.employeeService.updateEmployee({
        id: this.employeeId,
        ...this.employeeForm.value,
      });
    } else {
      this.employeeService.addEmployee({
        id: `${this.employeeService.employeeList().length + 1}`,
        ...this.employeeForm.value,
      });
    }
    this.router.navigate(['/employee']);
  }

  onClickCancel() {
    this.router.navigate(['/employee']);
  }
}
