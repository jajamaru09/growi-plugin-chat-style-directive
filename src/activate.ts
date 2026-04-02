import { fetchIconMap, getCachedIconMap } from './icon-fetcher';
import { remarkChatStyle } from './remark-chat-style';
import { injectStyles } from './styles';

declare const growiFacade: {
  markdownRenderer?: {
    optionsGenerators: {
      customGenerateViewOptions: (...args: any[]) => any;
      generateViewOptions: (...args: any[]) => any;
      customGeneratePreviewOptions: (...args: any[]) => any;
      generatePreviewOptions: (...args: any[]) => any;
    };
  };
};

export const activate = (): void => {
  console.debug('[chat-style] activate() called');
  if (typeof growiFacade === 'undefined' || growiFacade.markdownRenderer == null) {
    console.warn('[chat-style] growiFacade not available');
    return;
  }
  console.debug('[chat-style] growiFacade.markdownRenderer found');

  // アイコンマップの先行取得を開始（結果はキャッシュされる）
  fetchIconMap();

  const { optionsGenerators } = growiFacade.markdownRenderer;

  // 閲覧モード
  const origView = optionsGenerators.generateViewOptions;
  optionsGenerators.customGenerateViewOptions = (...args: any[]) => {
    const options = origView(...args);
    injectStyles();
    const iconMap = getCachedIconMap() ?? new Map();
    console.debug('[chat-style] customGenerateViewOptions: iconMap size =', iconMap.size, '(null means fetch not complete yet:', getCachedIconMap() === null, ')');
    options.remarkPlugins.push(remarkChatStyle(iconMap));
    return options;
  };

  // エディタプレビュー
  const origPreview = optionsGenerators.generatePreviewOptions;
  optionsGenerators.customGeneratePreviewOptions = (...args: any[]) => {
    const options = origPreview(...args);
    injectStyles();
    const iconMap = getCachedIconMap() ?? new Map();
    console.debug('[chat-style] customGeneratePreviewOptions: iconMap size =', iconMap.size);
    options.remarkPlugins.push(remarkChatStyle(iconMap));
    return options;
  };
};

export const deactivate = (): void => {};
