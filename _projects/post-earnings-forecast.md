---
title: Forecasting post-earnings stock movement
order: 1
featured: true
image: /assets/img/pead_drift.png
summary: >-
  A multimodal machine learning framework that predicts how far S&P 500 stocks
  move in the two weeks after earnings, from 24,000+ earnings events, then turns
  the predictions into a backtested trading strategy. Capstone project, team of three.
problem: Can earnings-time data identify which stocks will keep drifting after an earnings announcement?
role: Capstone team member (team of 3), Ontario Tech MBAI 5600G, Summer 2026. Advisor, Prof. Amin Ibrahim
result: Backtested Sharpe ratio of 2.3 over five years of walk-forward testing, before trading costs
stack: [Python, Polars, TA-Lib, FinBERT, PyTorch, TabNet, scikit-learn, XGBoost, Optuna, AWS S3, Delta Lake]
code: https://github.com/Richard-X46/Post-Earnings-Forecast
demo: https://richard-pears.dev/pead-report/
demo_label: Interactive report
---

## The business problem

After a company reports earnings, its stock often keeps moving in the same
direction for days or weeks. This is called post-earnings announcement drift
(PEAD), and it's one of the best-documented anomalies in finance. Traders
usually spot it by judgment or a single rule of thumb, such as how much a
company beat its earnings estimate.

We set out to replace that with a systematic, auditable signal: for every
S&P 500 earnings event, predict how strong the move will be over the next two
weeks, then test whether trading on those predictions would actually make money.

## The data

- **24,132 earnings events** across 503 S&P 500 companies, from 2014 to 2025
- **257 features** per event
- **Sources:** Alpha Vantage for fundamentals, earnings surprise, call transcripts and news sentiment; Yahoo Finance for daily prices

Each event combines four kinds of information: technical indicators across
the 12 trading days around the announcement, company fundamentals, FinBERT
sentiment from the earnings-call transcript, and news sentiment. Raw data was
stored as Delta Lake tables on AWS S3 and processed with Polars.

The data needed real cleaning decisions. About 47% of events had no news
coverage, so missing sentiment was filled from the same sector and year rather
than with one global value. Unbounded accounting ratios were capped, and
features that were near-duplicates of each other were removed. Every
imputation and scaling step was fit only on past data, to avoid leaking the
future into training.

## First, is the effect real?

![Post-earnings drift for beats and misses]({{ '/assets/img/pead_drift.png' | relative_url }})
*Average price path around earnings for 16,893 beats and 6,113 misses. The two groups split at the announcement and never come back together.*

Yes. Stocks that beat estimates kept rising, from +1.15% the day after to
+1.98% ten days later. Misses dropped 1.56% and only partly recovered. That
sustained gap is exactly what PEAD theory predicts, which made it worth
modeling.

## Approach

![Model pipeline]({{ '/assets/img/pead_pipeline.png' | relative_url }})
*Three feature groups are combined into one table, then feed two separate experiments: a tree-model ablation ladder and the deep learning models.*

We framed the target as the stock's peak return over the nine trading days
after the announcement, sorted into three classes: low (under 2%),
moderate (2 to 4%) or strong (4% or more). Then we built up in stages:

1. **Reproduced a published baseline.** We rebuilt the LSTM, BiLSTM and
   CNN-LSTM models from Hajek et al. (2025), the closest prior study, to check
   our pipeline against known results.
2. **Measured what each data source adds.** Random Forest and XGBoost were
   trained four times, adding one data source each time: technical indicators,
   then fundamentals, then transcript sentiment, then news sentiment.
3. **Built two advanced models.** A multi-task neural network predicts the
   class and the size of the move at the same time from a shared encoder.
   TabNet, an attention-based model, shows which features drive each
   prediction.

Financial data makes it easy to fool yourself, so every model was tested with
**walk-forward validation**: train only on the past, test on the next quarter,
and repeat across 16 to 20 quarters from 2021 to 2025. Hyperparameters were
tuned with Optuna in the same time-respecting way.

## Results

| Model | Accuracy (3 classes) |
|---|---|
| Random guessing | 33.3% |
| Random Forest, all features | 44.9% |
| TabNet | 44.5% |
| Multi-task neural network | 45.7% |

Two findings stood out.

**Extra data sources barely helped.** Adding fundamentals, transcript sentiment
and news sentiment on top of technical indicators left accuracy almost flat
in both tree models.

**The models were learning volatility.** TabNet's attention showed that 92.5%
of what it relied on came from technical and volatility features. Its single
most-used feature was volatility the day after the announcement, not anything
from the earnings report itself.

![TabNet feature attention]({{ '/assets/img/pead_attention.png' | relative_url }})
*TabNet's top 30 features for the final quarter. Post-event volatility (atr_t+1) dominates.*

Even so, the predictions ranked stocks correctly on average: stocks predicted
"strong" did move more than those predicted "low" (4.5% against 2.6% for the
neural network).

## Does it make money?

We replayed the signals as a simple strategy: buy stocks predicted to move
moderately or strongly at the close the day after earnings, $200 per trade
from a $50,000 account, and sell at a take-profit level or after ten days.

![Equity curve across take-profit levels]({{ '/assets/img/pead_equity.png' | relative_url }})
*Account value from 2021 to 2025 at each take-profit level tested. The highlighted line is the 5% level.*

| | Neural network | TabNet |
|---|---|---|
| Profit over 5 years | $11,953 | $12,138 |
| Sharpe ratio | 2.31 | 2.33 |
| Return on account | 23.9% | 24.3% |
| Profitable quarters | 14 of 20 | 14 of 20 |

Most losses came from one quarter, 2022 Q2, during a broad market drawdown.
Adding a 1% stop-loss cut the worst drawdown to about 1% but also cut profit
roughly in half, a trade-off we presented to the decision-maker rather than
choosing for them.

> These results exclude trading costs and slippage, and the data covers only
> companies still in the S&P 500 today. They show the signal has value; they
> are not a promise of live returns.

## What we recommended

- Run a monitored paper-trading pilot, not live capital, until trading costs are included.
- Prefer TabNet if decisions need to be explained, since it shows what drives each prediction.
- Redefine the target, or add intraday data, so the models learn from earnings content rather than mostly from volatility.

## My contribution

<p class="todo">TODO: Describe the parts you personally owned, in two or three sentences
(for example, which data sources, models, analysis or report sections were yours).
Delete this box when you're done.</p>
