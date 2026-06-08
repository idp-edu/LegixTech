from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import get_current_user
from app.models.user import User
from app.services.chat_service import gerar_resposta

router = APIRouter(prefix="/chat", tags=["Chatbot IA"])


class ChatRequest(BaseModel):
    mensagem: str
    contexto_projeto: str | None = None


class ChatResponse(BaseModel):
    resposta: str


@router.post("/", response_model=ChatResponse)
def chat(body: ChatRequest, current_user: User = Depends(get_current_user)):
    try:
        return ChatResponse(resposta=gerar_resposta(body.mensagem, body.contexto_projeto))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar resposta: {str(e)}")