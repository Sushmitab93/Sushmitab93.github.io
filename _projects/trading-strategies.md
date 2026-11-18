---
title: Technical trading strategies vs. a Canadian mutual fund
order: 5
featured: false
summary: >-
  Backtests 12 technical-indicator trading strategies on ten large tech stocks
  over ten years and compares them with the TD Canadian Balanced Fund.
problem: Can rule-based trading strategies beat a mainstream Canadian mutual fund?
role: Data collection, strategy backtesting and evaluation
result: No single strategy consistently beat the fund over the long term
stack: [Python, yfinance, pandas, NumPy, Matplotlib, Seaborn]
code: https://github.com/Sushmitab93/Stock-Trading-Strategies-Performance
---

## The question

Retail investors often hear that trading on technical signals beats leaving
money in a fund. I tested that claim against a fund widely available to
Canadian retail investors: the **TD Canadian Balanced Fund (TD908)**.

## Data

Daily price and volume data from Yahoo Finance, 2015 to 2025, for ten large
technology stocks: Apple, Amazon, Alphabet, Meta, Microsoft, NVIDIA, Netflix,
Tesla, Broadcom and Palantir.

## Strategies tested

| Family | Strategies |
|---|---|
| Trend following | Moving average crossover (50/200 day), 20-day breakout, Donchian channel |
| Mean reversion | Bollinger Bands, RSI oversold/overbought, moving average envelope |
| Momentum | Rate of change, 52-week breakout, relative strength |
| Hybrid | Moving average plus RSI, moving average plus Bollinger Bands, all three combined |

Each strategy was backtested to generate buy and sell signals, then scored on
CAGR, total return, volatility, maximum drawdown, Sharpe ratio, win rate and
profit factor.

## Findings

- Bollinger Bands and RSI reversion did well in strong trends and volatile markets, but suffered large drawdowns in downturns.
- Steadier strategies, such as the moving average envelope and rate of change, gave smaller but more consistent gains.
- **No single strategy consistently beat the mutual fund over the long term.**

The fund gave more reliable, balanced results for long-term investing.
Technical strategies work better for short-term opportunities or as one part
of a diversified approach.

## What I would do next

- Include trading costs and taxes, which would widen the gap further
- Test across more market sectors, not only large tech stocks
