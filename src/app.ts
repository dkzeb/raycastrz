import { initControls } from './controls';
import { controlState, Inventory }from './state';
import { CELL_SIZE, TICK } from './consts';
import { renderMinimap, renderScene, clearScreen, loadTexture, initRendering, renderPlayerOrientation, renderWeapon } from './rendering';
import { movePlayer, playerObj as player } from './player';
import { getRays } from './ray';
import { initWeapons, Weapon } from './weapons';


const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],    
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],    
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],    
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],    
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// runtime object references
let inventory: Inventory;

function gameLoop() {
    clearScreen();
    movePlayer(controlState, player, map);
    const rays = getRays(player, map);
    //renderScene(rays, player, map[0].length * CELL_SIZE, map.length * CELL_SIZE);    
    //renderWeapon(inventory.activeWeapon, controlState.fireWeapon);
    if(controlState.showMap) {
        renderMinimap(0,0,.1,rays, player, map);
    }

    if(controlState.isDebug) {
        // a bunch of debugging stuff that would be nice to have
        renderPlayerOrientation(player);
    }

    requestAnimationFrame(gameLoop);
}


(async () => {
    try {
        
        inventory = {
            weapons: await initWeapons(),
            activeWeapon: {} as Weapon
            
        }
        inventory.activeWeapon = inventory.weapons.find(w => w.active) || inventory.weapons[1];
        initControls(controlState, inventory);

        console.log('map width', map.length, map[0].length * CELL_SIZE,map.length * CELL_SIZE)

        initRendering({
            wall: await loadTexture('./images/brickwall.jpg'),
            floor: await loadTexture('./images/floortiles1.png'),
            ceiling: await loadTexture('./images/tile7.png')
        });
        requestAnimationFrame(gameLoop);
    } catch (e) {
        console.error(e);
    }
})();
