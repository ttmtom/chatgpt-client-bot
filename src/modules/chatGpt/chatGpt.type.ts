export type ChatGptMessage = { role: string; content: string };

export type ChatGptChatArgs = {
  model: string;
  messages: ChatGptMessage[];
};

export type ChatGptChatResponse = {
  index: number;
  message: ChatGptMessage;
  finish_reason: string;
}[];

export type TChatGptChatSuccessResponse = {
  msgId: string;
};
