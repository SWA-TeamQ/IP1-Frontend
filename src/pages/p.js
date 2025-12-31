function changeImage(el){
    document.querySelectorAll('.thumbnail-gallery img').forEach(i=>i.classList.remove('active'));
    el.classList.add('active');
    mainImg.style.opacity=0;
    setTimeout(()=>{mainImg.src=el.src;mainImg.style.transform='scale(1.02)';mainImg.style.opacity=1;setTimeout(()=>mainImg.style.transform='scale(1)',200);},200);
}

window.changeImage = changeImage;
