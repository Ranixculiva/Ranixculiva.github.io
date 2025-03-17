const translations = {
    zh: {
        title: "PawPrints - 找貓、分享、一起愛貓！",
        intro: "想被貓療癒心靈，卻沒有貓嗎？🐱 <strong>PawPrints</strong> 幫你找到街頭貓咪的蹤跡！快來記錄、分享、一起尋找那些可愛的小夥伴！",
        why: "為什麼你會愛上 PawPrints？",
        features: [
            "📍 記錄並分享貓咪發現地點，還能附上照片與描述！",
            "🗺️ 在地圖上探索可愛貓咪的蹤跡，一鍵導航過去！",
            "🔍 想找特定貓咪？用搜尋和篩選功能輕鬆找到牠！",
            "🐾 與其他貓奴交流，分享你的貓咪故事！"
        ],
        join: "加入 PawPrints，一起來找貓！",
        join_text: "愛貓的你，快來加入我們！不管是想幫助流浪貓，還是單純想看更多可愛貓咪，PawPrints 都會是你的好夥伴！🐾",
        cta: "訂閱最新貓咪消息！🐱"
    },
    en: {
        title: "PawPrints - Find, Share & Love Cats!",
        intro: "Need a little feline therapy but don't have a cat? 🐱 <strong>PawPrints</strong> lets you track, share, and discover adorable cats around you! Follow the paw prints to find your furry friends!",
        why: "Why You'll Love PawPrints?",
        features: [
            "📍 Log and share cat sightings, complete with photos & details!",
            "🗺️ Explore a map full of adorable cats and navigate to them!",
            "🔍 Looking for a specific kitty? Search and filter easily!",
            "🐾 Connect with fellow cat lovers and swap fun stories!"
        ],
        join: "Join PawPrints & Start Following Feline Trails!",
        join_text: "If you love cats, you belong here! Whether you want to help strays or just admire fluffy cuteness, PawPrints is your go-to app! 🐾",
        cta: "Subscribe for the latest cat updates! 🐱"
    },
    es: {
        title: "PawPrints - ¡Encuentra, Comparte y Ama a los Gatos!",
        intro: "¿Necesitas un poco de terapia felina pero no tienes un gato? 🐱 <strong>PawPrints</strong> te permite rastrear, compartir y descubrir adorables gatitos a tu alrededor. ¡Sigue las huellas y encuentra nuevos amigos peludos!",
        why: "¿Por qué te encantará PawPrints?",
        features: [
            "📍 ¡Registra y comparte avistamientos de gatos con fotos y detalles!",
            "🗺️ ¡Explora un mapa lleno de adorables gatitos y navega hasta ellos!",
            "🔍 ¿Buscas un gatito en particular? ¡Usa la búsqueda y los filtros fácilmente!",
            "🐾 ¡Conéctate con otros amantes de los gatos y comparte historias divertidas!"
        ],
        join: "¡Únete a PawPrints y empieza a seguir huellas felinas!",
        join_text: "Si amas a los gatos, este es tu lugar. Ya sea que quieras ayudar a los callejeros o simplemente admirar su ternura, ¡PawPrints es tu mejor opción! 🐾",
        cta: "¡Suscríbete para recibir las últimas noticias sobre gatos! 🐱"
    },
    ru: {
        title: "PawPrints - Найди, Поделись и Люби Кошек!",
        intro: "Нужна немного кошачьей терапии, но у вас нет кошки? 🐱 <strong>PawPrints</strong> поможет вам отслеживать, делиться и находить очаровательных котов вокруг вас! Следуйте за кошачьими следами!",
        why: "Почему вам понравится PawPrints?",
        features: [
            "📍 Записывайте и делитесь местами, где видели кошек, с фото и описанием!",
            "🗺️ Исследуйте карту с очаровательными котами и находите их!",
            "🔍 Ищете конкретного котика? Легко используйте поиск и фильтры!",
            "🐾 Общайтесь с другими любителями кошек и делитесь историями!"
        ],
        join: "Присоединяйтесь к PawPrints и начинайте искать кошек!",
        join_text: "Любите кошек? Тогда вам сюда! Хотите помочь бездомным или просто наслаждаться их милотой – PawPrints для вас! 🐾",
        cta: "Подпишитесь на обновления о кошках! 🐱"
    }
};

function switchLang(lang) {
    document.getElementById("title").innerHTML = translations[lang].title;
    document.getElementById("intro").innerHTML = translations[lang].intro;
    document.getElementById("why").innerText = translations[lang].why;
    document.getElementById("features").innerHTML = translations[lang].features.map(f => `<li>${f}</li>`).join("");
    document.getElementById("join").innerText = translations[lang].join;
    document.getElementById("join_text").innerHTML = translations[lang].join_text;
    document.getElementById("cta").innerText = translations[lang].cta;
    
    // Update active button state
    document.querySelectorAll('.lang-switch button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(lang)) {
            btn.classList.add('active');
        }
    });
}

// Theme switching functionality
function initTheme() {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }

    // Add listener for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-switch .material-icons');
    icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    switchLang('en');
    initTheme();
    
    // Add click event listener to theme switch button
    document.querySelector('.theme-switch').addEventListener('click', toggleTheme);
}); 