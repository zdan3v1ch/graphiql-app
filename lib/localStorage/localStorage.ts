'use client';

import { HISTORY_REQUEST } from '@/lib/localStorage/localStorage.constants';

export class Store {
  static addRequest(url: string, userEmail?: string | null) {
    if (!userEmail) {
      userEmail = '';
    }
    const localStorageKey = userEmail.concat(HISTORY_REQUEST);
    const newHistory: string[] = JSON.parse(
      localStorage.getItem(localStorageKey) ?? '[]'
    ) as string[];
    newHistory.push(url);
    localStorage.setItem(localStorageKey, JSON.stringify(newHistory));
  }
  static getRequests(userEmail?: string | null) {
    if (!userEmail) {
      userEmail = '';
    }
    return JSON.parse(
      localStorage.getItem(userEmail.concat(HISTORY_REQUEST)) ?? '[]'
    ) as string[];
  }
}
