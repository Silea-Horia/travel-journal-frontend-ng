import { Injectable } from '@angular/core';
import axios from 'axios';
import { faker } from '@faker-js/faker';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {
    private backendUrl: string = 'http://localhost:8080/api/locations';
    constructor() { 
        for (let i = 0; i < 100; i++) {
            this.generateRandomLocation();
        }
    }

    generateRandomLocation() {
        let name = faker.location.city();
        let dateVisited = faker.date.past({years: 20}).toISOString().slice(0, 10);
        let rating = faker.number.int({min: 0, max: 5});
        this.create(name, dateVisited, rating);
    }

    async getAll(searchTerm: string = '', ratings: number[] = [], page: number = 1) {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('name', searchTerm);
            ratings.forEach((rating) => params.append('ratings', rating.toString()));
            params.append('page', (page - 1).toString());

            const response = await axios.get(`${this.backendUrl}?${params.toString()}`);

            return {
                content: response.data.content,
                totalPages: response.data.totalPages || 1,
                page: page,
            };
        } catch (error) {
            console.error('Error fetching locations');
            return {
                content: [],
                totalPages: 1,
                page: page,
            };
        }
    }

    async create(name: string, dateVisited: string, rating: number) {
        try {
            const response = await axios.post(this.backendUrl, { name, dateVisited, rating });
            return response.data;
        } catch (error) {
            console.error('Error creating location:', error);
        }
    }

    async update(id: number, name: string, dateVisited: string, rating: number) {
        try {
            const response = await axios.put(`${this.backendUrl}/${id}`, {
                name,
                dateVisited,
                rating,
            });
            return response.data;
        } catch (error) {
            console.error('Error updating location:', error);
        }
    }

    async delete(id: number) {
        try {
            await axios.delete(`${this.backendUrl}/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting location');
        }

        return true;
    }
}
