import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentOffreEmploi } from './component-offre-emploi';

describe('ComponentOffreEmploi', () => {
  let component: ComponentOffreEmploi;
  let fixture: ComponentFixture<ComponentOffreEmploi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentOffreEmploi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentOffreEmploi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
