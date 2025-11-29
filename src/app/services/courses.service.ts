import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Course } from '../models/course.model';
import { GetCoursesResponse } from '../models/get-courses.response';
import { SkipLoading } from '../loading/skip-loading.component';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  http = inject(HttpClient);
  env = environment;

  async loadAllCourses(): Promise<Course[]> {
    const course$ = this.http.get<GetCoursesResponse>(
      `${environment.apiRoot}/courses`,
      {
        // context: new HttpContext().set(SkipLoading, true)
      }
    );
    const response = await firstValueFrom(course$);
    return response.courses;
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    const course$ = this.http.post<Course>(
      `${environment.apiRoot}/courses`,
      course
    );
    return firstValueFrom(course$);
  }

  async saveCourse(courseId: string, course: Partial<Course>): Promise<Course> {
    const course$ = this.http.put<Course>(
      `${environment.apiRoot}/courses/${courseId}`,
      course
    );
    return firstValueFrom(course$);
  }

  async deleteCourse(id: string) {
    const course$ = this.http.delete<Course>(
      `${environment.apiRoot}/courses/${id}`
    );
    return firstValueFrom(course$);
  }
}
