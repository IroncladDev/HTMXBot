import { complete } from './completions';

console.log(await complete({
  prompt: "What's your favorite meme someone made about HTMX?",
  promptKey: "htmxCarson"
}))