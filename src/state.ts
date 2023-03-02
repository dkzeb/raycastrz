import { ControlState } from "./controls";
import { Weapon } from "./weapons";

export const controlState: ControlState = {
    up: false,
    down: false,
    strafeLeft: false,
    strafeRight: false,
    turnLeft: false,
    turnRight: false,
    fireWeapon: false,
    showMap: false,
    isDebug: false
}

export interface Inventory {
    weapons: Weapon[],
    activeWeapon: Weapon
}