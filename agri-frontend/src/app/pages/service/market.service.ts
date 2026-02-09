// src/app/services/market.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  private apiUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
  private apiKey = '579b464db66ec23bdd000001f27574d1b76643b970d5fefe285fca51';
  private URL = 'https://agri-backend-jq99.onrender.com/'

  constructor(private http: HttpClient) { }

  getMarketRates(options?: {
    state?: string;
    commodity?: string;
    district?:string;
    limit?: number;
    offset?: number;
    date?: string;
  }): Observable<any> {
    let params = new HttpParams()
      .set('api-key', this.apiKey)
      .set('format', 'json')
      .set('limit', String(8000))
      .set('offset', String(options?.offset ?? 0));

    if (options?.state) params = params.set('filters[state]', options.state);
    if (options?.district) params = params.set('filters[district]', options.district);
    if (options?.commodity) params = params.set('filters[commodity]', options.commodity);

    return this.http.get<any>(this.apiUrl, { params });
  }

  // convenience endpoint to fetch time-series (multiple days) by market+commodity
  getMarketTimeSeries(market: string, commodity: string, limit = 30): Observable<any> {
    const params = new HttpParams()
      .set('api-key', this.apiKey)
      .set('format', 'json')
      .set('filters[market]', market)
      .set('filters[commodity]', commodity)
      .set('limit', String(limit))
      .set('sort', '-arrival_date'); // recent first
    return this.http.get<any>(this.apiUrl, { params });
  }

  getStates() {
    return this.http.get(this.URL + 'location/states')
  }
   getStatesprediction() {
    return this.http.get(this.URL + 'location/statesprediction')
  }
  loadDistricts(districts: string) {
    return this.http.get(this.URL + 'location/districts/' + districts)
  }
  getSoils() {
    return this.http.get(this.URL + 'details/soils')
  }
  loadCrops(soil: string) {
    return this.http.get(this.URL + 'details/soil/' + soil)
  }
  getProceMonthWise(payload: any) {
    return this.http.post(this.URL + 'predict/monthwise', payload)
  }
  getProceDateWise(payload: any) {
    return this.http.post(this.URL + 'predict/day', payload)
  }

  getAllCrops() {
    return this.http.get(this.URL + 'crops');
  }

  register(data: any) {
    return this.http.post(this.URL + "auth/register", data);
  }

  login(data: any) {
    return this.http.post(this.URL + "auth/login", data);
  }

  isLoggedIn() {
    return !!localStorage.getItem("token");
  }
  getAllCropsList() {
    return this.http.get(this.URL + 'crops/commodity');
  }

}
