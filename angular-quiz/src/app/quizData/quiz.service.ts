import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class QuizService {

    constructor(private http: HttpClient) { }
  
    get(url: string) {

      return this.http.get(url);
    }
  
    getAll() {
      return [
        { id: "assets/javaQuestions.json", name: 'Java Quiz'},
        { id: "assets/javaScriptQuestions.json", name: 'JavaScript Quiz'},
        { id: "assets/pythonQuestions.json", name: 'Python Quiz'}
      ];
    }
  
  }