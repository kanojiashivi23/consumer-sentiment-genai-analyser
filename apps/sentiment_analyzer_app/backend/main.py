import json
from apps.sentiment_analyzer_app.backend.db import get_db
from nexttoken import NextToken

def get_stats():
    """Calculate high-level KPIs."""
    print("[BACKEND_START] get_stats")
    conn = get_db()
    try:
        # Total reviews
        total = conn.execute("SELECT COUNT(*) FROM reviews").fetchone()[0]
        
        # Avg confidence
        avg_confidence = conn.execute("SELECT AVG(confidence) FROM reviews").fetchone()[0]
        
        # Sentiment distribution
        dist_rows = conn.execute("SELECT sentiment, COUNT(*) as count FROM reviews GROUP BY sentiment").fetchall()
        distribution = {row["sentiment"]: row["count"] for row in dist_rows}
        
        # Churn rate (Assuming 'Churned' vs 'Repurchased' in purchase_decision)
        churn_count = conn.execute("SELECT COUNT(*) FROM reviews WHERE purchase_decision = 'Churned'").fetchone()[0]
        churn_rate = churn_count / total if total > 0 else 0
        
        result = {
            "total": total,
            "avg_confidence": round(avg_confidence, 2) if avg_confidence else 0,
            "distribution": distribution,
            "churn_rate": round(churn_rate, 2)
        }
        print(f"[BACKEND_SUCCESS] get_stats: {result}")
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] get_stats failed: {str(e)}")
        raise
    finally:
        conn.close()

def get_reviews(sentiment: str = None, decision: str = None, limit: int = 50):
    """Fetch reviews with optional filters."""
    print(f"[BACKEND_START] get_reviews(sentiment={sentiment}, decision={decision}, limit={limit})")
    conn = get_db()
    try:
        query = "SELECT * FROM reviews WHERE 1=1"
        params = []
        if sentiment:
            query += " AND sentiment = ?"
            params.append(sentiment)
        if decision:
            query += " AND purchase_decision = ?"
            params.append(decision)
        
        query += " LIMIT ?"
        params.append(limit)
        
        rows = conn.execute(query, params).fetchall()
        result = [dict(row) for row in rows]
        print(f"[BACKEND_SUCCESS] get_reviews: found {len(result)} reviews")
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] get_reviews failed: {str(e)}")
        raise
    finally:
        conn.close()

def get_analysis_data():
    """Provide aggregated data for charts."""
    print("[BACKEND_START] get_analysis_data")
    conn = get_db()
    try:
        # Cross-tab: Sentiment vs Purchase Decision
        cross_tab_rows = conn.execute("""
            SELECT sentiment, purchase_decision, COUNT(*) as count 
            FROM reviews 
            GROUP BY sentiment, purchase_decision
        """).fetchall()
        cross_tab = [dict(row) for row in cross_tab_rows]
        
        # Accuracy vs Score (Assuming Score 4-5 are Positive, 1-2 are Negative, 3 is Neutral)
        # We'll check if sentiment matches the rating category
        match_rows = conn.execute("""
            SELECT 
                CASE 
                    WHEN Score >= 4 THEN 'positive'
                    WHEN Score <= 2 THEN 'negative'
                    ELSE 'neutral'
                END as expected_sentiment,
                sentiment,
                COUNT(*) as count
            FROM reviews
            GROUP BY expected_sentiment, sentiment
        """).fetchall()
        score_match = [dict(row) for row in match_rows]
        
        result = {
            "cross_tab": cross_tab,
            "score_match": score_match
        }
        print("[BACKEND_SUCCESS] get_analysis_data")
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] get_analysis_data failed: {str(e)}")
        raise
    finally:
        conn.close()

def analyze_text(text: str):
    """Analyze a custom user-provided review using an LLM."""
    print(f"[BACKEND_START] analyze_text: text_len={len(text)}")
    client = NextToken()
    try:
        prompt = f"""Analyze the sentiment of the following customer review.
Return ONLY a JSON object with the following fields:
- sentiment: "positive", "negative", or "neutral"
- confidence: a float between 0 and 1
- explanation: a brief one-sentence explanation of why you chose this sentiment.

Review: {text}"""
        
        response = client.chat.completions.create(
            model="gemini-2.5-flash-lite",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        
        content = response.choices[0].message.content.strip()
        # Clean up possible markdown code blocks
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        result = json.loads(content)
        print(f"[BACKEND_SUCCESS] analyze_text: {result}")
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] analyze_text failed: {str(e)}")
        raise

__all__ = ["get_stats", "get_reviews", "get_analysis_data", "analyze_text"]
