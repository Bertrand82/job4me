import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvItem } from './cv-item';

describe('CvItem', () => {
  let component: CvItem;
  let fixture: ComponentFixture<CvItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
