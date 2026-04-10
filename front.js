// PARALLAX
const robot = document.getElementById('robot');

document.addEventListener('mousemove', (e)=>{
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  robot.style.transform = `translate(${x}px, ${y}px)`;
});

// RIPPLE EFFECT
const btn = document.getElementById('btn');
btn.addEventListener('click', function(e){
  const circle = document.createElement('span');
  const rect = btn.getBoundingClientRect();

  const size = Math.max(rect.width, rect.height);
  circle.style.width = circle.style.height = size + 'px';

  circle.style.left = e.clientX - rect.left - size/2 + 'px';
  circle.style.top = e.clientY - rect.top - size/2 + 'px';

  btn.appendChild(circle);

  setTimeout(()=> circle.remove(), 600);
});