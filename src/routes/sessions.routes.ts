import { Router } from 'express';

const sessionsRouter = Router();

import AuthenticateUserService from '../services/AuthenticateUserService';

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;
    const authService = new AuthenticateUserService();

    const { user, token } = await authService.execute({ email, password });

    delete user.password;

    return response.json({ user, token });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default sessionsRouter;
