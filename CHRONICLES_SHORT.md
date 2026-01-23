# TVP CHRONICLES: State Vs. Intent Architecture (S.I.A)

This is AI polished for brevity, read longer version to relive my thoughts or stay for a summary if you're in a rush. Mind you, the latter is constantly updated.

### _The Basis of the New TVP Architecture_

I’ve managed to build a low-level, path-addressable state kernel with synchronous mediation and batched observation that mirrors the JS Event Loop. With great power comes great responsibility, and this class—**The Reactor**—is powerful enough that I’m actually sitting down to write this.

It’s all possible with Proxies, but let’s skip the technical details and explain the _why_ before we get to the _how_.

### The Philosophy: Collecting Like Terms

Many web video players fire fake events just to trick the media tech into believing it’s a native video element. I’ve decided to fall back to a raw principle in algebra: **collecting like terms.**

Software engineers love building Adapters, Contexts, and Request Managers to make two devices fit one slot. That’s not complex, it’s just not thinking. Standard isn’t a constant; it’s just what’s comfortable right now.

**The Analogy: Bob and the Pig**
Picture a room with an AC that turns on only when the entity inside is hot.
A regular Web Dev, **Bob**, sees a human inside. _"Okay, when human sweats, AC on."_ Case closed.
Then, the human is replaced with a **Pig**. Note: pigs don’t sweat.

Bob panics. He builds layers of adapters to learn how the pig works. Because he’s trained on event systems, Bob is going to _make_ that pig sweat, release fake sweat if he has to; just so his system can detect it.

**The Proposal**
I’m building a system that says: **"If entity is hot, turn AC on."** Declaratively.
I’m not listening for sweat. My adapter says: _"Hey entity, here is a state: `hot = false`. When you turn hot, change it to `true`."_

I don’t care if you sweat, or if you get hot because you’re nervous. Just switch the state. This makes my core stable. I’m not forcing a pig to sweat just to satisfy my code.

### The Mechanics: Mediators and Listeners

Before 2015, intercepting object property changes (`entity.hot = true`) in JS was impossible. Now, thanks to Proxies, I have implemented **State Mediators** and **State Listeners**.

1. **State Mediator:** Involves you _before_ or _exactly when_ something happens. It’s synchronous. You can terminate the action.
2. **State Listener:** Called _after_ something happened.

**The Rule:** You can’t do both with Gets, but you can do both with Sets. Basically, use `.set()` for input integrity while `.get()` for output derviation.

### State and Intent

I’ve defined two concepts to handle this surgical precision.

- **State:** Fact. Determined _after_ something happens.
- **Intent:** A Wish or Request. Something you _want_, regardless of limits.

**The UI Mirror**
The UI is a side effect of State, like a mirror. But it’s also a medium to communicate, like a mirror where you adjust your looks.
React.js is a slave to state, it rebuilds the whole world just to change one thing (easy on the brain, heavy on the CPU). Signals are fast but skin-deep; they can’t handle nested properties without getting scary.
I wanted to remove complexity without adding more.

**The API Shift**
State is a declaration of _what is_.
People usually use methods to change state: `human.straightenNose()`. That requires learning an API.
I propose: `human.state.nose` and `human.intent.nose`.
I shouldn’t need to know that `pig.makeNervous()` sets `pig.hot`.
My code: `pig.intent.hot = true` (Request) → System handles logic → `pig.state.hot = true` (Fact).
I’m bringing state to **appeals**, not just declarations.

### The Rules (Reality & The Great Mavo)

You can wish for anything, but your situation limits you. We don’t go wishing for what we can’t have; we learnt that the hard way.

- **You cannot mediate Intents.** A wish happens when initiated. The puppet doesn’t hold the string.
- **State mediates Reality.** State stops you. As The Great Mavo said, _"No more way for poor people."_ Your situation (State) doesn't stop the wish, but it limits the realization.

Your clothes reflect your status _after_ you get rich. Unless you’re living a fake life (don’t let me quote Mavo again abeg).

### The Compromise: Rejection & The Event Wave

Since Intents are unmediated, how do we stop a slider from moving when the logic forbids it? We need **Prevent Default** (borrowed from the DOM) but called **Reject** here since it's more like a stamp for other listeners placed by the intent owner.

The Reflector (UI) wants to be optimistic, but it must be smart enough to know when to stop deceiving itself.
The Compromise: **Rejected intent is not handled by the tech; it’s handled by optimistic listeners.**

**The Parable of the King**

- **The King:** Wishes `man.intent.flying = true`.
- **Media Tech (Adviser):** Decides if it’s possible. If not, it calls `reject()`. _"Hey, slaves to the King, don't reflect this dream."_
- **The Court Man (Smart Optimist):** Checks if intent was rejected. If yes, does nothing.
- **The Artist (Reckless Optimist):** Paints the King flying anyway.

**Capture vs. Bubble**

- **Tech (Owner):** Listens on **Capture** (runs first) to warn/reject.
- **Smart Optimist:** Listens on **Bubble** (runs last) to check for rejection.
- **Crazy Renderer:** Listens anywhere and just paints.

It’s like I’m a wizard granting wishes. If you, a mere human, try to listen to wishes too, I have to stand at the front of the crowd (Capture) and shout _"Don't do it!"_ so you don't break things meaning you should be waiting at the end of the line (Bubble).
Remember this: Rejection is not a rollback mechanism.
It is a signal of disapproval, not enforcement.

### Summary: The Final Piece

I added an event loop for **Intentful State** (declare `cancellable: true`).

- **State:** Use for immediate things (Settings, Configurations). Updates instantly.
- **Intent:** Use for requests (Video Play, Seek). Listens and declares when ready, like a wish granted.

**The Architecture:**

- **Mediators:** For Data Integrity.
- **Intents:** For User Requests.
- **Rejection:** For Owner Approval.

If I succeeded, I’ve effectively made you dumber, or at least reduced your work. Power is in your hands.
