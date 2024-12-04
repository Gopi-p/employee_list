import { Injectable, signal, WritableSignal } from '@angular/core';
import { EmployeeIF } from '../../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employeeList: WritableSignal<EmployeeIF[]> = signal([]);

  constructor() {}

  loadEmployees() {
    this.employeeList.set([
      {
        id: '1',
        name: 'gopi',
        fromDate: '2024-12-04T11:35:20.123Z',
        toDate: '2024-12-04T11:35:20.123Z',
        role: 'Product Owner',
      },
      {
        id: '2',
        name: 'Vinod',
        fromDate: '2024-12-04T11:35:20.123Z',
        toDate: '2024-12-04T11:35:20.123Z',
        role: 'Product Owner',
      },
      {
        id: '3',
        name: 'Kumar',
        fromDate: '2024-12-04T11:35:20.123Z',
        toDate: '2024-12-04T11:35:20.123Z',
        role: 'Product Owner',
      },
    ]);
  }

  getEmployee(id: string) {
    return this.employeeList().find((e) => e.id == id);
  }

  addEmployee(emp: EmployeeIF) {
    this.employeeList.update((e) => [emp, ...e]);
  }

  updateEmployee(emp: EmployeeIF) {
    this.employeeList.update((e) => {
      const index = e.findIndex((e) => e.id == emp.id);
      if (index !== -1) e[index] = emp;
      return e;
    });
  }

  deleteEmployee(id: string) {
    this.employeeList.update((e) => e.filter((emp) => emp.id !== id));
  }
}
