export default function App(){
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-green-500">
      <div class="chat-notification">
        <div class="chat-notification-logo-wrapper">
          <img class="chat-notification-logo" src="https://images.vexels.com/media/users/3/139911/isolated/preview/1afb4038427b2bd8edd275940aea269d-chat-service-icon-by-vexels.png" alt="ChitChat Logo" />
        </div>
        <div class="chat-notification-content">
          <h4 class="chat-notification-title">Yexopis</h4>
          <p class="chat-notification-message">You have a new message!</p>
        </div>
      </div>
    </div>
  )
}