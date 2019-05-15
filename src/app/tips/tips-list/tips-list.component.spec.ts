import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsListComponent } from './tips-list.component';

describe('TipsListComponent', () => {
  let component: TipsListComponent;
  let fixture: ComponentFixture<TipsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipsListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
