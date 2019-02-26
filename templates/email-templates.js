const dotenv = require('dotenv');
dotenv.load();
exports.rememberPassword = async () => {
    return `
      <p>Olá <strong>[name]!</strong> Tudo bem?</p>
      <p>Este e-mail é referente a solicitação de alteração de senha em sua conta!</p>
      <p>Para alterar a sua senha, <a href="${process.env.APP_URL}/reset-password?q=[token]">clique aqui</a></p>
      <p>Caso tenha recebido este e-mail por engado, basta desconsiderar.</p>
      <p>Link válido por 24 horas!</p>
    `;
  }
  
exports.alteredPassword = async () => {
  return `
    <p>Olá <strong>[name]!</strong> Tudo bem?</p>
    <p>Sua senha foi alterada com sucesso e você já pode utiliza-la em seu próximo login.</p>
  `;
}