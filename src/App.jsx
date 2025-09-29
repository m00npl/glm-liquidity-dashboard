import React, { useState, useMemo, useEffect } from 'react';
import { liquidityData, calculateStats, generateDexUrl } from './data/liquidityData';
import Navigation from './components/Navigation';
import { priceService } from './services/priceService';
import LiquidityTrendChart from './components/LiquidityTrendChart';
import LiquidityDistributionChart from './components/LiquidityDistributionChart';
import ChainLogo from './components/ChainLogo';

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
};

const formatUSD = (num) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

const App = () => {
  const [filters, setFilters] = useState({
    chain: '',
    protocol: '',
    counterAsset: '',
    minLiquidity: '',
    incentives: ''
  });

  const [displayMode, setDisplayMode] = useState('USD');
  const [prices, setPrices] = useState(null);
  const [pricesLoading, setPricesLoading] = useState(true);

  // Fetch live prices on component mount
  useEffect(() => {
    const fetchPrices = async () => {
      setPricesLoading(true);
      try {
        const currentPrices = await priceService.getPrices();
        setPrices(currentPrices);
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      } finally {
        setPricesLoading(false);
      }
    };

    fetchPrices();

    // Set up interval to refresh prices every 5 minutes
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const chains = [...new Set(liquidityData.map(item => item.chain))];
    const protocols = [...new Set(liquidityData.map(item => item.dex))];
    const counterAssets = [...new Set(liquidityData.map(item => item.pair.split('/')[1]))];

    return { chains, protocols, counterAssets };
  }, []);

  // Filter the data based on current filters
  const filteredData = useMemo(() => {
    return liquidityData.filter(item => {
      const glmPrice = prices?.GLM || 0.45;
      const liquidityUSD = item.glm_amount * glmPrice * 2; // GLM price * 2 for pair value
      const liquidityGLM = item.glm_amount * 2; // GLM amount * 2 for pair value
      const counterAsset = item.pair.split('/')[1];

      // Apply min liquidity filter based on display mode
      let minLiquidityCheck = true;
      if (filters.minLiquidity) {
        const minValue = parseFloat(filters.minLiquidity);
        if (displayMode === 'USD') {
          minLiquidityCheck = liquidityUSD >= minValue;
        } else {
          minLiquidityCheck = liquidityGLM >= minValue;
        }
      }

      return (
        (!filters.chain || item.chain === filters.chain) &&
        (!filters.protocol || item.dex === filters.protocol) &&
        (!filters.counterAsset || counterAsset === filters.counterAsset) &&
        minLiquidityCheck &&
        (!filters.incentives || (filters.incentives === 'incentivized' ? Math.random() > 0.7 : true))
      );
    });
  }, [filters, prices, displayMode]);

  const stats = calculateStats(filteredData, prices);

  return (
    <>
      <Navigation />
      <div className="main-container">
        {/* Header Section */}
        <div className="page-header">
          <h1 className="page-title">GLM Liquidity Dashboard</h1>
          <p className="page-description">
            Track GLM liquidity across chains and DeFi protocols.
          </p>
        </div>

        {/* Overview Section */}
        <div className="overview-section">
          <h2 className="section-title">[ Overview ]</h2>

          <div className="overview-cards">
            <div className="overview-card overview-card-black">
              <div className="card-header">
                <div className="card-icon">●</div>
                <span className="card-label">Total GLM Liquidity</span>
              </div>
              <div className="card-value">{(stats.totalGLM / 1000000).toFixed(1)}M GLM</div>
            </div>

            <div className="overview-card overview-card-blue">
              <div className="card-header">
                <div className="card-icon">●</div>
                <span className="card-label">Total Market Value (USD)</span>
              </div>
              <div className="card-value">{formatUSD(stats.totalLiquidityUSD)}</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-container">
              <div className="chart-header">
                <h3 className="chart-title">Liquidity Trend (30 Days)</h3>
                <p className="chart-subtitle">Total USD Liquidity by Chain</p>
              </div>
              {!pricesLoading ? (
                <LiquidityTrendChart
                  data={filteredData}
                  prices={prices}
                  chainStats={stats.chainStats}
                />
              ) : (
                <div className="chart-placeholder">
                  <div className="chart-mock">Loading chart...</div>
                </div>
              )}
            </div>

            <div className="chart-container">
              <div className="chart-header">
                <h3 className="chart-title">Liquidity Distribution</h3>
                <p className="chart-subtitle">Current USD Liquidity by Chain</p>
              </div>
              {!pricesLoading ? (
                <LiquidityDistributionChart
                  chainStats={stats.chainStats}
                  totalLiquidityUSD={stats.totalLiquidityUSD}
                  prices={prices}
                />
              ) : (
                <div className="chart-placeholder">
                  <div className="chart-mock">Loading chart...</div>
                </div>
              )}
            </div>
          </div>

          {/* Shared Legend for Both Charts */}
          <div className="charts-shared-legend">
            <h4 className="legend-title">Top 5 Chains by Liquidity</h4>
            <div className="shared-legend-grid">
              {Object.entries(stats.chainStats)
                .map(([chain, glmAmount]) => ({
                  chain,
                  glmAmount,
                  liquidityUSD: glmAmount * (prices?.GLM || 0.45) * 2
                }))
                .sort((a, b) => b.liquidityUSD - a.liquidityUSD)
                .slice(0, 5)
                .map((chainData, index) => {
                  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'];
                  const percentage = ((chainData.liquidityUSD / stats.totalLiquidityUSD) * 100).toFixed(1);

                  return (
                    <div key={chainData.chain} className="shared-legend-item">
                      <div
                        className="legend-color-indicator"
                        style={{backgroundColor: colors[index]}}
                      ></div>
                      <div className="legend-chain-info">
                        <span className="legend-chain-name">{chainData.chain}</span>
                        <span className="legend-chain-percentage">{percentage}%</span>
                        <span className="legend-chain-value">{formatUSD(chainData.liquidityUSD)}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Pool Explorer Section */}
        <div className="pool-explorer-section">
          <h2 className="section-title">[ Pool Explorer ]</h2>

          <div className="filter-bar">
            <div className="filter-left">
              <div className="filter-icon">🔍</div>
              <span>Filters</span>
            </div>
            <div className="display-toggle">
              <span>Display:</span>
              <div className="toggle-buttons">
                <button
                  className={`toggle-btn ${displayMode === 'USD' ? 'active' : ''}`}
                  onClick={() => setDisplayMode('USD')}
                >
                  USD
                </button>
                <button
                  className={`toggle-btn ${displayMode === 'GLM' ? 'active' : ''}`}
                  onClick={() => setDisplayMode('GLM')}
                >
                  GLM
                </button>
              </div>
            </div>
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label>Chain</label>
              <select
                className="filter-select"
                value={filters.chain}
                onChange={(e) => setFilters({...filters, chain: e.target.value})}
              >
                <option value="">All chains</option>
                {filterOptions.chains.map(chain => (
                  <option key={chain} value={chain}>{chain}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Protocol</label>
              <select
                className="filter-select"
                value={filters.protocol}
                onChange={(e) => setFilters({...filters, protocol: e.target.value})}
              >
                <option value="">All protocols</option>
                {filterOptions.protocols.map(protocol => (
                  <option key={protocol} value={protocol}>{protocol}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Counter Asset</label>
              <select
                className="filter-select"
                value={filters.counterAsset}
                onChange={(e) => setFilters({...filters, counterAsset: e.target.value})}
              >
                <option value="">All assets</option>
                {filterOptions.counterAssets.map(asset => (
                  <option key={asset} value={asset}>{asset}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Min Liquidity ({displayMode})</label>
              <input
                type="number"
                className="filter-input"
                placeholder={displayMode === 'USD' ? "e.g. 10000" : "e.g. 20000"}
                value={filters.minLiquidity}
                onChange={(e) => setFilters({...filters, minLiquidity: e.target.value})}
              />
            </div>
            <div className="filter-group">
              <label>Incentives</label>
              <select
                className="filter-select"
                value={filters.incentives}
                onChange={(e) => setFilters({...filters, incentives: e.target.value})}
              >
                <option value="">All pools</option>
                <option value="incentivized">Incentivized only</option>
                <option value="non-incentivized">Non-incentivized only</option>
              </select>
            </div>
          </div>

          <div className="pool-table">
            <table>
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Chain</th>
                  <th>Protocol</th>
                  <th>Liquidity</th>
                  <th>7d Change</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => {
                  const dexUrl = generateDexUrl(item.pair, item.chain, item.dex);
                  const liquidityUSD = stats.calculateLiquidityUSD(item.glm_amount, item.pair);
                  const volume24h = liquidityUSD * 0.25;
                  const change7d = (Math.random() - 0.5) * 30;
                  const isIncentivized = Math.random() > 0.7;

                  // Apply incentives filter
                  if (filters.incentives === 'incentivized' && !isIncentivized) return null;
                  if (filters.incentives === 'non-incentivized' && isIncentivized) return null;

                  return (
                    <tr key={`${item.chain}-${item.pair}-${item.dex}-${index}`} className="table-row" onClick={(e) => {
                      e.preventDefault();
                      if (dexUrl && dexUrl !== '#') {
                        window.open(dexUrl, '_blank');
                      }
                    }}>
                      <td className="pair-cell">
                        {item.pair}
                        {isIncentivized && <span className="incentive-star">✨</span>}
                      </td>
                      <td className="chain-cell">
                        <div className="chain-info">
                          <ChainLogo chain={item.chain} size={20} />
                          <span>{item.chain}</span>
                        </div>
                      </td>
                      <td className="protocol-cell">{item.dex}</td>
                      <td className="liquidity-cell">
                        {displayMode === 'USD' ? formatUSD(liquidityUSD) : `${formatNumber(item.glm_amount)} GLM`}
                      </td>
                      <td className="change-cell">
                        <span className={change7d > 0 ? 'positive' : 'negative'}>
                          {change7d > 0 ? '+' : ''}{change7d.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                }).filter(Boolean)}
              </tbody>
            </table>

            <div className="table-footer">
              Last updated: 29 Sep, 2025 11:51 AM
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;