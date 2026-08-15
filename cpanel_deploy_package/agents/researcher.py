"""
SAM AI - Researcher Agent
Gathers information from various sources.
"""

import asyncio
import time
from datetime import datetime
from typing import Dict, Any, List
import json
from agents.base import BaseAgent, AgentTask, AgentResponse
from api_hub import api_hub

class ResearcherAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Researcher",
            description="Gathers and analyzes information from multiple sources"
        )
        self.tools = ["web_search", "document_analysis", "data_extraction"]
    
    def can_handle(self, task_description: str) -> bool:
        keywords = ["research", "find", "search", "analyze", "information", "data", "investigate", "study"]
        return any(keyword in task_description.lower() for keyword in keywords)
    
    async def execute(self, task: AgentTask, context: Dict[str, Any]) -> AgentResponse:
        start_time = time.time()
        steps_completed = []
        
        try:
            steps_completed.append("Identified research objectives")
            
            prompt = f"""You are a research agent. Gather and analyze information for this task.

Task: {task.description}

Context: {json.dumps(context) if context else 'None'}

Provide:
1. Key findings
2. Supporting evidence
3. Conclusions
4. Recommendations

Be thorough and factual."""

            messages = [
                {"role": "system", "content": "You are a thorough researcher. Provide well-structured, factual information."},
                {"role": "user", "content": prompt}
            ]
            
            result = await api_hub.chat(messages)
            steps_completed.append("Conducted research and analysis")
            steps_completed.append("Compiled findings")
            
            task.result = result["content"]
            task.status = "completed"
            task.completed_at = datetime.utcnow().isoformat()
            
            return self.create_response(
                task=task,
                result=result["content"],
                steps=steps_completed,
                metadata={"provider": result.get("provider")},
                execution_time=time.time() - start_time
            )
            
        except Exception as e:
            task.status = "failed"
            return AgentResponse(
                agent_name=self.name,
                task_id=task.id,
                status="failed",
                result=f"Research failed: {str(e)}",
                steps_completed=steps_completed,
                execution_time=time.time() - start_time
            )
