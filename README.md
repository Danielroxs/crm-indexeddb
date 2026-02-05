# CRM - Customer Relationship Management

A lightweight, modern Frontend CRM application built with **Vanilla JavaScript**, **Tailwind CSS**, and **IndexedDB** for local data storage.

## Features

- ✅ **Customer Management**: Full CRUD operations (Create, Read, Update, Delete)
- 🔍 **Real-time Search**: Search customers by name, email, phone, or company
- 💾 **Local Storage**: All data stored locally using IndexedDB (no server required)
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Clean and intuitive interface with Tailwind CSS
- ⚡ **Fast & Lightweight**: No frameworks, pure Vanilla JavaScript
- 🔒 **Privacy-First**: All data stays in your browser

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Danielroxs/crm-indexeddb.git
cd crm-indexeddb
```

2. Open `index.html` in your web browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Or use a local development server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

## Usage

### Adding a Customer
1. Click the "Add Customer" button
2. Fill in the customer details (name, email, and phone are required)
3. Optionally add company name and notes
4. Click "Save" to add the customer

### Editing a Customer
1. Click the edit icon (pencil) on any customer card
2. Update the desired fields
3. Click "Save" to update the customer

### Deleting a Customer
1. Click the delete icon (trash) on any customer card
2. Confirm the deletion in the modal
3. The customer will be permanently removed

### Searching for Customers
- Type in the search bar at the top of the page
- Results will filter in real-time as you type
- Search works across name, email, phone, and company fields

## Technical Details

### Architecture

The application is structured into three main components:

1. **index.html**: Main HTML structure with Tailwind CSS for styling
2. **js/db.js**: IndexedDB service class (`CustomerDB`) handling all database operations
3. **js/app.js**: Main application logic (`CRMApp`) managing UI and interactions

### IndexedDB Schema

**Database Name**: `CustomerCRM`

**Object Store**: `customers`

**Customer Object Structure**:
```javascript
{
  id: number,           // Auto-incremented primary key
  name: string,         // Customer name (required)
  email: string,        // Customer email (required)
  phone: string,        // Customer phone (required)
  company: string,      // Company name (optional)
  notes: string,        // Additional notes (optional)
  createdAt: string,    // ISO timestamp
  updatedAt: string     // ISO timestamp
}
```

**Indexes**:
- `name`: For searching by customer name
- `email`: For searching by email
- `phone`: For searching by phone number
- `company`: For searching by company name

### Browser Compatibility

This application works in all modern browsers that support:
- IndexedDB API
- ES6+ JavaScript features
- CSS Grid and Flexbox

**Supported Browsers**:
- Chrome 24+
- Firefox 16+
- Safari 10+
- Edge 12+
- Opera 15+

## Project Structure

```
crm-indexeddb/
├── index.html          # Main HTML file
├── js/
│   ├── db.js          # IndexedDB service
│   └── app.js         # Application logic
└── README.md          # Documentation
```

## Features in Detail

### Customer List View
- Displays all customers in card format
- Shows customer name, email, phone, company, and notes
- Includes relative timestamps (e.g., "2 hours ago")
- Quick access to edit and delete actions

### Modal Forms
- Add/Edit customer modal with form validation
- Delete confirmation modal to prevent accidental deletions
- Smooth animations and transitions

### Search & Filter
- Real-time search with 300ms debounce
- Searches across multiple fields simultaneously
- Case-insensitive matching

### Data Persistence
- All data stored locally in browser's IndexedDB
- Data persists across browser sessions
- No server or internet connection required

## Development

### No Build Process Required
This is a pure frontend application with no build step. Simply edit the HTML, CSS, or JavaScript files and refresh your browser.

### Code Style
- Clean, readable code with comments
- ES6+ features (async/await, classes, arrow functions)
- Organized into logical modules

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

Danielroxs

## Acknowledgments

- Built with [Tailwind CSS](https://tailwindcss.com/) via CDN
- Icons from [Heroicons](https://heroicons.com/)
- Powered by [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)