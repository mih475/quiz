import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quizData/quiz.service';
import { Option } from '../quizData/option';
import { Question } from '../quizData/question';
import { Quiz } from '../quizData/quiz';
import { QuizConfig } from '../quizData/quiz-config';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [QuizService]
})
export class QuizComponent implements OnInit {

  quizes: any[];
  quiz: Quiz = new Quiz(null);
  mode = 'quiz';
  quizName: string;
  config: QuizConfig = {
    'allowBack': true, 
    'allowReview': true,
    'duration': 300,  // 5 min
    'pageSize': 1,
    'requiredAll': false,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  score = 0;
  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = '';
  

  constructor(private quizService: QuizService) { }

  disNext(){
    if(this.pager.index > 0){
      (<HTMLInputElement>document.getElementById("pr")).disabled = false;
    }

    if(this.pager.index > 8){
      (<HTMLInputElement>document.getElementById("nx")).disabled = true;
    }
  }
  disPrev(){
    if(this.pager.index == 0){
      (<HTMLInputElement>document.getElementById("pr")).disabled = true;
    }

    if(this.pager.index <= 8){
      (<HTMLInputElement>document.getElementById("nx")).disabled = false;
    }
  }

  checkBoxTickCheck(){
    if((document.querySelectorAll('input[type="checkbox"]:checked')).length > 1){
      alert("Please select only one option as your answer")
    }
    else{
      this.goTo(this.pager.index + 1);
    }
  }

  checkBoxTickCheckBack(){
    if((document.querySelectorAll('input[type="checkbox"]:checked')).length > 1){
      alert("Please select only one option as your answer")
    }
    else{
      this.goTo(this.pager.index - 1);
    }
  }

  checkBoxTickCheckBeforeSubmit(){
    if((document.querySelectorAll('input[type="checkbox"]:checked')).length > 1){
      alert("Please select only one option as your answer")
    }
    else{
      this.onSubmit();
    }
  }

  checkTickCheckBoxBeforeReview(){
    if((document.querySelectorAll('input[type="checkbox"]:checked')).length > 1){
      alert("Please select only one option as your answer")
    }
    else{
      this.mode = 'review';
    }
  }


  ngOnInit() {
    this.quizes = this.quizService.getAll();
    this.quizName = this.quizes[0].id;
    this.loadQuiz(this.quizName);
  }

  loadQuiz(quizName: string) {
    
    this.quizService.get(quizName).subscribe(res => {
      this.quiz = new Quiz(res);
      this.pager.count = this.quiz.questions.length;
      this.pager.index = 0;
      this.startTime = new Date();
      this.ellapsedTime = '00:00';
      this.timer = setInterval(() => { this.tick(); }, 1000);
      this.duration = this.parseTime(this.config.duration);
    });
    this.mode = 'quiz';
  }

  tick() {
    const now = new Date();
    const diff = (now.getTime() - this.startTime.getTime()) / 1000;
    if (diff >= this.config.duration) {
      this.onSubmit();
    }
    this.ellapsedTime = this.parseTime(diff);
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `${mins}:${secs}`;
  }

  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }
  }

  isAnswered(question: Question) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    if (question.options.find(x => x.selected === x.isAnswer)) {
      return 'Your answer is correct.';
    } else {
      var cor;
      for(var i=0; i<question.options.length;i++){
          if(question.options[i].isAnswer){
            cor = 'Correct answer is ' + "'"+question.options[i].name +"'" + '.';
          }
      }
      var fin = 'Your answer is wrong.\n'+ cor;
      fin.replace("\n","<br>");
      return fin;
    }
  };

  onSubmit() {
    let answers = [];
    this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));
    for(var i =0; i<this.quiz.questions.length;i++){
      if(this.quiz.questions[i].options.find(x => x.selected === x.isAnswer)){
        this.quiz.score++;
      }
    }
    clearInterval(this.timer);
    this.mode = 'result';
  }

}
