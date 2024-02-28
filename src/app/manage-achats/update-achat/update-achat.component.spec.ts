import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAchatComponent } from './update-achat.component';

describe('UpdateAchatComponent', () => {
  let component: UpdateAchatComponent;
  let fixture: ComponentFixture<UpdateAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAchatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
