"""
SAM AI - Base Agent Class
All agents inherit from this base class.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
import json

@dataclass
class AgentTask:
    """Represents a task for an agent"""
    id: str
    description: str
    context: Dict[str, Any] = field(default_factory=dict)
    steps: List[str] = field(default_factory=list)
    result: Optional[str] = None
    status: str = "pending"  # pending, in_progress, completed, failed
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    completed_at: Optional[str] = None

@dataclass
class AgentResponse:
    """Standard response from an agent"""
    agent_name: str
    task_id: str
    status: str
    result: str
    steps_completed: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    execution_time: float = 0.0

class BaseAgent(ABC):
    """Base class for all SAM AI agents"""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.tools: List[str] = []
    
    @abstractmethod
    async def execute(self, task: AgentTask, context: Dict[str, Any]) -> AgentResponse:
        """Execute the agent's main logic"""
        pass
    
    def can_handle(self, task_description: str) -> bool:
        """Determine if this agent can handle the given task"""
        return False
    
    def get_available_tools(self) -> List[str]:
        """Return list of available tools for this agent"""
        return self.tools
    
    def create_response(self, task: AgentTask, result: str, steps: List[str], metadata: Dict[str, Any] = None, execution_time: float = 0.0) -> AgentResponse:
        """Helper to create standardized response"""
        return AgentResponse(
            agent_name=self.name,
            task_id=task.id,
            status="completed",
            result=result,
            steps_completed=steps,
            metadata=metadata or {},
            execution_time=execution_time
        )
