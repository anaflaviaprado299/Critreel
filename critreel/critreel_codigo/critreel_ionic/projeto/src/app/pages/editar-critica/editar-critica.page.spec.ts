import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarCriticaPage } from './editar-critica.page';

describe('EditarCriticaPage', () => {
  let component: EditarCriticaPage;
  let fixture: ComponentFixture<EditarCriticaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCriticaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
