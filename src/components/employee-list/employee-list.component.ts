import { Component, effect, OnInit } from '@angular/core';
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
export class EmployeeListComponent implements OnInit {
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
      const employeeList = this.employeeService.employeeList();

      console.log('@@  employeeList: ', employeeList);

      this.totalEmployee = employeeList.length;
      this.employees.current = [];
      this.employees.past = [];
      employeeList.map((e) => {
        if (e.toDate) {
          this.employees.past.push(e);
        } else {
          this.employees.current.push(e);
        }
      });
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
