import { Component, effect } from '@angular/core';
import { EmployeeService } from '../../shared/services/employee/employee.service';
import { EmployeeIF } from '../../shared/models/employee.model';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';

const MAT = [MatIconModule, MatButtonModule, MatListModule];
const SHARED = [NavbarComponent];
const CORE = [DatePipe];

@Component({
  selector: 'employee-list',
  standalone: true,
  imports: [...CORE, ...MAT, ...SHARED],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  providers: [DatePipe],
})
export class EmployeeListComponent {
  employees: {
    current: EmployeeIF[];
    past: EmployeeIF[];
  } = {
    current: [],
    past: [],
  };

  totalEmployee: number = 0;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {
    effect(() => {
      this.totalEmployee = this.employeeService.totalEmployee;
      this.employees = this.employeeService.employeeList();
    });
  }

  onClickAdd() {
    this.router.navigate(['/add-employee']);
  }

  onClickEmployee(id: string) {
    this.router.navigate([`/edit-employee/${id}`]);
  }

  deleteEmp(id: string) {
    this.employeeService.deleteEmployee(id);
  }
}
