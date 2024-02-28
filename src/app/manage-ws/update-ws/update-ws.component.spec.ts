import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWsComponent } from './update-ws.component';

describe('UpdateWsComponent', () => {
  let component: UpdateWsComponent;
  let fixture: ComponentFixture<UpdateWsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateWsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateWsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
