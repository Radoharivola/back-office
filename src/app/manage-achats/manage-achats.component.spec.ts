import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAchatsComponent } from './manage-achats.component';

describe('ManageAchatsComponent', () => {
  let component: ManageAchatsComponent;
  let fixture: ComponentFixture<ManageAchatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAchatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
