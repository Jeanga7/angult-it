import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CaptchaService } from '../services/captcha.service';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css'],
})
export class CaptchaComponent implements OnInit {
  currentChallengeIndex = 0;
  userAnswers: any[] = [];
  isValid = false;

  challenges = [
    {
      type: 'image',
      question: 'Sélectionnez toutes les images contenant des voitures',
      options: [
        { id: 1, src: 'car1.png', isCorrect: true },
        { id: 2, src: 'bike1.png', isCorrect: false },
        { id: 3, src: 'bike2.png', isCorrect: false },
        { id: 4, src: 'car2.png', isCorrect: true },
        { id: 5, src: 'bike2.png', isCorrect: true },
        { id: 6, src: 'car2.png', isCorrect: true },
        { id: 7, src: 'tree1.png', isCorrect: true },
        { id: 8, src: 'car1.png', isCorrect: true },
        { id: 9, src: 'car2.png', isCorrect: true },
        { id: 10, src: 'tree2.png', isCorrect: true },
        { id: 11, src: 'car2.png', isCorrect: true },
        { id: 12, src: 'tree1.png', isCorrect: true }
      ],
    },
    { type: 'math', question: 'Combien font 3 + 4 ?', answer: 7 },
    {
      type: 'text',
      question: 'Tapez "Angular" pour continuer',
      answer: 'Angular',
    },
  ];

  constructor(private router: Router, private captchaService: CaptchaService) {}

  ngOnInit() {
    const savedProgress = this.captchaService.getProgress();
    if (savedProgress) {
      this.currentChallengeIndex = savedProgress.currentChallengeIndex;
      this.userAnswers = savedProgress.userAnswers;
      this.validateForm();
    }
  }

  onAnswerSelected(event: any) {
    const challenge = this.challenges[this.currentChallengeIndex];
    if (challenge.type === 'image') {
      this.userAnswers[this.currentChallengeIndex] = event;
    } else {
      const answer = event.target.value.trim();
      this.userAnswers[this.currentChallengeIndex] = answer;
    }
    this.validateForm();
    this.saveProgress();
  }

  validateForm() {
    const challenge = this.challenges[this.currentChallengeIndex];
    if (challenge.type === 'image') {
      this.isValid = this.userAnswers[this.currentChallengeIndex] === true;
    } else {
      this.isValid =
        this.userAnswers[this.currentChallengeIndex] === challenge.answer;
    }
  }

  saveProgress() {
    this.captchaService.saveProgress({
      currentChallengeIndex: this.currentChallengeIndex,
      userAnswers: this.userAnswers,
    });
  }

  nextChallenge() {
    if (
      this.isValid &&
      this.currentChallengeIndex < this.challenges.length - 1
    ) {
      this.currentChallengeIndex++;
      this.isValid = false;
      this.saveProgress();
    }
  }

  previousChallenge() {
    if (this.currentChallengeIndex > 0) {
      this.currentChallengeIndex--;
      this.isValid = false;
    }
  }

  finishCaptcha() {
    if (this.isValid) {
      this.captchaService.clearProgress();
      this.router.navigate(['/result']);
    }
  }
}
