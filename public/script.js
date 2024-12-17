const arrow = document.getElementById('arrow');
const centerBox = document.getElementById('center-box');
const game = document.getElementById('game');

// When you hover on the center box
centerBox.addEventListener('mouseenter', () => {
  arrow.style.top = '50%'; // Move the arrow to the center
  arrow.style.opacity = '1'; // Make it visible
});

centerBox.addEventListener('mouseleave', () => {
  arrow.style.top = '-200px'; // Move back to the top
  arrow.style.opacity = '0'; // Hide it
});
game.addEventListener('mouseenter', () => {
    arrow.style.top = '50%'; // Move the arrow to the center
    arrow.style.opacity = '1'; // Make it visible
  });
  
  game.addEventListener('mouseleave', () => {
    arrow.style.top = '-200px'; // Move back to the top
    arrow.style.opacity = '0'; // Hide it
  });
  
