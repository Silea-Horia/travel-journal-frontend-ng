import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { Location } from '../../model/location';
import { ServicesService } from '../services.service';

@Component({
    selector: 'app-main',
    imports: [CommonModule, FormsModule, InfiniteScrollModule],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
    locations: Location[] = [];
    ratings: number[] = [0, 1, 2, 3, 4, 5];

    dropdownToggle: boolean = false;
    createToggle: boolean = false;

    selectedLocationsIds: number[] = [];
    searchTerm: string = '';
    selectedRatings: number[] = [];

    currentPage: number = 1;

    constructor(private services: ServicesService) {}

    ngOnInit(): void {
        this.getAllLocations();
    }

    async getAllLocations() {
        let response = (await this.services.getAll(this.searchTerm, this.selectedRatings, this.currentPage));
        this.locations = this.locations.concat(response.content);
    }

    async createLocation(name: string, dateVisited: string, rating: number) {
        try {
            await this.services.create(name, dateVisited, rating);
            
            this.locations = [];
            this.currentPage = 1;
            await this.getAllLocations();
        } catch (error) {
            console.error('Error creating locations:', error);
        }
    }

    async updateLocation(name: string, dateVisited: string, rating: number) {
        try {
            await this.services.update(this.selectedLocationsIds[0], name, dateVisited, rating);
            
            this.locations = [];
            this.currentPage = 1;
            await this.getAllLocations();
        } catch (error) {
            console.error('Error updating locations:', error);
        }
    }

    async deleteLocations() {
        const deletePromises = this.selectedLocationsIds.map(locationId => 
            this.services.delete(locationId)
        );

        try {
            await Promise.all(deletePromises);

            this.selectedLocationsIds = [];
            this.locations = [];
            this.currentPage = 1;
            await this.getAllLocations();
        } catch (error) {
            console.error('Error deleting locations:', error);
        }
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

    selectLocation(location: Location): void {
        const index = this.selectedLocationsIds.indexOf(location.id, 0);

        if (index > -1) {
            this.selectedLocationsIds.splice(index, 1);
        } else {
            this.selectedLocationsIds.push(location.id);
        }

        console.log(this.selectedLocationsIds);
        console.log(this.selectedLocationsIds.includes(location.id));

        this.getAllLocations()
    }

    getSelectedLocation(): Location {
        return this.locations.filter(location => location.id == this.selectedLocationsIds[0])[0];
    }

    onScroll() {
        console.log("scrolled");
        this.currentPage++;
        this.getAllLocations();
    }
}
