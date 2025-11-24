// lib/templates.ts - CORRECTED FOR YOUR ACTUAL SIGNS

interface UserProfile {
  fullName?: string;
  jobTitle?: string;
  skills?: string[];
  yearsExperience?: number;
  education?: string;
  bio?: string;
  achievements?: string[];
  location?: string;
}

interface TemplateContext {
  signs: string[];
  userProfile?: UserProfile;
  interviewStage?: 'opening' | 'experience' | 'skills' | 'closing';
}

// ✅ CORRECT - Matches your training data exactly
const SIGN_TO_ENGLISH: Record<string, string> = {
  'can': 'Can',
  'challenge': 'Challenge',
  'experience': 'Experience',
  'good_morning': 'Good morning',
  'goodbye': 'Goodbye',
  'have': 'Have',
  'hello': 'Hello',
  'help_me': 'Help me',
  'how': 'How?',
  'how_are_you': 'How are you?',
  'i': 'I',
  'i_understand': 'I understand',
  'im_ok': "I'm okay",
  'interested': 'Interested',
  'leadership': 'Leadership',
  'like': 'Like',
  'live_at': 'I live at',
  'money': 'Money',
  'name': 'My name is',
  'nice_to_meet_you': 'Nice to meet you',
  'no': 'No',
  'plan': 'Plan',
  'please': 'Please',
  'rwanda': 'Rwanda',
  'school': 'School',
  'skills': 'Skills',
  'strength': 'Strength',
  'study': 'Study',
  'success': 'Success',
  'team': 'Team',
  'thank_you': 'Thank you',
  'want': 'Want',
  'weakness': 'Weakness',
  'what': 'What?',
  'when': 'When?',
  'why': 'Why?',
  'will': 'Will',
  'work': 'Work',
  'yes': 'Yes'
};

// ✅ Multi-sign combinations using YOUR actual signs
function generateCombinationTemplate(signs: string[], profile: UserProfile): string | null {
  const signSet = new Set(signs);
  const name = profile.fullName || "the candidate";
  const location = profile.location || "Kigali";
  const role = profile.jobTitle || "professional";
  const education = profile.education || "university";
  const experience = profile.yearsExperience || "several";

  // === GREETINGS ===
  if (signSet.has('hello') && signSet.has('good_morning')) {
    return `Hello! Good morning to you.`;
  }

  if (signSet.has('hello') && signSet.has('nice_to_meet_you')) {
    return `Hello! Nice to meet you.`;
  }

  if (signSet.has('hello') && signSet.has('name')) {
    return `Hello! My name is ${name}.`;
  }

  // === INTRODUCTIONS ===
  if (signSet.has('name') && signSet.has('live_at') && signSet.has('rwanda')) {
    return `My name is ${name} and I live in ${location}, Rwanda.`;
  }

  if (signSet.has('i') && signSet.has('live_at') && signSet.has('rwanda')) {
    return `I live in Rwanda, specifically in ${location}.`;
  }

  if (signSet.has('name') && signSet.has('rwanda')) {
    return `My name is ${name} and I'm from Rwanda.`;
  }

  // === EXPERIENCE & SKILLS ===
  if (signSet.has('i') && signSet.has('have') && signSet.has('experience')) {
    return `I have ${experience} years of professional experience.`;
  }

  if (signSet.has('i') && signSet.has('have') && signSet.has('skills')) {
    return `I have strong technical skills and expertise.`;
  }

  if (signSet.has('experience') && signSet.has('work')) {
    return `I have work experience as a ${role}.`;
  }

  if (signSet.has('i') && signSet.has('can') && signSet.has('work')) {
    return `I can work effectively and deliver results.`;
  }

  // === EDUCATION ===
  if (signSet.has('i') && signSet.has('have') && signSet.has('school')) {
    return `I have completed my education at ${education}.`;
  }

  if (signSet.has('i') && signSet.has('study') && signSet.has('school')) {
    return `I studied at ${education}.`;
  }

  // === INTERESTS & GOALS ===
  if (signSet.has('i') && signSet.has('want') && signSet.has('work')) {
    return `I want to work with your team.`;
  }

  if (signSet.has('i') && signSet.has('interested') && signSet.has('work')) {
    return `I'm interested in this work opportunity.`;
  }

  if (signSet.has('i') && signSet.has('want') && signSet.has('success')) {
    return `I want to achieve success in this role.`;
  }

  if (signSet.has('i') && signSet.has('like') && signSet.has('team')) {
    return `I like working in team environments.`;
  }

  if (signSet.has('i') && signSet.has('want') && signSet.has('leadership')) {
    return `I want to develop my leadership skills.`;
  }

  // === STRENGTHS & WEAKNESSES ===
  if (signSet.has('i') && signSet.has('have') && signSet.has('strength')) {
    return `I have strong technical and problem-solving abilities.`;
  }

  if (signSet.has('strength') && signSet.has('leadership')) {
    return `My strength is leadership and team collaboration.`;
  }

  if (signSet.has('weakness') && signSet.has('i_understand')) {
    return `I understand my weaknesses and work to improve them.`;
  }

  // === QUESTIONS ===
  if (signSet.has('how') && signSet.has('can') && signSet.has('help_me')) {
    return `How can I help with this project?`;
  }

  if (signSet.has('what') && signSet.has('work')) {
    return `What does this work involve?`;
  }

  if (signSet.has('when') && signSet.has('can') && signSet.has('i')) {
    return `When can I start?`;
  }

  if (signSet.has('why') && signSet.has('i') && signSet.has('want')) {
    return `Why do I want this position? Let me explain.`;
  }

  if (signSet.has('how_are_you')) {
    return `How are you doing today?`;
  }

  // === AFFIRMATIONS ===
  if (signSet.has('yes') && signSet.has('i') && signSet.has('can')) {
    return `Yes, I can do that.`;
  }

  if (signSet.has('yes') && signSet.has('i_understand')) {
    return `Yes, I understand completely.`;
  }

  if (signSet.has('no') && signSet.has('i')) {
    return `No, I haven't done that before.`;
  }

  if (signSet.has('i_understand') && signSet.has('thank_you')) {
    return `I understand. Thank you for explaining.`;
  }

  if (signSet.has('im_ok') && signSet.has('thank_you')) {
    return `I'm doing well, thank you for asking.`;
  }

  // === PLANNING & GOALS ===
  if (signSet.has('i') && signSet.has('have') && signSet.has('plan')) {
    return `I have a clear plan for this role.`;
  }

  if (signSet.has('i') && signSet.has('will') && signSet.has('work')) {
    return `I will work hard and contribute to the team.`;
  }

  if (signSet.has('i') && signSet.has('will') && signSet.has('success')) {
    return `I will strive for success in this position.`;
  }

  // === TEAM & COLLABORATION ===
  if (signSet.has('i') && signSet.has('like') && signSet.has('team')) {
    return `I like collaborating with teams.`;
  }

  if (signSet.has('team') && signSet.has('work')) {
    return `I enjoy team-based work environments.`;
  }

  if (signSet.has('i') && signSet.has('can') && signSet.has('help_me')) {
    return `I can help the team achieve our goals.`;
  }

  // === CHALLENGES ===
  if (signSet.has('i') && signSet.has('can') && signSet.has('challenge')) {
    return `I can handle challenges effectively.`;
  }

  if (signSet.has('challenge') && signSet.has('experience')) {
    return `I have experience overcoming challenges.`;
  }

  // === COMPENSATION ===
  if (signSet.has('money') && signSet.has('what')) {
    return `What is the compensation range?`;
  }

  if (signSet.has('money') && signSet.has('i') && signSet.has('want')) {
    return `Regarding compensation, I'm looking for fair pay.`;
  }

  // === CLOSING ===
  if (signSet.has('thank_you') && signSet.has('goodbye')) {
    return `Thank you for your time. Goodbye!`;
  }

  if (signSet.has('thank_you') && signSet.has('nice_to_meet_you')) {
    return `Thank you! It was nice to meet you.`;
  }

  if (signSet.has('goodbye') && signSet.has('good_morning')) {
    return `Goodbye and have a great day!`;
  }

  if (signSet.has('please') && signSet.has('help_me')) {
    return `Please help me understand this better.`;
  }

  return null;
}

// Simple single-sign templates
const SIMPLE_TEMPLATES: Record<string, string[]> = {
  'can': ["I am capable of doing this."],
  'challenge': ["I enjoy challenges."],
  'experience': ["I have relevant experience."],
  'good_morning': ["Good morning!"],
  'goodbye': ["Goodbye!"],
  'have': ["I have this."],
  'hello': ["Hello!"],
  'help_me': ["Can you help me?"],
  'how': ["How does this work?"],
  'how_are_you': ["How are you?"],
  'i': ["I"],
  'i_understand': ["I understand."],
  'im_ok': ["I'm doing well."],
  'interested': ["I'm very interested."],
  'leadership': ["Leadership is important to me."],
  'like': ["I like this."],
  'live_at': ["I live in..."],
  'money': ["Regarding compensation..."],
  'name': ["My name is..."],
  'nice_to_meet_you': ["Nice to meet you!"],
  'no': ["No."],
  'plan': ["I have a plan."],
  'please': ["Please."],
  'rwanda': ["Rwanda."],
  'school': ["Education matters to me."],
  'skills': ["I have strong skills."],
  'strength': ["That's my strength."],
  'study': ["I studied this."],
  'success': ["Success is my goal."],
  'team': ["I value teamwork."],
  'thank_you': ["Thank you!"],
  'want': ["I want this."],
  'weakness': ["That's an area I'm improving."],
  'what': ["What is this?"],
  'when': ["When?"],
  'why': ["Why?"],
  'will': ["I will do this."],
  'work': ["Work is important to me."],
  'yes': ["Yes!"]
};

// Main generator
export function generateResponse(
  sign: string, 
  userProfile: UserProfile | undefined, 
  context: TemplateContext
): string {
  const { signs } = context;
  const profile = context.userProfile || userProfile || {};

  if (signs.length === 0) {
    return "Waiting for sign...";
  }

  // Try combinations first
  if (signs.length >= 2) {
    const combinedResponse = generateCombinationTemplate(signs, profile);
    if (combinedResponse) return combinedResponse;
  }

  // Fallback to simple templates
  const lastSign = signs[signs.length - 1];
  const templates = SIMPLE_TEMPLATES[lastSign];
  
  if (templates && templates.length > 0) {
    return templates[0];
  }

  return SIGN_TO_ENGLISH[lastSign] || lastSign.replace(/_/g, ' ');
}

export function getSignMeaning(sign: string): string {
  return SIGN_TO_ENGLISH[sign] || sign.replace(/_/g, ' ');
}