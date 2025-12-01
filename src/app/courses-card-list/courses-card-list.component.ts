import { Component, effect, ElementRef, inject, input, output, viewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'courses-card-list',
  imports: [RouterLink],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
})
export class CoursesCardListComponent {
  courses = input.required<Course[]>();
  courseUpdated = output<Course>();
  courseDeleted = output<string>();
  dialog = inject(MatDialog);

  courseCards = viewChildren<ElementRef>('courseCard');

  async onDeleteCourse(course: Course) {
    this.courseDeleted.emit(course.id);
  }

  async onEditCourse(course: Course) {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'update',
      title: 'Update existing course',
      course: course,
    });

    if (!newCourse) {
      return;
    }

    console.log('Updated', newCourse);
    this.courseUpdated.emit(newCourse);
  }
  constructor() {
    effect(() => {
      console.log('courseCards', this.courseCards());
    });
  }
}
