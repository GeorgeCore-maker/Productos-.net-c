import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Producto, ProductsService } from './products.service';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe, AddProductComponent, EditProductComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  productos: Producto[] = [];
  cargando = true;
  error = '';
  mensaje = '';

  mostrarFormulario = false;
  productoEnEdicion: Producto | null = null;
  productoAEliminar: Producto | null = null;
  eliminando = false;

  constructor(
    private readonly productsService: ProductsService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error = '';
    this.productsService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargando = false;
      },
      error: (response: { status: number }) => {
        this.error =
          response.status === 401
            ? 'Tu sesión no es válida o venció. Inicia sesión nuevamente.'
            : 'No se pudieron cargar los productos. Verifica la API y la configuración CORS.';
        this.cargando = false;
      },
    });
  }

  abrirFormulario(): void {
    this.mensaje = '';
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  alCrearProducto(): void {
    this.cerrarFormulario();
    this.cargarProductos();
  }

  editar(producto: Producto): void {
    this.mensaje = '';
    this.productoEnEdicion = producto;
  }

  cerrarEdicion(): void {
    this.productoEnEdicion = null;
  }

  alActualizarProducto(): void {
    this.cerrarEdicion();
    this.mensaje = 'Producto actualizado correctamente.';
    this.cargarProductos();
  }

  pedirEliminar(producto: Producto): void {
    this.mensaje = '';
    this.productoAEliminar = producto;
  }

  cancelarEliminar(): void {
    this.productoAEliminar = null;
  }

  eliminar(): void {
    if (!this.productoAEliminar || this.eliminando) {
      return;
    }

    const id = this.productoAEliminar.id;
    this.eliminando = true;

    this.productsService.eliminarProducto(id).subscribe({
      next: () => {
        this.eliminando = false;
        this.productoAEliminar = null;
        this.mensaje = 'Producto eliminado correctamente.';
        this.cargarProductos();
      },
      error: (response: { status: number }) => {
        this.eliminando = false;
        this.mensaje =
          response.status === 401
            ? 'Tu sesión venció. Inicia sesión nuevamente.'
            : 'No se pudo eliminar el producto.';
      },
    });
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
