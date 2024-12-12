import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeService } from '../shared/services/employee/employee.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(private employeeService: EmployeeService) {}

  async ngOnInit(): Promise<void> {
    /**
     * Load all employees from the indexDb on app startup
     */
    await this.employeeService.loadEmployees();
  }
}
