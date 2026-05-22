// Initialize EmailJS with your Public Key
emailjs.init("OpnO-Q38LDoO1IxY8");

document.getElementById('verification-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('user-email').value;
  
  // Generate a random 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  // Store this code in localStorage or a global variable to verify it later
  sessionStorage.setItem('sentCode', verificationCode);

  // Template parameters for EmailJS
  const templateParams = {
    to_name: username,
    to_email: email,
    verification_code: verificationCode
  };

  // Send the email
  emailjs.send('service_vsor7t5', 'template_we9ahji', templateParams)
    .then(function(response) {
       alert('Verification code sent successfully!');
       // Here you would redirect the user to a page/input to type the code
    }, function(error) {
       alert('Failed to send code. Please try again.');
       console.error('EmailJS Error:', error);
    });
});