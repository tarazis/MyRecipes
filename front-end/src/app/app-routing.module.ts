import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { ListRecipiesComponent } from './list-recipies/list-recipies.component';
import { ChooseRecipeComponent } from './choose-recipe/choose-recipe.component';

const routes: Routes = [
    {path: '', component: ChooseRecipeComponent},
    {path: 'create-recipe', component: CreateRecipeComponent},
    {path: 'list-recipies', component: ListRecipiesComponent},
    {path: 'choose-recipe', component: ChooseRecipeComponent},
    {path: 'edit/:id', component: CreateRecipeComponent}


]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule{

}