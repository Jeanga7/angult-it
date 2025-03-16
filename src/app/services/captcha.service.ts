import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  private readonly STORAGE_KEY = 'captchaProgress';

  saveProgress(progress: any) {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    }
  }

  getProgress(): any {
    return this.isLocalStorageAvailable()
      ? JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? 'null')
      : null;
  }

  clearProgress() {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  public isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  generateRandomCaptcha(challenges: any[]) {
    challenges.forEach((challenge) => {
      if (challenge.type === 'image') {
        this.generateRandomImageChallenge(challenge);
      } else if (challenge.type === 'math') {
        this.generateRandomMathChallenge(challenge);
      } else if (challenge.type === 'text') {
        this.generateRandomTextChallenge(challenge);
      } else if (challenge.type === 'audio') {
        this.generateRandomAudioChallenge(challenge);
      }
    });
  }

  generateRandomImageChallenge(challenge: any) {
    const fields = Array.from(
      new Set(
        challenge.options.map(
          (option: { image_type: string }) => option.image_type
        )
      )
    );

    const randomField = fields[Math.floor(Math.random() * fields.length)];
    challenge.field = randomField;
    challenge.question = `Sélectionnez toutes les images contenant des ${randomField}s`;

    // Mélangez les options pour rendre l'ordre aléatoire
    this.shuffleArray(challenge.options);
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
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
      'Africain',
      'Texte',
      'TypeScript',
      'humain',
      'Puissant',
      'Secure',
      'challenge',
      'Web',
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
    const transformation =
      transformations[Math.floor(Math.random() * transformations.length)];

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
        transformedText = randomText
          .split('')
          .sort(() => Math.random() - 0.5)
          .join('');
        challenge.question = `Réorganisez les lettres pour retrouver le mot : "${transformedText}"`;
        break;

      case 'emoji':
        transformedText = randomText.replace(/e/gi, '😊').replace(/a/gi, '🎉');
        challenge.question = `Tapez ce mot en remplaçant les emojis par les lettres correspondantes : "${transformedText}"`;
        break;
    }

    challenge.answer = randomText;
  }

  generateRandomAudioChallenge(challenge: any) {
    const audioSamples = [
      { src: 'audio/sample1.mp3', answer: 'Bonjour' },
      { src: 'audio/sample2.mp3', answer: 'Angular' },
      { src: 'audio/sample3.mp3', answer: 'Captcha' },
    ];
  
    const randomSample = audioSamples[Math.floor(Math.random() * audioSamples.length)];
    challenge.audioSrc = randomSample.src;
    challenge.question = 'Écoutez l\'audio et tapez ce que vous entendez';
    challenge.answer = randomSample.answer;
  }
}
