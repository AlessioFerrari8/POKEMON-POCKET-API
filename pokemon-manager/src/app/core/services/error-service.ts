import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    constructor() { }

    handleError(error: any): void {
        console.error('Error caught by interceptor:', error);

        // Log status code if available
        if (error.status) {
            console.error(`Status: ${error.status}`);
        }

        // Log message if available
        if (error.message) {
            console.error(`Message: ${error.message}`);
        }

        // Log error details
        if (error.error) {
            console.error('Error details:', error.error);
        }

        // Custom error handling per status code
        switch (error.status) {
            case 401:
                // Unauthorized - redirect to login
                console.warn('Unauthorized access - redirect to login');
                break;
            case 403:
                // Forbidden
                console.warn('Forbidden access');
                break;
            case 404:
                // Not found
                console.warn('Resource not found');
                break;
            case 500:
                // Server error
                console.error('Server error occurred');
                break;
            default:
                console.error('An error occurred:', error);
        }
    }
}
