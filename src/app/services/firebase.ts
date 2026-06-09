import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardItem } from './dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class Firebase {
  urlDatabaseItems: string = 'https://my-angular-app-7f2e6-default-rtdb.europe-west1.firebasedatabase.app/items';
  urlDatabaseStats: string = 'https://my-angular-app-7f2e6-default-rtdb.europe-west1.firebasedatabase.app/stats';
  constructor(private Http: HttpClient) { }

  insertItems(url: string, body: {}) {
    return this.Http.post(url, body);
  }

  addItem(url: string, item: any) {
    return this.Http.post(url, item);
  }

  getItems(url: string) {
    //return this.Http.get(url);
    return this.Http.get<Record<string, DashboardItem>>(url);
  }

  updateItem(url: string, id: string, item: any) {
    return this.Http.put(`${url}/${id}.json`, item);
  }

  deleteItem(url: string, id: string){
    return this.Http.patch(`${url}/${id}.json`, { deleted: true });
  }

  markAsDeleted(url: string, id: string) {
    return this.Http.patch(`${url}/${id}.json`, { deleted: true });
  }

  restoreItem(url: string, id: string) {
    return this.Http.patch(`${url}/${id}.json`, { deleted: false });
  }

  insertStats(url: string, body: {}) {
    return this.Http.post(url, body);
  }

  getStats(url: string) {
    return this.Http.get(url);
  }

  deleteStat(url: string, id: string){
    return this.Http.patch(`${url}/${id}.json`, { deleted: true });
  }

}


