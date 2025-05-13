import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {
    private backendUrl: string = 'http://localhost:8080/api/locations';
    constructor() { }

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
}
