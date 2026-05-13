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






# GenAI Consumer Sentiment & Purchasing Behaviour Analyser (v2.0) 🚀

This project is a full-stack AI application that analyzes 500+ Amazon Food reviews to uncover the relationship between customer sentiment and purchasing behavior (churn vs. repurchase).

## 🌟 What's New in v2.0
I have upgraded this project from a collection of analysis scripts into a **production-ready dashboard**:
- **Interactive Analytics:** A React-based dashboard for real-time data exploration.
- **AI Sentiment Lab:** An integrated inference tool that predicts sentiment for custom reviews using LLMs.
- **SQLite Integration:** Moved from flat CSVs to a relational database for high-performance querying.

## 📊 Key Insights
- **Sentiment vs. Churn:** 95.6% of positive sentiment customers repurchased, while 52.6% of negative sentiment customers churned.
- **The "Hidden Signal":** Identified a **20.5% mismatch** where star ratings failed to capture the true emotional sentiment of the written review.

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** Python (stateless RPC), SQLite
- **AI Models:** HuggingFace RoBERTa (Base Analysis) & Gemini 2.5 Flash (Inference Lab)

## 📂 Project Structure
- `/frontend`: React application, UI components, and interactive charts.
- `/backend`: Python API handlers and SQLite database management.

## 🚀 Running Locally
1. Clone the repo.
2. **Backend:** `cd backend && pip install -r requirements.txt && python main.py`
3. **Frontend:** `cd frontend && npm install && npm run dev`
