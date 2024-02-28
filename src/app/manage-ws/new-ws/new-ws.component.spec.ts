import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWsComponent } from './new-ws.component';

describe('NewWsComponent', () => {
  let component: NewWsComponent;
  let fixture: ComponentFixture<NewWsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewWsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewWsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
