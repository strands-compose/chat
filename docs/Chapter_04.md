# Chapter 04 — Using the Chat

This chapter walks through the chat screen from left to right. You will learn how to pick an agent, read the live Workflow panel, attach files and keep an eye on your monthly budget.

## The Welcome Screen

A new chat starts here. Pick an agent from the dropdown, then type a question or click one of the **Suggested** prompts (an admin writes those per agent).

![New chat with the agent picker and suggested questions](img/chat-welcome.png)

- The **?** button next to the picker opens the agent's description in a right-hand panel. It only shows when the agent has a description.
- If you see *"You do not have access to any AI agents"*, you are in no group that an agent is shared with. Ask your admin ([Chapter 08](Chapter_08.md#group-based-visibility)).
- You can bookmark a chat: the URL carries `?session_id=...`. Opening a link to a conversation you do not own sends you back to a new chat.

## Layout at a Glance

| Area | What is in it |
|---|---|
| Sidebar (left) | App title, **New chat**, history, your budget meter and user menu |
| Top bar | Agent name, collapse/expand all messages, compact/full width, session usage, light/dark toggle |
| Chat column | Messages and the composer |
| Workflow panel (right) | What the agents did during a turn |

On a phone the sidebar starts collapsed and the Workflow panel closes itself when a turn ends.

## Sidebar

<table>
<tr>
<td valign="top" width="220"><img src="img/chat-history.png" alt="Sidebar with history grouped by age and session actions" width="200"></td>
<td valign="top">

### New chat and history

- **New chat** opens the welcome screen. If an agent is still answering, you are asked first, because the running reply would be discarded.
- **History** groups chats by last use: *Today*, *Yesterday*, *This week*, *Older*. A chat is titled with the first 64 characters of your first message. Hover a title to read it in full.
- **Click a chat** to reopen it with all its messages. It stays with the agent it started with, so to talk to another agent, start a new chat.
- **Rename** (pencil, on hover) opens a small dialog. Type a name of up to 255 characters and press Enter.
- **Delete** (bin, on hover) hides the chat from your list for good. The confirm dialog says it cannot be undone. Admins can still see the archived record ([Chapter 05](Chapter_05.md)).
- The list loads your **50 most recent** chats. When you have more, a **Load more** button at the bottom adds the next 50. Loaded chats stay in the list when it refreshes, for example after you start a new chat.
- The arrow at the top **collapses** the sidebar to an icon rail. Your avatar then shows a ring that fills as you spend. On a phone the sidebar starts collapsed and closes itself after you pick a chat.

### Budget meter and user menu

The card at the bottom shows **Monthly budget**, spend and limit (for example `$2.40 / $10.00`), a bar, `% used` and the reset date (the 1st of next month). The bar changes colour at 50% and 85%, so you see trouble coming.

Click your name for **Profile**, **Admin panel** (superusers only) and **Sign out**.

> **Watch out:** the budget is enforced. Once spend reaches the limit, new messages are rejected with *"Budget exceeded. Please contact your administrator."* See [Chapter 08](Chapter_08.md#budgets).

</td>
</tr>
</table>

## Asking and Streaming

Type in the composer and press **Enter** to send. **Shift+Enter** adds a new line. While the agent works:

- The reply shows *Working on it…* plus a hint such as *"Doc Expert is answering…"*.
- The **Stop** button (square) asks *"Are you sure you want to stop the agent? The current response will be discarded."* Starting a new chat or opening another one asks the same thing while an agent is running.
- A stopped turn ends with the note *Generation stopped by user.*

![A multi-agent answer streaming with the Workflow panel open](img/chat-streaming.png)

Each message has actions: **Copy** on both sides, **Resend** on your own messages. Click a message's avatar to fold or unfold it. The top bar has *Collapse all* and *Expand all*, plus a compact/full width toggle that the browser remembers.

### Errors

A failed turn shows a red error bubble with the message text, for example when the agent service is unreachable. Error bubbles are saved with the chat, so they are still there after a reload.

## The Workflow Panel

The panel opens when you send a message. It shows who did what, live. Reopen it any time with the **Workflow** pill on an assistant message, or close it with **X**.

![Finished turn with a tool call expanded and token chips](img/chat-workflow.png)

| You see | It means |
|---|---|
| Status badge: *Running*, *Completed*, *Error* | State of the turn |
| Agent chips at the top (`×2`) | Which agents took part and how often they ran |
| A lane per agent, tagged *Orchestrator* or *Agent* | One run. Click the round avatar to fold it |
| Streamed text | What that agent wrote |
| **Thinking** | Model reasoning, if the model sends it |
| Tool badge: running, success, *Failed* | A tool call. Click it to see input and output |
| **Ask *Agent*** row with a bot icon, *Rejected* on error | An orchestrator asking another agent |
| *Handoff to ...* | Control passes to another agent |
| `N tokens` and *... finished* | Per-agent total when its run ends |
| **Jump to latest** | Appears when you scroll up during streaming |

The panel header shows **tokens for this turn**. Click the token total to split it into input, output, cache read and cache write.

> **Watch out:** the trace lives in your browser only. After a reload, or after you open another chat and come back, the answers are still there but the **Workflow** pill is gone.

## Attachments

![Composer with an image and a document attached](img/chat-attachments.png)

The **+** button offers **Image** and **Document**. You can also drop files anywhere on the page.

| Category | Extensions |
|---|---|
| Image | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp` |
| Document | `.pdf`, `.csv`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.html`, `.htm`, `.txt`, `.md` |

Defaults: 5 MB per file, 20 MB per message, 10 files per message. Admins change them with `CHAT_MEDIA_MAX_FILE_BYTES`, `CHAT_MEDIA_MAX_TOTAL_BYTES` and `CHAT_MEDIA_MAX_BLOCK_COUNT` ([Chapter 09](Chapter_09.md)). The browser checks these limits and shows a dialog when you break one. The format list comes from the server, so it follows the installed `strands-compose-agentcore`.

The **+** button works only for agents marked *multimodal*. Otherwise it shows *File upload not supported*.

## Your Profile and Usage

**Profile** opens a window with three tabs.

![Usage tab with weekly cost bars and a table of the same buckets](img/usage-dashboard.png)

- **Account**: edit first and last name, location, company and department (username and email are read-only). It also shows *This Month Usage* and two daily charts.
- **Agents**: the agents you can use, with their descriptions and kind.
- **Usage**: pick a timespan, then *Daily / Weekly / Monthly* and *Cost / Tokens*. A table lists the same buckets.

The top bar pill (**Session usage**) shows cost and tokens for the open chat. Costs depend on the pricing table ([Chapter 08](Chapter_08.md#pricing)).

## Dark Mode

The moon/sun button in the top bar switches themes. The first load follows your operating system. Your choice lasts for the browser tab only.

![The chat in dark mode](img/chat-dark.png)

## Next

[Chapter 05 — The Admin Panel](Chapter_05.md)
