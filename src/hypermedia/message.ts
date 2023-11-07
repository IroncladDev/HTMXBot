import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import sanitize from "sanitize-html";
import { Msg } from "..";
import { allowedTags, promptAuthors } from "../config";

type HypermediaMessage = string;

export default class Message {
  public message: Msg;

  constructor(message: Msg) {
    this.message = message;
  }

  public render({
    swapOob,
  }: {
    swapOob?: boolean;
  } = {}): HypermediaMessage {
    const escapedContent = this.message.content;

    const renderedMarkdown = DOMPurify.sanitize(
      sanitize(marked.parse(escapedContent), {
        allowedTags,
      }),
    );

    if (this.message.author === "Human") {
      return `<div class="flex gap-2 items-center pb-0 mt-4" id="${this.message.id}">
  <div class="w-8 flex flex-col items-center shrink-0 self-stretch">
    <div class="grow"></div>
    <div class="w-2 h-2 rounded-full bg-border"></div>
    <div class="w-0.5 grow bg-border"></div>
  </div>
  <div class="markdown muted">${renderedMarkdown}</div>
</div>`;
    }

    return `<div 
  class="flex gap-2 pt-0" id="${this.message.id}"
  _="init
  scrollIntoView() the #scroll-view
  if the first <pre/> in me
    call hljs.highlightAll()
  end"
  ${swapOob ? 'hx-swap-oob="true"' : ""}>
  <div class="w-8 h-10 flex flex-col items-center shrink-0 self-stretch">
    <div class="w-0.5 grow bg-border"></div>
    <div 
      class="avatar"
      style="background-image: url(${promptAuthors[this.message.author].image})"
    ></div>
  </div>
  <div class="flex flex-col gap-1 pt-2">
    <span class="font-bold text-sm text-slate-700 dark:text-slate-400">${
      promptAuthors[this.message.author].displayName
    }</span>
    <div class="markdown">${renderedMarkdown}</div>
  </div>
</div>`;
  }

  public static renderMultiple(messages: Array<HypermediaMessage>) {
    return `<div id="messages" class="flex flex-col" hx-swap-oob="beforeend">
  ${messages.join("\n  ")}
</div>`;
  }
}
