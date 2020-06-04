const loadingTag = document.querySelector(' header p.loading ')
const nextTag = document.querySelector(' a.next ')
const previousTag = document.querySelector(' a.previous ')
const stepsTag = document.querySelector('footer span')
const sliderTag = document.querySelector('div.slider')
const footerTag = document.querySelector('footer')

let currentSlide = 0
let totalSlides = 0

const project = 'OG1X9JPoNIhiXbAEZK6WNz'
const apiKey = '48052-54fbfda6-2970-4c5c-86bb-a89771e9676a'
const apiHeaders = {
  headers: {
    'X-Figma-Token': apiKey
  }
}
const loadFile = function(key) {
  return fetch('https://api.figma.com/v1/files/' + key, apiHeaders)
    .then(response => response.json())
    .then(data => {
      console.log(data.document.children[0].children)
      const ids = data.document.children[0].children.map(frame => {
        return frame.id
      })
      const title = data.name
      return {
        key: key,
        title: data.name,
        ids: ids
      }
    })
}

const loadImages = function(obj) {
  console.log(obj)
  const key = obj.key
  const ids = obj.ids.join(',')
  return fetch('https://api.figma.com/v1/images/' + key + '?ids=' + ids + '&scale=.5', apiHeaders)
    .then(response => response.json())
    .then(data => {
      return obj.ids.map(id => {
        return data.images[id]
      })
    })
}

const addImagestoSite = function(urls) {
  sliderTag.innerHTML = ''
  totalSlides = urls.length
  footerTag.classList.add("show")
  console.log(totalSlides)
  urls.forEach(url => {
    sliderTag.innerHTML =
      sliderTag.innerHTML +
      `
			<div>
				<img src=${url}>
			</div>
`
  })
}

loadFile(project)
  .then(file => {
    loadingTag.innerHTML = file.title
    document.tile = file.title + 'Figma API'
    return file
  })
  .then(file => loadImages(file))
  .then(imageUrls => addImagestoSite(imageUrls))

const next = function() {
  currentSlide = currentSlide + 1
  if (currentSlide >= totalSlides) {
    currentSlide = 0
  }
  moveSlider()
}

const previous = function() {
  currentSlide = currentSlide - 1
  if (currentSlide < 0) {
    currentSlide = totalSlides - 1
  }
  moveSlider()
}

const moveSlider = function() {
  sliderTag.style.transform = `translate(${currentSlide * -100}vw, 0)`
  stepsTag.innerHTML = `${currentSlide + 1} / ${totalSlides}`
}

nextTag.addEventListener('click', function() {
  next()
})
previousTag.addEventListener('click', function() {
  previous()
})
