def test_get_salvos_retorna_lista_vazia(client, token_for):
    headers, _ = token_for()
    resp = client.get("/salvos/", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["projetos"] == []
    assert resp.json()["total"] == 0


def test_get_salvos_tem_campo_headline(client, token_for, db):
    from app.models.project import Project
    from app.models.saved import SavedProject

    headers, user = token_for()
    projeto = Project(
        external_id="999999",
        titulo="PL 1/2024",
        headline="Título jornalístico de teste"
    )
    db.add(projeto)
    db.commit()
    db.refresh(projeto)
    db.add(SavedProject(user_id=user.id, project_id=projeto.id))
    db.commit()

    resp = client.get("/salvos/", headers=headers)
    assert resp.status_code == 200
    projetos = resp.json()["projetos"]
    assert len(projetos) == 1
    assert "headline" in projetos[0]
    assert projetos[0]["headline"] == "Título jornalístico de teste"


def test_salvar_duplicado_retorna_400(client, token_for, db):
    from app.models.project import Project
    from app.models.saved import SavedProject

    headers, user = token_for()
    projeto = Project(external_id="111111", titulo="PL 2/2024")
    db.add(projeto)
    db.commit()
    db.refresh(projeto)
    db.add(SavedProject(user_id=user.id, project_id=projeto.id))
    db.commit()

    resp = client.post("/salvos/111111", headers=headers)
    assert resp.status_code == 400
