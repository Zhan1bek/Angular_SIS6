import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'en' | 'ru' | 'kz';

export interface Translations {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguage$ = new BehaviorSubject<Language>('en');
  private translations: { [lang: string]: Translations } = {};

  constructor() {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang && ['en', 'ru', 'kz'].includes(savedLang)) {
      this.currentLanguage$.next(savedLang);
    }
    
    // Load translations
    this.loadTranslations();
  }

  get currentLanguage(): Observable<Language> {
    return this.currentLanguage$.asObservable();
  }

  get currentLanguageValue(): Language {
    return this.currentLanguage$.value;
  }

  setLanguage(lang: Language): void {
    this.currentLanguage$.next(lang);
    localStorage.setItem('app_language', lang);
    // Update document language attribute
    document.documentElement.lang = lang;
  }

  translate(key: string, params?: { [key: string]: string }): string {
    const lang = this.currentLanguage$.value;
    let translation = this.translations[lang]?.[key] || this.translations['en']?.[key] || key;

    // Replace parameters
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{{${paramKey}}}`, params[paramKey]);
      });
    }

    return translation;
  }

  private loadTranslations(): void {
    // English translations
    this.translations['en'] = {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.launches': 'Launches',
      'nav.favorites': 'Favorites',
      'nav.profile': 'Profile',
      'nav.login': 'Login',
      'nav.signup': 'Sign up',
      'offline.banner.text': 'You are currently offline. Some features may be limited.',
      'offline.banner.link': 'View Offline Page',
      'profile.title': 'Profile',
      'profile.email': 'Email',
      'profile.uid': 'User ID',
      'profile.upload': 'Profile Picture',
      'profile.upload.hint': 'Click to upload (JPG or PNG)',
      'profile.uploading': 'Compressing and uploading...',
      'profile.logout': 'Logout',
      'profile.notifications.title': 'Notifications',
      'profile.notifications.enable': 'Enable',
      'profile.notifications.test': 'Test',
      'profile.notifications.enabled': '✓ Enabled',
      'profile.notifications.blocked': '✗ Blocked',
      'profile.notifications.label': 'Receive local notifications about new launches',
      'home.title': 'SpaceX Viewer',
      'home.welcome': 'Welcome to SpaceX Viewer',
      'home.description': 'This app shows the latest SpaceX launches with detailed information loaded from the official public API.',
      'home.navigation': 'Use the navigation above or click the button below to browse recent launches.',
      'home.viewLaunches': 'View launches',
      'about.title': 'About Us',
      'login.title': 'Login',
      'login.email': 'Email',
      'login.password': 'Password',
      'login.submit': 'Login',
      'signup.title': 'Create account',
      'signup.email': 'Email',
      'signup.password': 'Password',
      'signup.repeatPassword': 'Repeat password',
      'signup.submit': 'Sign up',
      'favorites.title': 'Favorites',
      'favorites.subtitle': 'Saved SpaceX launches. Works for guests (localStorage) and for logged-in users (Firestore).',
      'favorites.empty': 'You don\'t have any favorites yet. Add some launches from the list.',
      'launches.title': 'Latest Launches',
      'launches.search': 'Search by launch name...',
      'launches.itemsPerPage': 'Items per page:',
      'launches.loading': 'Loading...',
      'launches.noResults': 'No launches found.',
      'launches.offline': 'You are currently offline. Showing cached data if available.',
      'launches.previous': '← Previous',
      'launches.next': 'Next →',
      'launches.page': 'Page',
      'launches.of': 'of',
      'detail.back': '← Back',
      'detail.success': 'Success',
      'detail.failure': 'Failure',
      'detail.unknown': 'Unknown',
      'detail.rocket': 'Rocket:',
      'detail.launchpad': 'Launchpad:',
      'detail.details': 'Details',
      'detail.links': 'Links',
      'detail.article': 'Article',
      'detail.webcast': 'Webcast',
      'language.select': 'Language'
    };

    // Russian translations
    this.translations['ru'] = {
      'nav.home': 'Главная',
      'nav.about': 'О нас',
      'nav.launches': 'Запуски',
      'nav.favorites': 'Избранное',
      'nav.profile': 'Профиль',
      'nav.login': 'Войти',
      'nav.signup': 'Регистрация',
      'offline.banner.text': 'Вы сейчас офлайн. Некоторые функции могут быть ограничены.',
      'offline.banner.link': 'Посмотреть офлайн страницу',
      'profile.title': 'Профиль',
      'profile.email': 'Email',
      'profile.uid': 'ID пользователя',
      'profile.upload': 'Фото профиля',
      'profile.upload.hint': 'Нажмите для загрузки (JPG или PNG)',
      'profile.uploading': 'Сжатие и загрузка...',
      'profile.logout': 'Выйти',
      'profile.notifications.title': 'Уведомления',
      'profile.notifications.enable': 'Включить',
      'profile.notifications.test': 'Тест',
      'profile.notifications.enabled': '✓ Включено',
      'profile.notifications.blocked': '✗ Заблокировано',
      'profile.notifications.label': 'Получать локальные уведомления о новых запусках',
      'home.title': 'SpaceX Viewer',
      'home.welcome': 'Добро пожаловать в SpaceX Viewer',
      'home.description': 'Это приложение показывает последние запуски SpaceX с подробной информацией, загруженной из официального публичного API.',
      'home.navigation': 'Используйте навигацию выше или нажмите кнопку ниже, чтобы просмотреть последние запуски.',
      'home.viewLaunches': 'Просмотреть запуски',
      'about.title': 'О нас',
      'login.title': 'Вход',
      'login.email': 'Email',
      'login.password': 'Пароль',
      'login.submit': 'Войти',
      'signup.title': 'Создать аккаунт',
      'signup.email': 'Email',
      'signup.password': 'Пароль',
      'signup.repeatPassword': 'Повторите пароль',
      'signup.submit': 'Зарегистрироваться',
      'favorites.title': 'Избранное',
      'favorites.subtitle': 'Сохраненные запуски SpaceX. Работает для гостей (localStorage) и для авторизованных пользователей (Firestore).',
      'favorites.empty': 'У вас пока нет избранного. Добавьте запуски из списка.',
      'launches.title': 'Последние запуски',
      'launches.search': 'Поиск по названию запуска...',
      'launches.itemsPerPage': 'Элементов на странице:',
      'launches.loading': 'Загрузка...',
      'launches.noResults': 'Запуски не найдены.',
      'launches.offline': 'Вы сейчас офлайн. Показываются кэшированные данные, если доступны.',
      'launches.previous': '← Назад',
      'launches.next': 'Вперед →',
      'launches.page': 'Страница',
      'launches.of': 'из',
      'detail.back': '← Назад',
      'detail.success': 'Успешно',
      'detail.failure': 'Неудача',
      'detail.unknown': 'Неизвестно',
      'detail.rocket': 'Ракета:',
      'detail.launchpad': 'Площадка:',
      'detail.details': 'Детали',
      'detail.links': 'Ссылки',
      'detail.article': 'Статья',
      'detail.webcast': 'Трансляция',
      'language.select': 'Язык'
    };

    // Kazakh translations
    this.translations['kz'] = {
      'nav.home': 'Басты',
      'nav.about': 'Біз туралы',
      'nav.launches': 'Ұшырулар',
      'nav.favorites': 'Таңдаулылар',
      'nav.profile': 'Профиль',
      'nav.login': 'Кіру',
      'nav.signup': 'Тіркелу',
      'offline.banner.text': 'Сіз қазір желіден тыс. Кейбір мүмкіндіктер шектеулі болуы мүмкін.',
      'offline.banner.link': 'Желіден тыс бетті көру',
      'profile.title': 'Профиль',
      'profile.email': 'Email',
      'profile.uid': 'Пайдаланушы ID',
      'profile.upload': 'Профиль суреті',
      'profile.upload.hint': 'Жүктеу үшін басыңыз (JPG немесе PNG)',
      'profile.uploading': 'Сығу және жүктеу...',
      'profile.logout': 'Шығу',
      'profile.notifications.title': 'Хабарландырулар',
      'profile.notifications.enable': 'Қосу',
      'profile.notifications.test': 'Тест',
      'profile.notifications.enabled': '✓ Қосылған',
      'profile.notifications.blocked': '✗ Бұғатталған',
      'profile.notifications.label': 'Жаңа ұшырулар туралы жергілікті хабарландырулар алу',
      'home.title': 'SpaceX Viewer',
      'home.welcome': 'SpaceX Viewer-ға қош келдіңіз',
      'home.description': 'Бұл қолданба ресми ашық API-ден жүктелген егжей-тегжейлі ақпаратпен соңғы SpaceX ұшыруларын көрсетеді.',
      'home.navigation': 'Жоғарыдағы навигацияны пайдаланыңыз немесе соңғы ұшыруларды көру үшін төмендегі батырманы басыңыз.',
      'home.viewLaunches': 'Ұшыруларды көру',
      'about.title': 'Біз туралы',
      'login.title': 'Кіру',
      'login.email': 'Email',
      'login.password': 'Құпия сөз',
      'login.submit': 'Кіру',
      'signup.title': 'Аккаунт құру',
      'signup.email': 'Email',
      'signup.password': 'Құпия сөз',
      'signup.repeatPassword': 'Құпия сөзді қайталаңыз',
      'signup.submit': 'Тіркелу',
      'favorites.title': 'Таңдаулылар',
      'favorites.subtitle': 'Сақталған SpaceX ұшырулары. Қонақтар үшін (localStorage) және кіру жасаған пайдаланушылар үшін (Firestore) жұмыс істейді.',
      'favorites.empty': 'Сізде әлі таңдаулылар жоқ. Тізімнен ұшыруларды қосыңыз.',
      'launches.title': 'Соңғы ұшырулар',
      'launches.search': 'Ұшыру атауы бойынша іздеу...',
      'launches.itemsPerPage': 'Беттегі элементтер:',
      'launches.loading': 'Жүктелуде...',
      'launches.noResults': 'Ұшырулар табылмады.',
      'launches.offline': 'Сіз қазір желіден тыс. Кэштелген деректер көрсетілуде, егер қолжетімді болса.',
      'launches.previous': '← Алдыңғы',
      'launches.next': 'Келесі →',
      'launches.page': 'Бет',
      'launches.of': 'ішінен',
      'detail.back': '← Артқа',
      'detail.success': 'Сәтті',
      'detail.failure': 'Сәтсіз',
      'detail.unknown': 'Белгісіз',
      'detail.rocket': 'Ракета:',
      'detail.launchpad': 'Ұшыру алаңы:',
      'detail.details': 'Детальдар',
      'detail.links': 'Сілтемелер',
      'detail.article': 'Мақала',
      'detail.webcast': 'Трансляция',
      'language.select': 'Тіл'
    };
  }
}

