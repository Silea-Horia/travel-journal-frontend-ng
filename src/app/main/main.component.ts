import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    createToggle: boolean = false;

    selectedLocationsIds: number[] = [];
    searchTerm: string = '';
    selectedRatings: number[] = [];

    currentPage: number = 1;
    pageSize: number = 30;
    totalPages: number = 1;

    constructor(private services: ServicesService) {}

    ngOnInit(): void {
        this.getAllLocations();
    }

    async getAllLocations() {
        try {
            const response = await this.services.getAll(this.searchTerm, this.selectedRatings, this.currentPage - 1, this.pageSize);
            this.locations = response.content;
            this.totalPages = response.totalPages;
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    }

    async createLocation(name: string, dateVisited: string, rating: number) {
        try {
            await this.services.create(name, dateVisited, rating);
            this.currentPage = 1;
            await this.getAllLocations();
        } catch (error) {
            console.error('Error creating location:', error);
        }
    }

    async updateLocation(name: string, dateVisited: string, rating: number) {
        try {
            await this.services.update(this.selectedLocationsIds[0], name, dateVisited, rating);
            this.currentPage = 1;
            await this.getAllLocations();
        } catch (error) {
            console.error('Error updating location:', error);
        }
    }

    async deleteLocations() {
        const deletePromises = this.selectedLocationsIds.map(locationId => 
            this.services.delete(locationId)
        );

        try {
            await Promise.all(deletePromises);
            this.selectedLocationsIds = [];
            this.currentPage = 1;
            await this.getAllLocations();
        } catch (error) {
            console.error('Error deleting locations:', error);
        }
    }

    selectRating(rating: number): void {
        const index = this.selectedRatings.indexOf(rating);
        if (index > -1) {
            this.selectedRatings.splice(index, 1);
        } else {
            this.selectedRatings.push(rating);
        }
        this.currentPage = 1;
        this.getAllLocations();
    }

    selectLocation(location: Location): void {
        const index = this.selectedLocationsIds.indexOf(location.id);
        if (index > -1) {
            this.selectedLocationsIds.splice(index, 1);
        } else {
            this.selectedLocationsIds.push(location.id);
        }
        this.getAllLocations();
    }

    getSelectedLocation(): Location {
        return this.locations.find(location => location.id === this.selectedLocationsIds[0])!;
    }

    goToPreviousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.getAllLocations();
        }
    }

    goToNextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getAllLocations();
        }
    }
}