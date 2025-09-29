const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const TOKEN_IDS = {
  'GLM': 'golem',
  'ETH': 'ethereum',
  'USDC': 'usd-coin',
  'DAI': 'dai',
  'USDT': 'tether'
};

class PriceService {
  constructor() {
    this.prices = {};
    this.changes24h = {};
    this.lastUpdate = null;
    this.updateInterval = 5 * 60 * 1000; // 5 minutes
    this.cacheKey = 'glm_prices_cache';
    this.loadFromCache();
  }

  loadFromCache() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        const now = Date.now();

        // Use cached data if it's less than 5 minutes old
        if (data.timestamp && (now - data.timestamp) < this.updateInterval) {
          this.prices = data.prices || {};
          this.changes24h = data.changes24h || {};
          this.lastUpdate = data.timestamp;
          console.log('Loaded prices from cache:', this.prices);
        }
      }
    } catch (error) {
      console.error('Error loading prices from cache:', error);
    }
  }

  saveToCache() {
    try {
      const data = {
        prices: this.prices,
        changes24h: this.changes24h,
        timestamp: this.lastUpdate
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving prices to cache:', error);
    }
  }

  async fetchPrices() {
    try {
      const tokenIds = Object.values(TOKEN_IDS).join(',');
      const response = await fetch(
        `${COINGECKO_API}/simple/price?ids=${tokenIds}&vs_currencies=usd&include_24hr_change=true`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform to our format
      this.prices = {
        GLM: data[TOKEN_IDS.GLM]?.usd || 0.45, // fallback to default
        ETH: data[TOKEN_IDS.ETH]?.usd || 3200,
        USDC: data[TOKEN_IDS.USDC]?.usd || 1,
        DAI: data[TOKEN_IDS.DAI]?.usd || 1,
        USDT: data[TOKEN_IDS.USDT]?.usd || 1
      };

      this.changes24h = {
        GLM: data[TOKEN_IDS.GLM]?.usd_24h_change || 0,
        ETH: data[TOKEN_IDS.ETH]?.usd_24h_change || 0,
        USDC: data[TOKEN_IDS.USDC]?.usd_24h_change || 0,
        DAI: data[TOKEN_IDS.DAI]?.usd_24h_change || 0,
        USDT: data[TOKEN_IDS.USDT]?.usd_24h_change || 0
      };

      this.lastUpdate = Date.now();
      this.saveToCache(); // Save to cache after successful update
      console.log('Prices updated:', this.prices);

      return this.prices;
    } catch (error) {
      console.error('Error fetching prices:', error);
      // Return fallback prices
      return {
        GLM: 0.45,
        ETH: 3200,
        USDC: 1,
        DAI: 1,
        USDT: 1
      };
    }
  }

  async getPrices() {
    const now = Date.now();

    // Check if we need to update prices
    if (!this.lastUpdate || (now - this.lastUpdate) > this.updateInterval) {
      await this.fetchPrices();
    }

    return this.prices;
  }

  getPrice(token) {
    return this.prices[token] || 0;
  }

  get24hChange(token) {
    return this.changes24h?.[token] || 0;
  }
}

export const priceService = new PriceService();
export default priceService;