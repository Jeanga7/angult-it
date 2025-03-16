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
        { id: 2, src: 'car2.png', image_type: 'voiture', selected: false },
        { id: 3, src: 'bike1.png', image_type: 'vélo', selected: false },
        { id: 4, src: 'bike2.png', image_type: 'vélo', selected: false },
        { id: 5, src: 'robot1.png', image_type: 'robot', selected: false },
        { id: 6, src: 'robot2.png', image_type: 'robot', selected: false },
        { id: 7, src: 'robot3.png', image_type: 'robot', selected: false },
        { id: 8, src: 'tree2.png', image_type: 'arbre', selected: false },
        { id: 9, src: 'tree1.png', image_type: 'arbre', selected: false },
        { id: 10, src: 'pompier1.png', image_type: 'pompier', selected: false },
        { id: 11, src: 'pompier2.png', image_type: 'pompier', selected: false },
        { id: 12, src: 'pompier3.png', image_type: 'pompier', selected: false },
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
        } else if (challenge.type === 'math') {
          this.generateRandomMathChallenge(challenge);
        } else if (challenge.type === 'text') {
          this.generateRandomTextChallenge(challenge);
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

  generateRandomTextChallenge(challenge: any) {
    const phrases = [
      'Angular est cool',
      'Typescript est super',
      'Captcha est facile',
      'Je suis un robot',
      'African Devs',
      'Je suis humain',
    ];

    const words = [
      'Angular',
      'robot',
      'Captcha',
      'African',
      'Devs',
      'humain',
      'Puissant',
      'Secure',
      'challenge',
      'Check',
    ];

    // Générer un mot ou une phrase aléatoirement
    const useWord = Math.random() < 0.6;
    const randomText = useWord
      ? words[Math.floor(Math.random() * words.length)]
      : phrases[Math.floor(Math.random() * phrases.length)];

    // Générer une transformation aléatoire
    const transformations = useWord
      ? ['lowercase', 'reverse', 'missing', 'shuffle', 'emoji']
      : ['lowercase', 'reverse', 'missing'];
    const transformation = transformations[Math.floor(Math.random() * transformations.length)];

    let transformedText = randomText;
    switch (transformation) {
      case 'lowercase':
        transformedText = randomText.toUpperCase();
        challenge.question = `Tapez ce texte en minuscules: ${transformedText}`;
        break;
      case 'reverse':
        transformedText = randomText.split('').reverse().join('');
        challenge.question = `Tapez ce texte à l'envers: ${transformedText}`;
        break;
      case 'missing':
        transformedText = randomText.replace(/[aeiou]/gi, '_');
        challenge.question = `Complétez ce texte avec les voyelles manquantes: ${transformedText}`;
        break;
        case 'shuffle':
          transformedText = randomText.split('').sort(() => Math.random() - 0.5).join('');
          challenge.question = `Réorganisez les lettres pour retrouver le mot : "${transformedText}"`;
          break;
    
        case 'emoji':
          transformedText = randomText.replace(/e/gi, '😊').replace(/a/gi, '🎉');
          challenge.question = `Tapez ce mot en remplaçant les emojis par les lettres correspondantes : "${transformedText}"`;
          break;
    }

    challenge.answer = randomText;
  }

  generateRandomMathChallenge(challenge: any) {
    const operation = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);

    let answer;
    switch (operation) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case '*':
        answer = num1 * num2;
        break;
      case '/':
        answer = num1 / num2;
        break;
    }

    challenge.question = `Combien font: ${num1} ${operation} ${num2} ?`;
    challenge.answer = answer;
  }

  generateRandomQuestion(challenge: any) {
    if (challenge.type === 'image' && challenge.options) {
      const fields = Array.from(
        new Set(
          challenge.options.map(
            (option: { image_type: string }) => option.image_type
          )
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
