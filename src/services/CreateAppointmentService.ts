import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

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
      throw Error('Appointment date already booked');
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
