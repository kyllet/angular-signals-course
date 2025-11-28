import {inject, Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Course} from "../models/course.model";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: "root"
})
export class CoursesServiceWithFetch {
  http = inject(HttpClient);

  constructor(http: HttpClient) {}

  env = environment;

  async loadAllCourses(): Promise<Course[]> {
    const response = await fetch(`${this.env.apiRoot}/courses`);
    const payload = await response.json();   
     
    return payload.courses;
  }

  
  async createCourse(course: Partial<Course>): Promise<Course> {
    const response = await fetch(`${this.env.apiRoot}/courses`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(course)
    });

    return response.json();

  }

  async saveCourse(id: string, changes: Partial<Course>): Promise<Course> {
    const response = await fetch(`${this.env.apiRoot}/courses/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(changes)
    });

    return response.json();
  }

  async deleteCourse(id: string): Promise<void> {
    const response = await fetch(`${this.env.apiRoot}/courses/${id}`, {
      method: 'DELETE',
    })
  }

  async loadAllCourses2(): Promise<Course[]> {

    const response = await fetch(`${this.env.apiRoot}/courses2`);
    const payload = await response.json();
    
     
    return payload.courses;
  }

  

  getAllCourses(): Observable<any> { 
    return this.http.get<any>(`${this.env.apiRoot}/courses`) 
 
  }

  getAllCourses2(): Observable<Course[]> {
    // return this.http.get<Course[]>(`${this.env.apiRoot}/courses2`);
    let req: any; 
     this.http.get<Course[]>(`${this.env.apiRoot}/courses2`).pipe(
      map((res: any) => req = res.courses)
     );
 
     return req;
  }

}
