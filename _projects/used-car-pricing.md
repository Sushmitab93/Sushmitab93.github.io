---
title: Used car fair value and listing trust
order: 4
featured: false
image: /assets/img/car_actual_vs_predicted.png
summary: >-
  Estimates the fair market value of used car listings from 5.6 million dealer
  records, flags listings whose price looks unreliable, and forecasts price trends.
problem: Is a used car listing priced fairly, and can its price be trusted?
role: Data cleaning, feature engineering, modeling and forecasting
result: Price model R² of 0.833 (RMSE $7,847) on 5.6 million listings; flags the 2.7% priced unusually far from fair value
stack: [Python, pandas, statsmodels, scikit-learn, Matplotlib, Seaborn]
code: https://github.com/Sushmitab93/UsedCarPricePrediction
---

## The problem

Buyers and dealers lose time when a listing's price doesn't match the car. The
goal was to estimate a fair market value for each listing and give a simple
signal of how much to trust its price.

## Data

The data comes from MarketCheck, which collects listings from more than 65,000
dealer websites across the US and Canada. I focused on US listings from 2013 to
2022, with 21 fields covering the vehicle (make, model, year, mileage, engine,
drivetrain, fuel type) and the seller. After cleaning, the dataset had
**5,649,563 records**.

I engineered features such as vehicle age, miles per year and vehicle segment.
Outliers were flagged but kept, because unusual prices are part of the real
market the model needs to handle.

## Approach

**1. Price model.** Two linear regression models predicted log price from
mileage, age, engine size, make, segment, fuel type, transmission and
drivetrain. I compared them on RMSE, R² and adjusted R², and checked the
residuals for non-linearity.

![Actual vs. predicted price]({{ '/assets/img/car_actual_vs_predicted.png' | relative_url }})
*Actual against predicted price on the validation set.*

**2. Trust flag.** Each listing's price is compared with the model's fair
value. A listing is flagged as unreliable when its gap is more than two
standard deviations from what's normal for its vehicle segment. That flagged
**2.7% of listings** (30,614 of about 1.13 million in the validation set).

![Predicted vs. actual price colored by trust score]({{ '/assets/img/car_trust.png' | relative_url }})
*Listings far from the line are the ones flagged as unreliable.*

I also fit a logistic regression to predict the flag from vehicle attributes
alone. Its accuracy (97.3%) matched the share of trusted listings exactly, so
it was effectively predicting "trusted" every time. Vehicle attributes alone
can't tell you whether a listing is mispriced; the price gap itself is the
signal.

**3. Forecasting.** Holt's linear trend model forecasts the median used car
price three years ahead, to help dealers anticipate market shifts.

## Results

| Output | Result |
|---|---|
| Price model | R² = 0.833, RMSE = $7,847 |
| Listings flagged as unreliable | 2.7% |

## What I would do next

- Try gradient-boosted trees to capture the non-linearity the residuals showed
- Validate the flag against listings known to be mispriced
- Rebuild the trust model with class weighting and listing-level features (description, seller history) so it can predict mispricing before a price is known
