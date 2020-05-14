import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';

import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    const dateStartOfHour = startOfHour(date);

    const findAppointmentSameDate = await this.appointmentsRepository.findByDate(
      dateStartOfHour,
    );

    if (findAppointmentSameDate) {
      throw new AppError('Appointment date already booked', 400);
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: dateStartOfHour,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
