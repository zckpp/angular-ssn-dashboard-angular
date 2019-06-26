import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestNoteComponent } from './request-note.component';

describe('RequestNoteComponent', () => {
  let component: RequestNoteComponent;
  let fixture: ComponentFixture<RequestNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
