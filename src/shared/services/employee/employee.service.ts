import { Injectable, signal, WritableSignal } from '@angular/core';
import { EmployeeIF } from '../../models/employee.model';
import { IdbService } from '../idb/idb.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  /**
   * Total available employees count in both current and previous category
   */
  totalEmployee: number = 0;

  /**
   *
   * Categorized employee object which contains the employee in current and past array.
   */
  employeeList: WritableSignal<{
    current: EmployeeIF[];
    past: EmployeeIF[];
  }> = signal({
    current: [],
    past: [],
  });

  constructor(private idbService: IdbService) {}

  /**
   *
   * A function to load all employees from indexDB from {@link idbService}
   *
   * It fetch and update the {@link employeeList}.
   */
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

  /**
   * Getter function will return the employee by matching the id.
   *
   * @param id
   * @returns {EmployeeIF | undefined}
   */
  getEmployee(id: string): EmployeeIF | undefined {
    let emp: EmployeeIF | undefined;
    emp = this.employeeList().current.find((e) => e.id == id);
    emp ??= this.employeeList().past.find((e) => e.id == id);
    return emp;
  }

  /**
   * A function to insert an employee into the indexDB.
   *
   * Item will be pushed to the respected array by evaluating the toDate of the employee.
   *
   * @param emp
   */
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

  /**
   * A function to update the existing employee.
   *
   * @param newEmp
   */
  async updateEmployee(newEmp: EmployeeIF) {
    await this.idbService.updateEmployee(newEmp);

    const oldEmp = this.getEmployee(newEmp.id);

    this.employeeList.update((e) => {
      // If both old and new emp has toDate, then the item can be updated directly in the 'past' array.
      if (oldEmp?.toDate && newEmp.toDate) {
        const index = e.past.findIndex((e) => e.id == newEmp.id);
        if (index !== -1) e.past[index] = newEmp;
      }
      // If both old and new emp doesn't have toDate, then the item can be updated directly in the 'current' array.
      else if (!oldEmp?.toDate && !newEmp.toDate) {
        const index = e.current.findIndex((e) => e.id == newEmp.id);
        if (index !== -1) e.current[index] = newEmp;
      }
      // If the old emp has but new emp doesn't, then the item should be removed from 'past' and insert into 'current'.
      else if (oldEmp?.toDate && !newEmp.toDate) {
        e = {
          past: e.past.filter((e) => e.id != newEmp.id),
          current: [newEmp, ...e.current],
        };
      }
      // If the new emp has but old emp doesn't, then the item should be removed from 'current' and insert into 'past'.
      else if (!oldEmp?.toDate && newEmp.toDate) {
        e = {
          current: e.current.filter((e) => e.id != newEmp.id),
          past: [newEmp, ...e.past],
        };
      }
      return e;
    });
  }

  /**
   * Deleting the emp entry from the indexDB and the {@link employeeList}
   * @param id
   */
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
