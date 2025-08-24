import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreEmploiItem } from './offre-emploi-item';

describe('OffreEmploiItem', () => {
  let component: OffreEmploiItem;
  let fixture: ComponentFixture<OffreEmploiItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffreEmploiItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffreEmploiItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
