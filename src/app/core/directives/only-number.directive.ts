import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[stockOnlyNumber]',
  standalone: true,
})
export class OnlyNumberDirective {
  constructor(private el: ElementRef, private ngControl: NgControl) { }

  // Escucha el evento de entrada y formatea el valor
  @HostListener('input')
  onInputChange() {
    const initialValue = this.el.nativeElement.value; // Valor inicial del input
    // Llama a la función transform para formatear el valor
    const formattedValue = this.transform(initialValue);
    // Actualiza el valor del input con el valor formateado
    this.el.nativeElement.value = formattedValue;
    // Aquí actualizamos el valor del control del formulario con el valor formateado
    this.ngControl.control?.setValue(formattedValue);
  }

  /**
   * Función para transformar y formatear el valor
   *
   * @param {string} value
   * @return {*}  {string} Valor formateado solo con números
   * @memberof OnlyNumberDirective
   */
  transform(value: string): string {
    // Elimina todos los caracteres que no sean números
    const newValue = value.replace(/\D+/g, '');
    return newValue; // Devuelve el nuevo valor formateado
  }
}
