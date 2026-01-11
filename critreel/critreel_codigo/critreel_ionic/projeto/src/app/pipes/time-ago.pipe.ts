import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';

    const date = new Date(value);

    // Ajuste automático para o fuso horário local
    const userOffset = new Date().getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - userOffset);

    const now = new Date();
    const seconds = Math.floor((+now - +localDate) / 1000);

    if (seconds < 60) return 'há poucos segundos';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `há ${days} dias`;
    const months = Math.floor(days / 30);
    if (months < 12) return `há ${months} meses`;
    const years = Math.floor(months / 12);
    return `há ${years} anos`;
  }
}
