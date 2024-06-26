/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MergeModalComponent } from './merge-modal.component';

describe('MergeModalComponent', () => {
  let component: MergeModalComponent;
  let fixture: ComponentFixture<MergeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
