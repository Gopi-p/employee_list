import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'employee',
    loadComponent: () =>
      import('./../components/employee-list/employee-list.component').then(
        (c) => c.EmployeeListComponent
      ),
  },
  {
    path: 'add-employee',
    loadComponent: () =>
      import(
        './../components/add-edit-employee/add-edit-employee.component'
      ).then((c) => c.AddEditEmployeeComponent),
  },
  {
    path: 'edit-employee/:id',
    loadComponent: () =>
      import(
        './../components/add-edit-employee/add-edit-employee.component'
      ).then((c) => c.AddEditEmployeeComponent),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'employee',
  },
];
