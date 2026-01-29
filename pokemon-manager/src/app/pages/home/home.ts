import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
