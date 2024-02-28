import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWsComponent } from './manage-ws.component';

describe('ManageWsComponent', () => {
  let component: ManageWsComponent;
  let fixture: ComponentFixture<ManageWsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageWsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageWsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
