import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { RecipiesService } from '../services/recipies.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-list-recipies',
    templateUrl: './list-recipies.component.html',
    styleUrls: ['./list-recipies.component.css']
})
export class ListRecipiesComponent implements OnInit {
    @Input() filterRecipes: Recipe[];
    showDetails: boolean = false;
    detailsButtonName: String = "SHOW DETAILS";
    recipies: Recipe[];

    constructor(public recipiesService: RecipiesService) {}

    ngOnInit() {
        this.getRecipiesFromService();

        
    }

    getRecipiesFromService() {
        this.recipiesService.getRecipies()
            .subscribe((res) => {
                if (this.filterRecipes && this.filterRecipes.length > 0) {
                    this.recipies = this.filterRecipes;
                } else {
                    this.recipies = res.recipies;
                    console.log(this.recipies);
                }

            }, (err) => {
                console.log(err);
            });
    }

    deleteRecipe(id: string) {
        this.recipiesService.deleteRecipe(id)
            .subscribe((res) => {
                this.getRecipiesFromService();
            })
        
    }

    toggleDetails() {
        this.showDetails = !this.showDetails;
        if (this.showDetails) {
            this.detailsButtonName = "HIDE DETAILS";
        } else {
            this.detailsButtonName = "SHOW DETAILS";
        }
    }

}