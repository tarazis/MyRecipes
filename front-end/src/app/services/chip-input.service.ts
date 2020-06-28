import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChipInputService {
    private elementsUpdated = new Subject<string[]>();

    updateElementsByForm(elements: string[]) {
        this.elementsUpdated.next([...elements]);
    }

    getElementsByFormUpdateListener(){
        return this.elementsUpdated.asObservable();
    }

    updateElementsByApi(elements: string[]) {
        this.elementsUpdated.next([...elements]);
    }
    
    getElementsByApiUpdateListener() {
        return this.elementsUpdated.asObservable();
    }


}