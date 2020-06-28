import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecipiesService } from '../services/recipies.service';
import { Recipe } from '../models/recipe.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { EventEmitter } from 'protractor';
import { ChipInputService } from '../services/chip-input.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-choose-recipe',
    templateUrl: './choose-recipe.component.html',
    styleUrls: ['./choose-recipe.component.css']
})
export class ChooseRecipeComponent implements OnInit {
    private elementsSubscription: Subscription;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    types: string[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
    form: FormGroup;
    recipies: Recipe[] = [];
    chosenRecipe: string = "None";
    chosenRecipies: Recipe[] = [];

    visible = true;
    selectable = true;
    removable = true;
    ingredients: string[] = []; // For mat chips


    constructor(public recipiesService: RecipiesService, public chipInputService: ChipInputService, public router: Router) {
    }

    ngOnInit() {
        this.router.navigate(['/choose-recipe'])
        this.form = new FormGroup({
            'type': new FormControl(null, {validators: [Validators.required]})
        });

        this.elementsSubscription = this.chipInputService.getElementsByFormUpdateListener()
        .subscribe((elements: string[]) => {
            this.ingredients = elements;
        });

    }

    ngOnDestroy() {
        this.elementsSubscription.unsubscribe();
    }

    removeIngredient(ingredient: string) {
        this.ingredients.splice(this.ingredients.indexOf(ingredient), 1);
    }

    addIngredient(event: MatChipInputEvent) {
        const input = event.input;
        const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.ingredients.push((value.trim()).toLowerCase());
    }

    // Reset the input value
    if (input) {
        input.value = '';
    }

    }

    onElementsUpdated(elements: string[]) {
        this.ingredients = [...elements];
    }

    onChooseRecipe() {
        console.log(JSON.stringify(
            {
                type: this.form.value.type,
                ingredients: this.ingredients
            }
        ));
        this.recipiesService.getSpecificRecipies(this.form.value.type, this.ingredients)
            .subscribe((res) => {
                this.recipies = res.recipies;
                console.log(this.recipies);
            });
    }

    // Needs fixing
    ChooseRecipe() {
        console.log("chosen recipe");
    }

    resetForm() {
        this.form.reset();
        this.ingredients = [];
    }

}