def test_rota_protegida_sem_token_retorna_401(client):
    resp = client.get("/salvos/")
    assert resp.status_code == 401


def test_login_senha_errado(client, token_for):
    token_for(email="user@test.com", password="correta")
    resp = client.post(
        "/auth/login",
        json={"email": "user@test.com", "password": "errada"}   # ← json, não data
    )
    assert resp.status_code == 401


def test_login_senha_correto(client, token_for):
    token_for(email="user@test.com", password="senha123")
    resp = client.post(
        "/auth/login",
        json={"email": "user@test.com", "password": "senha123"}  # ← json, não data
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()
