"""
SAM AI - Agent Router
Routes tasks to appropriate agents and manages multi-agent workflows.
"""

import asyncio
import time
import uuid
from typing import Dict, Any, List, Optional
from agents.base import AgentTask, AgentResponse
from agents.executor import agent_executor

class AgentRouter:
    def __init__(self):
        self.active_tasks: Dict[str, AgentTask] = {}
        self.task_history: List[Dict[str, Any]] = []
    
    async def route_task(self, task_description: str, context: Dict[str, Any] = None, use_planning: bool = True) -> Dict[str, Any]:
        """Route a task to the appropriate agent(s)"""
        task_id = str(uuid.uuid4())
        
        if use_planning:
            # First, create a plan
            plan_result = await agent_executor.execute(
                f"Create a step-by-step plan for: {task_description}",
                context
            )
            
            if plan_result["status"] == "completed":
                try:
                    import json
                    plan_data = json.loads(plan_result["result"])
                    plan = plan_data.get("plan", [])
                    
                    if plan:
                        # Execute the plan
                        execution_results = await agent_executor.execute_plan(plan, context)
                        
                        return {
                            "task_id": task_id,
                            "status": "completed",
                            "mode": "planned",
                            "plan": plan,
                            "results": execution_results,
                            "final_result": execution_results[-1]["result"] if execution_results else "No results",
                            "agent_used": execution_results[-1]["agent_used"] if execution_results else None
                        }
                except:
                    pass
        
        # Direct execution without planning
        result = await agent_executor.execute(task_description, context)
        result["mode"] = "direct"
        return result
    
    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get status of a specific task"""
        for task in self.task_history:
            if task.get("task_id") == task_id:
                return task
        return None
    
    def get_available_agents(self) -> List[str]:
        """Get list of available agents"""
        return agent_executor.get_available_agents()

# Global router instance
agent_router = AgentRouter()
