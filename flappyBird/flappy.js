function newElement(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barrier(reverse = false) {
    this.element = newElement('div', 'barrier')
    const edge = newElement('div', 'edge')
    const corps = newElement('div', 'corps')
    this.element.appendChild(reverse ? corps : edge)
    this.element.appendChild(reverse ? edge : corps)

    this.setHeight = height => corps.style.height = `${height}px`
}

// const b = new Barrier(true)
// b.setHeight(200)
// document.querySelector('[wm-flappy]').appendChild(b.element)

function PairOfBarriers(height, opening, x) {
    this.element = newElement('div', 'pair-of-barriers')

    this.upper = new Barrier(true)
    this.lower = new Barrier(false)

    this.element.appendChild(this.upper.element)
    this.element.appendChild(this.lower.element)

    this.drawOpening = () => {
        const upperHeight = Math.random() * (height - opening)
        const lowerHeight = height - opening - upperHeight
        this.upper.setHeight(upperHeight)
        this.lower.setHeight(lowerHeight)
    }
    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.drawOpening()
    this.setX(x)
}

// const b = new PairOfBarriers(700, 200, 400)
// document.querySelector('[wm-flappy]').appendChild(b.element)

function Barriers(height, width, opening, space, notifyPoint) {
    this.pairs = [
        new PairOfBarriers(height, opening, width),
        new PairOfBarriers(height, opening, width + space),
        new PairOfBarriers(height, opening, width + space * 2),
        new PairOfBarriers(height, opening, width + space * 3)
    ]

    const displacement = 3
    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - displacement)

            // when the element leaves the game area
            if (pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + space * this.pairs.length)
                pair.drawOpening()
            }
            const middle = width / 2
            const crossedMiddle = pair.getX() + displacement >= middle && pair.getX() < middle
            if (crossedMiddle) notifyPoint()
        })
    }
}

function Bird(gameHeight) {
    let flying = false

    this.element = newElement('img', 'bird')
    this.element.src = 'imgs/bird.png'

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => flying = true
    window.onkeyup = e => flying = false

    this.animate = () => {
        const newY = this.getY() + (flying ? 8 : -5)
        const maxHeight = gameHeight - this.element.clientHeight

        if (newY <= 0) {
            this.setY(0)
        } else if (newY >= maxHeight) {
            this.setY(maxHeight)
        } else {
            this.setY(newY)
        }
    }
    this.setY(gameHeight / 2)
}


function Progress() {
    this.element = newElement('span', 'progress')
    this.updatePoints = points => {
        this.element.innerHTML = points
    }
    this.updatePoints(0)
}
// const bird = new Bird(700)
// const gameArea = document.querySelector('[wm-flappy]')
// const barriers = new Barriers(700, 1200, 200, 400)
// gameArea.appendChild(bird.element)
// gameArea.appendChild(new Progress().element)
// barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))
// setInterval(() => {
//     barriers.animate()
//     bird.animate()
// }, 20);

function overlapping(elementA, elementB) {
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.leftSide + a.width >= b.leftSide
        && b.leftSide + b.width >= a.leftSide
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
        return horizontal && vertical
}

function collided(bird, barriers) {
    let collided = false
    barriers.pairs.forEach(pairOfBarriers => {
        if (!collided) {
            const upper = pairOfBarriers.upper.element
            const lower = pairOfBarriers.lower.element
            collided = overlapping(bird.element, upper)
                || overlapping(bird.element, lower)
        }
    })
    return collided
}



function FlappyBird() {
    let points = 0

    const gameArea = document.querySelector('[wm-flappy]')
    const height = gameArea.clientHeight
    const width = gameArea.clientWidth

    const progress = new Progress()
    const barriers = new Barriers(height, width, 200, 400, () => progress.updatePoints(++points))
    const bird = new Bird(height)

    gameArea.appendChild(progress.element)
    gameArea.appendChild(bird.element)
    barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))

    this.start = () => {
        //game loop
        const timer = setInterval(() => {
            barriers.animate()
            bird.animate()

            if(collided(bird, barriers)) {
                clearInterval(timer)
            }
        }, 20)
    }
}

new FlappyBird().start()