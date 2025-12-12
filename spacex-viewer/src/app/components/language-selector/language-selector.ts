import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService, Language } from '../../services/i18n.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-selector">
      <select 
        [value]="currentLanguage" 
        (change)="onLanguageChange($event)"
        class="language-select"
        [attr.aria-label]="i18n.translate('language.select')"
      >
        <option value="en">EN</option>
        <option value="ru">RU</option>
        <option value="kz">KZ</option>
      </select>
    </div>
  `,
  styles: [`
    .language-selector {
      display: flex;
      align-items: center;
    }

    .language-select {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: #ddd;
      padding: 6px 10px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      outline: none;
    }

    .language-select:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .language-select:focus {
      border-color: #1e90ff;
      box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.2);
    }

    .language-select option {
      background: #1e293b;
      color: #e5e7eb;
    }
  `]
})
export class LanguageSelectorComponent {
  i18n = inject(I18nService);
  currentLanguage: Language = this.i18n.currentLanguageValue;

  constructor() {
    this.i18n.currentLanguage.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.i18n.setLanguage(select.value as Language);
  }
}

