"""
SAM AI - Content Agent
Creates articles, scripts, and marketing content.
"""

import asyncio
import time
from datetime import datetime
from typing import Dict, Any, List
import json
from agents.base import BaseAgent, AgentTask, AgentResponse
from api_hub import api_hub

class ContentAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Content Creator",
            description="Creates articles, scripts, and marketing content"
        )
        self.tools = ["writing", "editing", "seo_optimization", "formatting"]
    
    def can_handle(self, task_description: str) -> bool:
        keywords = ["write", "create", "article", "blog", "script", "content", "post", "social media", "youtube", "caption"]
        return any(keyword in task_description.lower() for keyword in keywords)
    
    async def execute(self, task: AgentTask, context: Dict[str, Any]) -> AgentResponse:
        start_time = time.time()
        steps_completed = []
        
        try:
            steps_completed.append("Analyzed content requirements")
            
            content_type = context.get("content_type", "article")
            tone = context.get("tone", "professional")
            length = context.get("length", "medium")
            
            prompt = f"""You are a professional content creator. Create high-quality content.

Task: {task.description}

Content Type: {content_type}
Tone: {tone}
Length: {length}

Context: {json.dumps(context) if context else 'None'}

Provide:
1. Well-structured content
2. Engaging headlines
3. Clear call-to-action
4. SEO-friendly formatting"""

            messages = [
                {"role": "system", "content": f"You are a professional {content_type} writer. Create engaging, high-quality content."},
                {"role": "user", "content": prompt}
            ]
            
            result = await api_hub.chat(messages)
            steps_completed.append("Created content draft")
            steps_completed.append("Optimized for engagement")
            
            task.result = result["content"]
            task.status = "completed"
            task.completed_at = datetime.utcnow().isoformat()
            
            return self.create_response(
                task=task,
                result=result["content"],
                steps=steps_completed,
                metadata={"provider": result.get("provider"), "content_type": content_type},
                execution_time=time.time() - start_time
            )
            
        except Exception as e:
            task.status = "failed"
            return AgentResponse(
                agent_name=self.name,
                task_id=task.id,
                status="failed",
                result=f"Content creation failed: {str(e)}",
                steps_completed=steps_completed,
                execution_time=time.time() - start_time
            )
