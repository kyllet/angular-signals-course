import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, forkJoin, from, map, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
  rxResource,
} from '@angular/core/rxjs-interop';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { HttpClient } from '@angular/common/http';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';

type Counter = {
  value: number;
};
@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #courses = signal<Course[]>([]);
  coursesService = inject(CoursesService);

  dialog = inject(MatDialog);
  loadingService = inject(LoadingService);

  messagesService = inject(MessagesService);

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  constructor() {
    effect(() => {
      console.log('Beginner courses: ', this.beginnerCourses());
      console.log('Advanced courses: ', this.advancedCourses());
    });
    this.loadCourses().then(() =>
      console.log('All courses loaded', this.#courses())
    );
  }

  async onCourseDeleted(id: string) {
    try {
      await this.coursesService.deleteCourse(id);
      const courses = this.#courses();
      const newCourses = courses.filter((course) => course.id !== id);
      this.#courses.set(newCourses);
    } catch (error) {
      console.error(error);
    }
  }
  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create New Course',
    });

    const newCourses = [...this.#courses(), newCourse];

    this.#courses.set(newCourses);
  }

  onCourseUpdate(updatedCourse: Course) {
    const courses = this.#courses();

    const newCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    );

    this.#courses.set(newCourses);
  }

  async loadCourses() {
    try {
      // this.loadingService.loadingOn();
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (error) {
      this.messagesService.showMessage('Error on loading courses', 'success');
      console.log(error);
    }
    // finally {
    //     this.loadingService.loadingOff();
    // }
  }

  /*
    counter = signal(0);
    counterObj = signal<Counter>({value: 15});
    //counter = signal(10).asReadonly();

    valueArr = signal<number[]>([1,2,3]);


    //computed
    tenXcounter = computed(() => this.counter() * 10);
    hunXcounter = computed(() => this.tenXcounter() * 10);

    increment() {        
        this.counter.update(counter => counter + 1);

        this.counterObj.update(counter => ({
            ...counter,
            value: counter.value + 1
        }))
        
        var len = this.valueArr().length;

        this.valueArr.update( arr => ([
            ...arr,
            arr[len-1] + 1
        ]))
    }
*/

  /*  constructor() {        
        effect(() => {
            console.log(`counter value: ${this.counter()}`)
        });
        
    }*/
}
