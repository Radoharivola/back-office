import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAchatComponent } from './new-achat.component';

describe('NewAchatComponent', () => {
  let component: NewAchatComponent;
  let fixture: ComponentFixture<NewAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAchatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
