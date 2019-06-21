import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from  '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequestListComponent } from './dashboard/request-list/request-list.component';
import { CookieService } from 'ngx-cookie-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule, MatSelectModule, MatCardModule, MatSnackBarModule, MatPaginatorModule, MatSortModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RequestListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    NgbModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }