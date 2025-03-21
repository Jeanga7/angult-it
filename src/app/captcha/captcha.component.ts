import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CaptchaService } from '../services/captcha.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
        { id: 1, src: 'img/car1.png', image_type: 'voiture', selected: false },
        { id: 2, src: 'img/car2.png', image_type: 'voiture', selected: false },
        { id: 3, src: 'img/bike1.png', image_type: 'vélo', selected: false },
        { id: 4, src: 'img/bike2.png', image_type: 'vélo', selected: false },
        { id: 5, src: 'img/robot1.png', image_type: 'robot', selected: false },
        { id: 6, src: 'img/robot2.png', image_type: 'robot', selected: false },
        { id: 7, src: 'img/robot3.png', image_type: 'robot', selected: false },
        { id: 8, src: 'img/tree2.png', image_type: 'arbre', selected: false },
        { id: 9, src: 'img/tree1.png', image_type: 'arbre', selected: false },
        {
          id: 10,
          src: 'img/pompier1.png',
          image_type: 'pompier',
          selected: false,
        },
        {
          id: 11,
          src: 'img/pompier2.png',
          image_type: 'pompier',
          selected: false,
        },
        {
          id: 12,
          src: 'img/pompier3.png',
          image_type: 'pompier',
          selected: false,
        },
      ],
    },
    { type: 'math', question: 'Combien font 3 + 4 ?', answer: 7 },
    {
      type: 'text',
      question: 'Tapez "Angular" pour continuer',
      answer: 'Angular',
    },
    {
      type: 'audio',
      question: "Écoutez l'audio et tapez ce que vous entendez",
      audioSrc: 'sounds/bonjour.mp3',
      answer: 'Bonjour',
    },
  ];

  constructor(private router: Router, private captchaService: CaptchaService) {
    /* // blocker la console
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        alert('Console désactivée');
      }
    });

    // blocker la console par click droit
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      alert('Clic droit désactivé');
    }); */
  }

  ngOnInit() {
    if (!this.captchaService.isLocalStorageAvailable()) {
      return;
    }

    //Restauration des challenges
    const savedChallenges = localStorage.getItem('challenges');
    if (savedChallenges) {
      this.challenges = JSON.parse(savedChallenges);
    } else {
      this.captchaService.generateRandomCaptcha(this.challenges);
      this.captchaService.shuffleChallenges(this.challenges);
      this.saveChallenges();
    }

    //Restauration de la progression
    const savedProgress = this.captchaService.getProgress();
    if (savedProgress) {
      this.currentChallengeIndex = savedProgress.currentChallengeIndex;
      this.userAnswers = savedProgress.userAnswers;

      this.challenges.forEach((challenge, index) => {
        if (challenge.type === 'image' && this.userAnswers[index]) {
          challenge.options?.forEach((option: any) => {
            option.selected = this.userAnswers[index].some(
              (selectedOption: any) => selectedOption.id === option.id
            );
          });
        }
      });
    }

    this.validateForm();
  }

  saveChallenges() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('challenges', JSON.stringify(this.challenges));
    }
  }

  onAnswerSelected(event: any) {
    const challenge = this.challenges[this.currentChallengeIndex];
    if (challenge.type === 'image') {
      event.selected = !event.selected;
      this.userAnswers[this.currentChallengeIndex] = challenge.options
        ? challenge.options.filter((option) => option.selected)
        : [];
    } else {
      const answer = event.target.value.trim();
      this.userAnswers[this.currentChallengeIndex] = answer;
    }
    this.validateForm();
    this.saveProgress();
  }

  validateForm() {
    const challenge = this.challenges[this.currentChallengeIndex];
    const userAnswer = this.userAnswers[this.currentChallengeIndex];
      const correctAnswer =
        challenge.answer ||
        challenge.options?.filter((opt: any) => opt.selected);
    if (challenge.type === 'image') {
          const userSelectedIds = Array.isArray(userAnswer)
          ? userAnswer.map((opt: any) => opt.id).sort()
          : [];
        const correctSelectedIds = Array.isArray(correctAnswer)
          ? correctAnswer.map((opt: any) => opt.id).sort()
          : [];
        this.isValid =
          JSON.stringify(userSelectedIds) ===
          JSON.stringify(correctSelectedIds);
    } else if (
      challenge.type === 'math' ||
      challenge.type === 'text' ||
      challenge.type === 'audio'
    ) {
      const userAnswer = this.userAnswers[this.currentChallengeIndex]
        ?.toString()
        .trim();
      
      this.isValid =
          correctAnswer?.toString().trim().toLowerCase() ===
          userAnswer?.toString().trim().toLowerCase();
    }
  }

  saveProgress() {
    this.captchaService.saveProgress({
      currentChallengeIndex: this.currentChallengeIndex,
      userAnswers: this.userAnswers,
    });
  }

  nextChallenge() {
    if (this.currentChallengeIndex < this.challenges.length - 1) {
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
    // this.captchaService.clearProgress();
    localStorage.setItem('completed', 'true');
    this.router.navigate(['/result']);
  }
}
