import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  @Output() productoCreado = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  guardando = false;
  mensaje = '';

  private readonly fb = new FormBuilder();

  formulario = this.fb.nonNullable.group({
    nombre: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    activo: [true],
  });

  constructor(private readonly productsService: ProductsService) {}

  cerrarModal(): void {
    this.cerrar.emit();
  }

  guardarProducto(): void {
    if (this.formulario.invalid || this.guardando) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.mensaje = '';

    this.productsService
      .crearProducto(this.formulario.getRawValue())
      .subscribe({
        next: () => {
          this.formulario.reset({
            nombre: '',
            precio: 0,
            activo: true,
          });

          this.mensaje = 'Producto creado correctamente.';
          this.guardando = false;
          this.productoCreado.emit();
        },
        error: (response: { status: number }) => {
          this.mensaje =
            response.status === 401
              ? 'Tu sesión venció. Inicia sesión nuevamente.'
              : 'No se pudo crear el producto.';

          this.guardando = false;
        },
      });
  }
}
