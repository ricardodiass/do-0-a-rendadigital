// Menu Mobile
document.getElementById('mobileMenu').addEventListener('click', function() {
    document.getElementById('navMenu').classList.toggle('active');
});

// Scroll suave para links internos (apenas para âncoras #)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Verifica se é um link interno (começa com #)
        if(this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if(targetElement) {
                // Fecha menu mobile se estiver aberto
                document.getElementById('navMenu').classList.remove('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Timer de oferta
function updateTimer() {
    const now = new Date();
    const endTime = new Date();
    endTime.setHours(now.getHours() + 2); // 2 horas a partir de agora
    
    const timeLeft = endTime - now;
    
    // Se o tempo acabou, reseta para 2 horas
    if(timeLeft <= 0) {
        endTime.setHours(endTime.getHours() + 2);
        const newTimeLeft = endTime - now;
        return formatTime(newTimeLeft);
    }
    
    return formatTime(timeLeft);
}

function formatTime(time) {
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Atualizar timer a cada segundo
function startTimer() {
    const timerElement = document.getElementById('timer');
    if(timerElement) {
        timerElement.textContent = updateTimer();
        setInterval(() => {
            timerElement.textContent = updateTimer();
        }, 1000);
    }
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const faqItem = this.parentElement;
        faqItem.classList.toggle('active');
        
        // Fecha outras FAQs abertas
        document.querySelectorAll('.faq-item').forEach(item => {
            if(item !== faqItem && item.classList.contains('active')) {
                item.classList.remove('active');
            }
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if(window.scrollY > 100) {
        header.style.padding = '12px 0';
        header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.padding = '18px 0';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
    }
});

// Animações ao rolar a página
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Adiciona delay escalonado para os cards
            if(entry.target.classList.contains('problem-card') || 
               entry.target.classList.contains('profile-card') ||
               entry.target.classList.contains('bonus-card')) {
                const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

// Aplicar animação aos elementos
document.querySelectorAll('.problem-card, .profile-card, .step, .result-item, .bonus-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Efeito de digitação no título (opcional)
function typeWriterEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if(heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        let i = 0;
        const typeWriter = () => {
            if(i < originalText.length) {
                heroTitle.innerHTML += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Inicia após 1 segundo
        setTimeout(typeWriter, 1000);
    }
}

// Contador de vagas restantes (simulado)
function updateRemainingSpots() {
    const spotsElement = document.querySelector('.warning-box strong');
    if(spotsElement) {
        const currentText = spotsElement.textContent;
        const numbers = currentText.match(/\d+/g);
        
        if(numbers && numbers.length > 0) {
            let currentNumber = parseInt(numbers[0]);
            if(currentNumber > 1) {
                // Diminui vagas a cada 30 segundos (apenas para demonstração)
                const newNumber = currentNumber - Math.floor(Math.random() * 3 + 1);
                if(newNumber > 0) {
                    spotsElement.textContent = currentText.replace(/\d+/, newNumber);
                    
                    // Atualiza novamente após 30 segundos
                    setTimeout(updateRemainingSpots, 30000);
                } else {
                    spotsElement.textContent = currentText.replace(/\d+/, "ESGOTADAS");
                    // Desativa o botão quando as vagas acabam
                    const ctaButton = document.getElementById('ctaButton');
                    if(ctaButton) {
                        ctaButton.textContent = "VAGAS ESGOTADAS";
                        ctaButton.style.opacity = "0.6";
                        ctaButton.style.cursor = "not-allowed";
                        ctaButton.onclick = function(e) {
                            e.preventDefault();
                            alert("As vagas para esta turma estão esgotadas. Entre em nossa lista de espera para a próxima turma!");
                        };
                    }
                }
            }
        }
    }
}

// Contador animado para estatísticas
function animateCounter(element, finalValue, duration) {
    let start = 0;
    const increment = finalValue / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if(start >= finalValue) {
            if(element.classList.contains('stat-number')) {
                element.textContent = finalValue.toLocaleString() + '+';
            } else {
                element.textContent = finalValue.toLocaleString();
            }
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

// Observador para animar contadores quando entrarem na viewport
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const currentText = stat.textContent;
                const finalValue = parseInt(currentText.replace(/[^0-9]/g, ''));
                
                // Limpa o conteúdo atual
                stat.textContent = '0';
                
                // Anima para o valor final
                setTimeout(() => {
                    animateCounter(stat, finalValue, 2000);
                }, index * 300); // Delay escalonado
            });
            
            // Para de observar depois de executar
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Inicializar quando a página carregar
window.addEventListener('load', function() {
    startTimer();
    typeWriterEffect();
    
    // Observa a seção hero para animar os contadores
    const heroSection = document.querySelector('.hero');
    if(heroSection) {
        statsObserver.observe(heroSection);
    }
    
    // Inicia contador de vagas após 2 minutos
    setTimeout(updateRemainingSpots, 120000);
    
    // Placeholder do vídeo - simula clique
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if(videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            alert("Em uma implementação real, um vídeo explicativo seria reproduzido aqui.");
        });
    }
});

// Detectar dispositivo para otimização
function detectDevice() {
    const isMobile = window.innerWidth <= 768;
    const body = document.body;
    
    if(isMobile) {
        body.classList.add('mobile-device');
        body.classList.remove('desktop-device');
    } else {
        body.classList.add('desktop-device');
        body.classList.remove('mobile-device');
    }
}

// Detectar mudanças de tamanho de tela
window.addEventListener('resize', detectDevice);
detectDevice(); // Executar na carga inicial