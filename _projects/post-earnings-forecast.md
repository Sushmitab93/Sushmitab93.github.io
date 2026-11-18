---
title: Forecasting post-earnings stock movement
order: 1
featured: true
image: /assets/img/pead_workflow.png
summary: >-
  A multimodal model that predicts how far an S&P 500 stock will run in the two
  weeks after an earnings announcement, using price technicals, fundamentals and
  FinBERT sentiment from earnings calls. Capstone project, team of three.
problem: Can earnings-time data predict the size of a stock's move over the following two weeks?
role: Capstone team member (team of 3), Ontario Tech MBAI 5600G, Summer 2026
result: 45.7% directional accuracy across 20 walk-forward folds, against a 33.2% baseline
stack: [Python, polars, FinBERT, Transformers, TabNet, TensorFlow, XGBoost, AWS S3, Delta Lake, Modal, Quarto, Docker]
code: https://github.com/Richard-X46/Post-Earnings-Forecast
demo: https://richard-pears.dev/pead-report/
demo_label: Interactive report
---

## The business problem

After a company reports earnings, its stock often keeps drifting in the same
direction for days. This is known as post-earnings announcement drift (PEAD).
If you can estimate how big that move is likely to be, you can size positions
and set take-profit levels with more confidence.

We framed it as a practical question: in the nine trading days after an
earnings event, how high will the stock's intraday price peak? Each event was
put into one of three classes: a low move (under 2%), a moderate move (2 to 4%)
or a strong move (4% or more).

## Data

- About **24,000 earnings events** across roughly **500 S&P 500 companies**
- Daily prices and volume, used to build technical indicators
- Quarterly fundamentals (income statement, balance sheet, cash flow)
- Earnings call transcripts scored with **FinBERT**, a finance-tuned language model
- News sentiment, analyst upgrades and downgrades, sector, and market context (VIX, S&P 500)

Raw data landed in AWS S3 as Delta Lake tables and was processed with polars.

![Project workflow]({{ '/assets/img/pead_workflow.png' | relative_url }})
*The pipeline, from ingestion through feature engineering, modeling and a replayed trading strategy.*

## Approach

Financial data leaks easily: train on the future and test on the past, and
results look far better than they will be in real use. To prevent that, every
model was evaluated with **expanding-window walk-forward validation**. We
trained on all quarters up to a point, tested on the next quarter, and repeated
this for 20 quarters from 2021 Q1 to 2025 Q4.

We compared two main models:

- **TabNet**, an attention-based deep learning model for tabular data, trained on GPU through Modal
- A **multitask deep neural network** that predicts the size of the move and its class together

Ablation runs measured how much each feature group (technicals, fundamentals,
sentiment) added.

## Results

Directional accuracy is the share of events where the predicted class matched
what happened. Always guessing the most common class scores 33.2%.

| Model | Mean directional accuracy | Mean absolute error | Best quarter |
|---|---|---|---|
| TabNet (initial) | 43.7% | 0.0313 | 70.2% (2022 Q4) |
| TabNet (updated) | 45.0% | 0.0303 | 69.0% (2022 Q4) |
| Multitask DNN | 45.7% | 0.0296 | 70.0% (2022 Q4) |

We then replayed the TabNet signals as a simple strategy: buy the predicted
moderate and strong movers at the next close and exit at a take-profit level or
after ten days. On a $50,000 book, the best setting returned **$12,138 with a
Sharpe ratio of 2.33** and was profitable in every full year.

> This backtest ignores transaction costs and slippage, and the take-profit level
> was chosen on the same evaluation period. It shows the signal has value; it is
> not a claim of real trading returns.

## My contribution

<p class="todo">TODO: Describe the parts you personally owned, in two or three sentences
(for example, which features, models, analysis or report sections were yours).
Delete this box when you're done.</p>

## What I would do next

- Add realistic transaction costs and compare against simply holding the S&P 500
- Add confidence intervals so results across quarters can be compared fairly
- Test whether the weakest quarters share a market regime the model could detect
