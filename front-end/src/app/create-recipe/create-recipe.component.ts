import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { RecipiesService} from '../services/recipies.service'
import { ChipInputComponent } from '../common/chip-input.component';
import { ChipInputService } from '../services/chip-input.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ReadVarExpr } from '@angular/compiler';

@Component({
    selector: 'app-create-recipe',
    templateUrl: './create-recipe.component.html',
    styleUrls: ['./create-recipe.component.css']
})
export class CreateRecipeComponent implements OnInit {
    
    types = ['Breakfast', "Lunch", "Dinner", "Snack"];
    editMode: boolean = false;
    recipeId: string = null;
    form: FormGroup;
    recipe: Recipe;
    ingredients: string[];
    imagePreview: string;
    private elementsSubscription: Subscription;
    constructor(public recipiesService: RecipiesService,
                public chipInputService: ChipInputService,
                public route: ActivatedRoute,
                public router: Router) {
    }

    ngOnInit() {
        // Initialize FormGroup.
        // Note: type is a formArray, which will be dynamically added when checkboxes
        //       are checked.
        this.form = new FormGroup({
            'title': new FormControl(null, { validators: [Validators.required]}, ),
            'type': new FormArray([]), 
            'instructions': new FormControl(null, { validators: [Validators.required]}),
            'ingredients': new FormControl(null, {validators: [Validators.required]}),
            'image': new FormControl(null, {validators: [Validators.required]})
        });

        this.addCheckBoxes();
        console.log(this.form.get("type"));
        this.elementsSubscription = this.chipInputService.getElementsByFormUpdateListener()
            .subscribe((elements: string[]) => {
                this.ingredients = elements;
                this.form.patchValue({ingredients: this.ingredients});
                this.form.get('ingredients').updateValueAndValidity();
            });

        this.route.paramMap.subscribe((paramMap) => {
            if (paramMap.has('id')) {
                this.editMode = true;
                this.recipeId = paramMap.get('id');
                console.log(this.recipeId);

                this.recipiesService.getRecipeById(this.recipeId).subscribe(data => {
                    console.log(data);
                    this.recipe = {
                        _id: data.recipe._id,
                        title: data.recipe.title,
                        type: data.recipe.type,
                        ingredients: data.recipe.ingredients,
                        instructions: data.recipe.instructions,
                        imagePath: data.recipe.imagePath
                    };

                    this.fillFormInformation(this.recipe);

                });

            } else {
                this.editMode = false;
                this.recipeId = null;
            }
        });

        console.log((this.form.value.type as Array<boolean>));
    }

    ngOnDestroy() {
        this.elementsSubscription.unsubscribe();
    }

    // Create a recipe
    onSaveRecipe() {
        this.recipe = {
            _id: this.recipeId,
            title: (this.form.get('title').value).trim(),
            type: this.getTypesForBackend(this.form.get('type') as FormArray),
            ingredients: this.ingredients,
            instructions: (this.form.get('instructions').value).trim(),
            imagePath: this.form.get('image').value
        }
        console.log("Updating.. new information:");
        console.log(this.recipe);

        if (this.editMode) {
            this.recipiesService.updateRecipe(this.recipe, this.form.get('image').value)
                .subscribe(res => {
                    console.log(res);
                    this.router.navigate(["/list-recipies"]);
                });
        } else {
            this.recipiesService.saveRecipe(this.recipe, this.form.get('image').value)
            .subscribe((res) => {
                console.log(res);
                this.router.navigate(["/list-recipies"]);
            }, (err) => {
                console.log(err);
            });

        }


    }

    /**
     * Invoke every time a checkbox is checked/unchecked.
     * If checked, add it to formArray. else, remove it.
     * TODO: Try to find a simpler way
     * @param event event when checkbox is checked/unchecked
     */
    onCheckChange(event) {
        const formArray: FormArray = this.form.get('type') as FormArray;
        // if checkbox is checked
         if(event.checked){
            // Add a new control in the arrayForm
            formArray.push(new FormControl(event.source.value));
        } else { // if checkbox is unchecked
            // find the unselected element
            let i: number = 0;
            // for each control in the from array: if the value matches the event value remove it.
            formArray.controls.forEach((ctrl: FormControl) => {
            if(ctrl.value == event.source.value) {
                // Remove the unselected element from the arrayForm
                formArray.removeAt(i);
                return;
            }
                i++;
            });
        }
    }

    getIngredients(ingredients: string) {
        return ingredients.split(',');
    }

    getIngredientsForEdit(ingredients: string[]) {
        let resultString = "";
        ingredients.forEach((ing, i) =>{
            resultString = i < ingredients.length - 1 ? resultString + ing + "," : resultString + ing;
        });

        this.form.get('ingredients').setValue(resultString);
    }

    getTypesForBackend(typesFormArray: FormArray ): string[] {
        let resultArray = [];
        this.types.forEach((t,i) => {
            if (typesFormArray.at(i).value)
                resultArray.push(t);
        });
        return resultArray;
    }

    getTypesForEdit(selectedTypes: string[]){
        const formArray: FormArray = this.form.get('type') as FormArray;

        selectedTypes.forEach((t,i) => {
            formArray.at(this.types.indexOf(t)).setValue(true);

        });
    }

    addCheckBoxes() {
        const formArray: FormArray = this.form.get('type') as FormArray;

        this.types.forEach(type => {
            formArray.push(new FormControl(false));
        })

    }

    fillFormInformation(recipe: Recipe) {
        this.form.get('title').setValue(recipe.title);
        this.getTypesForEdit(recipe.type);
        this.ingredients = recipe.ingredients;
        this.form.patchValue({ingredients: this.ingredients});
        this.form.get('ingredients').updateValueAndValidity();
        this.chipInputService.updateElementsByApi(this.ingredients);
        this.form.get('instructions').setValue(this.recipe.instructions);
        this.form.patchValue({image: this.recipe.imagePath})
        this.form.get('image').updateValueAndValidity();
    }

    imageSelected(event: Event) {
        const image = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: image});

        const fileReader = new FileReader();
        fileReader.onload = () => {
            this.imagePreview = fileReader.result as string;
        };

        fileReader.readAsDataURL(image);
    }

    isCheckBoxesValid(): boolean {
        let valid = false;

        this.form.value.type.forEach(v => {
            if (v == true)
                valid = true;
        });
        return valid;
    }


}