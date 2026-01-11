import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroFilmePage } from './cadastro-filme.page';

describe('CadastroFilmePage', () => {
  let component: CadastroFilmePage;
  let fixture: ComponentFixture<CadastroFilmePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroFilmePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
