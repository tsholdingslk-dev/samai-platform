"""
SAM AI - Project Brain (RAG Engine)
Retrieval-Augmented Generation for project-specific knowledge.
"""

import os
import json
import math
from typing import List, Dict, Optional, Tuple
from dotenv import load_dotenv

load_dotenv()

class Document:
    def __init__(self, text: str, metadata: Dict, doc_id: str):
        self.text = text
        self.metadata = metadata
        self.doc_id = doc_id
        self.embedding: Optional[List[float]] = None

class ProjectBrain:
    def __init__(self, project_id: str):
        self.project_id = project_id
        self.documents: List[Document] = []
        self.embeddings_cache: Dict[str, List[float]] = {}
        
    def add_document(self, text: str, metadata: Dict, doc_id: str):
        """Add a document to the knowledge base"""
        doc = Document(text, metadata, doc_id)
        self.documents.append(doc)
        return doc
    
    async def index_documents(self):
        """Generate embeddings for all documents"""
        from api_hub import api_hub
        
        for doc in self.documents:
            if doc.text and not doc.embedding:
                try:
                    embedding = await api_hub.embed(doc.text)
                    doc.embedding = embedding
                    self.embeddings_cache[doc.doc_id] = embedding
                except Exception as e:
                    print(f"Failed to embed document {doc.doc_id}: {e}")
    
    def _cosine_similarity(self, a: List[float], b: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        if not a or not b or len(a) != len(b):
            return 0.0
        
        dot_product = sum(x * y for x, y in zip(a, b))
        magnitude_a = math.sqrt(sum(x * x for x in a))
        magnitude_b = math.sqrt(sum(x * x for x in b))
        
        if magnitude_a == 0 or magnitude_b == 0:
            return 0.0
        
        return dot_product / (magnitude_a * magnitude_b)
    
    async def retrieve(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Retrieve the most relevant documents for a query.
        Returns a list of {text, metadata, score} dicts.
        """
        from api_hub import api_hub
        
        if not self.documents:
            return []
        
        # Try embedding-based retrieval first
        query_embedding = None
        try:
            query_embedding = await api_hub.embed(query)
        except Exception as e:
            print(f"Embedding not available, falling back to keyword search: {e}")
        
        scored_docs = []
        
        if query_embedding:
            # Cosine similarity retrieval
            for doc in self.documents:
                if doc.embedding:
                    score = self._cosine_similarity(query_embedding, doc.embedding)
                    scored_docs.append({
                        "text": doc.text,
                        "metadata": doc.metadata,
                        "score": score,
                        "doc_id": doc.doc_id
                    })
        else:
            # Fallback: keyword-based retrieval
            query_words = set(query.lower().split())
            for doc in self.documents:
                doc_words = set(doc.text.lower().split())
                overlap = len(query_words.intersection(doc_words))
                score = overlap / max(len(query_words), 1)
                scored_docs.append({
                    "text": doc.text,
                    "metadata": doc.metadata,
                    "score": score,
                    "doc_id": doc.doc_id
                })
        
        # Sort by score and return top_k
        scored_docs.sort(key=lambda x: x["score"], reverse=True)
        return scored_docs[:top_k]
    
    def get_context_for_prompt(self, query: str, top_k: int = 3) -> str:
        """
        Get relevant context as a formatted string for the AI prompt.
        This is a synchronous wrapper for retrieve().
        """
        import asyncio
        loop = asyncio.get_event_loop()
        if loop.is_running():
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                results = pool.submit(lambda: asyncio.run(self.retrieve(query, top_k))).result()
        else:
            results = loop.run_until_complete(self.retrieve(query, top_k))
        
        if not results:
            return ""
        
        context_parts = []
        for i, doc in enumerate(results, 1):
            context_parts.append(f"[Document {i} (Score: {doc['score']:.2f})]\n{doc['text']}\n")
        
        return "\n".join(context_parts)
    
    def to_dict(self) -> Dict:
        """Serialize brain state"""
        return {
            "project_id": self.project_id,
            "documents": [
                {
                    "doc_id": doc.doc_id,
                    "text": doc.text,
                    "metadata": doc.metadata,
                    "embedding": doc.embedding
                }
                for doc in self.documents
            ]
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> "ProjectBrain":
        """Deserialize brain state"""
        brain = cls(data["project_id"])
        for doc_data in data.get("documents", []):
            doc = Document(
                text=doc_data["text"],
                metadata=doc_data["metadata"],
                doc_id=doc_data["doc_id"]
            )
            doc.embedding = doc_data.get("embedding")
            brain.documents.append(doc)
            if doc.embedding:
                brain.embeddings_cache[doc.doc_id] = doc.embedding
        return brain


# In-memory store for project brains
# In production, this should be persisted to database or Redis
_project_brains: Dict[str, ProjectBrain] = {}

def get_project_brain(project_id: str) -> ProjectBrain:
    """Get or create a Project Brain for a project"""
    if project_id not in _project_brains:
        _project_brains[project_id] = ProjectBrain(project_id)
    return _project_brains[project_id]

def remove_project_brain(project_id: str):
    """Remove a Project Brain (e.g., when project is deleted)"""
    if project_id in _project_brains:
        del _project_brains[project_id]
