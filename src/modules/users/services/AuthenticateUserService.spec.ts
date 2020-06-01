import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUserService.execute({
      name: 'Arthur Castro',
      email: 'arthurcastroes@gmail.com',
      password: '123456',
    });

    const response = await authenticateUserService.execute({
      email: 'arthurcastroes@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existent user', async () => {
    expect(
      authenticateUserService.execute({
        email: 'arthurnaoexiste@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate with the wrong password', async () => {
    await createUserService.execute({
      name: 'Arthur Castro',
      email: 'arthurcastroes@gmail.com',
      password: '123456',
    });

    expect(
      authenticateUserService.execute({
        email: 'arthurcastroes@gmail.com',
        password: '123456wrong',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
