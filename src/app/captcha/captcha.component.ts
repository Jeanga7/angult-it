import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css'],
})
export class CaptchaComponent {
  currentChallengeIndex = 0;
  challenges = [
    {
      type: 'image',
      question: 'Select all images with a car',
      options: [
        { id: 1, src: 'car1.png', isCorrect: true },
        { id: 2, src: 'bike1.png', isCorrect: false },
        { id: 3, src: 'car2.png', isCorrect: true },
        { id: 4, src: 'tree1.png', isCorrect: false },
        { id: 5, src: 'bike2.png', isCorrect: false },
        { id: 6, src: 'tree2.png', isCorrect: false },
      ],
    },
    {
      type: 'math',
      question: 'What is 2 + 2?',
      answer: 4,
    },
    {
      type: 'text',
      question: 'Type "Paris" to continue',
      answer: 'Paris',
    },
  ];

  userAnswers: any[] = [];
  isValid = false;

  constructor(private router: Router) {}

  validateForm() {
    this.isValid = this.userAnswers[this.currentChallengeIndex];
  }

  onImageSelect(selectedOption: any) {
    this.userAnswers[this.currentChallengeIndex] = selectedOption;
    this.validateForm();
  }

  onMathAnswer(event: any) {
    const numericAnswer = parseInt(event.target.value, 10);
    this.userAnswers[this.currentChallengeIndex] = 
      this.challenges[this.currentChallengeIndex].answer === numericAnswer;
    this.validateForm();
  }

  onTextAnswer(event: any) {
    const answer = event.target.value.trim();
    const currentChallenge = this.challenges[this.currentChallengeIndex];
    
    // Comparaison insensible à la casse
    this.userAnswers[this.currentChallengeIndex] = 
      answer.toLowerCase() === String(currentChallenge.answer).toLowerCase();
    
    this.validateForm();
  }

  nextChallenge() {
    if (this.currentChallengeIndex < this.challenges.length - 1) {
      this.currentChallengeIndex++;
      this.isValid = false;
    }
  }

  previousChallenge() {
    if (this.currentChallengeIndex > 0) {
      this.currentChallengeIndex--;
      this.isValid = false;
    }
  }

  finishCaptchas() {
    if (this.isValid) {
      this.router.navigate(['/result']);
    }
  }
}
