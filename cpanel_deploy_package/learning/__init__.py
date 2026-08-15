"""
SAM AI - Self Learning System
Learns from user feedback and adapts responses.
"""

import os
import json
import hashlib
from typing import Dict, Any, List, Optional
from datetime import datetime
from dataclasses import dataclass, field
from database import SessionLocal
from models import User, Chat
import sqlalchemy

@dataclass
class UserFeedback:
    user_id: str
    message_id: str
    rating: int  # 1-5
    feedback_text: str
    category: str  # quality, speed, accuracy, relevance
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())

@dataclass
class UserPreference:
    user_id: str
    preference_type: str  # response_length, tone, format, language
    preference_value: str
    confidence: float = 1.0
    last_updated: str = field(default_factory=lambda: datetime.utcnow().isoformat())

class FeedbackCollector:
    def __init__(self):
        self.feedback_db: List[UserFeedback] = []
    
    def record_feedback(self, user_id: str, message_id: str, rating: int, feedback_text: str, category: str) -> UserFeedback:
        feedback = UserFeedback(
            user_id=user_id,
            message_id=message_id,
            rating=rating,
            feedback_text=feedback_text,
            category=category
        )
        self.feedback_db.append(feedback)
        self._persist_feedback(feedback)
        return feedback
    
    def _persist_feedback(self, feedback: UserFeedback):
        try:
            db = SessionLocal()
            try:
                # Create feedback table if not exists
                from sqlalchemy import text
                db.execute(text("""
                    CREATE TABLE IF NOT EXISTS user_feedback (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id VARCHAR(36) NOT NULL,
                        message_id VARCHAR(36) NOT NULL,
                        rating INT NOT NULL,
                        feedback_text TEXT,
                        category VARCHAR(50) NOT NULL,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                """))
                db.commit()
                
                db.execute(text("""
                    INSERT INTO user_feedback (user_id, message_id, rating, feedback_text, category)
                    VALUES (:user_id, :message_id, :rating, :feedback_text, :category)
                """), {
                    "user_id": feedback.user_id,
                    "message_id": feedback.message_id,
                    "rating": feedback.rating,
                    "feedback_text": feedback.feedback_text,
                    "category": feedback.category
                })
                db.commit()
            except Exception as e:
                print(f"Error persisting feedback: {e}")
            finally:
                db.close()
        except Exception as e:
            print(f"Database error: {e}")
    
    def get_user_feedback(self, user_id: str, limit: int = 50) -> List[UserFeedback]:
        return [f for f in self.feedback_db if f.user_id == user_id][-limit:]
    
    def get_feedback_stats(self, user_id: str) -> Dict[str, Any]:
        user_feedback = self.get_user_feedback(user_id)
        if not user_feedback:
            return {"average_rating": 0, "total_feedback": 0, "categories": {}}
        
        ratings = [f.rating for f in user_feedback]
        avg_rating = sum(ratings) / len(ratings)
        
        categories: Dict[str, List[int]] = {}
        for f in user_feedback:
            if f.category not in categories:
                categories[f.category] = []
            categories[f.category].append(f.rating)
        
        return {
            "average_rating": round(avg_rating, 2),
            "total_feedback": len(user_feedback),
            "categories": {k: round(sum(v)/len(v), 2) for k, v in categories.items()}
        }

class PreferenceLearner:
    def __init__(self):
        self.preferences: Dict[str, UserPreference] = {}
    
    def learn_preference(self, user_id: str, preference_type: str, preference_value: str):
        key = f"{user_id}:{preference_type}"
        
        if key in self.preferences:
            existing = self.preferences[key]
            existing.preference_value = preference_value
            existing.confidence = min(existing.confidence + 0.1, 1.0)
            existing.last_updated = datetime.utcnow().isoformat()
        else:
            self.preferences[key] = UserPreference(
                user_id=user_id,
                preference_type=preference_type,
                preference_value=preference_value
            )
    
    def get_preferences(self, user_id: str) -> Dict[str, str]:
        return {
            p.preference_type: p.preference_value
            for k, p in self.preferences.items()
            if p.user_id == user_id and p.confidence > 0.5
        }
    
    def get_prompt_modifiers(self, user_id: str) -> Dict[str, Any]:
        prefs = self.get_preferences(user_id)
        modifiers = {}
        
        if "response_length" in prefs:
            length = prefs["response_length"]
            if length == "short":
                modifiers["max_tokens"] = 200
            elif length == "medium":
                modifiers["max_tokens"] = 500
            elif length == "long":
                modifiers["max_tokens"] = 1000
        
        if "tone" in prefs:
            modifiers["tone"] = prefs["tone"]
        
        if "language" in prefs:
            modifiers["language"] = prefs["language"]
        
        return modifiers

class ResponseAnalyzer:
    def __init__(self):
        self.analysis_history: List[Dict[str, Any]] = []
    
    def analyze_response_quality(self, user_id: str, message: str, response: str, feedback: Optional[UserFeedback] = None) -> Dict[str, Any]:
        analysis = {
            "user_id": user_id,
            "message_length": len(message),
            "response_length": len(response),
            "response_time": datetime.utcnow().isoformat(),
            "quality_score": 0.0,
            "suggestions": []
        }
        
        if feedback:
            analysis["quality_score"] = feedback.rating / 5.0
            analysis["feedback_category"] = feedback.category
            analysis["feedback_text"] = feedback.feedback_text
        
        if len(response) > 2000:
            analysis["suggestions"].append("Response might be too long")
        if len(response) < 50:
            analysis["suggestions"].append("Response might be too short")
        
        self.analysis_history.append(analysis)
        return analysis

class KnowledgeUpdater:
    def __init__(self):
        self.knowledge_base: Dict[str, List[Dict[str, Any]]] = {}
    
    def add_knowledge(self, user_id: str, source: str, content: str, metadata: Dict[str, Any] = None):
        if user_id not in self.knowledge_base:
            self.knowledge_base[user_id] = []
        
        self.knowledge_base[user_id].append({
            "source": source,
            "content": content,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow().isoformat(),
            "usage_count": 0
        })
    
    def get_user_knowledge(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        if user_id not in self.knowledge_base:
            return []
        return sorted(
            self.knowledge_base[user_id],
            key=lambda x: x["usage_count"],
            reverse=True
        )[:limit]
    
    def increment_usage(self, user_id: str, knowledge_index: int):
        if user_id in self.knowledge_base and 0 <= knowledge_index < len(self.knowledge_base[user_id]):
            self.knowledge_base[user_id][knowledge_index]["usage_count"] += 1

class SelfLearningSystem:
    def __init__(self):
        self.feedback_collector = FeedbackCollector()
        self.preference_learner = PreferenceLearner()
        self.response_analyzer = ResponseAnalyzer()
        self.knowledge_updater = KnowledgeUpdater()
    
    def record_feedback(self, user_id: str, message_id: str, rating: int, feedback_text: str, category: str):
        feedback = self.feedback_collector.record_feedback(user_id, message_id, rating, feedback_text, category)
        self._analyze_and_learn(user_id, feedback)
        return feedback
    
    def _analyze_and_learn(self, user_id: str, feedback: UserFeedback):
        if feedback.rating >= 4:
            self.preference_learner.learn_preference(user_id, "satisfaction", "high")
        elif feedback.rating <= 2:
            self.preference_learner.learn_preference(user_id, "satisfaction", "low")
        
        if "too long" in feedback.feedback_text.lower():
            self.preference_learner.learn_preference(user_id, "response_length", "short")
        elif "too short" in feedback.feedback_text.lower():
            self.preference_learner.learn_preference(user_id, "response_length", "long")
    
    def get_user_preferences(self, user_id: str) -> Dict[str, Any]:
        preferences = self.preference_learner.get_preferences(user_id)
        prompt_modifiers = self.preference_learner.get_prompt_modifiers(user_id)
        feedback_stats = self.feedback_collector.get_feedback_stats(user_id)
        
        return {
            "preferences": preferences,
            "prompt_modifiers": prompt_modifiers,
            "feedback_stats": feedback_stats
        }
    
    def add_user_knowledge(self, user_id: str, source: str, content: str, metadata: Dict[str, Any] = None):
        self.knowledge_updater.add_knowledge(user_id, source, content, metadata)
    
    def get_user_knowledge(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        return self.knowledge_updater.get_user_knowledge(user_id, limit)
    
    def analyze_response(self, user_id: str, message: str, response: str, feedback: Optional[UserFeedback] = None) -> Dict[str, Any]:
        return self.response_analyzer.analyze_response_quality(user_id, message, response, feedback)

# Global self-learning system instance
self_learning = SelfLearningSystem()
