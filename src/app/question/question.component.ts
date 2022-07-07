import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  
  public name : string="";
  public questionList : any = [];
  public currentQuestion:number = 0;
  public points: number=0;
  counter=60;
  correctAnswer:number = 0;
  inCorrectAnswer:number = 0;
  interval$:any;
  progress:string="0";
  isQuizCompleted : boolean= false;
  constructor(private questionService : QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startcounter();
  }
  getAllQuestions(){
    this.questionService.getQuestionJson()
    .subscribe(res=>{
      this.questionList = res.questions
    })
  }
  nextQuestion(){
    this.currentQuestion++;
  }
  previousQuestion(){
    this.currentQuestion--;
  }
  answer(currentQno:number,option:any){
    if(currentQno === this.questionList.length){
        this.isQuizCompleted = true;
        this.stopcounter();
    }
    if(option.correct){
      this.points+=1;
      this.correctAnswer++;
      setTimeout(() => {
        this.currentQuestion++;
        // this.points = this.points + 1;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
    }else{
      setTimeout(() => {
        this.currentQuestion++;
        this.inCorrectAnswer++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
      this.points-=1;
    }
  }
  startcounter(){
    this.interval$ = interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter==0){
        this.currentQuestion++;
        this.counter=60;
        this.points-=1;
      }
    });
    setTimeout(()=> {
        this.interval$.unsubscribe();
    }, 600000);
  }
  stopcounter(){
     this.interval$.unsubscribe();
     this.counter=0;
  }
  resetCounter(){
    this.stopcounter();
    this.counter=60;
    this.startcounter();
  }
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.counter=60;
    this.points=0;
    this.currentQuestion=0;
    this.progress= "0";
  }
  getProgressPercent(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }
}
