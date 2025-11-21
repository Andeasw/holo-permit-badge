/**
 * Dimensional Permit Auto-Badge (Optimized)
 * Behavior: Right-Bottom Fixed, Expands Left on Hover, Draggable
 */
(function () {
    // ================= Configuration =================
    const CONFIG = {
        // Auto-detect base URL from script location
        baseUrl: (function() {
            const script = document.currentScript;
            if (script && script.src) {
                return script.src.substring(0, script.src.lastIndexOf('/') + 1);
            }
            return "https://andeasw.github.io/holo-permit-badge/"; 
        })(),
        textColor: "#1d1d1f",
        font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace"
    };

    // ================= 1. Resource Injection =================
    function injectResources() {
        // FontAwesome
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(link);
        }

        // Styles
        const style = document.createElement("style");
        style.innerHTML = `
            #dim-permit-badge {
                position: fixed; right: 20px; bottom: 20px; z-index: 99999;
                display: flex; align-items: center; flex-direction: row-reverse;
                width: 36px; height: 36px; overflow: hidden;
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 30px;
                box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.05);
                color: ${CONFIG.textColor}; font-family: ${CONFIG.font}; font-size: 12px;
                white-space: nowrap; text-decoration: none; user-select: none;
                transform: scale(0.9); opacity: 0;
                transition: width 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.4s ease, transform 0.4s ease, background 0.3s;
                cursor: grab;
            }
            #dim-permit-badge.dragging {
                cursor: grabbing; transition: none !important;
                box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            }
            #dim-permit-badge.visible { transform: scale(1); opacity: 1; }
            #dim-permit-badge:hover:not(.dragging) {
                width: auto; padding-left: 15px; padding-right: 0;
                background: rgba(255, 255, 255, 0.65);
                box-shadow: 4px 8px 25px rgba(0, 0, 0, 0.1);
            }
            .dp-icon-box {
                min-width: 36px; height: 36px;
                display: flex; align-items: center; justify-content: center;
            }
            .dp-shield {
                font-size: 16px;
                background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 25%, #8fd3f4 50%, #84fab0 75%, #a18cd1 100%);
                background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                animation: holoFlow 4s linear infinite; pointer-events: none;
            }
            @keyframes holoFlow { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
            .dp-content {
                display: flex; align-items: center; gap: 8px;
                opacity: 0; transform: translateX(10px);
                transition: all 0.4s ease 0.1s; pointer-events: none;
            }
            #dim-permit-badge:hover:not(.dragging) .dp-content { opacity: 1; transform: translateX(0); }
            .dp-divider { width: 1px; height: 10px; background: rgba(0,0,0,0.15); }
            .dp-date { font-family: 'Courier New', monospace; font-weight: 700; opacity: 0.8; }
        `;
        document.head.appendChild(style);
    }

    // ================= 2. Core Logic =================
    function initBadge() {
        // Domain Processing
        let rawHost = window.location.hostname || "LOCAL-MODE";
        const displayDomain = rawHost.toUpperCase().replace("WWW.", "");
        
        // Generate Target URL (Matches HTML logic: ?host=...)
        const targetUrl = `${CONFIG.baseUrl}?host=${encodeURIComponent(rawHost)}`;

        // Date Code
        const now = new Date();
        const icpCode = `ICP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

        // DOM Construction
        const badge = document.createElement("a");
        badge.id = "dim-permit-badge";
        badge.href = targetUrl;
        badge.target = "_blank"; 
        badge.innerHTML = `
            <div class="dp-icon-box"><i class="fas fa-shield-alt dp-shield"></i></div>
            <div class="dp-content">
                <span>${displayDomain}</span>
                <span class="dp-divider"></span>
                <span class="dp-date">${icpCode}</span>
            </div>
        `;
        document.body.appendChild(badge);

        // ================= 3. Interactions =================
        let isDragging = false, hasMoved = false;
        let startX, startY, initialLeft, initialTop;

        // Drag Handlers
        const onStart = (e) => {
            if (e.type === "mousedown" && e.button !== 0) return;
            isDragging = true; hasMoved = false;
            badge.classList.add("dragging");
            const cx = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
            const cy = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
            startX = cx; startY = cy;
            const rect = badge.getBoundingClientRect();
            initialLeft = rect.left; initialTop = rect.top;
            if(e.type.includes("touch")) e.preventDefault();
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const cx = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
            const cy = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
            const dx = cx - startX, dy = cy - startY;
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMoved = true;
            
            const maxL = window.innerWidth - badge.offsetWidth;
            const maxT = window.innerHeight - badge.offsetHeight;
            badge.style.left = Math.max(0, Math.min(initialLeft + dx, maxL)) + "px";
            badge.style.top = Math.max(0, Math.min(initialTop + dy, maxT)) + "px";
            badge.style.right = "auto"; badge.style.bottom = "auto";
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            badge.classList.remove("dragging");
        };

        // Click Handler (Prevent link if dragged)
        badge.addEventListener("click", (e) => {
            if (hasMoved) {
                e.preventDefault(); e.stopPropagation();
            } else {
                e.preventDefault();
                window.open(targetUrl, "_blank");
            }
        });

        // Bind Events
        badge.addEventListener("mousedown", onStart);
        badge.addEventListener("touchstart", onStart, { passive: false });
        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("mouseup", onEnd);
        window.addEventListener("touchend", onEnd);

        // Scroll Visibility
        function checkScroll() {
            const scrollH = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY || window.pageYOffset;
            // Show if at bottom OR if page is not scrollable
            if (scrollH <= 0 || scrolled >= scrollH - 80) {
                badge.classList.add("visible");
            } else {
                badge.classList.remove("visible");
            }
        }

        window.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);
        setTimeout(checkScroll, 500);
    }

    // ================= 4. Initialization =================
    injectResources();
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initBadge);
    } else {
        initBadge();
    }
})();
