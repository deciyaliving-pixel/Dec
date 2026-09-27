# Daily Claude Recap — Automatic Email

Har din apne aap ek **1-page summary** ban jaati hai ki aapne us din Claude par kya-kya kiya,
aur woh aapki email par chali jaati hai — taaki din bhar ka kuch alag se yaad rakhne ki zaroorat na pade.

## Kaise chalta hai (How it works)

1. Har raat **9:40 baje (IST)** ek scheduled Routine chalti hai.
2. Woh aapki us din ki Claude sessions padhti hai (`list_sessions`) — kya kaam hua, kya status hai, kaunse artifacts bane.
3. Us se ek chhota **1-page recap (Hinglish)** banta hai:
   - **Aaj aapne Claude par yeh kiya** — har session ka ek line + status
   - **Pending / kal ke liye** — jo open ya waiting hai
4. Recap **email** ho jaata hai: `shivamsharma8400@gmail.com`

Aapko din bhar kuch alag se save/likhne ki zaroorat nahi — recap seedhe aapki Claude activity se banta hai.

## Setup details

| Cheez | Value |
|------|-------|
| Type | Scheduled Routine (session-bound) |
| Schedule | `CRON_TZ=Asia/Kolkata 40 21 * * *` (roz 9:40pm IST) |
| Email to | shivamsharma8400@gmail.com |
| Data source | Aapki apni Claude Code sessions (titles, status, artifacts) |

## Badalna ho to (To change)

- **Time badalna**: Routine ka cron update karwa lo (jaise subah bhejni ho to `40 8 * * *`).
- **Band karna**: Routine ko disable/delete karwa do.
- **Format ya email address badalna**: bas keh do, prompt update kar dunga.

> Note: Recap sirf Claude Code sessions ki activity cover karta hai (jo `list_sessions` mein aati hai).
> Claude.ai chat app ki alag baat-cheet iska hissa nahi hoti.
