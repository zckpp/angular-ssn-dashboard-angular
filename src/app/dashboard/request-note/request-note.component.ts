import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// also need to do entryComponent in app Module
@Component({
  selector: 'app-request-note',
  templateUrl: './request-note.component.html',
  styleUrls: ['./request-note.component.scss']
})
export class RequestNoteComponent {

  constructor(
      public dialogRef: MatDialogRef<RequestNoteComponent>,
      @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
