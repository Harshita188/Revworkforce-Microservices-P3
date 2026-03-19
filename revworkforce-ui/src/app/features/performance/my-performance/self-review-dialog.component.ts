import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-self-review-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
    ],
    template: `
    <h2 mat-dialog-title>Submit Self Review</h2>

    <mat-dialog-content>
      <p>Please describe your progress or achievements for this goal.</p>

      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Self Review</mat-label>

        <textarea
          matInput
          rows="4"
          [(ngModel)]="reviewText"
          placeholder="Example: Improved backend APIs and optimized database queries">
        </textarea>

      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">

      <button mat-button (click)="close()">
        Cancel
      </button>

      <button
        mat-raised-button
        color="primary"
        (click)="submit()"
        [disabled]="!reviewText">

        Submit
      </button>

    </mat-dialog-actions>
  `
})
export class SelfReviewDialogComponent {

    reviewText: string = '';

    constructor(private dialogRef: MatDialogRef<SelfReviewDialogComponent>) { }

    close() {
        this.dialogRef.close();
    }

    submit() {
        this.dialogRef.close(this.reviewText);
    }
}