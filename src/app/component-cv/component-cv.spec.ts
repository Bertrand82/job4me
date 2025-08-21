import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentCV } from './component-cv';

describe('ComponentCV', () => {
  let component: ComponentCV;
  let fixture: ComponentFixture<ComponentCV>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentCV]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentCV);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
