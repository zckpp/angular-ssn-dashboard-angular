import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Request } from '../../request';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})

export class RequestListComponent implements OnInit {

  // receive requests from dashboard and emit approve and decline operations
  @Input() requests;
  @Input() dashboardStatus;
  @Input() pageSize;
  @Input() pageIndex;
  @Output() requestTemp = new EventEmitter<Request>();
  @Output() requestResolved = new EventEmitter<Request>();
  @Output() requestInvalid = new EventEmitter<Request>();
  @Output() editNote = new EventEmitter<Request>();
  @Output() statusChange = new EventEmitter<string>();
  @Output() sortData = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }
}
