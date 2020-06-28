import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ChipInputService } from '../services/chip-input.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-chip-input',
    templateUrl: './chip-input.component.html',
    styleUrls: ['./chip-input.component.css']
})
export class ChipInputComponent implements OnInit {
    private elementsSubscription: Subscription;

    options: FormGroup;
    colorControl = new FormControl('accent');


    constructor(public chipInputService: ChipInputService, fb: FormBuilder) {
        this.options = fb.group({
            color: this.colorControl,
        });

    }
    ngOnInit(){
        this.elementsSubscription = this.chipInputService.getElementsByApiUpdateListener()
        .subscribe((elements: string[]) => {
            this.elements = elements;
        });
        
    }

    ngOnDestroy() {
        this.elementsSubscription.unsubscribe();
    }
    elements: any = [];
    separatorKeysCodes: number[] = [ENTER, COMMA];
    @Input() visible: boolean;
    @Input() selectable: boolean;
    @Input() removable: boolean;

    removeElement(element: string) {
        this.elements.splice(this.elements.indexOf(element), 1);
        this.chipInputService.updateElementsByForm(this.elements);

    }

    addElement(event: MatChipInputEvent) {
        const input = event.input;
        const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.elements.push((value.trim()).toLowerCase());
    }

    // Reset the input value
    if (input) {
        input.value = '';
    }

    this.chipInputService.updateElementsByForm(this.elements);

    }

}