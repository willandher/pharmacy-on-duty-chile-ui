import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  apiUrl = environment.apiUrl;

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = -33.448890;
  lng = -70.669265;
  zoom = 12
  data = {
    'type': 'FeatureCollection',
    'features': []
  }

  constructor(
    private http: HttpClient
  ) {
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

  addPoints() {
    this.map.on('load', () => {
      this.map.addSource('points', {
        'type': 'geojson',
        'data': this.data
      })
      this.map.addLayer({
        'id': 'pharmacies',
        'type': 'circle',
        'source': 'points',
        'paint': {
          'circle-radius': 6,
          'circle-color': '#B42222'
        }
      });
      this.map.getCanvas().style.cursor = 'pointer';
    });
    // Change the cursor to a pointer when the mouse is over the places layer.
    this.map.on('mouseenter', 'pharmacies', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    this.map.on('mouseleave', 'pharmacies', () => {
      this.map.getCanvas().style.cursor = '';
    });

    this.map.on('click', 'pharmacies', (e) => {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(this.map);
    });
  }

  updatePoints(source) {
    var features = []
    this.map.flyTo({
      center: [
        source[0].localLng,
        source[0].localLat,
      ],
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
    console.log(source.length)
    source.map(item => {
      features = [...features,
      {
        'type': 'Feature',
        'properties': {
          'description': `<strong>${item.nombreLocal}</strong><p>${item.direccion}</p><p>Telefonos: ${item.telefono}</p>`,
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [item.localLng, item.localLat]
        }
      }
      ]
    })
    var data = {
      'type': 'FeatureCollection',
      'features': features
    }
    this.map.getSource('points').setData(data)
  }

  getPharmacies(id) {
    return this.http.get(`https://pharmacy-service-dev-ftsn5nwobq-uc.a.run.app/pharmacies/${id}`)
  }

  getAllComuna(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/comunas`);
  }

  getLocales(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/locales`);
  }

  getFarmaciaDeTurno(comuna,localNombre): Observable<any> {

    let params = new HttpParams();
    params = params.append('comuna', comuna);
    params = params.append('localNombre', localNombre);


    return this.http.get<any>(`${this.apiUrl}/pharmaciesOnDuty/`,{
      params:params
    });
  }

  getLocalComuna(data): Observable<any> {
    let params = new HttpParams();
    params = params.append('comuna', data.nameComuna);
    params = params.append('idRegion', data.idRegion);
    return this.http.get<any>(`${this.apiUrl}/localByComuna/`,{
      params:params
    });
  }


}
