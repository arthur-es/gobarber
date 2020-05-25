import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordRecoverEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService,
    );

    const { email } = request.body;

    await sendForgotPasswordEmail.execute({
      email,
    });

    return response.status(204).json();
  }
}
