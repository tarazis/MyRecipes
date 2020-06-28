import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule, MatInput} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {MatExpansionModule, MatExpansionPanel} from '@angular/material/expansion';
import { ListRecipiesComponent } from './list-recipies/list-recipies.component';
import {MatTreeModule} from '@angular/material/tree';
import {MatListModule} from '@angular/material/list';
import { HttpClientModule} from "@angular/common/http";
import { ChooseRecipeComponent } from './choose-recipe/choose-recipe.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';

import {MatRadioModule} from '@angular/material/radio';
import { ChipInputComponent } from './common/chip-input.component';
import {MatTooltipModule} from '@angular/material/tooltip';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CreateRecipeComponent,
    ListRecipiesComponent,
    ChooseRecipeComponent,
    ChipInputComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatExpansionModule,
    MatTreeModule,
    MatListModule,
    HttpClientModule,
    MatRadioModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
