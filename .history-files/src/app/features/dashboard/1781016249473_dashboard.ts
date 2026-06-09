import {
  Component,
  OnInit,
  OnDestroy,
  computed,
  signal,
  effect,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, interval } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { DashboardItem, DashboardService, DashboardStats } from '../../services/dashboard.service';
import { Firebase } from '../../services/firebase';
import { StatCardComponent } from './components/stat-card/stat-card';
import { ItemsListComponent } from './components/item-list/item-list';
import { SettingsComponent } from './components/settings/setting';
import { NewProject } from './components/new-project/new-project';
import { ExportReport } from './components/export-report/export-report';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    StatCardComponent,
    ItemsListComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Input() stats: DashboardStats[] = [];
  private destroy$ = new Subject<void>();

  // ✅ FORM
  homeform: FormGroup;

  // ✅ STATE
  itemsDatabase = signal<DashboardItem[]>([]);
  statsDatabase = signal<DashboardStats[]>([]);

  // ✅ ICON PICKER
  icons: string[] = [
    '💰', '👥', '📦', '📈',
    '🚀', '📊', '🏆', '⚙️',
    '💡', '🛒', '📉', '🔥'
  ];

  // ✅ COMPUTED
  dashboardItems = computed(() => {
    const local = this.dashboardService.items$();
    return [...local, ...this.itemsDatabase()].filter(i => !i.deleted);
  });

  dashboardStats = computed(() => {
    const local = this.dashboardService.stats$();
    return [...local, ...this.statsDatabase()].filter(s => !s.deleted);
  });
  
  private hasLogged = false;

  private logEffect = effect(() => {
    if (!this.hasLogged) {
      console.log('📊 Stats:', this.dashboardStats());
      console.log('📦 Items:', this.dashboardItems());
      this.hasLogged = true;
    }
  });

  constructor(
    private dashboardService: DashboardService,
    private firebase: Firebase,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {

    // ✅ INIT FORM
    this.homeform = this.fb.group({
      title: ['', { validators: [Validators.required] }],
      value: [null, Validators.required],
      change: [0, Validators.required],
      icon: ['', Validators.required],
      color: ['bg-blue', Validators.required],
      deleted: [false]
    });

  }

  // ✅ INIT
  ngOnInit() {
    this.loadItemsFromDatabase();
    this.loadStatsFromDatabase();

    // ✅ polling items
    interval(5000)
      .pipe(
        switchMap(() =>
          this.firebase.getItems(this.firebase.urlDatabaseItems + '.json')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((data: any) => {
        if (!data) return;

        const mapped = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));

        this.itemsDatabase.set(mapped);
      });
  }

  // ✅ DESTROY
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ FORM SUBMIT → SALVA STAT
  onSubmit() {
  if (this.homeform.invalid) return;

  const newStat: DashboardStats = {
    id: this.homeform.value.id,
    title: this.homeform.value.title,
    value: this.homeform.value.value,
    change: this.homeform.value.change,
    icon: this.homeform.value.icon,
    color: this.homeform.value.color,
    deleted: this.homeform.value.deleted
  };

  this.firebase
  .insertStats(this.firebase.urlDatabaseStats + '.json', newStat)
  .subscribe({
    next: (response: any) => {

      const statWithId: DashboardStats = {
        ...newStat,
        id: response.name   // ✅ ID Firebase
      };

      // ✅ aggiorna UI
      this.statsDatabase.update(stats => [...stats, statWithId]);
      this.homeform.reset({ change: 0, value: null, color: 'bg-blue', icon: '', title: '', deleted: false });

      console.log('✅ Nuova stat aggiunta:', statWithId);
      console.log('📊 Lista aggiornata stats:', this.dashboardStats());

    },
    error: (err) => console.error('❌ Errore:', err)
  });
 }

  // ✅ CARICA STATS
  private loadStatsFromDatabase() {
  this.firebase.getStats(this.firebase.urlDatabaseStats + '.json')
    .subscribe((data: any) => {
      if (!data) {
        this.statsDatabase.set([]);
        return;
      }

      const mapped = Object.keys(data).map(key => ({
        ...(data[key] as DashboardStats),
        id: key
      }));

      this.statsDatabase.set(mapped);
      console.log('📁 Database Stats:', this.statsDatabase());
    });
 }

  // ✅ CARICA ITEMS
  private loadItemsFromDatabase() {
    this.firebase.getItems(this.firebase.urlDatabaseItems + '.json')
        .subscribe((data: any) => {
          if (!data) {
            this.itemsDatabase.set([]);
            return;
          }

          const mapped = Object.keys(data).map(key => ({
            ...(data[key] as DashboardItem),
            id: key
          }));

          this.itemsDatabase.set(mapped);
          console.log('📁 Database Items:', this.itemsDatabase());
        });
  }

  // ✅ ADD ITEM (dialog)
  onItemAdded(item: DashboardItem) {
      this.itemsDatabase.update(items => [...items, item]);

      console.log('✅ Item ricevuto dal dialog:', item);
     
      // ✅ questo mostra tutto (incluso deleted)
      const deletedItems = this.itemsDatabase().filter(i => i.deleted);
      const allItems = [...this.dashboardItems(), ...deletedItems];
      console.log('✅ Tutti gli Items aggiornati:', allItems);
  }

  // ✅ EXPORT TABLE (dialog)
  onTableExport(items: DashboardItem[]) {

  }

  // ✅ DELETE ITEM
  onDeleteItem(id: string) {

    // ✅ trova item PRIMA di modificarla
    const itemToDelete = this.itemsDatabase().find(i => i.id === id);

    if (!itemToDelete) {
      console.warn('⚠️ Item NON trovato:', id);
      return;
    }
    this.itemsDatabase.update(items =>
      items.map(i =>
        i.id === id ? { ...i, deleted: true } : i
      )
    );

    this.firebase.deleteItem(this.firebase.urlDatabaseItems, id)
      .subscribe({
        next: () => console.log('✅ Eliminato logicamente:', id),
        error: err => console.error('❌ Errore:', err)
      });

      // ✅ trova la versione aggiornata (deleted:true)
    const updated = this.itemsDatabase().find(i => i.id === id);
    console.log('🗑️ Item delete logico:', updated);

    // ✅ questo mostra tutto (senza deleted)
    console.log('🗑️ dashboardItems DOPO delete logico:', this.dashboardItems());

     // ✅ questo mostra tutto gli items sul DB (incluso deleted)
    console.log('🗑️ itemsDatabase DOPO delete logico:', this.itemsDatabase());

    // ✅ questo mostra tutto (incluso deleted)
    const deletedItems = this.itemsDatabase().filter(i => i.deleted);
    const allItems = [...this.dashboardItems(), ...deletedItems];
    console.log('🗑️ Tutti gli Items DOPO delete logico:', allItems);

  } 

  // ✅ OPEN DIALOG
  openDialog() {
    this.dialog.open(NewProject)
      .afterClosed()
      .subscribe(result => {
        if (result) this.onItemAdded(result);
      });
  }

  // ✅ OPEN DIALOG
  openDialogReport() {
    this.dialog.open(ExportReport, {
      width: '730px',         // ✅ più largo
      maxWidth: '85vw',       // ✅ responsive
      height: '85vh',         // ✅ più alto
      panelClass: 'custom-dialog'  // ✅ per styling
    })
    .afterClosed()
    .subscribe(result => {
      if (result) this.onTableExport(result);
    });
  }

    // ✅ OPEN DIALOG
  openDialogSettings() {
    this.dialog.open(SettingsComponent, {
      width: '400px',
      panelClass: 'custom-dialog'
    });
  }

  // ✅ UI HELPERS
  get changeClass() {
    const change = this.homeform.get('change')?.value || 0;
    return change >= 0 ? 'text-green' : 'text-red';
  }

  get changeIcon() {
    const change = this.homeform.get('change')?.value || 0;
    return change >= 0 ? '📈' : '📉';
  }

  selectIcon(icon: string) {
    const ic = this.homeform.patchValue({ icon });
    this.homeform.value.icon = ic;
  }

  // ✅ DELETE STAT
  onDeleteStat(id: string) {

  // ✅ trova stat PRIMA di modificarla
    const statToDelete = this.dashboardStats().find(s => s.id === id);

    if (!statToDelete) {
      console.warn('⚠️ Stat NON trovata:', id);
      return;
    }

    // ✅ aggiorna (soft delete)
    this.statsDatabase.update(stats =>
      stats.map(s =>
        s.id === id ? { ...s, deleted: true } : s
      )
    );

    this.firebase.deleteStat(this.firebase.urlDatabaseStats, id)
    .subscribe({
      next: () => console.log('✅ Eliminato logicamente:', id),
      error: err => console.error('❌ Errore:', err)
    });
    
      // ✅ trova la versione aggiornata (deleted:true)
    const updated = this.statsDatabase().find(s => s.id === id);
    console.log('🗑️ Stat delete logico:', updated);

    // ✅ questo mostra tutto (senza deleted)
    console.log('🗑️ dashboardStats DOPO delete logico:', this.dashboardStats());

     // ✅ questo mostra tutto le stats sul DB (incluso deleted)
    console.log('🗑️ statsDatabase DOPO delete logico:', this.statsDatabase());

    // ✅ questo mostra tutto (incluso deleted)
    const deletedStats = this.statsDatabase().filter(s => s.deleted);
    const allStats = [...this.dashboardStats(), ...deletedStats];
    console.log('🗑️ Tutti le Stats DOPO delete logico:', allStats);

 }

  trackById(index: number, item: any) {
   return item.id;
  }

}
