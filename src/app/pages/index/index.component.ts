import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { MapboxService } from 'src/app/_services/mapbox.service';
import {map, startWith} from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
export interface Comuna {
  idRegion: number;
  nameComuna: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  searchForm = new FormControl();
  localForm = new FormControl();
  options: Comuna[];
  optionComuna: string;
  optionLocal: string;
  filteredOptions: Observable<Comuna[]>;

  optionsLocal: string[];
  filteredOptionsLocal: Observable<string[]>;


  constructor( public dialog: MatDialog, private mapboxService: MapboxService) {

  }

  ngOnInit(): void {
    this.getAllComunas();
  }

  displayFn(comuna: Comuna): string {
    return comuna && comuna.nameComuna ? comuna.nameComuna : '';

  }

  displayFnLocal(local: string): string {
    return local && local ? local : '';

  }

   filterByName(name: string): Comuna[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.nameComuna.toLowerCase().indexOf(filterValue) === 0);
  }

  filterLocal(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.optionsLocal.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }




  getAllComunas(){
    this.mapboxService.getAllComuna().subscribe(data =>{
      this.options = data.filter((comuna) => comuna.nameComuna !== 'Elija Comuna');
      this.mapboxService.buildMap();
      this.mapboxService.addPoints();
      this.filteredOptions = this.searchForm.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nameComuna),
        map(name => name ? this.filterByName(name) : this.options.slice())
        //map(nameComuna =>  this.filterByName(nameComuna))
      )
    })
  }

  getLocalesPorComunas(data) : void {
    this.mapboxService.getLocalComuna(data).subscribe(data =>{
      this.optionsLocal = data;
      this.filteredOptionsLocal = this.localForm.valueChanges.pipe(
        startWith(''),
        map(value => this.filterLocal(value))
      );
    },data=>{
      console.log("se fue por el error ",data);
    })
  }



  onSelectOptionLocal(optionLocal){
    this.optionLocal = optionLocal;
    console.log("buscar presionado",this.optionComuna,this.optionLocal)
    this.mapboxService.getFarmaciaDeTurno(this.optionComuna,this.optionLocal).subscribe((data)=>{
      this.mapboxService.updatePoints(data);
    },(data)=>{
      this.openDialog();
      console.log("Error",data);
    })
  }

  onSelectOptionComuna(optionComuna){
    this.localForm.setValue('');
    this.optionComuna = optionComuna.nameComuna;
    this.optionsLocal = [];
    this.getLocalesPorComunas(optionComuna);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }



}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-simple.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {}) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
