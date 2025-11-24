// app/config/demoQuestions.ts

export interface SignStep {
  sign: string;
  english: string;
  confidence: number;
}

export interface DemoQuestion {
  id: number;
  key: string;
  question: string;
  signs: SignStep[];
  templateResponse: (profile?: any) => string;
}

export const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    id: 1,
    key: '1',
    question: 'Can you introduce yourself?',
    signs: [
      { sign: 'hello', english: 'Hello', confidence: 0.95 },
      { sign: 'name', english: 'my name is', confidence: 0.93 },
      { sign: 'nice_to_meet_you', english: 'Nice to meet you!', confidence: 0.91 },
    ],
    templateResponse: (profile) => 
      `Hello, my name is ${profile?.fullName || 'Crystal'}. Nice to meet you!`
  },
  {
    id: 2,
    key: '2',
    question: 'Where are you based?',
    signs: [
      { sign: 'i', english: 'I', confidence: 0.92 },
      { sign: 'live', english: 'live in', confidence: 0.90 },
      { sign: 'rwanda', english: 'Rwanda', confidence: 0.94 },
    ],
    templateResponse: () => 'I currently live in Rwanda.'
  },
  {
    id: 3,
    key: '3',
    question: 'What experience do you have?',
    signs: [
      { sign: 'i', english: 'I', confidence: 0.92 },
      { sign: 'experience', english: 'have experience in', confidence: 0.93 },
      { sign: 'skills', english: 'these skills', confidence: 0.91 },
    ],
    templateResponse: (profile) => {
      const skills = profile?.skills?.join(', ') || 'software development and machine learning';
      return `I have experience in ${skills}.`;
    }
  },
  {
    id: 4,
    key: '4',
    question: 'Why are you interested in this role?',
    signs: [
      { sign: 'i', english: 'I', confidence: 0.90 },
      { sign: 'interested', english: 'am interested', confidence: 0.92 },
      { sign: 'plan', english: 'in this plan', confidence: 0.89 },
    ],
    templateResponse: () => 
      'I am very interested in this role because it aligns with my career plan and skills.'
  },
  {
    id: 5,
    key: '5',
    question: 'Can you work in a team?',
    signs: [
      { sign: 'i', english: 'I', confidence: 0.91 },
      { sign: 'can', english: 'can', confidence: 0.93 },
      { sign: 'team', english: 'work in a team', confidence: 0.90 },
      { sign: 'work', english: 'effectively', confidence: 0.88 },
    ],
    templateResponse: () => 
      'Yes, I can work well in a team and contribute effectively to group projects.'
  },
  {
    id: 6,
    key: '6',
    question: 'Thank you for interviewing today',
    signs: [
      { sign: 'thank_you', english: 'Thank you', confidence: 0.94 },
      { sign: 'goodbye', english: 'Goodbye!', confidence: 0.92 },
    ],
    templateResponse: () => 'Thank you for interviewing me today. Goodbye!'
  },
];

// Keyword mapping for voice detection
export const QUESTION_KEYWORDS: Record<string, number> = {
  'introduce': 1,
  'yourself': 1,
  'name': 1,
  'who': 1,
  
  'based': 2,
  'location': 2,
  'where': 2,
  'live': 2,
  
  'experience': 3,
  'worked': 3,
  'skills': 3,
  'background': 3,
  
  'interested': 4,
  'why': 4,
  'role': 4,
  'position': 4,
  
  'team': 5,
  'teamwork': 5,
  'collaborate': 5,
  
  'thank': 6,
  'thanks': 6,
  'goodbye': 6,
};