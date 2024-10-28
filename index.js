require('dotenv').config();
const app = require('server');

const PORT = process.env.PORT || 3018;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
