import { Component, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion',
  imports: [CommonModule],
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss'
})
export class Accordion {
  // Inputs
  title = input.required<string>();
  isOpen = input<boolean>(false);

  // Outputs
  toggle = output<boolean>();

  // Internal state
  expanded = signal<boolean>(false);

  ngOnInit(): void {
    this.expanded.set(this.isOpen());
  }

  onToggle(): void {
    const newState = !this.expanded();
    this.expanded.set(newState);
    this.toggle.emit(newState);
  }
}
