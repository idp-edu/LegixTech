def test_listar_seguindo_vazio(client, token_for):
    headers, _ = token_for()
    resp = client.get("/seguindo/", headers=headers)
    assert resp.status_code == 200
    assert resp.json() == []


def test_listar_seguindo_com_joinedload(client, token_for, db):
    from app.models.politician import Politician
    from app.models.followed_politician import FollowedPolitician

    headers, user = token_for()

    for i in range(5):
        p = Politician(
            external_id=str(100 + i),
            name=f"Deputado {i}",
            party="PT",
            state="DF",
            house="Câmara",
            photo_url=""
        )
        db.add(p)
        db.commit()
        db.refresh(p)
        db.add(FollowedPolitician(user_id=user.id, politician_id=p.id))
    db.commit()

    resp = client.get("/seguindo/", headers=headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 5
    # Garante que os campos do político vieram junto
    assert resp.json()[0]["politician_name"] is not None
