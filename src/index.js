import express from 'express';
import { PORT } from './config.js';
import userRoutes from './routes/users.routes.js';
import answerchoices from './routes/answer_choices.routes.js';
import answers from './routes/answers.routes.js';
import forms from './routes/forms.routes.js';
import options from './routes/options.routes.js';
import questions from './routes/questions.routes.js';
import responses from './routes/responses.routes.js';
import morgan from 'morgan';

const app = express()

app.use(morgan('dev'));
app.use(express.json());
app.use(userRoutes);
app.use(answerchoices);
app.use(answers);
app.use(forms);
app.use(options);
app.use(questions);
app.use(responses);
app.listen(PORT);
console.log('Server on port', PORT);
