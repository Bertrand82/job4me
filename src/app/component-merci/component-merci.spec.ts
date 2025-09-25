import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentMerci } from './component-merci';

describe('ComponentMerci', () => {
  let component: ComponentMerci;
  let fixture: ComponentFixture<ComponentMerci>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentMerci]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentMerci);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
