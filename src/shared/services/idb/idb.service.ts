import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { EmployeeIF } from '../../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class IdbService {
  idb: IDBPDatabase | undefined;
  constructor() {}

  async initDB() {
    this.idb = await openDB('EmployeeDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id' });
        }
      },
    });
  }

  // Add an employee
  async addEmployee(employee: EmployeeIF): Promise<void> {
    if (!this.idb) await this.initDB();
    await this.idb?.add('employees', employee);
  }

  // Get all employees
  async getAllEmployees(): Promise<EmployeeIF[]> {
    if (!this.idb) await this.initDB();
    return await this.idb!.getAll('employees');
  }

  // Update an employee
  async updateEmployee(employee: EmployeeIF): Promise<void> {
    if (!this.idb) await this.initDB();
    await this.idb?.put('employees', employee);
  }

  // Delete an employee
  async deleteEmployee(id: string): Promise<void> {
    if (!this.idb) await this.initDB();
    await this.idb?.delete('employees', id);
  }
}
