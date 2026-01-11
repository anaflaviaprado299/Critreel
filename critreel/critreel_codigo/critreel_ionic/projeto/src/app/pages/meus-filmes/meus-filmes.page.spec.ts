import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeusFilmesPage } from './meus-filmes.page';

describe('MeusFilmesPage', () => {
  let component: MeusFilmesPage;
  let fixture: ComponentFixture<MeusFilmesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeusFilmesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
