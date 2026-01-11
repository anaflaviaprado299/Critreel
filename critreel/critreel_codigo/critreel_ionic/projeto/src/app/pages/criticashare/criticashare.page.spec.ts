import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriticasharePage } from './criticashare.page';

describe('CriticasharePage', () => {
  let component: CriticasharePage;
  let fixture: ComponentFixture<CriticasharePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticasharePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
