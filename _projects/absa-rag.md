---
title: Product review insights with sentiment analysis and RAG
order: 3
featured: true
thumb: /assets/img/thumb_absa.png
image: /assets/img/absa_rag_answer.png
summary: >-
  An NLP system that reads Amazon electronics reviews sentence by sentence,
  identifies which product feature each one is about and whether it is positive
  or negative, then answers plain-English questions with cited sources.
problem: What do customers actually praise or complain about, feature by feature?
role: Data pipeline, models, RAG layer, evaluation and app
result: 81% aspect accuracy; filtering by the model's labels raised correct-sentiment retrieval from 46% to 56%
stack: [Python, PyTorch, DistilBERT, Hugging Face, LangChain, Chroma, Sentence-Transformers, Groq, Ollama, Streamlit, pytest]
code: https://github.com/Sushmitab93/AspectBasedSentimentAnalysis
---

## The problem

A single star rating hides most of what a review says. A five-star review can
still contain "but the battery dies fast." Product teams need to know which
**feature** people are talking about and how they **feel** about it.

This project works in two layers:

1. **Aspect-based sentiment analysis**: label each review sentence with one of
   eight features (battery, sound, camera, price, display, design, connectivity,
   performance) and a positive or negative sentiment.
2. **Retrieval-augmented generation (RAG)**: use those labels to answer questions
   such as "What do customers complain about with battery life?", with every
   point cited back to real review sentences.

## Data

| Stage | Count |
|---|---|
| Reviews loaded | 50,000 |
| After removing duplicates and empty text | 43,644 |
| Sentences of 5+ words | 183,654 |
| Sentences that mention a feature | 64,815 |
| Balanced training sentences | 11,240 |
| Test sentences | 13,068 |

The train/test split is done **by review**, so sentences from the same review
never appear in both sets. That keeps the test results honest.

## Models

Each sentence is turned into a 768-dimension embedding with a frozen
**DistilBERT** model. Two PyTorch networks then classify it, using dropout,
batch normalization, early stopping and learning-rate scheduling.

| Model | Accuracy | Macro-F1 |
|---|---|---|
| Aspect classifier (8 features) | 80.95% | 0.78 |
| Sentiment classifier | 73.81% | 0.62 |

Sentiment is the harder task. Its labels come from the overall star rating, not
the sentence, and 87% of test sentences are positive. The model catches most
complaints (70% recall on negatives) but over-flags them, which the RAG layer
is designed to handle.

## The RAG layer

1. Keep only sentences whose **predicted** feature and sentiment match the user's filters.
2. Retrieve the 12 sentences closest in meaning to the question from a Chroma vector database.
3. An LLM (Groq, or Ollama offline) writes a short answer, cites each point, and sets aside sentences that don't fit.

![RAG answer with citations]({{ '/assets/img/absa_rag_answer.png' | relative_url }})
*Asking about battery complaints. Several cited sentences come from four-star reviews: complaints a star rating would have hidden.*

## Does the model filter help?

I measured retrieval with and without the classifier's labels across all 16
feature and sentiment combinations.

| Retrieval method | Correct feature | Correct sentiment |
|---|---|---|
| Semantic search only | 88.5% | 45.8% |
| Model filter plus semantic search | **93.8%** | **56.2%** |

Semantic search finds the right topic but can't tell praise from complaints.
The classifier adds that missing signal, and the LLM removes most of what's
left over.

![Sentences the LLM set aside]({{ '/assets/img/absa_rag_rejected.png' | relative_url }})
*Sentences the LLM rejected, such as "the battery life on this is killer," which is praise mislabeled as a complaint.*

## What I would do next

- Replace keyword-based feature labels with a sequence-labeling model
- Add a neutral class so three-star sentences are handled properly
- Hand-label a small test set to score answer faithfulness automatically
