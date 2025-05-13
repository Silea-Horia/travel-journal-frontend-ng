import { Component } from '@angular/core';
import { MainComponent } from './main/main.component';
//import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [MainComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'travel-journal-frontend';
}
