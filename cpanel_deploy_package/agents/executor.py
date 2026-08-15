"""
SAM AI - Agent Executor
Executes tasks using appropriate agents.
"""

import asyncio
import time
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from agents.base import BaseAgent, AgentTask, AgentResponse
from agents.planner import PlannerAgent
from agents.researcher import ResearcherAgent
from agents.coder import CodingAgent
from agents.business import BusinessAgent
from agents.content import ContentAgent
from agents.council import CouncilAgent

class AgentExecutor:
    def __init__(self):
        self.agents: List[BaseAgent] = [
            CouncilAgent(),
            PlannerAgent(),
            ResearcherAgent(),
            CodingAgent(),
            BusinessAgent(),
            ContentAgent()
        ]
        self.execution_history: List[Dict[str, Any]] = []
    
    def get_available_agents(self) -> List[str]:
        return [agent.name for agent in self.agents]
    
    def select_agent(self, task_description: str) -> Optional[BaseAgent]:
        """Select the best agent for a given task"""
        best_agent = None
        best_score = 0
        
        for agent in self.agents:
            if agent.can_handle(task_description):
                score = len(task_description.split()) * 0.1 + 1
                if score > best_score:
                    best_score = score
                    best_agent = agent
        
        return best_agent
    
    async def execute(self, task_description: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute a task using the appropriate agent"""
        start_time = time.time()
        task_id = str(uuid.uuid4())
        
        context = context or {}
        
        # Select agent
        agent = self.select_agent(task_description)
        if not agent:
            return {
                "task_id": task_id,
                "status": "failed",
                "result": "No suitable agent found for this task",
                "agent_used": None,
                "execution_time": time.time() - start_time
            }
        
        # Create task
        task = AgentTask(
            id=task_id,
            description=task_description,
            context=context
        )
        
        # Execute
        response = await agent.execute(task, context)
        
        # Log execution
        self.execution_history.append({
            "task_id": task_id,
            "agent": agent.name,
            "status": response.status,
            "execution_time": response.execution_time,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return {
            "task_id": task_id,
            "status": response.status,
            "result": response.result,
            "agent_used": response.agent_name,
            "steps_completed": response.steps_completed,
            "execution_time": response.execution_time,
            "metadata": response.metadata
        }
    
    async def execute_plan(self, plan: List[str], context: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Execute a multi-step plan"""
        results = []
        for step in plan:
            result = await self.execute(step, context)
            results.append(result)
        return results

# Global executor instance
agent_executor = AgentExecutor()
