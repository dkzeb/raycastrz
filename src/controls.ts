import { Inventory } from "./state";

export interface ControlState {
    up: boolean,
    down: boolean,
    strafeLeft: boolean,
    strafeRight: boolean,
    turnLeft: boolean,
    turnRight: boolean,
    fireWeapon: boolean,
    showMap: boolean,
    isDebug: boolean
};

export const initControls = (controlState: ControlState, inventory: Inventory) => {
    document.addEventListener('keydown', (evt) => {

        if(evt.key.toLowerCase() === 'w') 
            controlState.up = true;
            
        if(evt.key.toLowerCase() === 's') 
            controlState.down = true;  
            
        if(evt.key.toLowerCase() === 'a') 
            controlState.strafeLeft = true;
        
        if(evt.key.toLowerCase() === 'd') 
            controlState.strafeRight = true;
        
        if(evt.key.toLowerCase() === 'q' || evt.key === 'ArrowLeft') 
            controlState.turnLeft = true;
        
        if(evt.key.toLowerCase() === 'e' || evt.key === 'ArrowRight') 
            controlState.turnRight = true;       
            
        if(evt.key.toLowerCase() === 'm') 
            controlState.showMap = !controlState.showMap;

        if(evt.key === ',') 
            controlState.isDebug = !controlState.isDebug;

        if(evt.key === 'ArrowUp') 
            controlState.fireWeapon = true;

        if(evt.key === '1' || evt.key === '2' || evt.key === '3') {
            inventory.weapons.forEach(w => w.active = false);
            const weapon = inventory.weapons.find(w => w.index === parseInt(evt.key));
            if(weapon) {
                weapon.active;
                inventory.activeWeapon = weapon;
            }
        }        
    });
    
    document.addEventListener('keyup', (evt) => {
        if(evt.key.toLowerCase() === 'w') 
            controlState.up = false;
            
        if(evt.key.toLowerCase() === 's') 
            controlState.down = false;  
            
        if(evt.key.toLowerCase() === 'a') 
            controlState.strafeLeft = false;
        
        if(evt.key.toLowerCase() === 'd') 
            controlState.strafeRight = false;
        
        if(evt.key.toLowerCase() === 'q' || evt.key === 'ArrowLeft') 
            controlState.turnLeft = false;
        
        if(evt.key.toLowerCase() === 'e' || evt.key === 'ArrowRight') 
            controlState.turnRight = false;   

        
        if(evt.key === 'ArrowUp') 
            controlState.fireWeapon = false;    
    });
}