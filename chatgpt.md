# ChatGPT
Anson-Bot now supports ChatGPT. Users can ask ChatGPT questions directly from WhatsApp.

## Model
Anson-Bot requests the `gpt-3.5-turbo` model, the same one that powers ChatGPT.

## Context-building
Since the API does not support storing context, prompts are constructed in this manner:
```
For the prompt below, "Q:" indicates a prompt and "A:" indicates your response.
If "A:" is given, then this question-answer pair is our previous conversation, for your reference.
If "A:" is not given, then that question is your latest prompt. Answer it as you would do normally.
The "Qs" and "As" are only for your reference. DO NOT include them in your responses.

Q: [prompt_1]
A: [response_1]

Q: [prompt_2]
A: [response_2]

...

Q: [prompt]
A: 
```
Up to 5 pairs of conversions are stored. This limit can be changed by the `maxContextLength` constant in `commands/chatgpt/gpt.ts`.<br>
Previous prompts and responses are stored in the bot's side, not OpenAI.