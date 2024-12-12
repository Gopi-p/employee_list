import { Injectable, signal, WritableSignal } from '@angular/core';
import { EmployeeIF } from '../../models/employee.model';
import { IdbService } from '../idb/idb.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  totalEmployee: number = 0;

  employeeList: WritableSignal<{
    current: EmployeeIF[];
    past: EmployeeIF[];
  }> = signal({
    current: [],
    past: [],
  });

  constructor(private idbService: IdbService) {}

  async loadEmployees() {
    let result = await this.idbService.getAllEmployees();

    this.totalEmployee = result.length;

    let processedList: {
      current: EmployeeIF[];
      past: EmployeeIF[];
    } = {
      current: [],
      past: [],
    };

    result.map((e) => {
      if (e.toDate) {
        processedList.past.push(e);
      } else {
        processedList.current.push(e);
      }
    });

    this.employeeList.set(processedList);
  }

  getEmployee(id: string) {
    let emp: EmployeeIF | undefined;
    emp = this.employeeList().current.find((e) => e.id == id);
    emp ??= this.employeeList().past.find((e) => e.id == id);
    return emp;
  }

  async addEmployee(emp: EmployeeIF) {
    await this.idbService.addEmployee(emp);

    this.employeeList.update((e) => {
      if (emp.toDate) {
        e = {
          current: e.current,
          past: [emp, ...e.past],
        };
      } else {
        e = {
          current: [emp, ...e.current],
          past: e.past,
        };
      }

      return e;
    });
    this.totalEmployee++;
  }

  async updateEmployee(emp: EmployeeIF) {
    await this.idbService.updateEmployee(emp);

    const oldEmp = this.getEmployee(emp.id);

    this.employeeList.update((e) => {
      if (oldEmp?.toDate && emp.toDate) {
        const index = e.past.findIndex((e) => e.id == emp.id);
        if (index !== -1) e.past[index] = emp;
      } else if (!oldEmp?.toDate && !emp.toDate) {
        const index = e.current.findIndex((e) => e.id == emp.id);
        if (index !== -1) e.current[index] = emp;
      } else if (oldEmp?.toDate && !emp.toDate) {
        e = {
          past: e.past.filter((e) => e.id != emp.id),
          current: [emp, ...e.current],
        };
      } else if (!oldEmp?.toDate && emp.toDate) {
        e = {
          current: e.current.filter((e) => e.id != emp.id),
          past: [emp, ...e.past],
        };
      }
      return e;
    });
  }

  async deleteEmployee(id: string) {
    await this.idbService.deleteEmployee(id);
    this.employeeList.update((e) => {
      return {
        current: e.current.filter((e) => e.id != id),
        past: e.past.filter((e) => e.id != id),
      };
    });
    this.totalEmployee--;
  }
}
