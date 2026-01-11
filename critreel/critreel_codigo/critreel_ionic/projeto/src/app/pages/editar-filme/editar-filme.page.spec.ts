import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarFilmePage } from './editar-filme.page';

describe('EditarFilmePage', () => {
  let component: EditarFilmePage;
  let fixture: ComponentFixture<EditarFilmePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarFilmePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
