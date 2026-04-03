import { ensureIconMap } from './icon-fetcher';
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
    console.warn('[chat-style] growiFacade not available');
    return;
  }

  const { optionsGenerators } = growiFacade.markdownRenderer;

  // 閲覧モード（他プラグインが既に customGenerateViewOptions を設定している場合はチェーンする）
  const origView = optionsGenerators.customGenerateViewOptions ?? optionsGenerators.generateViewOptions;
  optionsGenerators.customGenerateViewOptions = (...args: any[]) => {
    const options = origView(...args);
    injectStyles();
    const iconMap = ensureIconMap();
    options.remarkPlugins.push(remarkChatStyle(iconMap));
    return options;
  };

  // エディタプレビュー（同様にチェーンする）
  const origPreview = optionsGenerators.customGeneratePreviewOptions ?? optionsGenerators.generatePreviewOptions;
  optionsGenerators.customGeneratePreviewOptions = (...args: any[]) => {
    const options = origPreview(...args);
    injectStyles();
    const iconMap = ensureIconMap();
    options.remarkPlugins.push(remarkChatStyle(iconMap));
    return options;
  };
};

export const deactivate = (): void => {};
