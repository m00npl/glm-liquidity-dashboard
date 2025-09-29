const GLM_ADDRESSES = {
  "Ethereum": "0x7dd9c5cba05e151c895fde1cf355c9a1d5da6429",
  "Arbitrum": "0x3a18dcB9333BF656d90B3e6Db9F7E69b46f22CE7",
  "Optimism": "0x3a18dcB9333BF656d90B3e6Db9F7E69b46f22CE7",
  "Base": "0x3a18dcB9333BF656d90B3e6Db9F7E69b46f22CE7",
  "Polygon PoS": "0x0b220b82F3eA3B7F6d9A1D8ab58930C064A2b5Bf",
  "Linea": "0x3a18dcB9333BF656d90B3e6Db9F7E69b46f22CE7",
  "zkSync Era": "0x3a18dcB9333BF656d90B3e6Db9F7E69b46f22CE7",
  "Scroll": "0x3a18dcB9333BF656d90B3e6Db9F7E69b46f22CE7"
};

const TOKEN_ADDRESSES = {
  "Ethereum": {
    "ETH": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "USDC": "0xA0b86a33E6411b8c36F989C72FE9A7CdFE14b2a5",
    "DAI": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  },
  "Arbitrum": {
    "ETH": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    "USDC": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    "USDT": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    "DAI": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
  },
  "Optimism": {
    "ETH": "0x4200000000000000000000000000000000000006",
    "USDC": "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    "DAI": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
  },
  "Base": {
    "ETH": "0x4200000000000000000000000000000000000006",
    "USDC": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "DAI": "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"
  },
  "Polygon PoS": {
    "ETH": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    "USDC": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
  },
  "Linea": {
    "ETH": "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
    "USDC": "0x176211869cA2b568f2A7D4EE941E073a821EE1ff"
  },
  "zkSync Era": {
    "ETH": "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91"
  },
  "Scroll": {
    "ETH": "0x5300000000000000000000000000000000000004"
  }
};

export const liquidityData = [
  { pair: "GLM/ETH", chain: "Ethereum", dex: "Uniswap v3", glm_amount: 6000000 },
  { pair: "GLM/ETH", chain: "Arbitrum", dex: "Uniswap v3", glm_amount: 1600000 },
  { pair: "GLM/ETH", chain: "Optimism", dex: "Velodrome", glm_amount: 1000000 },
  { pair: "GLM/ETH", chain: "Base", dex: "Aerodrome", glm_amount: 800000 },
  { pair: "GLM/ETH", chain: "Polygon PoS", dex: "Uniswap v3", glm_amount: 600000 },
  { pair: "GLM/ETH", chain: "Linea", dex: "Uniswap v3", glm_amount: 333333.33 },
  { pair: "GLM/ETH", chain: "zkSync Era", dex: "Native AMM/Aggregator", glm_amount: 333333.33 },
  { pair: "GLM/ETH", chain: "Scroll", dex: "Uniswap v3", glm_amount: 333333.33 },
  { pair: "GLM/USDC", chain: "Ethereum", dex: "Uniswap v3 or Curve", glm_amount: 3000000 },
  { pair: "GLM/USDC", chain: "Arbitrum", dex: "Uniswap v3", glm_amount: 800000 },
  { pair: "GLM/USDC", chain: "Optimism", dex: "Velodrome", glm_amount: 400000 },
  { pair: "GLM/USDC", chain: "Base", dex: "Aerodrome", glm_amount: 400000 },
  { pair: "GLM/USDC", chain: "Polygon PoS", dex: "Uniswap v3", glm_amount: 400000 },
  { pair: "GLM/DAI", chain: "Ethereum", dex: "Curve or Uniswap v3", glm_amount: 1600000 },
  { pair: "GLM/DAI", chain: "Arbitrum", dex: "Uniswap v3", glm_amount: 400000 },
  { pair: "GLM/DAI", chain: "Optimism", dex: "Velodrome", glm_amount: 200000 },
  { pair: "GLM/DAI", chain: "Base", dex: "Aerodrome", glm_amount: 200000 },
  { pair: "GLM/USDT", chain: "Ethereum", dex: "Uniswap v3", glm_amount: 1400000 },
  { pair: "GLM/USDT", chain: "Arbitrum", dex: "Uniswap v3", glm_amount: 200000 }
];

export const generateDexUrl = (pair, chain, dex) => {
  const glmAddress = GLM_ADDRESSES[chain];
  const tokenAddresses = TOKEN_ADDRESSES[chain];

  if (!glmAddress || !tokenAddresses) return "#";

  const pairToken = pair.split("/")[1];
  const tokenAddress = tokenAddresses[pairToken];

  if (!tokenAddress) return "#";

  if (dex.includes("Uniswap v3")) {
    if (chain === "Ethereum") {
      return `https://app.uniswap.org/swap?inputCurrency=${glmAddress}&outputCurrency=${tokenAddress}&chain=ethereum`;
    } else if (chain === "Arbitrum") {
      return `https://app.uniswap.org/swap?inputCurrency=${glmAddress}&outputCurrency=${tokenAddress}&chain=arbitrum`;
    } else if (chain === "Polygon PoS") {
      return `https://app.uniswap.org/swap?inputCurrency=${glmAddress}&outputCurrency=${tokenAddress}&chain=polygon`;
    } else if (chain === "Linea") {
      return `https://app.uniswap.org/swap?inputCurrency=${glmAddress}&outputCurrency=${tokenAddress}&chain=linea`;
    } else if (chain === "Scroll") {
      return `https://app.uniswap.org/swap?inputCurrency=${glmAddress}&outputCurrency=${tokenAddress}&chain=scroll`;
    }
  } else if (dex === "Velodrome") {
    return `https://velodrome.finance/swap?from=${glmAddress}&to=${tokenAddress}`;
  } else if (dex === "Aerodrome") {
    return `https://aerodrome.finance/swap?from=${glmAddress}&to=${tokenAddress}`;
  } else if (dex.includes("Curve")) {
    return `https://curve.fi/#/ethereum/swap`;
  } else if (dex === "Native AMM/Aggregator") {
    return `https://syncswap.xyz/swap`;
  }

  return "#";
};

import { priceService } from '../services/priceService.js';

export const calculateStats = (data, prices = null) => {
  // Use provided prices or fallback to defaults
  const GLM_PRICE_USD = prices?.GLM || 0.45;
  const ETH_PRICE_USD = prices?.ETH || 3200;
  const USDC_PRICE_USD = prices?.USDC || 1;
  const DAI_PRICE_USD = prices?.DAI || 1;
  const USDT_PRICE_USD = prices?.USDT || 1;
  const totalGLM = data.reduce((sum, item) => sum + item.glm_amount, 0);

  const pairStats = data.reduce((acc, item) => {
    if (!acc[item.pair]) {
      acc[item.pair] = 0;
    }
    acc[item.pair] += item.glm_amount;
    return acc;
  }, {});

  const chainStats = data.reduce((acc, item) => {
    if (!acc[item.chain]) {
      acc[item.chain] = 0;
    }
    acc[item.chain] += item.glm_amount;
    return acc;
  }, {});

  const calculateLiquidityUSD = (glmAmount, pair) => {
    const glmValueUSD = glmAmount * GLM_PRICE_USD;
    return glmValueUSD * 2;
  };

  const calculatePairAmount = (glmAmount, pair) => {
    const glmValueUSD = glmAmount * GLM_PRICE_USD;

    if (pair === "GLM/ETH") {
      return glmValueUSD / ETH_PRICE_USD;
    } else if (pair === "GLM/USDC") {
      return glmValueUSD / USDC_PRICE_USD;
    } else if (pair === "GLM/DAI") {
      return glmValueUSD / DAI_PRICE_USD;
    } else if (pair === "GLM/USDT") {
      return glmValueUSD / USDT_PRICE_USD;
    }
    return 0;
  };

  const getPairToken = (pair) => {
    if (pair === "GLM/ETH") return "ETH";
    if (pair === "GLM/USDC") return "USDC";
    if (pair === "GLM/DAI") return "DAI";
    if (pair === "GLM/USDT") return "USDT";
    return "";
  };

  const totalLiquidityUSD = data.reduce((sum, item) => {
    return sum + calculateLiquidityUSD(item.glm_amount, item.pair);
  }, 0);

  return {
    totalGLM,
    totalLiquidityUSD,
    totalPairs: Object.keys(pairStats).length,
    totalChains: Object.keys(chainStats).length,
    totalDexes: new Set(data.map(item => item.dex)).size,
    pairStats,
    chainStats,
    calculateLiquidityUSD,
    calculatePairAmount,
    getPairToken
  };
};