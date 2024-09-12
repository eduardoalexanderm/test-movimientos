import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class HeroesService {

    private baseUrl: string = environments.baseUrl;
    constructor(private http_client: HttpClient) { }

    getHeroes(): Observable<Hero[]> {
        return this.http_client.get<Hero[]>(`${this.baseUrl}/heroes`);
    }

    getHeroById(id: string): Observable<Hero | undefined> {
        return this.http_client.get<Hero>(`${this.baseUrl}/heroes/${id}`).pipe(
            catchError(error => of(undefined))
        );
    }

    getSuggestions(term: string): Observable<Hero[]> {
        if (!term.trim()) {
            return of([]);
        }
        return this.http_client.get<Hero[]>(`${this.baseUrl}/heroes?q=${term}&_limit=6`);
    }

    addHero(hero: Hero): Observable<Hero> {
        return this.http_client.post<Hero>(`${this.baseUrl}/heroes`, hero);
    }

    updateHero(hero: Hero): Observable<Hero> {
        if (!hero.id) {
            throw new Error('The hero must have an id');
        }
        return this.http_client.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
    }

    deleteHEroById(id: string): Observable<any> {
        return this.http_client.delete(`${this.baseUrl}/heroes/${id}`)
            .pipe(
                map(resp => true),
                catchError(error => of(false)),
            );
    }
}