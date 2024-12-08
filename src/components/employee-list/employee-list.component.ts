import { Component, effect, OnInit } from '@angular/core';
import { EmployeeService } from '../../shared/services/employee/employee.service';
import { EmployeeIF } from '../../shared/models/employee.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/component/navbar/navbar.component';
import { IdbService } from '../../shared/services/idb/idb.service';

const MAT = [MatButtonModule, MatIconModule];
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
    private idbService: IdbService,
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
