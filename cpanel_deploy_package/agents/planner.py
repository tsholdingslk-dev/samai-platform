"""
SAM AI - Planner Agent
Breaks down complex tasks into manageable steps.
"""

import asyncio
import time
from datetime import datetime
from typing import Dict, Any, List
import json
from agents.base import BaseAgent, AgentTask, AgentResponse
from api_hub import api_hub

class PlannerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Planner",
            description="Breaks down complex tasks into actionable steps"
        )
        self.tools = ["analysis", "decomposition", "prioritization"]
    
    def can_handle(self, task_description: str) -> bool:
        keywords = ["plan", "strategy", "organize", "break down", "steps", "roadmap", "schedule"]
        return any(keyword in task_description.lower() for keyword in keywords) or len(task_description.split()) > 10
    
    async def execute(self, task: AgentTask, context: Dict[str, Any]) -> AgentResponse:
        start_time = time.time()
        steps_completed = []
        
        try:
            # Step 1: Understand the request
            steps_completed.append("Analyzed user request and identified key objectives")
            
            # Step 2: Use AI to create a structured plan
            prompt = f"""Break down this task into a structured plan with 4-6 actionable steps.

Task: {task.description}

Context: {json.dumps(context) if context else 'None'}

Return a JSON object with:
{{
  "plan": ["step 1", "step 2", "step 3", ...],
  "estimated_time": "X minutes",
  "required_tools": ["tool1", "tool2", ...],
  "complexity": "low/medium/high"
}}

Return only valid JSON, no other text."""

            messages = [
                {"role": "system", "content": "You are a strategic planner. Break down tasks into clear, actionable steps."},
                {"role": "user", "content": prompt}
            ]
            
            result = await api_hub.chat(messages)
            steps_completed.append("Generated structured plan using AI")
            
            # Parse the plan
            try:
                plan_data = json.loads(result["content"])
                plan = plan_data.get("plan", [])
                steps_completed.append(f"Created {len(plan)} step plan")
            except:
                plan = [result["content"]]
                steps_completed.append("Created single-step plan")
            
            task.result = json.dumps({
                "plan": plan,
                "raw_response": result["content"],
                "provider": result.get("provider", "unknown")
            })
            task.status = "completed"
            task.completed_at = datetime.utcnow().isoformat()
            
            return self.create_response(
                task=task,
                result=f"Plan created with {len(plan)} steps",
                steps=steps_completed,
                metadata={"plan": plan, "provider": result.get("provider")},
                execution_time=time.time() - start_time
            )
            
        except Exception as e:
            task.status = "failed"
            return AgentResponse(
                agent_name=self.name,
                task_id=task.id,
                status="failed",
                result=f"Planning failed: {str(e)}",
                steps_completed=steps_completed,
                execution_time=time.time() - start_time
            )
