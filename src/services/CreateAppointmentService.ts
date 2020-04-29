import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const dateStartOfHour = startOfHour(date);

    const findAppointmentSameDate = await appointmentsRepository.findByDate(
      dateStartOfHour,
    );

    if (findAppointmentSameDate) {
      throw Error('Appointment date already booked');
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: dateStartOfHour,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
