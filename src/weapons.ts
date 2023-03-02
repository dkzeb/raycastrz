import { AnimatedWeaponsSprite } from "./animatedSprites"
import { aspectRatioFactor } from "./consts";
import { loadTexture } from "./rendering";

export type Weapon = {
    name: string;
    index: number;
    sprites: AnimatedWeaponsSprite;
    clipSize: number;
    fire: Function;
    active?: Boolean;
}

export async function initWeapons(): Promise<Weapon[]> {
    const weapons: Weapon[] = [];
    // init pistol
    const pistol: Weapon = {
        name: 'Pistol',
        index: 1,
        sprites: {
            idle: await loadTexture('./images/weapons/pistol/idle.png'),
            fire: [
                await loadTexture('./images/weapons/pistol/fire1.png'),
                await loadTexture('./images/weapons/pistol/fire2.png'),
                await loadTexture('./images/weapons/pistol/fire3.png'),
                await loadTexture('./images/weapons/pistol/fire4.png'),            
            ],
            offsetX: 25 ,
            offsetY: -20 + ((125 / 2) * (aspectRatioFactor / 2)),
            frameTimeout: 100,
            scale: 125 + (125 * (aspectRatioFactor / 2))

        },
        clipSize: 10,
        active: false,
        fire: () => { console.log('PISTOL: BANG!') }
    }
    pistol.sprites.activeSprite = pistol.sprites.idle; // set the idle sprite to active as default
    weapons.push(pistol);

    const shotgun: Weapon = {
        name: 'Shotgun',
        index: 2,
        sprites: {
            idle: await loadTexture('./images/weapons/shotgun/idle.png'),
            fire: [
                await loadTexture('./images/weapons/shotgun/fire1.png'),
                await loadTexture('./images/weapons/shotgun/fire2.png'),
                await loadTexture('./images/weapons/shotgun/fire3.png'),
                await loadTexture('./images/weapons/shotgun/fire4.png'),
                await loadTexture('./images/weapons/shotgun/fire5.png'),
                await loadTexture('./images/weapons/shotgun/fire6.png'),
                await loadTexture('./images/weapons/shotgun/fire7.png'),
                await loadTexture('./images/weapons/shotgun/fire8.png'),
                await loadTexture('./images/weapons/shotgun/fire9.png'),
                await loadTexture('./images/weapons/shotgun/fire10.png'),
                await loadTexture('./images/weapons/shotgun/fire11.png'),
                await loadTexture('./images/weapons/shotgun/fire12.png'),
                await loadTexture('./images/weapons/shotgun/fire13.png'),
                await loadTexture('./images/weapons/shotgun/fire14.png'),
            ],
            frameTimeout: 100,
            offsetX: 0,
            offsetY: -70 + ((200 / 2) * aspectRatioFactor / 2),
            scale: 200 + (200 * (aspectRatioFactor / 2)),
        },        
        active: true,
        clipSize: 0,
        fire: () => { console.log('SHOTGUN: BOOOM') }
    }
    // this is a centered weapon, we calculate the center offset as - half image width
    // will most def not work for all types of centered weapons - maybe we need some kind of standard for weapons sprites that are centered ...
    shotgun.sprites.offsetX = -Math.floor(((shotgun.sprites.idle.width / 2))) - (29.5 * aspectRatioFactor);
    shotgun.sprites.activeSprite = shotgun.sprites.idle;
    weapons.push(shotgun);


    const uzi: Weapon = {
        name: 'Uzi',
        clipSize: 30,
        index: 3,
        sprites: {
            idle: await loadTexture('./images/weapons/uzi/idle.png'),
            fire: [
                await loadTexture('./images/weapons/uzi/fire1.png'),
                await loadTexture('./images/weapons/uzi/fire2.png'),
                await loadTexture('./images/weapons/uzi/fire3.png')
            ],
            offsetX: 25 ,
            offsetY: -20 + ((125 / 2) * (aspectRatioFactor / 2)),
            frameTimeout: 25,
            scale: 125 + (125 * (aspectRatioFactor / 2))       
        },
        fire: () => { console.log('UZI: Rat tat tat tat') }
    }
    uzi.sprites.activeSprite = uzi.sprites.idle;
    weapons.push(uzi);

    const activeWeapon = weapons.find(w => w.active);
    if(!activeWeapon)
        weapons[0].active = true;

    console.log('active weapon??', activeWeapon);
    return weapons;
}