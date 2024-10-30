import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routes: RoutesService) {
  return () => {
    routes.add([
      {
        path: '/',
        name: '::Menu:Home',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
      {
        path: '/dashboard',
        name: '::Menu:Dashboard',
        iconClass: 'fas fa-chart-line',
        order: 2,
        layout: eLayoutType.application,
        requiredPolicy: 'PASS.Dashboard.Host  || PASS.Dashboard.Tenant',
      },

      {
        path: '/inventory',
        name: '::Inventory',
        iconClass: 'fas fa-boxes',
        order: 2,
        layout: eLayoutType.application,
      },
      {
        path: '/csvImport',
        name: '::CsvImport',
        iconClass: 'fas fa-book',
        order: 3,
        layout: eLayoutType.application,
      },
      {
        path: '/industry',
        name: '::Industry',
        iconClass: 'fas fa-building',
        order: 4,
        layout: eLayoutType.application,
      },
      {
        path: '/trace',
        name: '::Trace',
        iconClass: 'fas fa-exchange-alt',
        order: 5,
        layout: eLayoutType.application,
      },
      {
        path: '/reports',
        name: '::Report',
        iconClass: 'fas fa-newspaper',
        order: 6,
        layout: eLayoutType.application,
      },
      {
        path: '/layouts',
        name: '::Layout',
        iconClass: 'fas fa-border-all',
        order: 7,
        layout: eLayoutType.application,
      },

      //Inventory
      {
        path: '/compounds',
        name: '::CompoundsLibrary',
        iconClass: 'fas fa-capsules',
        parentName: '::Inventory',
        layout: eLayoutType.application,
      },
      {
        path: '/plates',
        name: '::Plates',
        iconClass: 'fas fa-table',
        parentName: '::Inventory',
        layout: eLayoutType.application,
      },
      {
        path: '/liquidPositionInPlates',
        name: '::LiquidPositionInPlates',
        iconClass: 'fas fa-table',
        parentName: '::Inventory',
        layout: eLayoutType.application,
      },

      //Import
      {
        path: '/imports',
        name: '::Imports',
        iconClass: 'fas fa-upload',
        parentName: '::CsvImport',
        layout: eLayoutType.application,
      },
      {
        path: '/csvHeaders',
        name: '::CsvHeaders',
        iconClass: 'fas fa-heading',
        parentName: '::CsvImport',
        layout: eLayoutType.application,
      },

      //Industry
      {
        path: '/instruments',
        name: '::Instruments',
        iconClass: 'fas fa-cash-register',
        parentName: '::Industry',
        layout: eLayoutType.application,
      },
      
      //Trace
      {
        path: '/liquidTransferHistories',
        name: '::LiquidTransferHistories',
        iconClass: 'fas fa-th-large',
        parentName: '::Trace',
        layout: eLayoutType.application,
      },
      {
        path: '/plateTransferHistories',
        name: '::PlateTransferHistories',
        iconClass: 'fas fa-th-large',
        parentName: '::Trace',
        layout: eLayoutType.application,
      },

      //Report
      {
        path: '/echoReports',
        name: '::EchoReports',
        iconClass: 'fas fa-sticky-note',
        parentName: '::Report',
        layout: eLayoutType.application,
      },

    ]);
  };
}
