import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibrosEliminar } from './libros-eliminar';

describe('LibrosEliminar', () => {
  let component: LibrosEliminar;
  let fixture: ComponentFixture<LibrosEliminar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrosEliminar],
    }).compileComponents();

    fixture = TestBed.createComponent(LibrosEliminar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
