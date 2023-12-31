import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, isDevMode } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"; // Import
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import {
  MsalModule,
  MsalRedirectComponent,
  MsalGuard,
  MsalInterceptor,
} from "@azure/msal-angular"; // Import MsalInterceptor
import {
  InteractionType,
  PublicClientApplication,
} from "@azure/msal-browser";
import { HomeModule } from "./home/home.module";
import { redirectUrl } from "./config/env.config";
import { CommonModule } from "@angular/common";
import { LoginModule } from "./login/login.module";

const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;


@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    LoginModule,
    HomeModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: "d984f456-db14-4dfb-b314-95df2bed999f",
          authority:
            "https://login.microsoftonline.com/489581cf-0f55-408a-9e44-289b6fb55ea0",
          redirectUri: redirectUrl
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: isIE,
        },
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ["user.read"],
        },
      },
      {
        interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
        protectedResourceMap: new Map([
          ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
        ]),
      }
    ),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalGuard,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
