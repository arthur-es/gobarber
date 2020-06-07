import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Arthur',
      email: 'arthur@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Arthur Castro',
      email: 'arthurcastro@gmail.com',
    });

    expect(updatedUser.name).toBe('Arthur Castro');
    expect(updatedUser.email).toBe('arthurcastro@gmail.com');
  });

  it('should not be able to update the profile if user does not exists', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        name: 'Arthur Castro',
        email: 'arthurcastro@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the email to a email that is already taken', async () => {
    await fakeUsersRepository.create({
      name: 'Arthur Castro',
      email: 'arthurcastro@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Arthur',
      email: 'arthur@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Arthur',
        email: 'arthurcastro@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Arthur',
      email: 'arthur@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Arthur Castro',
      email: 'arthurcastro@gmail.com',
      old_password: '123456',
      password: '654321',
    });

    expect(updatedUser.password).toBe('654321');
  });

  it('should not be able to update the password without informing old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Arthur',
      email: 'arthur@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Arthur Castro',
        email: 'arthurcastro@gmail.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Arthur',
      email: 'arthur@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Arthur Castro',
        email: 'arthurcastro@gmail.com',
        old_password: 'wrong-old-password',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
