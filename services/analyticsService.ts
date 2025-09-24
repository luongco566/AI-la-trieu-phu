
import { AnswerEvent } from '../types';

const ANALYTICS_KEY = 'millionaireAnalyticsEvents';

export const logAnswerEvent = (event: AnswerEvent): void => {
  try {
    const existingEvents = getAnswerEvents();
    const updatedEvents = [...existingEvents, event];
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updatedEvents));
  } catch (error) {
    console.error("Failed to log analytics event:", error);
  }
};

export const getAnswerEvents = (): AnswerEvent[] => {
  try {
    const savedEvents = localStorage.getItem(ANALYTICS_KEY);
    return savedEvents ? JSON.parse(savedEvents) : [];
  } catch (error) {
    console.error("Failed to retrieve analytics events:", error);
    return [];
  }
};
