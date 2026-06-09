"""
Gera resumos em linguagem acessível para proposições legislativas.
Usa Gemini se GEMINI_API_KEY estiver configurado, senão aplica glossário estático.
"""
import json
import re
from pathlib import Path

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
    return (
        f"Você é um especialista em comunicação cidadã. Reescreva o resumo abaixo em "
        f"linguagem simples e acessível para qualquer brasileiro, sem usar termos jurídicos "
        f"complexos. O resumo deve ter no máximo 3 parágrafos curtos e explicar: O QUE o "
        f"projeto propõe, POR QUE é importante para a população, e QUEM será afetado.\n\n"
        f"PROPOSIÇÃO: {tipo} {numero}/{ano}\n"
        f"EMENTA ORIGINAL: {ementa}\n\n"
        f"GLOSSÁRIO DE TERMOS (use como referência para simplificar):\n{glossario_texto}\n\n"
        f"RESPONDA APENAS com o resumo em português, sem introduções ou explicações adicionais."
    )


async def _resumo_via_gemini(ementa: str, tipo: str, numero: int, ano: int) -> str:
    from google import genai
    from google.genai import types
    from app.core.config import settings

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    prompt = _montar_prompt(ementa, tipo, numero, ano)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config=types.GenerateContentConfig(temperature=0.4),
    )
    return response.text.strip()


async def gerar_resumo(ementa: str, tipo: str, numero: int, ano: int) -> dict:
    if not ementa:
        return {"resumo": "Ementa não disponível.", "fonte": "sem_ementa"}

    from app.core.config import settings
    if settings.GEMINI_API_KEY:
        try:
            resumo = await _resumo_via_gemini(ementa, tipo, numero, ano)
            return {"resumo": resumo, "fonte": "gemini"}
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
