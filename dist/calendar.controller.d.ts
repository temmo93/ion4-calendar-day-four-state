import { ModalController } from '@ionic/angular';
import { ModalOptions, CalendarModalOptions } from './calendar.model';
import { CalendarService } from './services/calendar.service';
export declare class CalendarController {
    modalCtrl: ModalController;
    calSvc: CalendarService;
    constructor(modalCtrl: ModalController, calSvc: CalendarService);
    /**
     * @deprecated
     * @param calendarOptions
     * @param modalOptions
     * @returns
     */
    openCalendar(calendarOptions: CalendarModalOptions, modalOptions?: ModalOptions): Promise<{}>;
}
