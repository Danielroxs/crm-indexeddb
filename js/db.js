// IndexedDB Database Service
class CustomerDB {
    constructor() {
        this.dbName = 'CustomerCRM';
        this.version = 1;
        this.storeName = 'customers';
        this.db = null;
    }

    // Initialize the database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                reject(new Error('Failed to open database'));
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    
                    // Create indexes for searching
                    objectStore.createIndex('name', 'name', { unique: false });
                    objectStore.createIndex('email', 'email', { unique: false });
                    objectStore.createIndex('phone', 'phone', { unique: false });
                    objectStore.createIndex('company', 'company', { unique: false });
                }
            };
        });
    }

    // Add a new customer
    async addCustomer(customer) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            
            // Add timestamp
            customer.createdAt = new Date().toISOString();
            customer.updatedAt = new Date().toISOString();
            
            const request = objectStore.add(customer);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error('Failed to add customer'));
            };
        });
    }

    // Get all customers
    async getAllCustomers() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error('Failed to get customers'));
            };
        });
    }

    // Get a single customer by ID
    async getCustomer(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error('Failed to get customer'));
            };
        });
    }

    // Update an existing customer
    async updateCustomer(id, customer) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            
            // Get existing customer first
            const getRequest = objectStore.get(id);
            
            getRequest.onsuccess = () => {
                const existingCustomer = getRequest.result;
                if (!existingCustomer) {
                    reject(new Error('Customer not found'));
                    return;
                }
                
                // Update customer with new data, preserving id and createdAt
                const updatedCustomer = {
                    ...customer,
                    id: id,
                    createdAt: existingCustomer.createdAt,
                    updatedAt: new Date().toISOString()
                };
                
                const updateRequest = objectStore.put(updatedCustomer);
                
                updateRequest.onsuccess = () => {
                    resolve(updateRequest.result);
                };
                
                updateRequest.onerror = () => {
                    reject(new Error('Failed to update customer'));
                };
            };

            getRequest.onerror = () => {
                reject(new Error('Failed to get customer'));
            };
        });
    }

    // Delete a customer
    async deleteCustomer(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(new Error('Failed to delete customer'));
            };
        });
    }

    // Search customers by name, email, or phone
    async searchCustomers(searchTerm) {
        const allCustomers = await this.getAllCustomers();
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        return allCustomers.filter(customer => {
            return (
                customer.name.toLowerCase().includes(lowerSearchTerm) ||
                customer.email.toLowerCase().includes(lowerSearchTerm) ||
                customer.phone.toLowerCase().includes(lowerSearchTerm) ||
                (customer.company && customer.company.toLowerCase().includes(lowerSearchTerm))
            );
        });
    }
}
