import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Request } from  './request';
import { CategoryGroup } from  './category';
import { Observable } from  'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    // PHP_API_SERVER = "http://127.0.0.1/angular-ssn/backend/api";
    PHP_API_SERVER = "https://mycarnegie.carnegiescience.edu/sites/default/ssn/backend/api";
    constructor(private httpClient: HttpClient) {}

    readRequests(status: string): Observable<Request[]>{
        return this.httpClient.get<Request[]>(`${this.PHP_API_SERVER}/read.php?status=${status}`).pipe(
            tap(requests => {
                requests.forEach(function (request) {
                    // covert mysql datetime into js date
                    let ct = request.created_date.split(/[- :]/);
                    request.created_date = new Date(Date.UTC(ct[0], ct[1]-1, ct[2], ct[3], ct[4], ct[5]));
                    let ht = request.hire_date.split(/[- :]/);
                    request.hire_date = new Date(Date.UTC(ht[0], ht[1]-1, ht[2], ht[3], ht[4], ht[5]));
                });
            }),
            // sort by created date
            tap(requests => { requests.sort((a,b) => { return b.created_date-a.created_date; }); })
        );
    }

    searchRequests(status: string, term: string): Observable<Request[]>{
        return this.httpClient.post<Request[]>(`${this.PHP_API_SERVER}/read.php?status=${status}`, term).pipe(
            tap(requests => {
                requests.forEach(function (request) {
                    // covert mysql datetime into js date
                    let ct = request.created_date.split(/[- :]/);
                    request.created_date = new Date(Date.UTC(ct[0], ct[1]-1, ct[2], ct[3], ct[4], ct[5]));
                    let ht = request.hire_date.split(/[- :]/);
                    request.hire_date = new Date(Date.UTC(ht[0], ht[1]-1, ht[2], ht[3], ht[4], ht[5]));
                });
            }),
            // sort by created date
            tap(requests => { requests.sort((a,b) => { return b.created_date-a.created_date; }); })
        );
    }

    updateRequest(request: Request){
        return this.httpClient.put<Request>(`${this.PHP_API_SERVER}/update.php`, request);
    }

    deleteRequest(id: number){
        return this.httpClient.delete<Request>(`${this.PHP_API_SERVER}/delete.php/?id=${id}`);
    }
}
