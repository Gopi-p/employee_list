import { Component, effect, OnInit } from '@angular/core';
import { EmployeeService } from '../../shared/services/employee/employee.service';
import { EmployeeIF } from '../../shared/models/employee.model';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/component/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const MAT = [MatIconModule, MatButtonModule];
const SHARED = [NavbarComponent];

@Component({
  selector: 'employee-list',
  standalone: true,
  imports: [...MAT, ...SHARED],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  employeeList: EmployeeIF[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {
    effect(() => {
      this.employeeList = this.employeeService.employeeList();
    });
  }

  ngOnInit() {}

  onClickAdd() {
    this.router.navigate(['/add-employee']);
  }

  onClickEmployee(id: string) {
    this.router.navigate([`/edit-employee/${id}`]);
  }

  deleteEmp() {}
}
