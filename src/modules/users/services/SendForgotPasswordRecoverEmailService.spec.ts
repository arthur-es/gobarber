import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordRecoverEmailService from './SendForgotPasswordRecoverEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordRecoverEmailService;

describe('SendForgotPasswordRecoverEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordRecoverEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to send forgot password email', async () => {
    const sendMail = spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      email: 'arthurcastroes@gmail.com',
      name: 'Arthur',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'arthurcastroes@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send forgot password email to user that does not exist', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'non.existent@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate forgot password token', async () => {
    const generate = spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      email: 'token-email@gmail.com',
      name: 'Arthur',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'token-email@gmail.com',
    });

    expect(generate).toHaveBeenCalledWith(user.id);
  });
});
