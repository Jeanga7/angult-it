import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  challenges: any[] = [];
  userAnswers: any[] = [];
  results: {
    question: string;
    userAnswer: any;
    correctAnswer: any;
    isCorrect: boolean;
  }[] = [];
  score: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    const savedChallenges = localStorage.getItem('challenges');
    const savedAnswers = localStorage.getItem('captchaProgress');

    /* if (!savedChallenges || !savedAnswers) {
      this.router.navigate(['/captcha']);
    } */

    this.challenges = JSON.parse(savedChallenges ?? '[]');
    this.userAnswers = JSON.parse(savedAnswers ?? '[]').userAnswers;

    this.results = this.challenges.map((challenge, index) => {
      const userAnswer = this.userAnswers[index];
      const correctAnswer =
        challenge.answer ||
        challenge.options?.filter((opt: any) => opt.selected);
      const isCorrect =
        challenge.type === 'image'
          ? JSON.stringify(userAnswer) === JSON.stringify(correctAnswer)
          : userAnswer?.toString().trim().toLowerCase() ===
            correctAnswer?.toString().trim().toLowerCase();

      if (!isCorrect) {
        this.score++;
      }

      return {
        question: challenge.question,
        userAnswer,
        correctAnswer,
        isCorrect,
      };
    });
  }

  restartChallenge() {
    localStorage.removeItem('completed');
    localStorage.removeItem('challenges');
    localStorage.removeItem('captchaProgress');
    this.router.navigate(['/captcha']);
  }
}
