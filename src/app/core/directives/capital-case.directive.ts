import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[stockCapitalCase]',
  standalone: true,
})
export class CapitalCaseDirective { 
  constructor(private el: ElementRef) {}
  
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.el.nativeElement.value = input.value;
  }
}
