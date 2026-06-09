import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface DashboardStats {
  id: string;
  title: string;
  value: number | string;
  change: number;
  icon: string;
  color: string;
  deleted?: boolean;
}

export interface DashboardItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  date: string;
  value: number;
  deleted?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private firestore: Firestore) {}

  // Signals (local state)
  stats$ = signal<DashboardStats[]>([
    {
      id: '1',
      title: 'Utenti Totali',
      value: 1250,
      change: 12.5,
      icon: '👥',
      color: 'bg-blue',
      deleted: false
    },
    {
      id: '2',
      title: 'Ricavi',
      value: '€45,000',
      change: 8.2,
      icon: '💰',
      color: 'bg-green',
      deleted: false
    },
    {
      id: '3',
      title: 'Ordini',
      value: 342,
      change: -2.4,
      icon: '📦',
      color: 'bg-orange',
      deleted: false
    },
    {
      id: '4',
      title: 'Conversioni',
      value: '3.24%',
      change: 5.1,
      icon: '📈',
      color: 'bg-purple',
      deleted: false
    },
  ]);

  items$ = signal<DashboardItem[]>([
    {
      id: '1',
      name: 'Progetto Alpha',
      status: 'active',
      date: '2026-05-20',
      value: 85,
      deleted: false,
    },
    {
      id: '2',
      name: 'Progetto Beta',
      status: 'pending',
      date: '2026-05-19',
      value: 65,
      deleted: false,
    },
    {
      id: '3',
      name: 'Progetto Gamma',
      status: 'active',
      date: '2026-05-18',
      value: 92,
      deleted: false,
    },
    {
      id: '4',
      name: 'Progetto Delta',
      status: 'inactive',
      date: '2026-05-17',
      value: 40,
      deleted: false,
    },
  ]);

   addItem(item: DashboardItem) {
    const itemsRef = collection(this.firestore, 'items');
    return addDoc(itemsRef, item);
  } 

   getItems(): Observable<DashboardItem[]> {
    const itemsRef = collection(this.firestore, 'items');
    return collectionData(itemsRef, { idField: 'id' }) as Observable<DashboardItem[]>;
  } 

    getStats(): Observable<DashboardStats[]> {
    const statsRef = collection(this.firestore, 'stats');
    return collectionData(statsRef, { idField: 'id' }) as Observable<DashboardStats[]>;
  } 
}
