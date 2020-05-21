import { ElementRef, ChangeDetectorRef, Renderer2, OnInit } from '@angular/core';
import { ModalController, NavParams, IonContent, IonInfiniteScroll } from '@ionic/angular';
import { CalendarDay, CalendarMonth, CalendarModalOptions } from '../calendar.model';
import { CalendarService } from '../services/calendar.service';
export declare class CalendarModal implements OnInit {
    private _renderer;
    _elementRef: ElementRef;
    params: NavParams;
    ref: ChangeDetectorRef;
    modalCtrl: ModalController;
    calSvc: CalendarService;
    content: IonContent;
    monthsEle: ElementRef;
    datesTemp: Array<CalendarDay>;
    calendarMonths: Array<CalendarMonth>;
    step: number;
    showYearPicker: boolean;
    year: number;
    years: Array<number>;
    infiniteScroll: IonInfiniteScroll;
    _s: boolean;
    _d: CalendarModalOptions;
    actualFirstTime: number;
    constructor(_renderer: Renderer2, _elementRef: ElementRef, params: NavParams, ref: ChangeDetectorRef, modalCtrl: ModalController, calSvc: CalendarService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    init(): void;
    initDefaultDate(): void;
    findCssClass(): void;
    onChange(data: any): void;
    onCancel(): void;
    done(): void;
    canDone(): boolean;
    nextMonth(event: any): void;
    backwardsMonth(): void;
    scrollToDate(date: Date): void;
    scrollToDefaultDate(): void;
    onScroll($event: any): void;
    findInitMonthNumber(date: Date): number;
    _getDayTime(date: any): number;
    _monthFormat(date: any): string;
    trackByIndex(index: number, moment: CalendarMonth): number;
}
