export default function getFrequencies(dataArray, analyser) {
  analyser.getByteFrequencyData(dataArray)

  // Bass = < 500
  // Mids = 501 - 4999
  // Treble = 5001+

  const bass = dataArray.slice(0, (dataArray.length / 12) * 2)
  // console.log('bass', bass)
  const mid = dataArray.slice(
    dataArray.length / 12,
    (dataArray.length / 12) * 4
  )

  const treble = dataArray.slice((dataArray.length / 12) * 4)

  const throttleLog = throttle(() => console.log(`dataArray`, dataArray), 10)

  const bassAvg = avg(bass)
  const bassMax = max(bass)
  // console.log('bassAvg', bassAvg)
  // console.log('bassMax', bassMax)
  const midAvg = avg(mid)
  const midMax = max(mid)
  // console.log('midAvg', midAvg)
  // console.log('midMax', midMax)
  const trebleAvg = avg(treble)
  const trebleMax = max(treble)

  const lowerHalfArray = dataArray.slice(0, dataArray.length / 2 - 1)
  const upperHalfArray = dataArray.slice(
    dataArray.length / 2 - 1,
    dataArray.length - 1
  )

  const overallAvg = avg(dataArray)

  const lowerMax = max(lowerHalfArray)
  const lowerAvg = avg(lowerHalfArray)
  const upperMax = max(upperHalfArray)
  const upperAvg = avg(upperHalfArray)

  //   const lowerMaxFr = lowerMax / lowerHalfArray.length
  //   const lowerAvgFr = lowerAvg / lowerHalfArray.length
  //   const upperMaxFr = upperMax / upperHalfArray.length
  //   const upperAvgFr = upperAvg / upperHalfArray.length

  return {
    // lowerMaxFr,
    // lowerAvgFr,
    // upperMaxFr,
    // upperAvgFr,
    bassAvg,
    bassMax,
    midAvg,
    midMax,
    trebleAvg,
    trebleMax,
    overallAvg,
    throttleLog,
  }
}

function throttle(callback, limit) {
  var waiting = false // Initially, we're not waiting
  return function () {
    // We return a throttled function
    if (!waiting) {
      // If we're not waiting
      callback.apply(this, arguments) // Execute users function
      waiting = true // Prevent future invocations
      setTimeout(function () {
        // After a period of time
        waiting = false // And allow future invocations
      }, limit)
    }
  }
}

//some helper functions here
function fractionate(val, minVal, maxVal) {
  return (val - minVal) / (maxVal - minVal)
}

function modulate(val, minVal, maxVal, outMin, outMax) {
  var fr = fractionate(val, minVal, maxVal)
  var delta = outMax - outMin
  return outMin + fr * delta
}

function avg(arr) {
  var total = arr.reduce(function (sum, b) {
    return sum + b
  })
  return total / arr.length
}

function max(arr) {
  return arr.reduce(function (a, b) {
    return Math.max(a, b)
  })
}
