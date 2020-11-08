import { QuizConfig } from './quiz-config';
import { Question } from './question';

export class Quiz {
    id: number;
    name: string;
    config: QuizConfig;
    questions: Question[];
    score: number;

    constructor(data: any) {
        if (data) {
            this.score = 0;
            this.id = data.id;
            this.name = data.name;
            this.config = new QuizConfig(data.config);
            this.questions = [];
            data.questions.forEach(q => {
                this.questions.push(new Question(q));
            });
        }
    }
}