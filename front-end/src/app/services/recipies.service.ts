import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';


@Injectable({
    providedIn: 'root'
})
export class RecipiesService {
    URL: string = 'http://localhost:3000/api';
    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });


    constructor(public http: HttpClient) {}

    getRecipies(): Observable<any> {
        return this.http.get<{message: string, recipies: Recipe[]}>(this.URL + '/recipies');
    }

    saveRecipe(recipe: Recipe, image: File): Observable<HttpResponse<any>> {
        const postData = new FormData();
        postData.append("title", recipe.title);
        postData.append("type", JSON.stringify(recipe.type));
        postData.append("ingredients", JSON.stringify(recipe.ingredients));
        postData.append("instructions", recipe.instructions);
        postData.append("image", image);

        console.log(JSON.stringify(recipe));
        return this.http.post<any>(this.URL + '/save-recipe', postData);
    }

    deleteRecipe(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(this.URL + '/delete-recipe/' + id)

    }

    getSpecificRecipies(type: string, ingredients: string[]): Observable<any> {
        console.log("getting specific...");
        return this.http.post<{message: string, recipies: Recipe[]}>(this.URL + '/specific-recipes', JSON.stringify({
            type: type,
            ingredients: ingredients
        }), { headers: this.headers });

    }

    getRecipeById(id: string): Observable<any> {
        return this.http.get<{message: string, recipeData: Recipe}>(this.URL + '/get-recipe/' + id);
    }

    updateRecipe(recipe: Recipe, image: File | string): Observable<any> {
        const putData = new FormData();
        putData.append("_id", recipe._id);
        putData.append("title", recipe.title);
        putData.append("type", JSON.stringify(recipe.type));
        putData.append("ingredients", JSON.stringify(recipe.ingredients));
        putData.append("instructions", recipe.instructions);
        putData.append("image", image);
        console.log(image);

        return this.http.put<{message: string}>(this.URL + '/update-recipe/' + recipe._id, putData);

    }

}