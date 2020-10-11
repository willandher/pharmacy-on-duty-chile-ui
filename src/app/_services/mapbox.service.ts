import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ComunaDto } from '../model/comuna-dto';


@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  map: mapboxgl.Map;
	style = 'mapbox://styles/mapbox/streets-v11';
	lat = -33.4372;
	lng = -70.6506;
  zoom = 12;

  source = {
    'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [-121.415061, 40.506229]
          }
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [-121.505184, 40.488084]
          }
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [-121.354465, 40.488737]
          }
        }
      ]
  }
  
  apiUrl = environment.apiUrl;

  constructor(private http : HttpClient)  { 
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }


  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
    })
   this.map.addControl(new mapboxgl.NavigationControl());

  }

  addPoint(json){
    this.map.on('load',()=>{

      
      this.map.addSource('farmacias',{
        'type':'geojson',
        'data':{'type': 'FeatureCollection',
        'features':json}  
       });
       this.map.addLayer({
         "id":"maine",
         "type":"circle",
         "source":"farmacias",
         "layout":{   
         },
         'paint': {
          'circle-radius': 6,
          'circle-color': '#B42222'
          }
       });
    })
  }
/**
 * se extrae todas las colonias
 */
  getAllComuna(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/comunas`);
  }

  /**
   * 
   * @param data objeto compuesto por el id de la region y la colonia que nos sirven para buscar los locales
   */
  getLocalComuna(data): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/localByComuna/`,data);
  }

/**
 * 
 * @param comuna nombre de comuna
 * @param localNombre local
 */
  getFarmaciaDeTurno(comuna,localNombre): Observable<any> {

    let params = new HttpParams();
    params = params.append('comuna', comuna);
    params = params.append('localNombre', localNombre);

    return this.http.get<any>(`${this.apiUrl}/pharmaciesOnDuty/`,{
      params:params
    });
  }
  

  putno1 () {
    map.on('load', function () {
      map.addSource('maine', {
      'type': 'geojson',
      'data': {
      'type': 'Feature',
      'geometry': {
      'type': 'Polygon',
      'coordinates': [
      [
      [-67.13734351262877, 45.137451890638886],
      [-66.96466, 44.8097],
      [-68.03252, 44.3252],
      [-69.06, 43.98],
      [-70.11617, 43.68405],
      [-70.64573401557249, 43.090083319667144],
      [-70.75102474636725, 43.08003225358635],
      [-70.79761105007827, 43.21973948828747],
      [-70.98176001655037, 43.36789581966826],
      [-70.94416541205806, 43.46633942318431],
      [-71.08482, 45.3052400000002],
      [-70.6600225491012, 45.46022288673396],
      [-70.30495378282376, 45.914794623389355],
      [-70.00014034695016, 46.69317088478567],
      [-69.23708614772835, 47.44777598732787],
      [-68.90478084987546, 47.184794623394396],
      [-68.23430497910454, 47.35462921812177],
      [-67.79035274928509, 47.066248887716995],
      [-67.79141211614706, 45.702585354182816],
      [-67.13734351262877, 45.137451890638886]
      ]
      ]
      }
      }
      });
      map.addLayer({
      'id': 'maine',
      'type': 'fill',
      'source': 'maine',
      'layout': {},
      'paint': {
      'fill-color': '#088',
      'fill-opacity': 0.8
      }
      });
      });
  }

}



