import { Injectable, signal, WritableSignal } from '@angular/core';
import { EmployeeIF } from '../../models/employee.model';
import { IdbService } from '../idb/idb.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employeeList: WritableSignal<EmployeeIF[]> = signal([]);

  constructor(private idbService: IdbService) {}

  async loadEmployees() {
    let result = await this.idbService.getAllEmployees();
    this.employeeList.set(result);
  }

  getEmployee(id: string) {
    return this.employeeList().find((e) => e.id == id);
  }

  async addEmployee(emp: EmployeeIF) {
    await this.idbService.addEmployee(emp);
    this.employeeList.update((e) => [emp, ...e]);
  }

  async updateEmployee(emp: EmployeeIF) {
    await this.idbService.updateEmployee(emp);
    this.employeeList.update((e) => {
      const index = e.findIndex((e) => e.id == emp.id);
      if (index !== -1) e[index] = emp;
      return e;
    });
  }

  async deleteEmployee(id: string) {
    await this.idbService.deleteEmployee(id);
    this.employeeList.update((e) => e.filter((emp) => emp.id !== id));
  }
}
