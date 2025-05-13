import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {FormsModule} from '@angular/forms';

import { Location } from '../../model/location';
import { ServicesService } from '../services.service';

@Component({
    selector: 'app-main',
    imports: [CommonModule, FormsModule],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
    locations: Location[] = [];
    ratings: number[] = [0, 1, 2, 3, 4, 5];

    dropdownToggle: boolean = false;

    searchTerm: string = '';
    selectedRatings: number[] = [];

    constructor(private services: ServicesService) {}

    ngOnInit(): void {
        console.log('here');
        this.getAllLocations();
    }

    async getAllLocations() {
        this.locations = (await this.services.getAll(this.searchTerm, this.selectedRatings, 1)).content;
    }

    selectRating(rating: number): void {
        const index = this.selectedRatings.indexOf(rating, 0);

        if (index > -1) {
            this.selectedRatings.splice(index, 1);
        } else {
            this.selectedRatings.push(rating);
        }

        this.getAllLocations()
    }

}
