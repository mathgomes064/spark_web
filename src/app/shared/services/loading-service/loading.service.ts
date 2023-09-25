import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingShow = new BehaviorSubject<any>(false); // {1}

  get isLoadingShow() {
    return this.loadingShow.asObservable(); // {2}
  }

  present() {
    this.loadingShow.next(true);
  }

  dismiss() {
    this.loadingShow.next(false);
  }

  constructor() { }
}
