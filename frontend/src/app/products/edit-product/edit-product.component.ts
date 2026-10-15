import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto, ProductsService } from '../products.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {
  @Output() actualizado = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  guardando = false;
  mensaje = '';

  private _producto!: Producto;

  @Input({ required: true })
  set producto(value: Producto) {
    this._producto = value;
    this.formulario.patchValue({
      nombre: value.nombre,
      precio: value.precio,
      activo: value.activo,
    });
  }

  get producto(): Producto {
    return this._producto;
  }

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

  guardarCambios(): void {
    if (this.formulario.invalid || this.guardando) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.mensaje = '';

    this.productsService
      .actualizarProducto(this._producto.id, this.formulario.getRawValue())
      .subscribe({
        next: () => {
          this.guardando = false;
          this.actualizado.emit();
        },
        error: (response: { status: number }) => {
          this.mensaje =
            response.status === 401
              ? 'Tu sesión venció. Inicia sesión nuevamente.'
              : 'No se pudo actualizar el producto.';

          this.guardando = false;
        },
      });
  }
}
