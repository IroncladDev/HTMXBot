const invalidState = `<div id="invalidState" class="flex flex-col gap-4 p-4 items-center justify-center grow h-full">

  <h1 class="text-foreground font-bold text-4xl">It's So Over</h1>

  <p class="text-muted-foreground text-sm">This conversation's history has been malformed and couldn't be parsed.</p>

  <div class="flex gap-2">
    <button
      class="px-3 py-2 rounded-lg border border-border grow bg-accent/25 hover:bg-accent/35 transition-colors basis-0 text-foreground text-sm whitespace-nowrap"
      _="on click showModal() the #delete-modal
        call loadConvos() then set conversations to it
        set the innerText of #del-convo-name to conversations[$index].title"
    >Delete Conversation</button>
    <button
      class="px-3 py-2 rounded-lg border border-border grow bg-accent/10 hover:bg-accent/20 transition-colors basis-0 text-foreground text-sm whitespace-nowrap"
      _="on click showModal() the #new-chat
        call randomConvoName() then trigger changeName(name:it) on <.conversationName/>"
    >New Conversation</button>
  </div>

  <!--Little hack to make hyperscript aware of the current node-->
  <img 
    src="" 
    alt="Little hack to make hyperscript aware of the #emptyState node"  
    onerror="_hyperscript.processNode(document.getElementById('invalidState'))" style="display:none"
  />
</div>`;

export default invalidState;
