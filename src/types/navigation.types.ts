export type PageType = 'messages' | 'search' | 'profile' | 'unknown';
export type BlockMode = 'hard' | 'soft';
export type EvaluationResult = 'allowed' | 'restricted' | 'blocked';

export interface UrlRule {
  pattern: RegExp;
  result: EvaluationResult;
  blockMode: BlockMode;
  pageType?: PageType;
}

export interface UrlEvaluation {
  url: string;
  path: string;
  result: EvaluationResult;
  blockMode: BlockMode;
  pageType: PageType;
  shouldBlock: boolean;
}
