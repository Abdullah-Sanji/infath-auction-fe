import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

export interface BreadcrumbItem {
  label: string;
  route?: string[];
  translationKey?: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterLink, TranslocoPipe],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss'
})
export class Breadcrumb {
  items = input.required<BreadcrumbItem[]>();
}

