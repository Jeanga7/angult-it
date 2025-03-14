import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CaptchaService } from '../services/captcha.service';
import e from 'express';
import { generate } from 'rxjs';

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
      question: '',
      field: '',
      options: [
        { id: 1, src: 'car1.png', image_type: 'voiture', selected: false },
        { id: 2, src: 'bike1.png', image_type: 'vélo', selected: false },
        { id: 3, src: 'bike2.png', image_type: 'vélo', selected: false },
        { id: 4, src: 'car2.png', image_type: 'voiture', selected: false },
        { id: 5, src: 'bike2.png', image_type: 'vélo', selected: false },
        { id: 6, src: 'car2.png', image_type: 'voiture', selected: false },
        { id: 7, src: 'tree1.png', image_type: 'arbre', selected: false },
        { id: 8, src: 'car1.png', image_type: 'voiture', selected: false },
        { id: 9, src: 'car2.png', image_type: 'voiture', selected: false },
        { id: 10, src: 'tree2.png', image_type: 'arbre', selected: false },
        { id: 11, src: 'car2.png', image_type: 'voiture', selected: false },
        { id: 12, src: 'tree1.png', image_type: 'arbre', selected: false },
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
    if (!this.captchaService.isLocalStorageAvailable()) {
      return;
    }
    const savedChallenges = localStorage.getItem('challenges');
    if (savedChallenges) {
      this.challenges = JSON.parse(savedChallenges);
    } else {
      this.challenges.forEach((challenge) => {
        if (challenge.type === 'image') {
          this.generateRandomQuestion(challenge);
        }
      });
    }
  
    const savedProgress = this.captchaService.getProgress();
    if (savedProgress) {
      this.currentChallengeIndex = savedProgress.currentChallengeIndex;
      this.userAnswers = savedProgress.userAnswers;
      this.validateForm();
    }
  }

  generateRandomQuestion(challenge: any) {
    if (challenge.type === 'image' && challenge.options) {
      const fields = Array.from(
        new Set(
          challenge.options.map((option: { image_type: string }) => option.image_type)
        )
      );

      const randomField = fields[Math.floor(Math.random() * fields.length)];
      console.log(fields);
      challenge.field = randomField;
      challenge.question = `Sélectionnez toutes les images contenant des ${randomField}s`;

      // Mélangez les options pour rendre l'ordre aléatoire
      this.shuffleArray(challenge.options);

      this.saveChallenges();
    }
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  saveChallenges() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('challenges', JSON.stringify(this.challenges));
    }
  }

  onAnswerSelected(event: any) {
    const challenge = this.challenges[this.currentChallengeIndex];
    if (challenge.type === 'image') {
      this.userAnswers[this.currentChallengeIndex] = event;
      event.selected = !event.selected;
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
      this.isValid = challenge.options
        ? challenge.options.some((option) => option.selected)
        : false;
    } else {
      const userAnswer = this.userAnswers[this.currentChallengeIndex];
      this.isValid = userAnswer !== undefined && userAnswer !== '';
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
