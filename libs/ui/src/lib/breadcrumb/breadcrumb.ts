import {
  Component,
  input,
  InputSignal
} from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'lib-breadcrumb',
  imports: [BreadcrumbModule, CommonModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  // Input properties
  model: InputSignal<MenuItem[]> = input<MenuItem[]>([]);
  home: InputSignal<MenuItem | undefined> = input<MenuItem | undefined>(undefined);
  style: InputSignal<{ [klass: string]: any } | undefined> = input<{ [klass: string]: any } | undefined>(undefined);
  styleClass: InputSignal<string | undefined> = input<string | undefined>(undefined);
  ariaLabel: InputSignal<string | undefined> = input<string | undefined>(undefined);
}

