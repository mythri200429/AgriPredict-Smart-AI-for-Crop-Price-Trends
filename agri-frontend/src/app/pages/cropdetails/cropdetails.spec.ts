import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cropdetails } from './cropdetails';

describe('Cropdetails', () => {
  let component: Cropdetails;
  let fixture: ComponentFixture<Cropdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cropdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cropdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
