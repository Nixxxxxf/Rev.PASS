import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <app-host-dashboard *abpPermission="'PASS.Dashboard.Host'"></app-host-dashboard>
    <app-tenant-dashboard *abpPermission="'PASS.Dashboard.Tenant'"></app-tenant-dashboard>
  `,
})
export class DashboardComponent {}
