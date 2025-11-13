import { Component, EventEmitter, Output, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  query = signal('');

  placeholder = input<string>('Search...');

  @Output() queryChange: EventEmitter<any> = new EventEmitter<string>();

  get model(): string {
    return this.query();
  }
  set model(value: string) {
    this.query.set(value);
    this.queryChange.emit(value);
  }

  onModelChange(value: string) {
    this.query.set(value);
    this.queryChange.emit(value);
  }

  clear() {
    this.query.set('');
    this.queryChange.emit('');
  }
}
