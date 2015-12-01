# Bulk Create Units

Provides a keybinding (shift+ctrl+v by default) that paste multiple units using the create-unit cheat. It also adds a slider (exponential scale) and input box to the sandbox panel to select how many units to paste.

## WIP

Turn off the preview by deselecting a unit (shift+ctrl+z by default).

Next-formation (shift+ctrl+f by default) to change between grid, area, and parade.

Parade formation ignores unit/slider and creates one of each unit (don't forget to kill the ragnarok) Parades are in toolbox formation, it was written with Sandbox Unit Organizer in mind, but the stock toolbox will work if it is currently open.

## Issues

- PA Sliders are not bidirectional, so updating the text will not change the slider (69721)
- The current grid wrapping algorithm breaks down as you wrap around to the other side of the planet.
- I'm hacking the sandbox panel input handling a bit, so if things go sideways, you might not be able to type in the input box, get hotkeys firing while typing, or have to click outside the sandbox panel to get hotkeys working in game. I don't think this will happen, but I had these situations during development.
