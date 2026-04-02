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
  if (typeof growiFacade === 'undefined' || growiFacade.markdownRenderer == null) {
    console.warn('[chat-style-directive] growiFacade not available');
    return;
  }

  // アイコンマップの先行取得を開始（結果はキャッシュされる）
  fetchIconMap();

  const { optionsGenerators } = growiFacade.markdownRenderer;

  // 閲覧モード
  const origView = optionsGenerators.generateViewOptions;
  optionsGenerators.customGenerateViewOptions = (...args: any[]) => {
    const options = origView(...args);
    injectStyles();
    const iconMap = getCachedIconMap() ?? new Map();
    options.remarkPlugins.push(remarkChatStyle(iconMap));
    return options;
  };

  // エディタプレビュー
  const origPreview = optionsGenerators.generatePreviewOptions;
  optionsGenerators.customGeneratePreviewOptions = (...args: any[]) => {
    const options = origPreview(...args);
    injectStyles();
    const iconMap = getCachedIconMap() ?? new Map();
    options.remarkPlugins.push(remarkChatStyle(iconMap));
    return options;
  };
};

export const deactivate = (): void => {};
