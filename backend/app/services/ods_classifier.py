"""
Classifica proposições nos 17 Objetivos de Desenvolvimento Sustentável (ODS).
Estratégia: score por palavras-chave na ementa + correspondência de temas da Câmara.
"""
import json
import re
import unicodedata
from pathlib import Path

_ODS_DATA: list[dict] | None = None


def _load_ods() -> list[dict]:
    global _ODS_DATA
    if _ODS_DATA is None:
        path = Path(__file__).parent.parent.parent / "data" / "ods.json"
        _ODS_DATA = json.loads(path.read_text(encoding="utf-8"))
    return _ODS_DATA


def _normalize(text: str) -> str:
    text = text.lower()
    return "".join(
        c for c in unicodedata.normalize("NFD", text)
        if unicodedata.category(c) != "Mn"
    )


def _confidence(score: int) -> tuple[str, int]:
    pct = max(20, min(95, 20 + score * 12))
    if score >= 6:
        return "alta", pct
    if score >= 3:
        return "media", pct
    return "baixa", pct


def classificar(ementa: str, temas_camara: list[str]) -> list[dict]:
    ods_list = _load_ods()
    ementa_norm = _normalize(ementa or "")
    temas_norm = [_normalize(t) for t in (temas_camara or [])]

    scores: list[tuple[int, dict]] = []

    for ods in ods_list:
        score = 0

        for kw in ods["palavras_chave"]:
            kw_norm = _normalize(kw)
            if re.search(r"\b" + re.escape(kw_norm) + r"\b", ementa_norm):
                score += 2 if len(kw.split()) > 1 else 1

        for tema_camara in ods["temas_camara"]:
            tema_norm = _normalize(tema_camara)
            if any(tema_norm in t or t in tema_norm for t in temas_norm):
                score += 3

        if score > 0:
            scores.append((score, ods))

    scores.sort(key=lambda x: x[0], reverse=True)

    return [
        {
            "numero": ods["numero"],
            "nome": ods["nome"],
            "cor": ods["cor"],
            "impacto_direto": ods.get("impacto_direto", []),
            "score": score,
            "confianca": _confidence(score)[0],
            "confianca_percentual": _confidence(score)[1],
        }
        for score, ods in scores[:5]
    ]


def buscar_por_ods(numero: int) -> dict | None:
    ods_list = _load_ods()
    for ods in ods_list:
        if ods["numero"] == numero:
            return ods
    return None