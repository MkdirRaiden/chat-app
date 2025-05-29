const socket = io()

const clientsTotal = document.getElementById('client-total')

const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

const messageTone = new Audio('/message-tone.mp3')

//event listeners
messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  sendMessage()
})
messageInput.addEventListener('focus', emitFeedback)
messageInput.addEventListener('keypress', emitFeedback)
messageInput.addEventListener('blur', emitFeedback)

//socket events
socket.on('chat-message', (data) => {
  // console.log(data)
  messageTone.play()
  addMessageToUI(false, data)
})

socket.on('clients-total', (data) => {
  clientsTotal.innerText = `Total Clients: ${data}`
})

socket.on('feedback', (data) => {
  clearFeedback()
  const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
  `
  messageContainer.innerHTML += element
})

//callback functions
function sendMessage() {
  if (messageInput.value === '') return
  // console.log(messageInput.value)
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  }
  socket.emit('message', data)
  addMessageToUI(true, data)
  messageInput.value = ''
}
function addMessageToUI(isOwnMessage, data) {
  clearFeedback()
  const element = `
      <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
          <p class="message">
            ${data.message}
            <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
          </p>
        </li>
        `

  messageContainer.innerHTML += element
  scrollToBottom()
}
function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}
function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach((element) => {
    element.parentNode.removeChild(element)
  })
}
function emitFeedback() {
  socket.emit('feedback', {
    feedback: `✍️ ${nameInput.value} is typing a message`,
  })
}
