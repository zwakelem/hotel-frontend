import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindBooking } from './find-booking';

describe('FindBooking', () => {
  let component: FindBooking;
  let fixture: ComponentFixture<FindBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindBooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
