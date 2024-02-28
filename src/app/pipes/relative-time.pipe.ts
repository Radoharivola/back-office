import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date): string {
    const date = new Date(value);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const seconds = Math.floor(Math.abs(diff) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (diff > 0) {
      if (days > 0) {
        // Display the entire date when days > 0
        return this.formatDate(date);
      } else if (hours > 0) {
        return `Dans ${hours} heure${hours > 1 ? 's' : ''}`;
      } else if (minutes > 0) {
        return `Dans ${minutes} minute${minutes > 1 ? 's' : ''}`;
      } else {
        return `Dans ${seconds} seconde${seconds > 1 ? 's' : ''}`;
      }
    } else {
      if (days > 0) {
        // Display the entire date when days > 0
        return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
      } else if (hours > 0) {
        return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
      } else if (minutes > 0) {
        return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
      } else {
        return `Il y a ${seconds} seconde${seconds > 1 ? 's' : ''}`;
      }
    }
  }

  private formatDate(date: Date): string {
    const daysOfWeek = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${dayOfWeek} ${dayOfMonth} ${month} à ${hours}:${minutes.toString().padStart(2, '0')}`;
  }
}

