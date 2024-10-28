require('module-alias/register');
const express = require('express');
const usuarioRoutes = require('@src/routes/usuarioRoutes');
const authRoutes = require('@src/routes/authRoutes');

const app = express();

app.use(express.json());

//rotas
app.use('/api', usuarioRoutes);
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);

console.log('Current working directory:', process.cwd());

const PORT = process.env.PORT || 3018;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
