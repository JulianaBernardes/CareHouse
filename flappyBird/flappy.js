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
// b.setHeight(300)
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

// const b = new pairOfBarriers(700, 200,800)
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
            const crossedMiddle = pair.getX() + displacement >= middle
                && pair.getX() < middle
            if (crossedMiddle) notifyPoint()
        })
    }
}

const barriers = new Barriers(700, 1200, 200, 400)
const gameArea = document.querySelector('[wm-flappy]')
barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))
setInterval(() => {
    barriers.animate()
},20)



