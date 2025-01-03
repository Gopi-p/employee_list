import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { EmployeeIF } from '../../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class IdbService {
  idb: IDBPDatabase | undefined;

  async initDB() {
    this.idb = await openDB('EmployeeDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id' });
        }
      },
    });
  }

  async addEmployee(employee: EmployeeIF): Promise<void> {
    if (!this.idb) await this.initDB();
    await this.idb?.add('employees', employee);
  }

  async getAllEmployees(): Promise<EmployeeIF[]> {
    if (!this.idb) await this.initDB();
    return await this.idb!.getAll('employees');
  }

  async updateEmployee(employee: EmployeeIF): Promise<void> {
    if (!this.idb) await this.initDB();
    await this.idb?.put('employees', employee);
  }

  async deleteEmployee(id: string): Promise<void> {
    if (!this.idb) await this.initDB();
    await this.idb?.delete('employees', id);
  }
}
