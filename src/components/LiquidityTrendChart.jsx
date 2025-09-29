import React, { useState, useRef } from 'react';

const LiquidityTrendChart = ({ data, prices = null, chainStats }) => {
  const [tooltip, setTooltip] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const svgRef = useRef(null);
  // Get top 5 chains by liquidity
  const getTop5Chains = () => {
    if (!chainStats) return [];

    return Object.entries(chainStats)
      .map(([chain, glmAmount]) => ({
        chain,
        glmAmount,
        liquidityUSD: glmAmount * (prices?.GLM || 0.45) * 2
      }))
      .sort((a, b) => b.liquidityUSD - a.liquidityUSD)
      .slice(0, 5);
  };

  // Generate mock 30-day trend data for top 5 chains
  const generateTrendData = () => {
    const days = 30;
    const result = [];
    const today = new Date();
    const top5Chains = getTop5Chains();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayData = {
        date: date.toISOString().split('T')[0],
        chains: {},
        total: 0
      };

      // Generate trend for each of top 5 chains
      top5Chains.forEach((chainData, index) => {
        // Different trend patterns for each chain
        const trendFactor = 1 + Math.sin((i / days) * Math.PI * 2 + index) * 0.15; // Different sine waves
        const randomVariation = 1 + (Math.random() - 0.5) * 0.1; // ±5% random
        const value = chainData.liquidityUSD * trendFactor * randomVariation;

        dayData.chains[chainData.chain] = value;
        dayData.total += value;
      });

      dayData.formattedTotal = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(dayData.total);

      result.push(dayData);
    }

    return result;
  };

  const trendData = generateTrendData();
  const top5Chains = getTop5Chains();
  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'];

  if (top5Chains.length === 0) {
    return (
      <div className="chart-content">
        <div className="chart-mock">No data available</div>
      </div>
    );
  }

  // Calculate min/max from all chain values across all days
  const allValues = trendData.flatMap(d => Object.values(d.chains));
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);

  // Handle mouse events for tooltips
  const handleMouseMove = (event) => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = event.clientX - svgRect.left;

    // Calculate which day we're hovering over based on X position
    // Scale mouseX relative to SVG viewBox (600 width)
    const svgWidth = svgRect.width;
    const viewBoxWidth = 600;
    const scaledMouseX = (mouseX / svgWidth) * viewBoxWidth;

    const chartWidth = 580;
    const chartStartX = 10;
    const relativeX = scaledMouseX - chartStartX;

    if (relativeX >= 0 && relativeX <= chartWidth) {
      const dayIndex = Math.round((relativeX / chartWidth) * (trendData.length - 1));
      const dayData = trendData[dayIndex];

      if (dayData && dayIndex >= 0 && dayIndex < trendData.length) {
        setHoveredDay(dayIndex);
        setTooltip({
          x: event.clientX,
          y: event.clientY,
          date: dayData.date,
          chains: dayData.chains
        });
      }
    } else {
      // Mouse is outside chart area
      setTooltip(null);
      setHoveredDay(null);
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    setHoveredDay(null);
  };

  return (
    <div className="chart-content">
      <div className="multi-chain-chart">
        <svg
          width="100%"
          height="280"
          viewBox="0 0 600 280"
          className="trend-chart"
          ref={svgRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="60" height="28" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 28" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Individual chain trend lines */}
          {top5Chains.map((chainData, chainIndex) => {
            const color = colors[chainIndex];
            const chainMaxValue = Math.max(...trendData.map(d => d.chains[chainData.chain] || 0));
            const chainMinValue = Math.min(...trendData.map(d => d.chains[chainData.chain] || 0));

            return (
              <g key={chainData.chain}>
                {/* Chain trend line */}
                <path
                  d={trendData.map((point, index) => {
                    const x = (index / (trendData.length - 1)) * 580 + 10;
                    const chainValue = point.chains[chainData.chain] || 0;
                    const y = 260 - ((chainValue - minValue) / (maxValue - minValue)) * 240 + 10;
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />

                {/* Chain data points */}
                {trendData.map((point, index) => {
                  if (index % 7 === 0) { // Show every 7th point
                    const x = (index / (trendData.length - 1)) * 580 + 10;
                    const chainValue = point.chains[chainData.chain] || 0;
                    const y = 260 - ((chainValue - minValue) / (maxValue - minValue)) * 240 + 10;

                    return (
                      <circle
                        key={`${chainData.chain}-${index}`}
                        cx={x}
                        cy={y}
                        r="3"
                        fill={color}
                        stroke="white"
                        strokeWidth="1.5"
                      >
                        <title>
                          {chainData.chain}: {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            notation: 'compact',
                            maximumFractionDigits: 1
                          }).format(chainValue)} ({point.date})
                        </title>
                      </circle>
                    );
                  }
                  return null;
                })}
              </g>
            );
          })}

          {/* Hover line and points */}
          {hoveredDay !== null && (
            <g className="hover-elements">
              {/* Vertical hover line */}
              <line
                x1={(hoveredDay / (trendData.length - 1)) * 580 + 10}
                y1="20"
                x2={(hoveredDay / (trendData.length - 1)) * 580 + 10}
                y2="260"
                stroke="#6b7280"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.7"
              />

              {/* Hover points for each chain */}
              {top5Chains.map((chainData, chainIndex) => {
                const x = (hoveredDay / (trendData.length - 1)) * 580 + 10;
                const chainValue = trendData[hoveredDay].chains[chainData.chain] || 0;
                const y = 260 - ((chainValue - minValue) / (maxValue - minValue)) * 240 + 10;
                const color = colors[chainIndex];

                return (
                  <circle
                    key={`hover-${chainData.chain}`}
                    cx={x}
                    cy={y}
                    r="5"
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                    className="hover-point"
                  />
                );
              })}
            </g>
          )}

          {/* Y-axis labels */}
          <text x="5" y="25" fontSize="12" fill="#6b7280" textAnchor="start">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(maxValue)}
          </text>
          <text x="5" y="270" fontSize="12" fill="#6b7280" textAnchor="start">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(minValue)}
          </text>
        </svg>


        {/* Tooltip */}
        {tooltip && (
          <div
            className="chart-tooltip"
            style={{
              position: 'fixed',
              left: tooltip.x + 10,
              top: tooltip.y - 10,
              transform: 'translateY(-100%)',
              pointerEvents: 'none',
              zIndex: 1000
            }}
          >
            <div className="tooltip-content">
              <div className="tooltip-date">
                {new Date(tooltip.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="tooltip-values">
                {top5Chains.map((chainData, index) => {
                  const value = tooltip.chains[chainData.chain] || 0;
                  return (
                    <div key={chainData.chain} className="tooltip-chain-row">
                      <div
                        className="tooltip-chain-color"
                        style={{ backgroundColor: colors[index] }}
                      ></div>
                      <span className="tooltip-chain-name">{chainData.chain}</span>
                      <span className="tooltip-chain-value">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          notation: 'compact',
                          maximumFractionDigits: 1
                        }).format(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiquidityTrendChart;