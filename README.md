# RayCastrZ
**This** is the **future** - *the **future** is* **1992**
## Ok, thats when ... but where?
Try it out live; right here: https://dkzeb.github.io/raycastrz/

#### Controls:

- **WASD + Arrow Left & Right:** Movement, strafing and rotation
- **Arrow Up:** Fire Weapon - *(yeah it seems wierd, but give it a try, it makes sense)*
- **1 - 3:** Switch Weapons - *(Pistol, Shotgun, Uzi)*
- **m:** Show/Hide overhead map
- **Shift:** Walk speed modifier

#### Bleeding edge?: 

![Deploy to GH status](https://github.com/dkzeb/raycastrz/actions/workflows/deploy-release.yml/badge.svg)

Im also considering a "standalone" type release based on nwjs or electron for all OS, but that might be a bit crazy - who knows, lets see where this thing ends up!
### About
RayCastrZ is my implementation of a "game-engine" utilizing the classic pseudo-3D rendering technique raycasting.
This technique was made famous by Wolfenstein 3D and later heavily extended upon for ROTT, DOOM and subsequent "doom-clones", etc.

Much of this project is based on code from the somewhat famous tutorials written by permadi in 1996 (and later re-implemented in vanilla JS) - which can be found here: https://permadi.com/1996/05/ray-casting-tutorial-table-of-contents/, as well as https://lodev.org/cgtutor/raycasting.html (also parts 2, 3 & 4) - as well as a bunch of SO answers and other obscure sites on the web - (i even tried asking ChatGPT for help - but it got confused) 

### What it do? / What it don't?
Its a basic raycasting engine, in it's current state it is probably not fair to actually call it an engine, but basically it renders walls, floors and ceilings - based on two different methods; 
- ctx.drawImage for wall slices
- Pixel manipulation and putImageData for floor / ceiling 

Besides this, it has basic animated sprite support for weapons, and it handles inputs/controls and has a whole bunch of features that i want to implement along the way.

#### TODO:
- [x] Wall Rendering
- [x] Floor casting / Ceiling casting
- [x] Weapons - with animations, fire rate, etc.
- [x] Collisions
- [ ] Actual weapons fire mechanics (hitscan / projectile)
- [ ] General sprites; props, pickups, decorations 
- [ ] Animated Sprites & Characters 
- [ ] Basic A* and Enemy Behaviour
- [ ] Doors (of some type - not sure yet)
- [ ] UI
- [ ] Sound (music, sfx, etc)
- [ ] Improved character physics (sliding of walls, etc.)

Other than that im pretty happy with the progress so far, this has been a learning experience and it continues to be so!


