import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ComunaDto } from 'src/app/model/comuna-dto';
import { MapboxService } from 'src/app/_services/mapbox.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  apiUrl = environment.apiUrl;
  constructor(private mapboxService: MapboxService) { }

  ngOnInit(): void {
    this.mapboxService.buildMap();
      this.mapboxService.getFarmaciaDeTurno('Santiago','cruz verde').subscribe(farmaciasInfo=>{
        var  objetGeoJson = []; 
        farmaciasInfo.map((farmacia)=>{
            console.log(farmacia)
            var latitud = +farmacia.localLat;
            var longitud = +farmacia.localLng;
            objetGeoJson = [...objetGeoJson,
              {
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': [longitud, latitud]
                },
                'properties': {
                  'nombreLocal':farmacia.nombreLocal,
                  'direccion':farmacia.direccion,
                  'telefono': farmacia.telefono
                }
              }
            ];
          }
        )
        this.mapboxService.addPoint(objetGeoJson);

      })



  }

  




}
