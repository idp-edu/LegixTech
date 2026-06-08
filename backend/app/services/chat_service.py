from google import genai
from google.genai import types
from app.core.config import settings

_client = None

def get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


def gerar_resposta(mensagem: str, contexto_projeto: str | None = None) -> str:
    prompt_sistema = (
        "Você é um assistente especializado em legislação e política brasileira. "
        "Responda de forma clara, objetiva e em português. "
        "Quando relevante, cite artigos, leis ou impactos práticos para o cidadão."
    )
    if contexto_projeto:
        prompt = f"{prompt_sistema}\n\nContexto:\n{contexto_projeto}\n\nPergunta: {mensagem}"
    else:
        prompt = f"{prompt_sistema}\n\nPergunta: {mensagem}"

    response = get_client().models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.7,
        ),
    )
    return response.text