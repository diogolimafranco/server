# Especificação

O sistema receberá o cadastro de multiplos usuários
Cada usuário deverá informar no mínimo, seu nome, email e senha de acesso
Para maior segurança, as senhas serão criptografadas com tempero (salt), assim, senhas iguais terão hashs diferentes no banco de dados.
Cada usuário deverá estar vínculado a pelo menos uma empresa (company)
Cada empresa poderá ter multiplos usuários


# Esqueci minha senha / Alterar senha

O usuário pode solicitar a alteração de sua senha, caso necessário
Ao solicitar, ele deverá informar seu e-mail de acesso ao sistema
O sistema enviará um e-mail ao endereço de e-mail informado pelo usuário, que conterá o link para alteração da senha, juntamente com o token de validação.
Sendo válido o token, o usuário poderá alterar sua senha
O token para alteração de senha tem validade de um dia