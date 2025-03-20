import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportToCSV(data: any[]): string {
    // Define your headers
    const headers = ['First Name', 'Last Name', 'Street Address', 'City', 'State', 'Postal Code'];
  
    // Map through the data and create rows based on the header fields
    const csvRows = [
      headers.join(','),  // First row is the headers
      ...data.map(row => {
        return [
          row.first_name,
          row.last_name,
          row.street_address,
          row.city,
          row.state,
          row.postal_code
        ].join(',');  // Map each player to the columns
      })
    ];
  
    // Return the CSV string
    return csvRows.join('\n');
  }
}