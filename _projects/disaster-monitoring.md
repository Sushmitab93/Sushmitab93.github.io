---
title: Real-time disaster monitoring pipeline
order: 2
featured: true
image: /assets/img/disaster_overview.png
summary: >-
  A streaming pipeline that pulls live earthquake, wildfire, flood and storm data
  from USGS, NASA and FEMA, scores regional risk, flags unusual activity and shows
  it on a live dashboard.
problem: How can live hazard feeds be turned into a risk view that updates as events happen?
role: Design, data engineering, modeling and dashboard
result: Risk-score model with R² of 0.90, plus anomaly alerts for spikes above 3x the normal rate
stack: [Python, Apache Kafka, PySpark Structured Streaming, MongoDB, Docker, scikit-learn, Streamlit]
code: https://github.com/Sushmitab93/DisasterMonitoring
---

## Why I built this

In catastrophe modeling, most analysis looks back at historical events. Insurers
and reinsurers also need to know what is happening right now: where events are
clustering, and whether a region is far more active than usual. This project is
a working version of that live view, built on public data.

## Data sources

- **USGS**: earthquake events with magnitude, depth, location and tsunami alerts
- **NASA EONET**: natural events such as wildfires, floods and severe storms
- **FEMA**: US disaster declarations by state

The first run ingested **5,988 earthquake records, 509 NASA events** and the
FEMA declarations history.

## How it works

1. **Producers** call each API and publish events to their own Kafka topic.
2. **Spark Structured Streaming** reads all three topics, computes a risk score for each event and upserts it into MongoDB.
3. **A batch training job** reads from MongoDB and trains the models below.
4. **A Streamlit dashboard** shows live events and model results.

Kafka and MongoDB run in Docker, so the whole stack starts with one command.

![Dashboard overview]({{ '/assets/img/disaster_overview.png' | relative_url }})
*The Streamlit dashboard with live events and risk scores.*

## Models

| Model | What it does | Result |
|---|---|---|
| Random Forest | Predicts an earthquake risk score | R² = 0.90, RMSE = 3.57 |
| Anomaly detection | Compares each region's daily event rate with its own baseline, across 515 grid cells | Flags spikes above 3x baseline |
| K-Means clustering | Groups regions by seismic activity | 5 clusters, chosen with the elbow method |
| Seasonal analysis | Tracks monthly and yearly event rates | 10,970 events analyzed |

Magnitude drove most of the risk score (about 88% of feature importance,
including its squared term), with depth a distant third. That matches how
earthquake hazard is treated in catastrophe models.

![Dashboard charts]({{ '/assets/img/disaster_charts.png' | relative_url }})
*Clusters, anomalies and seasonal trends.*

## What it found

- Three critical seismic zones and two high-activity clusters worldwide
- Regional spikes more than three times the historical baseline, caught automatically
- Clear cyclical patterns in event frequency across years

## What I would do next

- Join events to an exposure dataset, so the dashboard shows insured value at risk, not just hazard
- Deploy the dashboard publicly with a scheduled refresh
- Add wildfire and flood severity models alongside the earthquake score
