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
        path: '/geneTypings',
        name: '::GeneTyping',
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
        path: '/samples',
        name: '::SamplesLibrary',
        iconClass: 'fas fa-capsules',
        parentName: '::Inventory',
        layout: eLayoutType.application,
      },
      {
        path: '/markers',
        name: '::MarkersLibrary',
        iconClass: 'fas fa-capsules',
        parentName: '::Inventory',
        layout: eLayoutType.application,
      },
      {
        path: '/markerPannels',
        name: '::MarkerPannel',
        iconClass: 'fas fa-capsules',
        parentName: '::Inventory',
        layout: eLayoutType.application,
      },
      {
        path: '/plates',
        name: '::Plate',
        iconClass: 'fas fa-table',
        parentName: '::Inventory',
        layout: eLayoutType.application,
      },
      


      //Import
      {
        path: '/imports',
        name: '::Import',
        iconClass: 'fas fa-upload',
        parentName: '::CsvImport',
        layout: eLayoutType.application,
      },
      {
        path: '/csvHeaders',
        name: '::CsvHeader',
        iconClass: 'fas fa-heading',
        parentName: '::CsvImport',
        layout: eLayoutType.application,
      },


      //Industry
      {
        path: '/instruments',
        name: '::Instrument',
        iconClass: 'fas fa-cash-register',
        parentName: '::Industry',
        layout: eLayoutType.application,
      },
      

      //Trace
      {
        path: '/liquidPositionInPlates',
        name: '::LiquidPositionInPlate',
        iconClass: 'fas fa-table',
        parentName: '::Trace',
        layout: eLayoutType.application,
      },
      {
        path: '/liquidTransferHistories',
        name: '::LiquidTransferHistory',
        iconClass: 'fas fa-th-large',
        parentName: '::Trace',
        layout: eLayoutType.application,
      },
      {
        path: '/plateTransferHistories',
        name: '::PlateTransferHistory',
        iconClass: 'fas fa-th-large',
        parentName: '::Trace',
        layout: eLayoutType.application,
      },


      //Report
      {
        path: '/echoReports',
        name: '::EchoReport',
        iconClass: 'fas fa-sticky-note',
        parentName: '::Report',
        layout: eLayoutType.application,
      },


      //GeneTyping
      {
        path: '/geneTypingAlgorithms',
        name: '::GeneTypingAlgorithm',
        iconClass: 'fas fa-sticky-note',
        parentName: '::GeneTyping',
        layout: eLayoutType.application,
      },
      {
        path: '/geneTypeSettings',
        name: '::GeneTypeSetting',
        iconClass: 'fas fa-sticky-note',
        parentName: '::GeneTyping',
        layout: eLayoutType.application,
      },
      {
        path: '/samplePlateResults',
        name: '::SamplePlateResult',
        iconClass: 'fas fa-sticky-note',
        parentName: '::GeneTyping',
        layout: eLayoutType.application,
      },
      {
        path: '/layouts',
        name: '::Layout',
        iconClass: 'fas fa-border-all',
        parentName: '::GeneTyping',
        layout: eLayoutType.application,
      },
    ]);
  };
}
