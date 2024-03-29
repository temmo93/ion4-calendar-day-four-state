import { Component, ChangeDetectorRef, Input, Output, EventEmitter, forwardRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarDay, CalendarMonth, CalendarOriginal, PickMode } from '../calendar.model'
import { defaults, pickModes, multi4 } from "../config";

export const MONTH_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MonthComponent),
  multi: true
};

@Component({
  selector: 'ion-calendar-month',
  providers: [MONTH_VALUE_ACCESSOR],
  template: `
    <div [class]="color">
      <ng-template [ngIf]="!_isRange" [ngIfElse]="rangeBox">
        <div class="days-box">
          <ng-template ngFor let-day [ngForOf]="month.days" [ngForTrackBy]="trackByTime">
            <div class="days">
              <ng-container *ngIf="day">
                <button type='button'
                        [class]="'days-btn ' + getMulti4Class(day) + day.cssClass"
                        [ngClass]="{today:day.isToday}"
                        (click)="onSelected(day)"
                        [class.marked]="day.marked"
                        [class.last-month-day]="day.isLastMonth"
                        [class.next-month-day]="day.isNextMonth"
                        [class.on-selected]="isSelected(day.time)"
                        [disabled]="day.disable">
                  <p>{{day.title}}</p>
                  <small *ngIf="day.subTitle">{{day?.subTitle}}</small>
                  <img *ngIf="getMulti4State(day) == 'lunch'" src="assets/imgs/sun.png" />
                  <img *ngIf="getMulti4State(day) == 'dinner'" src="assets/imgs/moon.png" />
                  <ng-container *ngIf="getMulti4State(day) == 'all'">
                      <img src="assets/imgs/sun.png" />
                      <img src="assets/imgs/moon.png" />
                  </ng-container>
                </button>
              </ng-container>
            </div>
          </ng-template>
        </div>
      </ng-template>

      <ng-template #rangeBox>
        <div class="days-box">
          <ng-template ngFor let-day [ngForOf]="month.days" [ngForTrackBy]="trackByTime">
            <div class="days"
                 [class.startSelection]="isStartSelection(day)"
                 [class.endSelection]="isEndSelection(day)"
                 [class.is-first-wrap]="day?.isFirst"
                 [class.is-last-wrap]="day?.isLast"
                 [class.between]="isBetween(day)">
              <ng-container *ngIf="day">
                <button type='button'
                        [class]="'days-btn ' + getMulti4Class(day) + day.cssClass"
                        [ngClass]="{today:day.isToday}"
                        (click)="onSelected(day)"
                        [class.marked]="day.marked"
                        [class.last-month-day]="day.isLastMonth"
                        [class.next-month-day]="day.isNextMonth"
                        [class.is-first]="day.isFirst"
                        [class.is-last]="day.isLast"
                        [class.on-selected]="isSelected(day.time)"
                        [disabled]="day.disable">
                  <p>{{day.title}}</p>
                  <small *ngIf="day.subTitle">{{day?.subTitle}}</small>>
                  <img *ngIf="getMulti4State(day) == 'lunch'" src="assets/imgs/sun.png" />
                  <img *ngIf="getMulti4State(day) == 'dinner'" src="assets/imgs/moon.png" />
                  <ng-container *ngIf="getMulti4State(day) == 'all'">
                      <img src="assets/imgs/sun.png" />
                      <img src="assets/imgs/moon.png" />
                  </ng-container>
                </button>
              </ng-container>

            </div>
          </ng-template>
        </div>
      </ng-template>
    </div>
  `
})
export class MonthComponent implements ControlValueAccessor, AfterViewInit {

  @Input() month: CalendarMonth;
  @Input() pickMode: PickMode;
  @Input() isSaveHistory: boolean;
  @Input() id: any;
  @Input() readonly = false;
  @Input() color: string = defaults.COLOR;

  @Output() onChange: EventEmitter<CalendarDay[]> = new EventEmitter();
  @Output() onChange4: EventEmitter<any> = new EventEmitter();
  @Output() onSelect: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onSelectStart: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onSelectEnd: EventEmitter<CalendarDay> = new EventEmitter();

  _date: Array<CalendarDay | null> = [null, null];
  _isInit = false;
  _onChanged: Function;
  _onTouched: Function;

  get _isRange(): boolean {
    return this.pickMode === pickModes.RANGE
  }

  constructor(public ref: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this._isInit = true;
  }

  writeValue(obj: any): void {
    if (Array.isArray(obj)) {
      this._date = obj;
    }
  }

  registerOnChange(fn: any): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  trackByTime(index: number, item: CalendarOriginal): number {
    return item ? item.time : index;
  }

  isEndSelection(day: CalendarDay): boolean {
    if (!day) return false;
    if (this.pickMode !== pickModes.RANGE || !this._isInit || this._date[1] === null) {
      return false;
    }

    return this._date[1].time === day.time;
  }

  isBetween(day: CalendarDay): boolean {
    if (!day) return false;

    if (this.pickMode !== pickModes.RANGE || !this._isInit) {
      return false;
    }

    if (this._date[0] === null || this._date[1] === null) {
      return false;
    }

    const start = this._date[0].time;
    const end = this._date[1].time;

    return day.time < end && day.time > start;
  }

  isStartSelection(day: CalendarDay): boolean {
    if (!day) return false;
    if (this.pickMode !== pickModes.RANGE || !this._isInit || this._date[0] === null) {
      return false;
    }

    return this._date[0].time === day.time && this._date[1] !== null;
  }

  isSelected(time: number): boolean {

    if (Array.isArray(this._date)) {

      if (this.pickMode !== pickModes.MULTI) {
        if (this.pickMode == pickModes.MULTI4) {
          return false;
        }

        if (this._date[0] !== null) {
          return time === this._date[0].time
        }

        if (this._date[1] !== null) {
          return time === this._date[1].time
        }
      } else {
        return this._date.findIndex(e => e !== null && e.time === time) !== -1;
      }

    } else {
      return false
    }
  }

  getMulti4Class(day: CalendarDay) {
    let index = this._date.findIndex(e => e !== null && e.time === day.time);
    if (index !== -1) {
      let dayFounded = this._date[index];
      return `multi4-${dayFounded.state} multi4-confirm-${dayFounded.confirm}`;
    } else {
      return '';
    }
  }

  getMulti4State(day: CalendarDay) {
    let index = this._date.findIndex(e => e !== null && e.time === day.time);
    if (index !== -1) {
      let dayFounded = this._date[index];
      return dayFounded.state;
    } else {
      return '';
    }
  }

  onSelected(item: CalendarDay): void {
    if (this.readonly) return;
    item.selected = true;
    this.onSelect.emit(item);
    if (this.pickMode === pickModes.SINGLE) {
      this._date[0] = item;
      this.onChange.emit(this._date);
      return;
    }

    if (this.pickMode === pickModes.RANGE) {
      if (this._date[0] === null) {
        this._date[0] = item;
        this.onSelectStart.emit(item);
      } else if (this._date[1] === null) {
        if (this._date[0].time < item.time) {
          this._date[1] = item;
          this.onSelectEnd.emit(item);
        } else {
          this._date[1] = this._date[0];
          this.onSelectEnd.emit(this._date[0]);
          this._date[0] = item;
          this.onSelectStart.emit(item);
        }
      } else {
        this._date[0] = item;
        this.onSelectStart.emit(item);
        this._date[1] = null;
      }
      this.onChange.emit(this._date);
      return;
    }

    if (this.pickMode === pickModes.MULTI) {

      const index = this._date.findIndex(e => e !== null && e.time === item.time);

      if (index === -1) {
        this._date.push(item);
      } else {
        this._date.splice(index, 1);
      }
      this.onChange.emit(this._date.filter(e => e !== null));
    }

    if( this.pickMode === pickModes.MULTI4 ) {
        const index = this._date.findIndex(e => e !== null && e.time === item.time);

        if (index === -1) {
          item.state = multi4.states.firstName;
          item.confirm = multi4.confirms.firstName;
          this._date.push(item);
        } else {
            let itemLast = this._date[index];

            if( itemLast.state == multi4.states.lastName ) {
              itemLast.state = null;
              this._date.splice(index, 1);
            } else {
              let currentStateName = itemLast.state;
              let nextStateIndex = multi4.states.index[currentStateName] < multi4.states.lastIndex ? multi4.states.index[currentStateName]+1 : multi4.states.lastIndex
              let nextStateName = multi4.states.cycle[nextStateIndex];
              itemLast.state = nextStateName;

              // update selected date value
              this._date[index] = itemLast;
            }
        }

        this.onChange4.emit(this._date.filter(e => e !== null));
    }
  }

}
