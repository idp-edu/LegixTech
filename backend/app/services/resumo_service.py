"""
Gera resumos em linguagem acessível para proposições legislativas.
Usa Gemini ou OpenAI se configurado, senão aplica glossário estático.
"""
import json
import os
import re
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

_LLM_PROVIDER = os.getenv("LLM_PROVIDER", "").lower()
_LLM_API_KEY = os.getenv("LLM_API_KEY", "")

_GLOSSARIO: dict | None = None


def _load_glossario() -> dict:
    global _GLOSSARIO
    if _GLOSSARIO is None:
        path = Path(__file__).parent.parent.parent / "data" / "glossario.json"
        _GLOSSARIO = json.loads(path.read_text(encoding="utf-8"))["termos"]
    return _GLOSSARIO


def _aplicar_glossario(texto: str) -> str:
    glossario = _load_glossario()
    resultado = texto
    for termo, definicao in glossario.items():
        pattern = re.compile(re.escape(termo), re.IGNORECASE)
        resultado = pattern.sub(f"{termo} ({definicao})", resultado, count=1)
    return resultado


def _montar_prompt(ementa: str, tipo: str, numero: int, ano: int) -> str:
    glossario = _load_glossario()
    glossario_texto = "\n".join(f"- {k}: {v}" for k, v in list(glossario.items())[:15])
    return f"""Você é um especialista em comunicação cidadã. Reescreva o resumo abaixo em linguagem simples e acessível para qualquer brasileiro, sem usar termos jurídicos complexos. O resumo deve ter no máximo 3 parágrafos curtos e explicar: O QUE o projeto propõe, POR QUE é importante para a população, e QUEM será afetado.

PROPOSIÇÃO: {tipo} {numero}/{ano}
EMENTA ORIGINAL: {ementa}

GLOSSÁRIO DE TERMOS (use como referência para simplificar):
{glossario_texto}

RESPONDA APENAS com o resumo em português, sem introduções ou explicações adicionais."""


async def _resumo_via_gemini(ementa: str, tipo: str, numero: int, ano: int) -> str:
    import google.generativeai as genai
    genai.configure(api_key=_LLM_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = _montar_prompt(ementa, tipo, numero, ano)
    response = await model.generate_content_async(prompt)
    return response.text.strip()


async def _resumo_via_openai(ementa: str, tipo: str, numero: int, ano: int) -> str:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=_LLM_API_KEY)
    prompt = _montar_prompt(ementa, tipo, numero, ano)
    completion = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400,
        temperature=0.4,
    )
    return completion.choices[0].message.content.strip()


async def gerar_resumo(ementa: str, tipo: str, numero: int, ano: int) -> dict:
    if not ementa:
        return {"resumo": "Ementa não disponível.", "fonte": "sem_ementa"}

    if _LLM_API_KEY and _LLM_PROVIDER == "gemini":
        try:
            resumo = await _resumo_via_gemini(ementa, tipo, numero, ano)
            return {"resumo": resumo, "fonte": "gemini"}
        except Exception:
            pass

    if _LLM_API_KEY and _LLM_PROVIDER == "openai":
        try:
            resumo = await _resumo_via_openai(ementa, tipo, numero, ano)
            return {"resumo": resumo, "fonte": "openai"}
        except Exception:
            pass

    resumo = _aplicar_glossario(ementa)
    return {"resumo": resumo, "fonte": "glossario"}


def explicar_termo(termo: str) -> dict:
    glossario = _load_glossario()
    termo_lower = termo.lower().strip()
    for k, v in glossario.items():
        if k.lower() == termo_lower:
            return {"termo": k, "definicao": v, "encontrado": True}
    return {"termo": termo, "definicao": None, "encontrado": False}