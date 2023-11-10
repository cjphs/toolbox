const ctx = document.getElementById('piechart');
const colourPickerList = document.getElementById('colourPickerList')
const colourListOutput = document.getElementById('colourListOutput')

const slices = 30;
let n = 12;
const sliceSizes = Array.from({length: slices}, () => Math.random()*(n*=.75));
sliceSizes.sort((a, b) => a - b).reverse()

const defaultColours = [
    '#47bbc1', '#fcc100', '#f44456', '#354052', '#4572A7',
    '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D',
    '#92A8CD', '#A47D7C', '#B5CA92'//, 'grey' from here on...
]

const chart = new Chart(ctx, {
    type: 'pie',
    data: {
    datasets: [{
        data: sliceSizes,
        borderWidth: 1,
        backgroundColor: []
    }]
    },
    options: {
    }
});

let shiftHeld = false;
document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') {
        shiftHeld = true
    }
})
document.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') {
        shiftHeld = false
    }
})

const appendColour = (colourValue='#d10a53',prepend=false) => {
    const colourPickerDiv = document.createElement('div')
    colourPickerDiv.classList.add('colourPickerDiv')

    const colourPickerInput = document.createElement('input')
    colourPickerInput.value = colourValue
    colourPickerInput.addEventListener('change', () => {
        updateChart()
    })

    new JSColor(colourPickerInput)

    const deleteButton = document.createElement('button')
    deleteButton.innerText = '-'
    deleteButton.addEventListener('click', () => {
        colourPickerDiv.remove()
        updateChart()
    })

    const moveUpButton = document.createElement('button')
    moveUpButton.innerText = '↑'
    moveUpButton.addEventListener('click', () => {
        if (shiftHeld) {
            const colourPickerDivs = document.querySelectorAll('.colourPickerDiv')
            let index = Array.from(colourPickerDivs).indexOf(colourPickerDiv)
            let nextColourPickerInput = colourPickerInput
            while (nextColourPickerInput.value === colourPickerInput.value && index >= 0 ) {
                nextColourPickerInput = colourPickerDivs[index].querySelector('input')
                if (nextColourPickerInput.value !== colourPickerInput.value) {
                    nextColourPickerInput.value = colourPickerInput.value
                    nextColourPickerInput.dispatchEvent(new Event('change'))
                    break
                }
                index--
            }
            if (index < 0)
                appendColour(colourPickerInput.value,prepend=true)
            return
        }
        const colourPickerDivs = document.querySelectorAll('.colourPickerDiv')
        const index = Array.from(colourPickerDivs).indexOf(colourPickerDiv)
        if (index > 0) {
            colourPickerDivs[index - 1].before(colourPickerDiv)
        }
        updateChart()
    })

    const moveDownButton = document.createElement('button')
    moveDownButton.innerText = '↓'
    moveDownButton.addEventListener('click', () => {
        if (shiftHeld) {
            const colourPickerDivs = document.querySelectorAll('.colourPickerDiv')
            let index = Array.from(colourPickerDivs).indexOf(colourPickerDiv)
            let nextColourPickerInput = colourPickerInput
            while (nextColourPickerInput.value === colourPickerInput.value && index <= colourPickerDivs.length - 1) {
                nextColourPickerInput = colourPickerDivs[index].querySelector('input')
                if (nextColourPickerInput.value !== colourPickerInput.value) {
                    nextColourPickerInput.value = colourPickerInput.value
                    nextColourPickerInput.dispatchEvent(new Event('change'))
                    break
                }
                index++
            }
            if (index > colourPickerDivs.length - 1)
                appendColour(colourPickerInput.value)
            return
        }
        const colourPickerDivs = document.querySelectorAll('.colourPickerDiv')
        const index = Array.from(colourPickerDivs).indexOf(colourPickerDiv)
        if (index < colourPickerDivs.length - 1) {
            colourPickerDivs[index + 1].after(colourPickerDiv)
        }
        updateChart()
    })

    colourPickerDiv.appendChild(colourPickerInput)
    colourPickerDiv.appendChild(moveUpButton)
    colourPickerDiv.appendChild(moveDownButton)
    colourPickerDiv.appendChild(deleteButton)
    
    prepend ? colourPickerList.prepend(colourPickerDiv) : colourPickerList.appendChild(colourPickerDiv)

    updateChart()
}

const getColours = () => {
    const colourPickerInputs = document.querySelectorAll('.colourPickerDiv input')
    return Array.from(colourPickerInputs).map(input => input.value)
}

const updateChart = () => {
    const colours = getColours()
    console.log(colours)
    const chartColours = colours.concat(Array.from({length: slices - colours.length}, () => 'gray'))
    chart.data.datasets[0].backgroundColor = chartColours
    chart.update()

    localStorage.setItem('colours', colours)

    colourListOutput.textContent = colours.join(', ')
}

const loadDefaults = () => {
    localStorage.setItem('colours', defaultColours)
    location.reload()
}

let coloursStorage = localStorage.getItem('colours')
if (!coloursStorage) {
    defaultColours.forEach(colour => {
        appendColour(colour)
    })
} else {
    coloursStorage.split(',').forEach(colour => {
        appendColour(colour)
    })
}

