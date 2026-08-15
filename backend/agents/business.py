"""
SAM AI - Business Agent
Handles business analysis, reports, and strategy.
"""

import asyncio
import time
from datetime import datetime
from typing import Dict, Any, List
import json
from agents.base import BaseAgent, AgentTask, AgentResponse
from api_hub import api_hub

class BusinessAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Business Analyst",
            description="Analyzes business problems and creates strategies"
        )
        self.tools = ["market_analysis", "financial_calc", "report_generation"]
    
    def can_handle(self, task_description: str) -> bool:
        keywords = ["business", "strategy", "market", "analysis", "report", "growth", "revenue", "marketing", "sales"]
        return any(keyword in task_description.lower() for keyword in keywords)
    
    async def execute(self, task: AgentTask, context: Dict[str, Any]) -> AgentResponse:
        start_time = time.time()
        steps_completed = []
        
        try:
            steps_completed.append("Analyzed business requirements")
            
            prompt = f"""You are a business analyst agent. Analyze and create a business strategy.

Task: {task.description}

Context: {json.dumps(context) if context else 'None'}

Provide:
1. Executive summary
2. Market analysis
3. Strategic recommendations
4. Action items
5. KPIs to track"""

            messages = [
                {"role": "system", "content": "You are a strategic business analyst. Provide data-driven, actionable insights."},
                {"role": "user", "content": prompt}
            ]
            
            result = await api_hub.chat(messages)
            steps_completed.append("Conducted market analysis")
            steps_completed.append("Generated strategy report")
            
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
                result=f"Business analysis failed: {str(e)}",
                steps_completed=steps_completed,
                execution_time=time.time() - start_time
            )
