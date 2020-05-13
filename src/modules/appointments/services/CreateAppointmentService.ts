import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const dateStartOfHour = startOfHour(date);

    const findAppointmentSameDate = await appointmentsRepository.findByDate(
      dateStartOfHour,
    );

    if (findAppointmentSameDate) {
      throw new AppError('Appointment date already booked', 400);
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: dateStartOfHour,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
