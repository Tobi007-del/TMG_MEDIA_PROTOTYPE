# TVP CHRONICLES: State Vs. Intent Architecture (S.I.A)

### _The Basis of the New TVP Architecture_

I’ve managed to build a low-level, path-addressable state kernel with synchronous mediation and batched observation that mirrors the JS Event Loop. Now, it is a well-known fact that with great power comes great responsibility. And this class or as I like to call it, **The Reactor** is quite powerful; so much so that I’m actually sitting down to write this.

It’s all possible with Proxies, but let me leave the technical details for a moment and explain the concept of _why_ before we go into what I have cognitively decided to shape the _how_.

### The Philosophy: Collecting Like Terms

One thing a lot of web video players have in common is firing events that didn’t happen just to make a media technology (and all parties involved) believe it’s the native platform video element by all means necessary.

Now, I’ve decided to fall back to a rather raw, commonly known principle in basic algebra: **the art of collecting like terms.**

If you want two different devices to fit into the same slot, oh! software engineers that like to call themselves "System Architects" quickly build an Adapter, a State Manager, a Context, and a Request Manager. That’s way too much. The issue is not the complexity, but the fact that no one is _thinking_. Everyone is just making software that follows the standard, but standard is not a constant; it's just what’s comfortable and predictable at that current time.

A rather simpler road to follow will still include the adapter, but let me give you an analogy, I love those.

Picture a room with air conditioners that are turned off. They only turn back on when the entity inside is hot. You’re an engineer, and you are told to build the terms to make that happen.

A classic regular Web Dev, I’d call him **Bob** would sit and see: _"Okay, a human is in the room. So, when human sweats, AC on. Problem solved for all humans. Case closed."_

Then, the human is replaced with a **Pig**. Take note: pigs don’t sweat.

Bob will go back to building and say, _"Hmm, one solution to serve two entities... I need an adapter and all those layers I mentioned."_ These layers, mind you, have to learn how that creature works to handle changes. Because of how web devs are trained on event systems, Bob is going to make that pig sweat. Yeah, release fake sweat if he has to, just so his system can detect sweat and turn the AC on.

With that rigidity, the whole system needs reconfiguration to be able to see to it that the pig sweats because you might need changes everywhere. There is no stable core.

### The Proposal: A Declarative Core

Now, I who happens to be not your regular dev have a proposal. It’s not something too new, but for libraries, it’s a concept that will be considered experimental (though it’s already quite comfortable for apps and websites). Simply put, it's state pluralism.

I’m going to build a system that says: **"If entity is hot, turn AC on."** Just as requested, declaratively.

I’m not listening to sweat, no. My adapter layer is one that says: _"Hey entity, I give you a state: `hot = false`. When you turn hot, change it to `true`."_

I’ll be listening. Mind you, I do not care _what_ changes you, neither do I need to know the intricacies of that change. So if you sweat when you're hot, or you’re hot when you’re nervous but don’t sweat, it’s not my business. Just switch the state.

This way, my core is stable; it never changes. The "like terms" were collected, which is the fact that they can all be _hot_. I’m not gonna force any pig to sweat, or pour water on the pig when I see it’s nervous and then tell everyone it’s sweating (including myself, apparently).

### The Mechanics: Mediators and Listeners

Now, that was the easy part. It would have been the hard part because everyone knows we can just change object properties like `entity.hot = false`. But before 2015, it wasn’t possible in JavaScript to intercept those changes and build that complex description I mentioned at the start. It’s probably similar to what powers many reactive frameworks out there. I’ll be bold enough to mention Vue 3, though I’ve only been at this about a year, so it’s probably not as performant (giving myself an obvious downplay).

Anyways, let’s continue. You’re here to see the rules of my new architecture because, with the power of Proxies, I have implemented **State Mediators** and **State Listeners**.

Let me explain what all that entails. Drop all your English constraints and just listen to what I translated mine to:

1. **State Mediator:** Must involve you _before_ or _exactly when_ something happens to state. It’s synchronous. It tells you when something is about to be Set, Gotten, or Deleted even. You can terminate them by returning a `TERMINATOR` (I don't wanna release technical details, just pretend to understand that).
2. **State Listener:** This is called _after_ something happened to state.

Now mind you, only 3 things can happen to state: a **Get**, **Set**, or **Delete**.

- **Gets** can be mediated during the get to control what is returned.
- **Sets** can be mediated _before_ the set and then listened to _after_ the set.
- **Deletes** function exactly the same as Sets.

So, you can’t do both (mediate and listen) with gets, but you can do both with sets.
I'll suggest, use `.set()` for input integrity; sanitization like some bouncer while .`get()` for simple formatting or output derivation like a value of 20% to be derived based on whatever video duration is later.

### Surgical Precision: Deep Reactivity

When you build something as powerful as that, it means you can solve problems at the root; if you’re fast, sharp, and surgical. Not everyone can handle it, but I know you’re smart if you’re still reading (either that or you’re AI).

Since it’s too hard to make sense of the "before" and the "after" and when to use them, I have defined two bright new concepts to join the party. That brings me to the title: **State and Intent**.

**State** is fact. It can only be determined _after_ something happens (like humans being hot after sweating, or pigs being hot after being nervous which is an assumption btw, I just have to stick with them for now). State is rather generic now.

**Intent** is my new inclusion. An Intent is a wish, or rather a request. Something you _want_, no matter how dreamy you are. But like everything in life, there are limits.

Another analogy for a minute (forget about Bob though, he was probably sacked and replaced with me before he started making other things sweat).

The **User Interface (UI)** is a side effect of State, right? Now stay with me. But it’s not just some state mirror; it’s also a medium for users to communicate with the system like a mirror where you could adjust your looks. I wish I had that.

Now things get really surgical here. React.js is a popular JS framework that brought state to the limelight, and they are slaves to it. They even do this thing where if state changes, they build the whole system again virtually and then compare that to the real thing just to then change what actually did. Like, bro, chill all that CPU so I can be dumb. (I do love it though, it’s easy on the brain).

My approach is not for the weak, mind you. Everyone is experimenting with state on the web now. There’s even this thing called **Signals** that react to changes on an object like `entity.hot = true`, but it cannot handle nested properties though, so it’s not surgical enough. It’s like surgery, but you can’t cut anything that doesn’t have just skin so always one layer deep, leading people to do scary things just to pretend to be reactive. I saw it and I ran immediately. I mean, the idea of removing complexity is to make users as dumb as can be. We are not on this earth to code, so why would someone remove complexity only to add more?

Anyways, let me not talk as if I’m not kind of a culprit, though I’m trying to make a stable surface for that core so everything will be magical.

I got lost a little there. Back to my **Intent** proposal. I’m taking them as wishes like you telling the mirror that "I want a pointed nose." That’s nothing new, as websites do have buttons, but what I’m implementing is how to do it by **collecting like terms**. I don’t want the Air Conditioner to know the terms of a pig being hot so that it can work for any animal. That event behavior locks things to the web and makes things that cannot be easily extended. My new take on things will probably allow me to make an array of players for all platforms.

As I mentioned earlier, State is a declaration of _what is_ after what may have happened. Now, that’s easy; a mirror just shows what it sees. When you want to change what is shown to also change _what is_, people tend to leave state and start calling what is often called **Methods** or **Functions**. Mind you, you have to know them to call them. Like now, with my pointed nose comment, I have to say `human.straightenNose()` and then it will do it since it implements it and allows it. That, to me, is already a learning curve; it means learning the API for the properties _and_ methods.

Now I bring to you something else:
A human should have a `human.state.nose` and a `human.intent.nose`. So, hey, all you need to know is a human’s got a nose, and everyone knows that.

Basically put, I’m saying we shouldn’t use methods or call functions to change state. That entails knowing that `pig.makeNervous()` changes `pig.hot` to true. With mine, I’m insinuating:
`pig.intent.hot = true` (Request) -> when needed to change -> `pig.state.hot = true` (Fact).

The system can call `man.straightenNose()` or `woman.tiltNose()` internally. Either way, I don’t want to have to check: _if man, straighten; if woman, tilt._ I’m just saying bring state to **appeals** too, not just declaration. Like how JS was taken server-side, I’ve taken the mantle upon myself and have thought of a way everyone can do this without going crazy. So I went crazy so you all don’t have to.

### The Rules of the Reactor

After vigorous thinking (this is a long document btw), back to the rules.

I want to point out a fact before anyone says I said you can wish for anything. Remember that even in life, it’s not just our situation that’s locked to the environ we find ourselves in. We don’t go wishing for what we can’t have or at least, we learnt that the hard way. So we never stopped wishing, but we always knew they were to no avail when it was bigger than what was permitted by whatever situation you are in.

Now, one big bold statement: **You cannot mediate Intents.**

A wish must happen when initiated. The puppet doesn’t hold the string when the puppeteer pulls. He can only maybe _not_ do what was intended if it’s broken, or it’s not supposed to, or just can’t. So it’s like you can dream, but **State** (which is your situation) will not stop you, but will remind you when you look around. _"No more way for poor people,"_ once said by The Great Mavo, after all.

But your situation, let’s say your parents can listen to your wishes to change your state. That line says it all. **State can be mediated and listened to**, as it’s what the UI (or mirror) will be listening to so it can reflect your new state or situation. It’s truly just a side effect. Your clothes don’t change your financial status; they reflect it, _after_ the fact that you are rich. Except it’s fake life you’re living, don’t let me quote Mavo again abeg, Nigeria to the world.

Now let me clog some holes. Intent doesn’t need clamping because the UI that allows one to request intent is already clamped by state (since it’s a reflection of what you can handle). Your brain cannot allow you to dream too far when it has seen your account, otherwise you might run mad.

But this is where things get fun. The UI could reflect both your **‘Want’** and your **‘Has’**. It’s a whole new twist to what can be reflected. It’s like seeing your dream self _and_ your actual self in a mirror if someone wanted to push the reactor to its limits.

### The Compromise: Rejection and the Event Loop

I don’t think I’ve drawn enough lines though. One more thing: a new concept was added to the flow `reject()`, borrowed from web event listeners `preventDefault()`.

Since intents are not mediated, anyone who was reflecting that optimistic wish (let’s say a range slider that wants to move faster than time; if you get my drift, I mean video current time oh) should at least watch for "if rejected." Because, like I said, the internals of magic is surgery.

It’s like the mirror will allow your dream self to reflect, but when it’s maybe too sunny, it will not. The reflector that wants to be optimistic for good user experience must take the responsibility of being **smart** to know: _"When should I just not reflect what is not, even when I am commanded to?"_

It’s not always that we should be allowed to deceive ourselves, after all. Everything should have limits. Great responsibility for such power. Even analytics could log that. But there is one drawback: the developer is not controlled by state-locked UI, so he can push intents to its bounds, and we don’t want to lose our right of being so watchful that we can know what someone is _and_ what they dream to be.

That brings me to an edge case which we can only solve with what I call a "compromise," in order not to overcomplicate the existing architecture that mirrors what people are already used to (so they won’t call me some mad man who found code so easy that he’s just painting his mind with it now).

#### The Parable of the King

The compromise entails this: twisting the mental model a little. **Preventing the default of an intent is not handled by the tech; it’s handled by optimistic listeners.** Though they could be smart or not.

Let me give you an instance of a **King**.
He can wish for anything. Say: `man.intent.flying = true`.
You can’t change his wish; it’s history. But you can try to grant it.

So, let’s say the **Media Technology** (Adviser) decides if this is physically or rather technically possible. If it is not, he calls **Prevent Default**, saying: _"Hey, optimistic listeners or rather, slaves to the king’s word, don’t suddenly start tryna reflect his dream."_

Now, I would do the portrayal of two slave types: an **Artist** and a **Court Man**.

1. **The Court Man (Smart Optimist):** Checks if intent was rejected. If rejected, he does nothing.
2. **The Artist (Reckless Optimist):** Doesn't even check and just goes, _"I’m painting no matter what, just wish away."_ True or not, you will see it.

It opens the mind to real amazing possibilities with what should just be code. It makes things a bit more interesting. Playing at a root level so low as object set interceptions, too many high-level operations or principles are possible. I mean, the analogy of a kingdom sounds like smart code, like you could do a whole village of stubborn and sensible people. Two things created with the same core could behave so differently.

### Implementation: Capture and Bubble

Now, that’s it without code. But since I introduced the **Event Wave**, I’d say `reject()` is _only_ for Intents. They’re like state.

- **The Tech (Owner):** Should only call it in the **Capture Phase** so it runs first.
- **The Smart Optimist:** Should always listen on the **Bubble Phase** so they can check if it was rejected.
- **The Crazy Renderer:** Could listen anywhere and just paint wishes.

You can tell it’s something different. I mean damn, it feels like telling a story. I’m just sad a little complexity was introduced, but what we are taking as the edge case is **Rejecting** (prevent default) - a progressive intent enhancement only to be called on the capture listener. Other than that, that’s all.

We already declared it was for only intents, but if I made them cancel tech behavior, that will be stupid because you could just not have intended it. So it’s a turn on the system. Since you said the tech should not mediate and block nor clamp or revert, it is its way of fighting back to anyone who’s listening that’s not him.

It’s like I’m a wizard, a wish granter. And then you, mere human, are trying to listen to wishes too. You’re not even gonna know the terms of granting and then start trying something crazy. So to help you progressively, I’ll tell you when you’re doing more harm than good. This means techs have to listen on the capture phase. Intent owners have to use capture so they could warn to prevent outright ignorance for those who would listen.

It’s like how you have to make sure you go to the front of a crowd or line and stand so everyone can hear you, especially when everyone is the same height. It’s also why only people that are sitting should be optimistic; they should always bubble if they’re gonna work on intent. Except from the owner of the intent state, he should capture to act and declare all others can _if_ they happen to be listening, meaning all optimists and general listeners should be waiting at the end of the line or sitting down.
And thanks to capture and bubble, we make standing up or clearly put, going first in a loop possible.
**Remember this**: Rejection is not a rollback mechanism.
It is a signal of disapproval, not enforcement.

If anything, it should be called `warnStupidPeople` since I had to go out of my way for work that nobody sent you in the first place. I’m talking as the Media Tech, not to you, Dear Reader.

I also added propagation, but I’m taking it as it’s for those that are doing some state changes that should be kept secret and want to just quiet everyone for a moment. Because unlike the browser, this API is open and everyone is a first-class citizen. There are no listeners running outside the event wave on its own phase. It gives more freedom after all. True surgery. Because the truth is in a library that’s ready for extensibility and that open source contribution. You can’t treat other devs like slaves. It’s like a lib builder, something low-level and all-powerful so you can define the rules all over again. The code would be used by devs anyway, so there’s no actual prevent default when I’m not selling them a product but an extensible core. So I’m part of the event loop sadly; any smart ass can break everything in one line. That’s my sacrifice.

### Summary

So, in summary, I added an event loop to be ready for anything later because when you meet the right people, you have to be ready for anything.

It’s only there for **Intentful State**, which you have to declare when creating the Reactor by passing `rejectable: true` (or rejecting ability). And then to cancel, you have to keep it in mind that you have to go to the front of the line by **Capturing** and then stopping the intent for other people that are not you (even when you’re the owner). They need to know when you disapprove, though you can’t stop a man from wishing.

That does it.

- **State** is everything you’re used to. You can mediate and listen to it. No need for the event loop there (even if you can still capture or bubble, depends if you find a need to; otherwise, don’t bother with it).
- The rest are **Progressive Enhancements** for turning a state system into some kind of request manager—in other words, making a mirror where you can change the reflection to affect the state even when you know only the state.

If I succeed, I have successfully made you dumber, or at least just reduced the work you have to do. It all bears quite a level of complexity, but you decide for yourself whether your use case demands State or Intent.

- **Intent** should be used to switch states to avoid methods in the flow.
- If the state is a direct set on reality, you don’t need intent.

So:

- For a **Settings Object** (scroll speed, configurations): You need **State** since they update instantly.
- For **Video Play**: It’s **Intent** because you can’t just get it upon asking. It listens and declares when it’s ready, like a wish being granted. Intent for asynchronous and events architecture; State for immediate declarations and configurations.

Power is in your hands though, as mediation was not prevented. So if you could think up some other concept, fine. This is just what I have enforced for this architecture where event triggers, events, and state live in the same world as intents and state, merging event flow and abstracting out the complexities of state transitions.

**For the Final Piece:**

- **Mediators:** For Data Integrity.
- **Intents:** For User Requests.
- **Rejection:** For Owner (of intent) Approval.

### After the Thought Process: Development and Testing

This part of this document is me logging various gathered information over time about high level ways to use the low level core.

The Triad of Getters: Surgical Precision
I’ve cracked the code on getter mediators. In this surgical world, we have three types: Virtual, Factual, and Mixed.

Virtual: Pulls from an external source (like the DOM). During initialization, it’s a liar, it reports default values that will overwrite your config if you listen too soon. You must defer these (lazy: true) until setup is done and you can trust reality.

Factual: Reads internal state (maybe processed). It always tells the truth and uses its own data. Never defer.

Mixed: Reads external data like Virtual, but acts as the authority even during init. You don't defer it because sometimes checking reality is cheaper than blindly overwriting it (e.g., video.src vs volume). Blindly setting src causes expensive reloads; checking the "Mixed" truth first prevents that.

The Heuristics: Factual uses data and is true. Virtual ignores data and lies (defer it). Mixed ignores data but is true enough to prevent costly errors. Basically, any Virtual you find a reason not to defer; usually due to cost or complexity is Mixed.

If initialization happens across multiple listeners, deferring the "liars" ensures no one reads garbage values before the state settles. That’s the logic for now

I also added `tick()` for synchronous flushes with path based options when needed, incase you need a listener to operate immediately mutation happens maybe for dom construction or initialization.

Now, there's also watchers for setters that need to update state immediately so like the native `Object.set()`, doesn't use the granularity of the event wave but is for immediate synchronous update meaning the flow is Mediator -> Watchers -> Listeners

### The Final API Signature

```javascript
// 1. MEDIATORS (The Logic)
// "When someone tries to set volume, force it to be a number."
config.set("volume", (val) => Number(val));
// 2. WATCHERS (The Internals/Survival)
// "Immediately after volume changes, update the audio engine. Do not wait."
config.watch("volume", (val) => (audioNode.gain.value = val));
// 3. LISTENERS (The UI)
// "When you have a free moment, update the slider position."
config.on("volume", (e) => (slider.value = e.value));
```

**The "Layman's" Pitch:**

> "Most video players try to paint the UI every time a variable changes. That’s like landing the plane to adjust the volume. TMG keeps the plane flying (logic) and only updates the cabin (UI) when the air is clear (Next Frame). That is why it feels faster than native."

_"I don't care if the volume changes 0.001ms later, as long as the slider animation doesn't stutter."_

### The Distilled Rules of Notifications 📜

#### Rule 1: The Rule of Survival (Sync) - `Reactor.watch()`

> **"If the next line of code will crash without this value, Watch it or stall if it's just UI."**
>
> - _Examples:_ `src`, `tracks`, `playlist`.
> - These are the **Engines**. They stay on land.

#### Rule 2: The Rule of the Cloud (Async) - `Reactor.on()`

> **"If it is just for human eyes or ears, Batch it."**
>
> - _Examples:_ `volume`, `brightness`, `css`, `classes`.
> - These are the **Cabin Controls**. They live in the sky.

#### Rule 3: The Rule of Stall - `Reactor.stall()`

> **"If the UI needs to report a complex calculation maybe on the next line, wait for the dust to settle."**
>
> - _Example:_ Muting/Unmuting (calculating the restore volume).
> - Don't report the intermediate math. Stall until the final value is ready.

#### Worthy of Note: Use `Reactor.tick()` to force updates to avoid stalling

### The Art of Resolution: The Power Line

I realized that a simple "Prevent Default" wasn't enough. It felt like silencing a subordinate rather than taking command. So, I introduced a political hierarchy to the architecture; a **Chain of Responsibility** that I call **The Power Line** for intents still btw.

In this system, we don't just stop things; we **Resolve** them. And unlike the chaos of the browser, rank is determined simply by **who got there first**.

#### The Hierarchy: Registration is Rank

Everything crucial happens in the **Capture Phase**. This is the active phase where the "Power Line" decisions are made.

1. **The Higher Power (Registered First):**
If a Plugin wants to be a "Leader" (e.g., Audio Context), it must register *before* the Tech. By capturing first, it gets the first look at the King's wish. It can choose to `resolve` (handle it) or `reject` (fail).
2. **The Adviser (The Tech):**
The Tech also listens on **Capture**. It stands in the line just like everyone else.
* **If it sees `e.resolved`:** It realizes a higher power has already handled the situation. It stands down.
* **If it sees `e.rejected`:** It sees the Leader failed. It can decide to be stubborn and say, *"I will save this situation,"* ignoring the rejection and executing the native behavior anyway.
* 2 & 3 can loop if you deem it possible.
3. **The Observers (The UI):**
The UI listens on **Bubble**. It doesn't get involved in the politics; it just watches the aftermath. Whether the Leader resolved it or the Adviser saved it, the UI just reflects the final outcome.

#### The Protocol

* **`resolve(message | signature)`**: "I Got This." (Stops lower ranks from acting).
* **`reject(reason)`**: "I Failed." (Warns lower ranks, but doesn't stop them if they are stubborn).

This architecture allows for **Stubborn Competence**. A Plugin(eg: Volume Audio Context) can try to be fancy at the front of the line only if it listens first. If it fails, the Tech (further down the capture line) picks up the pieces. If the Tech handles it, the UI (bubbling up) never even knows there was a struggle, because it just sees a working player.

That is the Art of Resolution.