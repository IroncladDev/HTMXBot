import { Msg } from "..";

export default class History {
  public history: Array<Msg> = [];

  /**
   * Encodes this.history into a base64 string
   */
  public encode() {
    if (!this.history)
      throw new Error(
        "History.decode() must be called before History.encode()",
      );

    const jsonString = JSON.stringify(this.history);
    return encodeURIComponent(jsonString);
  }

  /**
   * Decodes and verifies the typing of an encoded base64 string into this.history
   * @param {string} encoded - Base64-encoded string
   */
  public decode(encoded: string) {
    if (typeof encoded === "string" && encoded.length === 0) {
      return [];
    }

    try {
      const jsonString = decodeURIComponent(encoded);
      const json = JSON.parse(jsonString);

      if (
        json.every(
          (x: any) =>
            typeof x === "object" &&
            "content" in x &&
            "author" in x &&
            typeof x.content === "string" &&
            typeof x.author === "string",
        )
      ) {
        this.history = json;
        return json;
      }

      throw new Error("Invalid conversation history");
    } catch (e) {
      console.log(e);
      throw new Error("Could not parse corrupted conversation history");
    }
  }

  /**
   * Appends a Msg to this.history
   * @param {Msg} message - Msg to append
   */
  public append(message: Msg) {
    this.history.push(message);
  }

  /**
   * Returns the two most recent messages in this.history
   */
  public prev(): [Msg, Msg] | undefined {
    if (!this.history)
      throw new Error(
        "History.decode() must be called before History.encode()",
      );

    if (this.history.length >= 2) {
      return this.history.slice(-2) as [Msg, Msg];
    }

    return undefined;
  }

  /**
   * Renders the History component over hypermedia
   */
  public render() {
    return `<input 
  type="hidden"
  name="history"
  id="history"
  value="${this.encode()}"
  hidden
  hx-swap-oob="true"
  _="init call loadConvos()
  set convos to it
  set the history of convos[$index] to @value
  call localStorage.setItem('conversations', JSON.stringify(convos))
  set the disabled of #prompt to ''
  set the disabled of #chat-button to ''
  reset() the #chat-form
  focus() the #prompt
  if #emptyState exists then hide #emptyState
  if #invalidState exists then hide #invalidState"
>`;
  }
}
