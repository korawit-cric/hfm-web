// API definitions
export { linksApi } from './links.js';
export { faqsApi } from './faqs.js';
export { rankingsApi } from './rankings.js';
export { prizesApi } from './prizes.js';

// Types
export type {
  ApiEndpoint,
  ApiEndpointWithBody,
  CreateLinkDto,
  Faq,
  LinkTranslationInput,
  Link,
  Locale,
  Prize,
  Ranking,
  UpdateLinkDto,
} from './types.js';
