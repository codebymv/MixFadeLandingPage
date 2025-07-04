class ShopifyService {
  constructor() {
    this.shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;
    this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    this.apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01';
    
    if (!this.shopDomain || !this.accessToken) {
      console.warn('⚠️  Shopify credentials not configured. Set SHOPIFY_SHOP_DOMAIN and SHOPIFY_ACCESS_TOKEN in .env');
      return;
    }
    
    this.baseUrl = `https://${this.shopDomain}/admin/api/${this.apiVersion}`;
    console.log('✅ Shopify service initialized for:', this.shopDomain);
  }

  // Check if customer exists by email
  async findCustomerByEmail(email) {
    try {
      const response = await fetch(`${this.baseUrl}/customers/search.json?query=email:${encodeURIComponent(email)}`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status}`);
      }

      const data = await response.json();
      return data.customers && data.customers.length > 0 ? data.customers[0] : null;
    } catch (error) {
      console.error('Error finding customer:', error);
      throw error;
    }
  }

  // Create new customer with email marketing enabled
  async createCustomer(email, additionalData = {}) {
    try {
      const customerData = {
        customer: {
          email: email.toLowerCase().trim(),
          accepts_marketing: true,
          accepts_marketing_updated_at: new Date().toISOString(),
          tags: 'mixfade-downloader',
          note: `MixFade download: ${new Date().toISOString()}`,
          ...additionalData
        }
      };

      const response = await fetch(`${this.baseUrl}/customers.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Shopify API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Update existing customer to enable marketing if not already enabled
  async updateCustomerMarketing(customerId, email) {
    try {
      const updateData = {
        customer: {
          id: customerId,
          accepts_marketing: true,
          accepts_marketing_updated_at: new Date().toISOString(),
          tags: 'mixfade-downloader',
          note: `MixFade download: ${new Date().toISOString()}`
        }
      };

      const response = await fetch(`${this.baseUrl}/customers/${customerId}.json`, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Shopify API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.customer;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  // Main method to handle email collection for mailing list
  async collectEmailForMailingList(email, metadata = {}) {
    try {
      // Check if customer already exists
      const existingCustomer = await this.findCustomerByEmail(email);
      
      if (existingCustomer) {
        console.log(`✅ Found existing customer: ${email}`);
        
        // Update customer if they're not already subscribed to marketing
        if (!existingCustomer.accepts_marketing) {
          const updatedCustomer = await this.updateCustomerMarketing(existingCustomer.id, email);
          return {
            customer: updatedCustomer,
            action: 'updated',
            wasSubscribed: false,
            nowSubscribed: true
          };
        }
        
        return {
          customer: existingCustomer,
          action: 'exists',
          wasSubscribed: true,
          nowSubscribed: true
        };
      }
      
      // Create new customer with marketing enabled
      console.log(`📧 Creating new customer: ${email}`);
      const newCustomer = await this.createCustomer(email, metadata);
      
      return {
        customer: newCustomer,
        action: 'created',
        wasSubscribed: false,
        nowSubscribed: true
      };
      
    } catch (error) {
      console.error('Error in collectEmailForMailingList:', error);
      throw error;
    }
  }

  // Test connection to Shopify
  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        connected: true,
        shop: data.shop.name,
        domain: data.shop.myshopify_domain,
        email: data.shop.email
      };
    } catch (error) {
      console.error('Shopify connection test failed:', error);
      return { connected: false, error: error.message };
    }
  }
}

module.exports = ShopifyService;