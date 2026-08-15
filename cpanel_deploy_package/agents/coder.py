"""
SAM AI - Coding Agent
Generates, reviews, and fixes code.
"""

import asyncio
import time
from datetime import datetime
from typing import Dict, Any, List
import json
from agents.base import BaseAgent, AgentTask, AgentResponse
from api_hub import api_hub

class CodingAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Coder",
            description="Generates, reviews, and fixes code in multiple languages"
        )
        self.tools = ["code_generation", "code_review", "debugging", "documentation"]
    
    def can_handle(self, task_description: str) -> bool:
        keywords = ["code", "program", "script", "function", "api", "debug", "fix", "implement", "build", "develop"]
        return any(keyword in task_description.lower() for keyword in keywords)
    
    async def execute(self, task: AgentTask, context: Dict[str, Any]) -> AgentResponse:
        start_time = time.time()
        steps_completed = []
        
        try:
            steps_completed.append("Analyzed coding requirements")
            
            language = context.get("language", "python")
            framework = context.get("framework", "")
            
            context_info = f"Language: {language}"
            if framework:
                context_info += f", Framework: {framework}"
            
            prompt = f"""You are an expert coding agent. Complete this coding task.

Task: {task.description}

Context: {context_info}

Additional Context: {json.dumps(context) if context else 'None'}

Provide:
1. Clean, well-documented code
2. Explanation of the approach
3. Any setup/installation instructions
4. Example usage if applicable"""

            messages = [
                {"role": "system", "content": f"You are an expert {language} developer. Write production-ready code with clear explanations."},
                {"role": "user", "content": prompt}
            ]
            
            result = await api_hub.chat(messages)
            steps_completed.append("Generated code solution")
            steps_completed.append("Added documentation")
            
            task.result = result["content"]
            task.status = "completed"
            task.completed_at = datetime.utcnow().isoformat()
            
            return self.create_response(
                task=task,
                result=result["content"],
                steps=steps_completed,
                metadata={"provider": result.get("provider"), "language": language},
                execution_time=time.time() - start_time
            )
            
        except Exception as e:
            task.status = "failed"
            return AgentResponse(
                agent_name=self.name,
                task_id=task.id,
                status="failed",
                result=f"Coding task failed: {str(e)}",
                steps_completed=steps_completed,
                execution_time=time.time() - start_time
            )
