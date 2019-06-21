import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { Request } from '../request';
import { map, tap, startWith, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from "rxjs";
import { MatSnackBar, PageEvent, Sort } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // variables
  // postfix dollar sign for observables
  requests$: Observable<Request[]>;
  dashboardStatus: string;
  termFilter = new FormControl('');
  user: string;

  constructor(
      private apiService: ApiService,
      private cookieService: CookieService,
      private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // start with request list with pending status
    this.changeStatus("invalid");
    this.user = this.cookieService.get('ssn_app_user_name');
    this.requests$ = this.termFilter.valueChanges
        .pipe(
            //start with empty string to show all result
            startWith<string>(""),
            debounceTime(200),
            distinctUntilChanged(),
            switchMap(term => this.apiService.searchRequests(this.dashboardStatus, term)
            ),
        );
  }

  // methods
  updateRequest(request: Request, value){
    request.status = value;
    // use any here so that the condition statement won't generate error
    this.apiService.updateRequest(request).subscribe((response: any) => {
      // status response configured in php app
      console.log(response);
      // if succeed, then update request list view
      if (response.status == "succeed") {
        this.changeStatus(this.dashboardStatus);
        // set up snackBar pop up
        if ('temp' === value) {
          this.snackBar.open('Request is assinged with temporary SSN!', 'close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: 'approve'
          });
        } else if ('resolved' === value) {
          this.snackBar.open('Request is resolved!', 'close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: 'decline'
          });
        }
      }
      else alert("Operation failed on database, please try again.");
    });
  }

  tempRequest(request: Request){
    this.updateRequest(request, 'temp');
  }

  resolveRequest(request: Request){
    this.updateRequest(request, 'resolved');
  }

  // get different view based on status then pass it down to request list display
  changeStatus(status) {
    this.dashboardStatus = status;
    this.termFilter.setValue("");
    this.requests$ = this.termFilter.valueChanges
        .pipe(
            //start with empty string to show all result
            startWith<string>(""),
            debounceTime(200),
            distinctUntilChanged(),
            switchMap(term => this.apiService.searchRequests(this.dashboardStatus, term)
            ),
        );
  }

  // Mat Paginator Output
  pageEvent: PageEvent;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25];

  //Mat Sort
  sortDataControl(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    this.requests$ = this.requests$.pipe(
        tap(
            requests => {
              requests.sort((a, b) => {
                const isAsc = sort.direction === 'asc';
                switch (sort.active) {
                  case 'created_date': return compare(a.created_date, b.created_date, isAsc);
                  case 'first_name': return compare(a.first_name, b.first_name, isAsc);
                  case 'last_name': return compare(a.last_name, b.last_name, isAsc);
                  case 'department': return compare(a.department, b.department, isAsc);
                  case 'hire_date': return compare(a.hire_date, b.hire_date, isAsc);
                  default: return 0;
                }
              });
            }
        )
    );
  }
}
