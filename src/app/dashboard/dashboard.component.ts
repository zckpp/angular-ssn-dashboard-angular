import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { SortableDirective, SortEvent, Compare } from '../sortable.directive';
import { Request } from '../request';
import { map, tap, startWith, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from "rxjs";
import { MatSnackBar, PageEvent } from '@angular/material';

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
                // .pipe(
                //     map(
                //         (requests) => {
                //           return requests.filter((request) => { return request.status.includes(this.dashboardStatus); });
                //         }
                //     ),
                // )
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
                // .pipe(
                //     map(
                //         (requests) => {
                //           return requests.filter((request) => { return request.status.includes(this.dashboardStatus); });
                //         }
                //     ),
                // )
            ),
        );
  }

  // sort requests
  // sorting requests list table
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
  sortRequests({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting requests
    if (direction === '') {
      // sort by date when direction is reset to default
      this.requests$ = this.requests$.pipe(
          tap(
              (r: any[]) => {
                r.sort((a, b) => { return b.created_date-a.created_date; });
              }
          )
      );
    } else {
      // set string column
      this.requests$ = this.requests$.pipe(
          tap(
              (r: any[]) => {
                r.sort((a, b) => {
                  const res = Compare(a[column], b[column]);
                  return direction === 'asc' ? res : -res;
                });
              }
          )
      );
    }
  }

  // MatPaginator Output
  pageEvent: PageEvent;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25];
}
