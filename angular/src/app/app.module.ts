import { CoreModule } from '@abp/ng.core';
import { SettingManagementConfigModule } from '@abp/ng.setting-management/config';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IdentityConfigModule } from '@volo/abp.ng.identity/config';
import { CommercialUiConfigModule } from '@volo/abp.commercial.ng.ui/config';
import { AccountAdminConfigModule } from '@volo/abp.ng.account/admin/config';
import { AccountPublicConfigModule } from '@volo/abp.ng.account/public/config';
import { GdprConfigModule } from '@volo/abp.ng.gdpr/config';
import { AuditLoggingConfigModule } from '@volo/abp.ng.audit-logging/config';
import { LanguageManagementConfigModule } from '@volo/abp.ng.language-management/config';
import { registerLocale } from '@volo/abp.ng.language-management/locale';
import { FileManagementConfigModule } from '@volo/abp.ng.file-management/config';
import { ChatConfigModule } from '@volo/abp.ng.chat/config';
import { SaasConfigModule } from '@volo/abp.ng.saas/config';
import { TextTemplateManagementConfigModule } from '@volo/abp.ng.text-template-management/config';
import { OpeniddictproConfigModule } from '@volo/abp.ng.openiddictpro/config';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_ROUTE_PROVIDER } from './route.provider';
import { FeatureManagementModule } from '@abp/ng.feature-management';
import { HttpErrorComponent, ThemeLeptonXModule  } from '@volosoft/abp.ng.theme.lepton-x';
import { SideMenuLayoutModule } from '@volosoft/abp.ng.theme.lepton-x/layouts';
import { AccountLayoutModule } from '@volosoft/abp.ng.theme.lepton-x/account';
import { AbpOAuthModule } from '@abp/ng.oauth';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule.forRoot({
      environment,
      registerLocaleFn: registerLocale(),
    }),
    AbpOAuthModule.forRoot(),
    ThemeSharedModule.forRoot({
      httpErrorConfig: {
        errorScreen: {
          component: HttpErrorComponent,
          forWhichErrors: [401, 403, 404, 500],
          hideCloseIcon: true,
        },
      },
    }),
    AccountAdminConfigModule.forRoot(),
    AccountPublicConfigModule.forRoot(),
    CommercialUiConfigModule.forRoot(),
    GdprConfigModule.forRoot({
      privacyPolicyUrl: 'gdpr-cookie-consent/privacy',
      cookiePolicyUrl: 'gdpr-cookie-consent/cookie',
    }),
    LanguageManagementConfigModule.forRoot(),
    FileManagementConfigModule.forRoot(),
    SaasConfigModule.forRoot(),
    ChatConfigModule.forRoot(),
    AuditLoggingConfigModule.forRoot(),
    OpeniddictproConfigModule.forRoot(),
    TextTemplateManagementConfigModule.forRoot(),
    IdentityConfigModule.forRoot(),
    ThemeSharedModule.forRoot(),
    SettingManagementConfigModule.forRoot(),
    ThemeLeptonXModule.forRoot(),
    SideMenuLayoutModule.forRoot(),
    AccountLayoutModule.forRoot(),
    FeatureManagementModule.forRoot(),
  ],
  providers: [APP_ROUTE_PROVIDER],
  bootstrap: [AppComponent],
})
export class AppModule {}
