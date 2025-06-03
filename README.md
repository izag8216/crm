# CRM App

## Overview
A simple CRM (Customer Relationship Management) web application built with HTML/CSS/JS.
Performs CRUD operations on customer information stored in local data.txt.

## File Structure
- **index.html** : Main HTML file
- **styles.css** : Stylesheet
- **app.js** : JavaScript logic
- **data.txt** : Customer data file

## Usage
Simply open `index.html` in your browser.

## Features

### Core Features
- ✅ Add, edit, and delete customer information
- ✅ Customer list display
- ✅ Search functionality (customer name, company name, email address)
- ✅ Status filtering
- ✅ Responsive design
- ✅ Light/Dark mode toggle

### Customer Information Fields
- Customer name (required)
- Company name
- Email address
- Phone number
- Status (New/Prospect/Existing Customer/Dormant Customer)
- Representative
- Notes
- Created date

### Data Format
Customer data is saved in `data.txt` in the following format:
```
Customer Name|Company Name|Email Address|Phone Number|Status|Representative|Notes|Created Date
```

### Keyboard Shortcuts
- `Ctrl/Cmd + N` : Focus on new customer registration form
- `Escape` : Cancel edit / Close modal

### Themes
- Light mode (default)
- Dark mode
- Settings are automatically saved in browser

## Technical Specifications
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data Storage**: localStorage (emulates data.txt format)
- **Icons**: Font Awesome 6.0
- **Responsive**: Mobile-first design

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Developer Information

### Class Structure
- `CRMApp` : Main application class
  - Data management
  - Event handling
  - UI rendering
  - Theme management

### Data Flow
1. Load data.txt format data from localStorage
2. Parse with pipe delimiter (|)
3. Manage as JavaScript objects
4. Save to localStorage when changed

### Customization
Easy theme customization using CSS variables:
```css
:root {
    --primary-color: #2563eb;
    --bg-primary: #ffffff;
    /* Other variables... */
}
```

## License
MIT License

## Release History
- v1.0.0 (2025-01-15) : Initial release
  - Basic CRUD functionality
  - Responsive design
  - Light/Dark mode