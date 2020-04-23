import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: Request): Appointment {
    const dateStartOfHour = startOfHour(date);

    const findAppointmentSameDate = this.appointmentsRepository.findByDate(
      dateStartOfHour,
    );

    if (findAppointmentSameDate) {
      throw Error('Appointment date already booked');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: dateStartOfHour,
    });
    return appointment;
  }
}

export default CreateAppointmentService;
