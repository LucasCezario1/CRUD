const express = require('express');
const app = express();
app.use(express.json());

/**
 * A variável `projects` pode ser `const` porque um `array`
 * pode receber adições ou exclusões mesmo sendo uma constante.
 */
const projects = [];

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Projeto nao esta definido' });
  }

  return next();
}

/**
 * Middleware que dá log no número de requisições
 */
function logRequests(req, res, next) {
  console.count("Número de requisições"); // console de contagem count
  return next();
}

app.use(logRequests); //  fazendo a chama da requsiscao do middleware

/**
 *Busca de  todos os projetos
 */
app.get('/projects', (req, res) => {
  return res.json(projects);
});


/*BUSCA POR ID (GET)*/
app.get('/projects/:id', (req , res) =>{
  const { id } = req.params;
  return res.json(projects[id]);
});

/**
 * CRIACAO DE PROJETO POR ID E TITLE (POST)
 */
app.post('/projects', (req, res) => {
  const { id, title } = req.body; // JSON

  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project); // PUSH faz a criacao 
  return res.json(project);
});

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota (PUT).
 */
app.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota (delete).
 */
app.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1); // DELETA NO PRIMEIRO ID

  return res.send();
});

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id com title no tasks (POST); 
 */
app.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

app.listen(3000); // LOCALHOST server = 3000