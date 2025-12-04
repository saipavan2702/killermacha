
```dataviewjs
const clockDiv = this.container.createDiv({ cls: "analog-clock-widget" });
clockDiv.innerHTML = `
  <div style="position: relative; width: 135px; height: 135px; border-radius: 35%; border: 8px solid #333; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: auto;">
    <div id="hour-hand" style="position: absolute; width: 4px; height: 30px; background-color: #333; top: 50%; left: 50%; transform-origin: 50% 100%; transform: translateX(-50%) translateY(-100%);"></div>
    <div id="minute-hand" style="position: absolute; width: 4px; height: 50px; background-color: #666; top: 50%; left: 50%; transform-origin: 50% 100%; transform: translateX(-50%) translateY(-100%);"></div>
    <div id="second-hand" style="position: absolute; width: 2px; height: 55px; background-color: red; top: 50%; left: 50%; transform-origin: 50% 100%; transform: translateX(-50%) translateY(-100%);"></div>
  </div>
`;

function updateAnalogClock() {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const hourRotation = (hours * 30) + (minutes / 2);
  const minuteRotation = minutes * 6;
  const secondRotation = seconds * 6;
  const hourHand = clockDiv.querySelector("#hour-hand");
  const minuteHand = clockDiv.querySelector("#minute-hand");
  const secondHand = clockDiv.querySelector("#second-hand");
  if (hourHand && minuteHand && secondHand) {
    hourHand.style.transform = `translateX(-50%) translateY(-100%) rotate(${hourRotation}deg)`;
    minuteHand.style.transform = `translateX(-50%) translateY(-100%) rotate(${minuteRotation}deg)`;
    secondHand.style.transform = `translateX(-50%) translateY(-100%) rotate(${secondRotation}deg)`;
  }
  requestAnimationFrame(updateAnalogClock);
}

updateAnalogClock();
```

```dataviewjs
// Create a container div for the clock widget
const clockDiv = this.container.createDiv({ cls: "clock-widget" });

// Inject HTML structure after the container is created
clockDiv.innerHTML = `
  <div style="text-align: center;">
      <p id="clock-time" style="font-size: 2em; margin: 0;">Loading...</p>
      <p id="clock-date" style="margin: 0; color: gray;">Loading...</p>
  </div>
`;

// Cache the clock and date elements outside the update function for performance
const clockElement = clockDiv.querySelector("#clock-time");
const dateElement = clockDiv.querySelector("#clock-date");

// JavaScript function to update the clock and date
function updateClock() {
  const now = new Date();
  
  // Specify options to use the 24-hour format (hour12: false)
  const timeString = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true // Use 24-hour format
  });

  // Manually format the date as DD/MM/YYYY
  const day = String(now.getDate()).padStart(2, '0'); // Ensure two digits
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = now.getFullYear();
  const dateString = `${day}/${month}/${year}`; // Format the date

  // Update the content of the clock and date directly
  if (clockElement) {
    clockElement.textContent = timeString;
  }
  if (dateElement) {
    dateElement.textContent = dateString;
  }

  // Schedule the next update
  requestAnimationFrame(updateClock);
}

// Start updating the clock
updateClock();
```


<iframe src="https://i.pinimg.com/originals/cd/33/34/cd3334e92e7c63575bf59bfdd2766f85.gif" 
style="width:350%; height:350px;">
</iframe>
<iframe src="https://i.pinimg.com/originals/ef/0e/83/ef0e8349ac249a53cb6ead41803208df.gif" 
style="width:350%; height:350px;"
</iframe>
<iframe src="https://i.pinimg.com/originals/2f/6c/df/2f6cdf7605d12ab2628250bc16dec284.gif" 
style="width:350%; height:350px;">
</iframe>

> [!info] time management references
>- [fayefilms - stay focused](https://youtu.be/gyITyJgNyQ8?si=fPmjvnKhyMoHbDN-)
>- [reddit; work desk is also gaming desk](https://www.reddit.com/r/GirlGamers/comments/1fm9o2p/tips_on_separating_work_from_play_while_using_the/)
>- worst dnd dice role for studying
>---
>- **<u>dice rules</u>**
>	- 1 - 8 : deep breathers
>	- 9 - 12 : drawing sesh of 10 minutes 
>	- 13 - 16 : lie down in bed for 5 minutes or play w/ the dog
>	- 17 - 18 : grab a snack down stairs
>	- 19 : finish what the fuck u were doing
>	- 20: pick any choice




