import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciarPerfilPage } from './gerenciar-perfil.page';

describe('GerenciarPerfilPage', () => {
  let component: GerenciarPerfilPage;
  let fixture: ComponentFixture<GerenciarPerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciarPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
