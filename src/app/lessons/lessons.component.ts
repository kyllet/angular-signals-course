import {Component, ElementRef, inject, signal, viewChild} from '@angular/core';
import {LessonsService} from "../services/lessons.service";
import {Lesson} from "../models/lesson.model";
import {LessonDetailComponent} from "./lesson-detail/lesson-detail.component";
import { CdkObserveContent } from "@angular/cdk/observers";

@Component({
    selector: 'lessons',
    imports: [
    LessonDetailComponent,
    CdkObserveContent
],
    templateUrl: './lessons.component.html',
    styleUrl: './lessons.component.scss'
})
export class LessonsComponent {


    // lesson = signal()
    mode = signal<'master' | 'detail'>('master');
    lessons = signal<Lesson[]>([]);
    selectedLesson = signal<Lesson|null>(null);
    lessonsService = inject(LessonsService);

    searchInput = viewChild.required<ElementRef>('search');

    async onSearch() {
        const query = this.searchInput()?.nativeElement.value;
        console.log(query);
        const results = await this.lessonsService.loadLessons({query});
        this.lessons.set(results);
    }

    onLessonSelected(lesson: Lesson) {
        this.mode.set('detail');
        this.selectedLesson.set(lesson);
        }

    onCancel() {
        this.mode.set('master');
    }

}
