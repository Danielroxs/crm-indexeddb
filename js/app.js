// Main Application Logic
class CRMApp {
    constructor() {
        this.db = new CustomerDB();
        this.currentCustomerId = null;
        this.deleteCustomerId = null;
        this.init();
    }

    async init() {
        try {
            // Initialize database
            await this.db.init();
            console.log('Database initialized successfully');
            
            // Initialize UI
            this.initializeEventListeners();
            
            // Load customers
            await this.loadCustomers();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showToast('Failed to initialize application', 'error');
        }
    }

    initializeEventListeners() {
        // Add customer button
        document.getElementById('addCustomerBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Empty state add button
        document.getElementById('emptyStateAddBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Close modal
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submit
        document.getElementById('customerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCustomer();
        });

        // Search input
        let searchTimeout;
        document.getElementById('searchInput').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchCustomers(e.target.value);
            }, 300);
        });

        // Delete modal buttons
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
        });

        // Close modal on background click
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                this.closeModal();
            }
        });

        document.getElementById('deleteModal').addEventListener('click', (e) => {
            if (e.target.id === 'deleteModal') {
                this.closeDeleteModal();
            }
        });
    }

    async loadCustomers() {
        try {
            const customers = await this.db.getAllCustomers();
            this.renderCustomers(customers);
        } catch (error) {
            console.error('Error loading customers:', error);
            this.showToast('Failed to load customers', 'error');
        }
    }

    async searchCustomers(searchTerm) {
        try {
            if (!searchTerm.trim()) {
                await this.loadCustomers();
                return;
            }
            
            const customers = await this.db.searchCustomers(searchTerm);
            this.renderCustomers(customers);
        } catch (error) {
            console.error('Error searching customers:', error);
            this.showToast('Search failed', 'error');
        }
    }

    renderCustomers(customers) {
        const customerList = document.getElementById('customerList');
        const emptyState = document.getElementById('emptyState');

        if (customers.length === 0) {
            customerList.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        
        // Sort customers by most recent first
        customers.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        customerList.innerHTML = customers.map(customer => `
            <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 fade-in">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">${this.escapeHtml(customer.name)}</h3>
                        <div class="space-y-1 text-gray-600">
                            <p class="flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                ${this.escapeHtml(customer.email)}
                            </p>
                            <p class="flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                ${this.escapeHtml(customer.phone)}
                            </p>
                            ${customer.company ? `
                                <p class="flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                    ${this.escapeHtml(customer.company)}
                                </p>
                            ` : ''}
                        </div>
                        ${customer.notes ? `
                            <p class="mt-3 text-gray-600 text-sm italic">"${this.escapeHtml(customer.notes)}"</p>
                        ` : ''}
                        <p class="mt-3 text-xs text-gray-400">
                            Last updated: ${this.formatDate(customer.updatedAt)}
                        </p>
                    </div>
                    <div class="flex space-x-2 ml-4">
                        <button 
                            onclick="app.editCustomer(${customer.id})"
                            class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition duration-200"
                            title="Edit"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button 
                            onclick="app.deleteCustomer(${customer.id})"
                            class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition duration-200"
                            title="Delete"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    openModal(customer = null) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('customerForm');

        // Reset form
        form.reset();
        this.currentCustomerId = null;

        if (customer) {
            // Edit mode
            modalTitle.textContent = 'Edit Customer';
            this.currentCustomerId = customer.id;
            document.getElementById('name').value = customer.name;
            document.getElementById('email').value = customer.email;
            document.getElementById('phone').value = customer.phone;
            document.getElementById('company').value = customer.company || '';
            document.getElementById('notes').value = customer.notes || '';
        } else {
            // Add mode
            modalTitle.textContent = 'Add Customer';
        }

        modal.classList.remove('hidden');
    }

    closeModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        this.currentCustomerId = null;
    }

    async saveCustomer() {
        try {
            const customer = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                company: document.getElementById('company').value.trim(),
                notes: document.getElementById('notes').value.trim()
            };

            if (this.currentCustomerId) {
                // Update existing customer
                await this.db.updateCustomer(this.currentCustomerId, customer);
                this.showToast('Customer updated successfully');
            } else {
                // Add new customer
                await this.db.addCustomer(customer);
                this.showToast('Customer added successfully');
            }

            this.closeModal();
            await this.loadCustomers();
            
            // Clear search if active
            document.getElementById('searchInput').value = '';
        } catch (error) {
            console.error('Error saving customer:', error);
            this.showToast('Failed to save customer', 'error');
        }
    }

    async editCustomer(id) {
        try {
            const customer = await this.db.getCustomer(id);
            if (customer) {
                this.openModal(customer);
            } else {
                this.showToast('Customer not found', 'error');
            }
        } catch (error) {
            console.error('Error loading customer:', error);
            this.showToast('Failed to load customer', 'error');
        }
    }

    deleteCustomer(id) {
        this.deleteCustomerId = id;
        document.getElementById('deleteModal').classList.remove('hidden');
    }

    closeDeleteModal() {
        document.getElementById('deleteModal').classList.add('hidden');
        this.deleteCustomerId = null;
    }

    async confirmDelete() {
        if (!this.deleteCustomerId) return;

        try {
            await this.db.deleteCustomer(this.deleteCustomerId);
            this.showToast('Customer deleted successfully');
            this.closeDeleteModal();
            await this.loadCustomers();
            
            // Clear search if active
            document.getElementById('searchInput').value = '';
        } catch (error) {
            console.error('Error deleting customer:', error);
            this.showToast('Failed to delete customer', 'error');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CRMApp();
});
