/**
 * Code from: https://codepen.io/tbekaert/pen/NMLZjK.js?update
 * Original library => dom-confetti
 * https://github.com/daniel-lundin/dom-confetti
 */

const defaultColors = [
    '#a864fd',
    '#29cdff',
    '#78ff44',
    '#ff718d',
    '#fdff6a'];


const shape = function (element) {
    const list = [
        // Square
        function (e) {
            const size = `${Math.round((Math.random() + 0.5) * 10)}px`;
            e.style.width = size;
            e.style.height = size;
            return e;
        },
        // Round
        function (e) {
            const size = `${Math.round((Math.random() + 0.5) * 10)}px`;
            e.style.width = size;
            e.style.height = size;
            e.style['border-radius'] = '50%';
            return e;
        },
        // Triangle
        function (e) {
            const size = `${Math.round((Math.random() + 0.5) * 10)}`;
            const color = e.style['background-color'];
            e.style['background-color'] = 'transparent';

            e.style['border-bottom'] = `${size}px solid ${color}`;
            e.style['border-left'] = `${size / 2}px solid transparent`;
            e.style['border-right'] = `${size / 2}px solid transparent`;
            e.style.height = 0;
            e.style.width = size;

            return e;
        }];


    return list[Math.floor(Math.random() * list.length)](element);
};

function createElements(root, elementCount, colors) {
    return Array.from({ length: elementCount }).map((_, index) => {
        const element = document.createElement('div');
        const color = colors[index % colors.length];
        element.style['background-color'] = color; // eslint-disable-line space-infix-ops
        element.style.position = 'absolute';
        root.appendChild(shape(element));
        return element;
    });
}

function randomPhysics(angle, spread, startVelocity, random) {
    const radAngle = angle * (Math.PI / 180);
    const radSpread = spread * (Math.PI / 180);
    return {
        x: 0,
        y: 0,
        wobble: random() * 10,
        velocity: startVelocity * 0.5 + random() * startVelocity,
        angle2D: -radAngle + (0.5 * radSpread - random() * radSpread),
        angle3D: -(Math.PI / 4) + random() * (Math.PI / 2),
        tiltAngle: random() * Math.PI };

}

function updateFetti(fetti, progress, decay) {
    /* eslint-disable no-param-reassign */
    fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
    fetti.physics.wobble += 0.1;
    fetti.physics.velocity *= decay;
    fetti.physics.y += 3;
    fetti.physics.tiltAngle += 0.1;

    const { x, y, tiltAngle, wobble } = fetti.physics;
    const wobbleX = x + 10 * Math.cos(wobble);
    const wobbleY = y + 10 * Math.sin(wobble);
    const transform = `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotate3d(1, 1, 1, ${tiltAngle}rad)`;

    fetti.element.style.transform = transform;
    fetti.element.style.opacity = 1 - progress;

    /* eslint-enable */
}

function animate(root, fettis, decay) {
    const totalTicks = 200;
    let tick = 0;

    function update() {
        fettis.forEach(fetti => updateFetti(fetti, tick / totalTicks, decay));

        tick += 1;
        if (tick < totalTicks) {
            requestAnimationFrame(update);
        } else {
            fettis.forEach(fetti => {
                if (fetti.element.parentNode === root) {
                    return root.removeChild(fetti.element);
                }
            });
        }
    }

    requestAnimationFrame(update);
}

window.confetti = function (root, {
    angle = 90,
    decay = 0.9,
    spread = 45,
    startVelocity = 45,
    elementCount = 50,
    colors = defaultColors,
    random = Math.random } = {}) {
    const elements = createElements(root, elementCount, colors);
    const fettis = elements.map(element => ({
        element,
        physics: randomPhysics(angle, spread, startVelocity, random) }));
    animate(root, fettis, decay);
};
