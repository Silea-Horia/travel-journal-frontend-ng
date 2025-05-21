import { Injectable } from '@angular/core';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { environment } from '../../environment';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {
    private backendUrl: string = environment.NG_APP_API_URL;
    
    constructor() { 
        console.log(environment.NG_APP_API_URL);
    }

    generateRandomLocation() {
        let name = faker.location.city();
        let dateVisited = faker.date.past({years: 20}).toISOString().slice(0, 10);
        let rating = faker.number.int({min: 0, max: 5});
        this.create(name, dateVisited, rating);
    }

    async getAll(searchTerm: string = '', ratings: number[] = [], page: number = 0, size: number = 30) {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            ratings.forEach((rating) => params.append('ratings', rating.toString()));
            params.append('page', page.toString());
            params.append('size', size.toString());

            const response = await axios.get(`${this.backendUrl}?${params.toString()}`);

            return {
                content: response.data.content,
                totalPages: response.data.totalPages || 1,
                page: page + 1 // Return 1-based page for frontend
            };
        } catch (error) {
            console.error('Error fetching locations:', error);
            return {
                content: [],
                totalPages: 1,
                page: page + 1
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
            console.error('Error deleting location:', error);
        }
        return true;
    }
}