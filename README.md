# FACEIT Mappio

> Chrome extension for the FACEIT CSGO esports platform that displays everyone's map-related information in the match room letting you make more educated decisions during the veto process.

> [[chrome web store]](https://chrome.google.com/webstore/detail/faceit-mappio/kaeamgghipbhkjgibgglnmmnobdakapa)

The idea behind creating this extension is to provide more information about the match players directly in the match room. I usually play with a stack of friends and I am often the captain of the team. Every time I get to the veto stage, I find myself openning the opponents' profiles to check their map statistics. FACEIT web pages take notoriously long to load, so I frequently miss the first couple of veto picks. Hoping to resolve this issue, I created Mappio.

## Features

### Map Statistics

This is the MVP feature of this extension. Mappio appends each player's map statistics to their player card in the match room.

<table>
  <caption><p align="center">Comparison between default and Mappio player cards.</p></caption>
  <tr>
    <th>w/o Mappio</th>
    <th>w/ Mappio</th>
  </tr>
  <tr>
    <td><img src="/media/playerCards/Before.png" alt="FACEIT match room player card w/o mappio"></td>
    <td><img src="/media/playerCards/After.png" alt="FACEIT match room player card w/ mappio"></td>
  </tr>
</table>

### Map Drop Probabilities

While developing the Map Statistics feature, I realized it would also be useful to see the opponent's map dropping statistics. Let's say if you see that the opponent drops Nuke very often, you might want to let him drop it and use your veto pick to drop some other map you do not want to play. Mappio calculates the opposing team's captain map drop probabilities and appends them to the map cards in the match room.

<table>
  <caption><p align="center">Comparison between default and Mappio map cards.</p></caption>
  <tr>
    <th>w/o Mappio</th>
    <th>w/ Mappio</th>
  </tr>
  <tr>
    <td><img src="/media/mapCards/Before.png" alt="FACEIT match room map cards w/o mappio"></td>
    <td><img src="/media/mapCards/After.png" alt="FACEIT match room map cards w/ mappio"></td>
  </tr>
</table>

### Popup

Mappio features an extension popup that allows you to enable and disable features.

<table align="center">
  <tr>
    <th>Mappio extension popup</th>
  </tr>
  <tr>
    <td><img width="387" src="/media/popup/Popup.png" alt="Mappio extension popup"></td>
  </tr>
</table>

## Development

###### Clone the repository

```bash
git clone https://github.com/dankotov/faceit-mappio.git
```

###### Install dependencies

```bash
npm install
```

###### Build the extension

To automatically rebuild on detected changes:

```bash
npm run dev
```

To build for publishing:

```bash
npm run build
```

> Building the extension will create a `dist` folder.

###### Load in Chrome

1. Go to `chrome://extensions`.
2. Enable developer mode toggle on the top right side of the window.
3. Click on `Load unpacked` button.
4. Select the `dist` folder.
