import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscreverCriticaPage } from './escrever-critica.page';

describe('EscreverCriticaPage', () => {
  let component: EscreverCriticaPage;
  let fixture: ComponentFixture<EscreverCriticaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EscreverCriticaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
