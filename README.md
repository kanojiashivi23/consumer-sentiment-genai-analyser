# GenAI Consumer Sentiment & Purchasing Behaviour Analyser

## Overview
An end-to-end NLP pipeline that classifies 500 Amazon Food Reviews 
using HuggingFace's RoBERTa model to analyse consumer sentiment 
and its impact on purchasing behaviour.

## Tools Used
- Python (Pandas, Matplotlib, Seaborn)
- HuggingFace Inference API (cardiffnlp/twitter-roberta-base-sentiment-latest)
- Google Colab
- Dataset: Amazon Fine Food Reviews (Kaggle)

## Key Findings
- 95.6% of customers with POSITIVE sentiment repurchased
- 52.6% of customers with NEGATIVE sentiment churned
- AI sentiment matched star ratings 79.5% of the time
- Neutral sentiment was hardest to detect (57.6% avg confidence)
- 20.5% mismatch between star ratings and written sentiment 
  reveals hidden signals businesses miss when relying only on ratings

## Project Structure
- data_cleaning → load, clean, add purchase_decision column
- sentiment_analysis → HuggingFace API classification on 500 reviews
- analysis → cross-tabulation, accuracy check, confidence analysis
- dashboard → 4-chart summary visualisation

## Dashboard Preview
<img width="2084" height="1520" alt="final_dashboard" src="https://github.com/user-attachments/assets/54b930d6-51e4-4680-b0fd-ee4c3ddf55b3" />
