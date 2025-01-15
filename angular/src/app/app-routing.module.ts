import { authGuard, permissionGuard } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard, permissionGuard],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('@volo/abp.ng.account/public').then(m => m.AccountPublicModule.forLazy()),
  },
  {
    path: 'gdpr',
    loadChildren: () => import('@volo/abp.ng.gdpr').then(m => m.GdprModule.forLazy()),
  },
  {
    path: 'identity',
    loadChildren: () => import('@volo/abp.ng.identity').then(m => m.IdentityModule.forLazy()),
  },
  {
    path: 'language-management',
    loadChildren: () =>
      import('@volo/abp.ng.language-management').then(m => m.LanguageManagementModule.forLazy()),
  },
  {
    path: 'saas',
    loadChildren: () => import('@volo/abp.ng.saas').then(m => m.SaasModule.forLazy()),
  },
  {
    path: 'chat',
    loadChildren: () => import('@volo/abp.ng.chat').then(m => m.ChatModule.forLazy()),
  },
  {
    path: 'audit-logs',
    loadChildren: () =>
      import('@volo/abp.ng.audit-logging').then(m => m.AuditLoggingModule.forLazy()),
  },
  {
    path: 'openiddict',
    loadChildren: () =>
      import('@volo/abp.ng.openiddictpro').then(m => m.OpeniddictproModule.forLazy()),
  },
  {
    path: 'text-template-management',
    loadChildren: () =>
      import('@volo/abp.ng.text-template-management').then(m =>
        m.TextTemplateManagementModule.forLazy()
      ),
  },
  {
    path: 'file-management',
    loadChildren: () => import('@volo/abp.ng.file-management').then(m => m.FileManagementModule.forLazy()),
  },
  {
  path: 'gdpr-cookie-consent',
    loadChildren: () =>
      import('./gdpr-cookie-consent/gdpr-cookie-consent.module').then(
      m => m.GdprCookieConsentModule
    ),
  },
  {
    path: 'setting-management',
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.SettingManagementModule.forLazy()),
  },
  { path: 'csvHeaders', loadChildren: () => import('./csv-header/csv-header.module').then(m => m.CsvHeaderModule) },
  { path: 'compounds', loadChildren: () => import('./compound/compound.module').then(m => m.CompoundModule) },
  { path: 'echoReports', loadChildren: () => import('./echo-report/echo-report.module').then(m => m.EchoReportModule) },
  { path: 'imports', loadChildren: () => import('./import/import.module').then(m => m.ImportModule) },
  { path: 'instruments', loadChildren: () => import('./instrument/instrument.module').then(m => m.InstrumentModule) },
  { path: 'layouts', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule) },
  { path: 'liquids', loadChildren: () => import('./liquid/liquid.module').then(m => m.LiquidModule) },
  { path: 'liquidCategories', loadChildren: () => import('./liquid-category/liquid-category.module').then(m => m.LiquidCategoryModule) },
  { path: 'liquidPositionInPlates', loadChildren: () => import('./liquid-position-in-plate/liquid-position-in-plate.module').then(m => m.LiquidPositionInPlateModule) },
  { path: 'liquidTransferHistories', loadChildren: () => import('./liquid-transfer-history/liquid-transfer-history.module').then(m => m.LiquidTransferHistoryModule) },
  { path: 'plates', loadChildren: () => import('./plate/plate.module').then(m => m.PlateModule) },
  { path: 'plateTransferHistories', loadChildren: () => import('./plate-transfer-history/plate-transfer-history.module').then(m => m.PlateTransferHistoryModule) },
  { path: 'markers', loadChildren: () => import('./marker/marker.module').then(m => m.MarkerModule) },
  { path: 'markerPannels', loadChildren: () => import('./marker-pannel/marker-pannel.module').then(m => m.MarkerPannelModule) },
  { path: 'geneTypingAlgorithms', loadChildren: () => import('./gene-typing-algorithm/gene-typing-algorithm.module').then(m => m.GeneTypingAlgorithmModule) },
  { path: 'geneTypeSettings', loadChildren: () => import('./gene-type-setting/gene-type-setting.module').then(m => m.GeneTypeSettingModule) },
  { path: 'samples', loadChildren: () => import('./sample/sample.module').then(m => m.SampleModule) },
  { path: 'samplePlateResults', loadChildren: () => import('./sample-plate-result/sample-plate-result.module').then(m => m.SamplePlateResultModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
