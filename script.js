const video = document.getElementById('video')
const _token = '<API_TOKEN>';
const time_fraction = 600000 // 10 minutes

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    if (detections.length !== 0)
    {
        //No faces Away
        setStatus('auto');
        $('#status').text('Active').css('color', '#3aaf3a');
    } else {
        //Active
        setStatus('away');
        $('#status').text('Not Active').css('color', '#d82c20');
    }
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
  }, time_fraction)
})

function setStatus(status)
{
  $.ajax({
    type: "POST",
    url: 'https://slack.com/api/users.setPresence?token='+_token+'&presence=' + status,
  });
}