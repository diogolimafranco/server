# Autenticação

Para fazer a autenticação no sistema, o usuário deve informar seu e-mail de acesso e sua senha.
O sistema validará as informações envidas pelo usuário e retornará um token JWT.
Para as demais requisições a api, será necessário o uso do token de acesso
O token tem prazo de validade de 3 dias.
Após este período o token é considerado inválido e o usuário deverá fazer um novo login

# Esqueci minha senha

O usuário pode solicitar a alteração de sua senha, caso necessário
Ao solicitar, ele deverá informar seu e-mail de acesso ao sistema
O sistema enviará um e-mail ao endereço de e-mail informado pelo usuário, que conterá o link para alteração da senha, juntamente com o token de validação.
Sendo válido o token, o usuário poderá alterar sua senha
O token para alteração de senha tem validade de um dia