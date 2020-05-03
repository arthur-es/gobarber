import 'reflect-metadata';
import express from 'express';
import routes from './routes/routes';
import uploadConfig from './config/upload';
import './database';

const PORT = 3333;
const app = express();

app.use('/files', express.static(uploadConfig.directory));
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`🚀Server running on PORT ${PORT}....`);
});
