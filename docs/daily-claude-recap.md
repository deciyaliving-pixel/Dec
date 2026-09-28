# Daily Claude Recap — Notion Note (Automatic)

Har din apne aap ek **1-page recap** banta hai ki aapne us din Claude par kya-kya kiya,
aur woh seedhe **Notion** mein save ho jaata hai — taaki din bhar ka kuch alag se yaad rakhne ki zaroorat na pade.

## Kaise chalta hai (How it works)

1. Har raat **11:05 baje (IST)** ek scheduled Routine chalti hai.
2. Woh aapki us din ki Claude sessions padhti hai (`list_sessions`) — kya kaam hua, kya status hai, kaunse artifacts bane.
3. Us se ek chhota **1-page recap (Hinglish)** banta hai:
   - **Aaj aapne Claude par yeh kiya** — har session ka ek line + status
   - **Pending / kal ke liye** — jo open ya waiting hai
4. Recap ek naye **Notion page** ke roop mein save hota hai, "Claude Daily Recap" parent page ke andar.

Aapko din bhar kuch alag se save/likhne ki zaroorat nahi — recap seedhe aapki Claude activity se banta hai.
**Email band hai** — sirf Notion note.

## Setup details

| Cheez | Value |
|------|-------|
| Type | Scheduled Routine (session-bound) |
| Schedule | `CRON_TZ=Asia/Kolkata 5 23 * * *` (roz 11:05pm IST) |
| Destination | Notion → "Claude Daily Recap" page ke andar naya daily page |
| Data source | Aapki apni Claude Code sessions (titles, status, artifacts) |

## Badalna ho to (To change)

- **Time badalna**: Routine ka cron update karwa lo (jaise subah ke liye `5 8 * * *`).
- **Band karna**: Routine ko disable/delete karwa do.
- **Wapas email / Dropbox / Google Drive**: bas keh do, destination badal dunga.

> Note 1: Recap sirf Claude Code sessions ki activity cover karta hai (jo `list_sessions` mein aati hai).
> Claude.ai chat app ki alag baat-cheet iska hissa nahi hoti.
>
> Note 2: Dropbox is time isliye use nahi hua kyunki us account ka email verify hona baaki tha.
