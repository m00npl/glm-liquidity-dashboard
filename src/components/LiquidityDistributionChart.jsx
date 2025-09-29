import React, { useState } from 'react';
import ChainLogo from './ChainLogo';

const LiquidityDistributionChart = ({ chainStats, totalLiquidityUSD, prices = null }) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#f97316', '#84cc16'];

  // Calculate chain percentages and prepare data for pie chart
  const chartData = Object.entries(chainStats)
    .map(([chain, glmAmount], index) => {
      const glmPrice = prices?.GLM || 0.45;
      const chainLiquidityUSD = glmAmount * glmPrice * 2;
      const percentage = (chainLiquidityUSD / totalLiquidityUSD) * 100;

      return {
        chain,
        glmAmount,
        liquidityUSD: chainLiquidityUSD,
        percentage,
        color: colors[index % colors.length]
      };
    })
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8); // Show top 8 chains

  // Calculate pie slices
  let currentAngle = 0;
  const slices = chartData.map(item => {
    const sliceAngle = (item.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    currentAngle += sliceAngle;

    return {
      ...item,
      startAngle,
      endAngle,
      sliceAngle
    };
  });

  const createPath = (centerX, centerY, radius, startAngle, endAngle) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const centerX = 180; // 120 * 1.5
  const centerY = 180; // 120 * 1.5
  const radius = 120;  // 80 * 1.5

  return (
    <div className="chart-content">
      <svg width="360" height="360" viewBox="0 0 360 360" className="distribution-chart">
        {/* Pie slices */}
        {slices.map((slice, index) => (
          <g key={slice.chain}>
            <path
              d={createPath(centerX, centerY, radius, slice.startAngle, slice.endAngle)}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
              className="pie-slice"
              onMouseEnter={(e) => {
                setHoveredSlice(slice.chain);
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  chain: slice.chain,
                  percentage: slice.percentage,
                  value: slice.liquidityUSD
                });
              }}
              onMouseMove={(e) => {
                if (tooltip) {
                  setTooltip({
                    ...tooltip,
                    x: e.clientX,
                    y: e.clientY
                  });
                }
              }}
              onMouseLeave={() => {
                setHoveredSlice(null);
                setTooltip(null);
              }}
              style={{
                opacity: hoveredSlice && hoveredSlice !== slice.chain ? 0.7 : 1,
                transform: hoveredSlice === slice.chain ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: `${centerX}px ${centerY}px`,
                transition: 'all 0.2s ease'
              }}
            />
          </g>
        ))}

        {/* Center hole for donut effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r="60"
          fill="white"
          stroke="#f3f4f6"
          strokeWidth="3"
        />

        {/* Center text */}
        <text
          x={centerX}
          y={centerY - 8}
          textAnchor="middle"
          fontSize="18"
          fontWeight="500"
          fill="#1f2937"
        >
          Total
        </text>
        <text
          x={centerX}
          y={centerY + 12}
          textAnchor="middle"
          fontSize="16"
          fill="#6b7280"
        >
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
          }).format(totalLiquidityUSD)}
        </text>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pie-chart-tooltip"
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
            <div className="pie-tooltip-header">
              <ChainLogo chain={tooltip.chain} size={16} />
              <span className="pie-tooltip-chain-name">{tooltip.chain}</span>
            </div>
            <div className="pie-tooltip-values">
              <div className="pie-tooltip-row">
                <span className="pie-tooltip-label">Percentage:</span>
                <span className="pie-tooltip-value">{tooltip.percentage.toFixed(1)}%</span>
              </div>
              <div className="pie-tooltip-row">
                <span className="pie-tooltip-label">Value:</span>
                <span className="pie-tooltip-value">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                    maximumFractionDigits: 1
                  }).format(tooltip.value)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiquidityDistributionChart;