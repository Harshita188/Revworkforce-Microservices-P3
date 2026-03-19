import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h1 mat-dialog-title>Leave Approval decision</h1>
    <mat-dialog-content>
      <p>Please provide a reason or comment for this decision:</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Comment</mat-label>
        <textarea matInput [(ngModel)]="comment" rows="4" placeholder="Enter comment (e.g. approved, rejected due to priority, etc.)"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="submit()" [disabled]="!comment.trim()">Submit</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-top: 10px; }
  `]
})
export class CommentDialogComponent {
  comment: string = '';

  constructor(private dialogRef: MatDialogRef<CommentDialogComponent>) { }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.comment);
  }
}