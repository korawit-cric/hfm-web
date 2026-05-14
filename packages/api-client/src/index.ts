// API definitions
export { applicationsApi } from './applications.js';
export { countriesApi } from './countries.js';
export { experiencesApi } from './experiences.js';
export { faqsApi } from './faqs.js';
export { rankingsApi } from './rankings.js';
export { prizesApi } from './prizes.js';

// Types
export type {
  ApiEndpoint,
  ApiEndpointWithBody,
  Faq,
  Country,
  Experience,
  Locale,
  Prize,
  Ranking,
} from './types.js';
export type {
  CreateApplicationBody,
  SavedApplication,
} from './applications.js';
