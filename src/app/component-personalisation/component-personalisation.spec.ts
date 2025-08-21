import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentPersonalisation } from './component-personalisation';

describe('ComponentPersonalisation', () => {
  let component: ComponentPersonalisation;
  let fixture: ComponentFixture<ComponentPersonalisation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentPersonalisation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentPersonalisation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
