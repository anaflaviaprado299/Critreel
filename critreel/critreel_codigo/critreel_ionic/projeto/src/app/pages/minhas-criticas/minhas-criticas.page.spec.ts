import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinhasCriticasPage } from './minhas-criticas.page';

describe('MinhasCriticasPage', () => {
  let component: MinhasCriticasPage;
  let fixture: ComponentFixture<MinhasCriticasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinhasCriticasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
