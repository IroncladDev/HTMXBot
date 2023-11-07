const promptButton = (head: string, body: string) => `<button 
  class="glass flex flex-col gap-0.5 grow basis-0 text-left items-start"
  _="on click
  if not the disabled of #prompt
    set the value of #prompt to '${[head, body].join(" ")}'
    click() the #chat-button"
>
  <span class="text-mid text-sm font-semibold">${head}</span>
  <span class="text-sm text-muted-foreground">${body}</span>
</button>`;

const emptyState = `<div id="emptyState" class="flex flex-col gap-4 p-4 items-center justify-center grow h-full">
<h1 
  class="text-4xl font-bold text-foreground"
  _="init
  set names to { htmxOrg: 'htmx.org', htmxCarson: 'Carson Gross', grug: 'Grug' }
  call loadConvos() then set convos to it
  set my innerHTML to the names[convos[$index].promptKey]"
></h1>

<div
  class="flex flex-col gap-2 w-full hidden max-w-md"
  _="init call loadConvos() then set convos to it
  if the promptKey of convos[$index] is 'htmxOrg' then remove .hidden from me"
>
  <div class="flex gap-2 w-full">
    ${promptButton("Tell me about", "the htmx laser horse")}
    ${promptButton("What is your favorite meme", "made by WarrenInTheBuff")}
  </div>
  <div class="flex gap-2 w-full">
    ${promptButton("Tell me a funny time", "when you got owned")}
    ${promptButton("What was the", "influencer money trend")}
  </div>
</div>

<div
  class="flex flex-col gap-2 w-full hidden max-w-md"
  _="init call loadConvos() then set convos to it
  if the promptKey of convos[$index] is 'htmxCarson' then remove .hidden from me"
>
  <div class="flex gap-2 w-full">
    ${promptButton("What is HTMX", "in a nutshell")}
    ${promptButton(
      "What are the benefits",
      "of using Hyperscript over plain Javascript",
    )}
  </div>
  <div class="flex gap-2 w-full">
    ${promptButton("Teach me", "how to use HTMX with Websockets")}
    ${promptButton("Tell me about", "your past professional experience")}
  </div>
</div>

<div
  class="flex flex-col gap-2 w-full hidden max-w-md"
  _="init call loadConvos() then set convos to it
  if the promptKey of convos[$index] is 'grug' then remove .hidden from me"
>
  <div class="flex gap-2 w-full">
    ${promptButton("Should I", "write unit tests")}
    ${promptButton("When should", "grug smash things with club")}
  </div>
  <div class="flex gap-2 w-full">
    ${promptButton("What does grug think", "About complexity")}
    ${promptButton("Explain", "the FOLD Acronym")}
  </div>
</div>

<!--Little hack to make hyperscript aware of the current node-->
<img 
  src="" 
  alt="Little hack to make hyperscript aware of the #emptyState node"  
  onerror="_hyperscript.processNode(document.getElementById('emptyState'))" style="display:none"
/>
</div>`;

export default emptyState;
