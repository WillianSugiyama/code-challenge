import express, { Request, Response } from 'express';
import { randomUUID } from 'crypto';

const app = express();
app.use(express.json())

type Tasks = {
  id: string;
  title: string;
  completed: boolean;
};

let tasks: Tasks[] = [];

app.get('/', (req: Request, res: Response) => {
  return res.json('Hello World!')
});

app.get('/tasks', (req: Request, res: Response) => {
  return res.json(tasks);
});

app.post('/tasks', (req: Request, res: Response) => {
  const { title, completed } = req.body;

  if(!title || !completed || typeof completed !== 'boolean') {
    return res.status(400).send('Title or completed cannot be null');
  }

  tasks.push({
    id: randomUUID(),
    ...req.body
  });

  return res.json(tasks);
});

app.put('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const { title, completed } = req.body;

  if(!title || !completed || typeof completed !== 'boolean') {
    return res.status(400).send('Title or completed cannot be null');
  }
  
  if(!id) {
    return res.status(400).send('Id cannot be null');
  }

  const findTask = tasks.find((task) => task.id === id);

  if(!findTask) {
    return res.status(404).send("Task not found.");
  }

  const tasksMapped = tasks.map((task) => {
    if(task.id === req.params.id) {
      return {
        id: task.id,
        ...req.body
      }
    }

    return task;
  })

  tasks = tasksMapped;

  res.json(tasks);
});

app.delete('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  if(!id) {
    return res.status(400).send('Id cannot be null');
  }

  const findTask = tasks.find((task) => task.id === id);

  if(!findTask) {
    return res.status(404).send("Task not found.");
  }

  const taskFilter = tasks.filter((task) => task.id !== req.params.id);

  tasks = taskFilter;

  res.json(tasks);
});

const port = parseInt(process.env.PORT || '3000');

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});