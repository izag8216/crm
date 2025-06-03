// CRM Application JavaScript
class CRMApp {
    constructor() {
        this.customers = [];
        this.editingCustomerId = null;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.loadCustomers();
        this.setupEventListeners();
        this.applyTheme();
        this.renderCustomers();
    }

    // Data Management
    loadCustomers() {
        const data = localStorage.getItem('crm_data');
        if (data) {
            try {
                // Parse data.txt format (line-based)
                const lines = data.split('\n').filter(line => line.trim());
                this.customers = lines.map((line, index) => {
                    const parts = line.split('|');
                    return {
                        id: index + 1,
                        customerName: parts[0] || '',
                        companyName: parts[1] || '',
                        email: parts[2] || '',
                        phone: parts[3] || '',
                        status: parts[4] || 'New',
                        assignee: parts[5] || '',
                        notes: parts[6] || '',
                        createdAt: parts[7] || new Date().toISOString().split('T')[0]
                    };
                });
            } catch (error) {
                console.error('Error loading customer data:', error);
                this.customers = [];
            }
        } else {
            // Load sample data if no data exists
            this.loadSampleData();
        }
    }

    saveCustomers() {
        // Convert to data.txt format (line-based)
        const dataLines = this.customers.map(customer => 
            [
                customer.customerName,
                customer.companyName,
                customer.email,
                customer.phone,
                customer.status,
                customer.assignee,
                customer.notes,
                customer.createdAt
            ].join('|')
        );
        
        localStorage.setItem('crm_data', dataLines.join('\n'));
    }

    loadSampleData() {
        this.customers = [
            {
                id: 1,
                customerName: 'Taro Tanaka',
                companyName: 'Sample Corporation',
                email: 'tanaka@sample.co.jp',
                phone: '03-1234-5678',
                status: 'Existing Customer',
                assignee: 'Sato Sales',
                notes: 'Regular follow-up required',
                createdAt: '2025-01-01'
            },
            {
                id: 2,
                customerName: 'Hanako Yamada',
                companyName: 'Test Trading Company',
                email: 'yamada@test.com',
                phone: '06-9876-5432',
                status: 'Prospect',
                assignee: 'Suzuki Sales',
                notes: 'Presentation scheduled for next month',
                createdAt: '2025-01-02'
            },
            {
                id: 3,
                customerName: 'Jiro Sato',
                companyName: 'Demo Corporation',
                email: 'sato@demo.jp',
                phone: '052-1111-2222',
                status: 'New',
                assignee: 'Tanaka Sales',
                notes: 'Initial contact completed',
                createdAt: '2025-01-03'
            }
        ];
        this.saveCustomers();
    }

    // Event Listeners
    setupEventListeners() {
        // Form submission
        document.getElementById('customerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Status filter
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.handleStatusFilter(e.target.value);
        });

        // Cancel edit
        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.cancelEdit();
        });

        // Modal close events
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });

        // Confirm delete
        document.getElementById('confirmDelete').addEventListener('click', () => {
            this.confirmDelete();
        });
    }

    // Form Handling
    handleFormSubmit() {
        const formData = new FormData(document.getElementById('customerForm'));
        const customerData = {
            customerName: formData.get('customerName'),
            companyName: formData.get('companyName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            status: formData.get('status'),
            assignee: formData.get('assignee'),
            notes: formData.get('notes')
        };

        if (this.editingCustomerId) {
            this.updateCustomer(this.editingCustomerId, customerData);
        } else {
            this.addCustomer(customerData);
        }
    }

    addCustomer(customerData) {
        const newCustomer = {
            id: Date.now(), // Simple ID generation
            ...customerData,
            createdAt: new Date().toISOString().split('T')[0]
        };

        this.customers.push(newCustomer);
        this.saveCustomers();
        this.renderCustomers();
        this.resetForm();
        this.showNotification('Customer information added', 'success');
    }

    updateCustomer(id, customerData) {
        const index = this.customers.findIndex(c => c.id === id);
        if (index !== -1) {
            this.customers[index] = {
                ...this.customers[index],
                ...customerData
            };
            this.saveCustomers();
            this.renderCustomers();
            this.resetForm();
            this.showNotification('Customer information updated', 'success');
        }
    }

    editCustomer(id) {
        const customer = this.customers.find(c => c.id === id);
        if (customer) {
            this.editingCustomerId = id;
            this.populateForm(customer);
            document.getElementById('cancelEdit').style.display = 'inline-flex';
            document.querySelector('.form-section .section-title').innerHTML = 
                '<i class="fas fa-user-edit"></i>Edit Customer Information';
            
            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }

    deleteCustomer(id) {
        this.customerToDelete = id;
        document.getElementById('deleteModal').classList.add('active');
    }

    confirmDelete() {
        if (this.customerToDelete) {
            this.customers = this.customers.filter(c => c.id !== this.customerToDelete);
            this.saveCustomers();
            this.renderCustomers();
            this.closeModals();
            this.showNotification('Customer information deleted', 'success');
            this.customerToDelete = null;
        }
    }

    populateForm(customer) {
        document.getElementById('customerName').value = customer.customerName;
        document.getElementById('companyName').value = customer.companyName;
        document.getElementById('email').value = customer.email;
        document.getElementById('phone').value = customer.phone;
        document.getElementById('status').value = customer.status;
        document.getElementById('assignee').value = customer.assignee;
        document.getElementById('notes').value = customer.notes;
    }

    resetForm() {
        document.getElementById('customerForm').reset();
        this.editingCustomerId = null;
        document.getElementById('cancelEdit').style.display = 'none';
        document.querySelector('.form-section .section-title').innerHTML = 
            '<i class="fas fa-user-plus"></i>Register Customer Information';
    }

    cancelEdit() {
        this.resetForm();
    }

    // Rendering
    renderCustomers(customersToRender = null) {
        const customers = customersToRender || this.customers;
        const customerList = document.getElementById('customerList');

        if (customers.length === 0) {
            customerList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No customer information</h3>
                    <p>Please add new customer information</p>
                </div>
            `;
            return;
        }

        customerList.innerHTML = customers.map(customer => `
            <div class="customer-card" data-id="${customer.id}">
                <div class="customer-header">
                    <div>
                        <div class="customer-name">${this.escapeHtml(customer.customerName)}</div>
                        <div class="customer-company">${this.escapeHtml(customer.companyName)}</div>
                    </div>
                    <div class="customer-actions">
                        <button class="btn btn-sm btn-secondary" onclick="crmApp.editCustomer(${customer.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="crmApp.deleteCustomer(${customer.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="customer-info">
                    ${customer.email ? `
                        <div class="info-item">
                            <i class="fas fa-envelope"></i>
                            <span>${this.escapeHtml(customer.email)}</span>
                        </div>
                    ` : ''}
                    ${customer.phone ? `
                        <div class="info-item">
                            <i class="fas fa-phone"></i>
                            <span>${this.escapeHtml(customer.phone)}</span>
                        </div>
                    ` : ''}
                    ${customer.assignee ? `
                        <div class="info-item">
                            <i class="fas fa-user"></i>
                            <span>${this.escapeHtml(customer.assignee)}</span>
                        </div>
                    ` : ''}
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${customer.createdAt}</span>
                    </div>
                </div>
                <div class="customer-status">
                    <span class="status-badge status-${customer.status}">${customer.status}</span>
                </div>
                ${customer.notes ? `
                    <div class="customer-notes">
                        <strong>Notes:</strong> ${this.escapeHtml(customer.notes)}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    // Search and Filter
    handleSearch(query) {
        const filteredCustomers = this.customers.filter(customer => 
            customer.customerName.toLowerCase().includes(query.toLowerCase()) ||
            customer.companyName.toLowerCase().includes(query.toLowerCase()) ||
            customer.email.toLowerCase().includes(query.toLowerCase())
        );
        this.renderCustomers(filteredCustomers);
    }

    handleStatusFilter(status) {
        if (!status) {
            this.renderCustomers();
            return;
        }

        const filteredCustomers = this.customers.filter(customer => 
            customer.status === status
        );
        this.renderCustomers(filteredCustomers);
    }

    // Theme Management
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Modal Management
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Export/Import functionality
    exportData() {
        const dataStr = localStorage.getItem('crm_data') || '';
        const dataBlob = new Blob([dataStr], { type: 'text/plain' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'crm_data.txt';
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Data exported', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                localStorage.setItem('crm_data', e.target.result);
                this.loadCustomers();
                this.renderCustomers();
                this.showNotification('Data imported', 'success');
            };
            reader.readAsText(file);
        }
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .customer-notes {
        margin-top: 1rem;
        padding: 0.75rem;
        background-color: var(--bg-tertiary);
        border-radius: var(--radius-sm);
        font-size: 0.875rem;
        color: var(--text-secondary);
    }
`;
document.head.appendChild(style);

// Initialize the CRM application
let crmApp;
document.addEventListener('DOMContentLoaded', () => {
    crmApp = new CRMApp();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N for new customer
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('customerName').focus();
    }
    
    // Escape to cancel edit or close modals
    if (e.key === 'Escape') {
        if (crmApp.editingCustomerId) {
            crmApp.cancelEdit();
        } else {
            crmApp.closeModals();
        }
    }
});
